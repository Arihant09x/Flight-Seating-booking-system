import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Passenger, AircraftConfig, BookingStep, UndoAction, SeatLock } from '../types/booking';
import { createPassengers } from '../data/passengers';
import { getSeatsForConfig } from '../data/seats';
import { validateSeatAssignment } from '../utils/pricing';
import type { Seat } from '../types/booking';

// Lock duration in ms (10 minutes)
const LOCK_DURATION_MS = 10 * 60 * 1000;

interface BookingState {
  // Flight & config
  aircraftConfig: AircraftConfig;
  currentStep: BookingStep;

  // Passengers
  passengerCount: number;
  passengers: Passenger[];
  activePassengerId: string;

  // Seats — derived from config but stored with override status
  seatOverrides: Record<string, 'selected' | 'occupied' | 'available'>;

  // Seat lock (simulates payment page hold)
  seatLock: SeatLock | null;

  // Undo
  undoStack: UndoAction[];

  // Filter
  activeFilters: Set<string>;

  // Booking ref
  bookingRef: string | null;

  // Actions
  setPassengerCount: (count: number) => void;
  setActivePassenger: (id: string) => void;
  updatePassengerName: (id: string, name: string) => void;
  assignSeat: (seatId: string) => { success: boolean; reason?: string };
  removeSeat: (passengerId: string) => void;
  setAircraftConfig: (config: AircraftConfig) => void;
  setCurrentStep: (step: BookingStep) => void;
  setMeal: (passengerId: string, mealId: string | null) => void;
  undoLastAction: () => void;
  clearAllSeats: () => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  setBookingRef: (ref: string) => void;
  lockSeats: () => void;
  unlockSeats: () => void;
  resetBooking: () => void;

  // Computed helpers (not state, but accessed via store)
  getSeats: () => Seat[];
  getActivePassenger: () => Passenger | undefined;
  getAllAssignedSeatIds: () => Set<string>;
}

const initialPassengerCount = 1;
const initialPassengers = createPassengers(initialPassengerCount);

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      aircraftConfig: '3-2',
      currentStep: 'passengers',
      passengerCount: initialPassengerCount,
      passengers: initialPassengers,
      activePassengerId: initialPassengers[0].id,
      seatOverrides: {},
      seatLock: null,
      undoStack: [],
      activeFilters: new Set(),
      bookingRef: null,

      getSeats: () => {
        const { aircraftConfig, seatOverrides } = get();
        const base = getSeatsForConfig(aircraftConfig);
        return base.map(s => ({
          ...s,
          status: (seatOverrides[s.id] ?? s.status) as Seat['status'],
        }));
      },

      getActivePassenger: () => {
        const { passengers, activePassengerId } = get();
        return passengers.find(p => p.id === activePassengerId);
      },

      getAllAssignedSeatIds: () => {
        const { passengers } = get();
        const ids = new Set<string>();
        passengers.forEach(p => {
          if (p.assignedSeatId) ids.add(p.assignedSeatId);
        });
        return ids;
      },

      setPassengerCount: (count) => {
        const { passengers } = get();
        const newPassengers = createPassengers(count).map((np, i) => {
          const existing = passengers[i];
          return existing
            ? { ...existing, number: i + 1 }
            : np;
        });
        set({
          passengerCount: count,
          passengers: newPassengers,
          activePassengerId: newPassengers[0].id,
        });
      },

      setActivePassenger: (id) => set({ activePassengerId: id }),

      updatePassengerName: (id, name) => {
        set(state => ({
          passengers: state.passengers.map(p =>
            p.id === id ? { ...p, name } : p
          ),
        }));
      },

      assignSeat: (seatId) => {
        const { passengers, activePassengerId, getSeats } = get();
        const seats = getSeats();
        const validation = validateSeatAssignment(seatId, activePassengerId, passengers, seats);
        if (!validation.valid) {
          return { success: false, reason: validation.reason };
        }

        const activePassenger = passengers.find(p => p.id === activePassengerId);
        const previousSeatId = activePassenger?.assignedSeatId ?? null;

        // Record undo
        const undoAction: UndoAction = {
          type: 'assign',
          passengerId: activePassengerId,
          previousSeatId,
          newSeatId: seatId,
        };

        set(state => ({
          passengers: state.passengers.map(p =>
            p.id === activePassengerId ? { ...p, assignedSeatId: seatId } : p
          ),
          undoStack: [undoAction, ...state.undoStack].slice(0, 20),
        }));

        // Auto-advance to next unassigned passenger
        const updatedPassengers = get().passengers;
        const nextUnassigned = updatedPassengers.find(
          p => !p.assignedSeatId && p.id !== activePassengerId
        );
        if (nextUnassigned) {
          set({ activePassengerId: nextUnassigned.id });
        }

        return { success: true };
      },

      removeSeat: (passengerId) => {
        const { passengers } = get();
        const passenger = passengers.find(p => p.id === passengerId);
        const previousSeatId = passenger?.assignedSeatId ?? null;

        const undoAction: UndoAction = {
          type: 'remove',
          passengerId,
          previousSeatId,
          newSeatId: null,
        };

        set(state => ({
          passengers: state.passengers.map(p =>
            p.id === passengerId ? { ...p, assignedSeatId: null } : p
          ),
          undoStack: [undoAction, ...state.undoStack].slice(0, 20),
        }));
      },

      setAircraftConfig: (config) => {
        // Validate existing assignments against new layout
        const newSeats = getSeatsForConfig(config);
        const newSeatIds = new Set(newSeats.map(s => s.id));

        set(state => ({
          aircraftConfig: config,
          passengers: state.passengers.map(p => ({
            ...p,
            assignedSeatId:
              p.assignedSeatId && newSeatIds.has(p.assignedSeatId)
                ? p.assignedSeatId
                : null,
          })),
        }));
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      setMeal: (passengerId, mealId) => {
        set(state => ({
          passengers: state.passengers.map(p =>
            p.id === passengerId ? { ...p, mealId } : p
          ),
        }));
      },

      undoLastAction: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return;
        const [last, ...rest] = undoStack;

        set(state => ({
          passengers: state.passengers.map(p =>
            p.id === last.passengerId
              ? { ...p, assignedSeatId: last.previousSeatId }
              : p
          ),
          undoStack: rest,
        }));
      },

      clearAllSeats: () => {
        set(state => ({
          passengers: state.passengers.map(p => ({ ...p, assignedSeatId: null })),
          undoStack: [],
        }));
      },

      toggleFilter: (filter) => {
        set(state => {
          const filters = new Set(state.activeFilters);
          if (filters.has(filter)) {
            filters.delete(filter);
          } else {
            filters.add(filter);
          }
          return { activeFilters: filters };
        });
      },

      clearFilters: () => set({ activeFilters: new Set() }),

      setBookingRef: (ref) => set({ bookingRef: ref }),

      lockSeats: () => {
        const expiresAt = Date.now() + LOCK_DURATION_MS;
        const { passengers } = get();
        const assignedIds = passengers
          .map(p => p.assignedSeatId)
          .filter(Boolean) as string[];

        const seatLock: SeatLock = {
          seatId: assignedIds[0] ?? '',
          expiresAt,
        };

        set({ seatLock });
      },

      unlockSeats: () => set({ seatLock: null }),

      resetBooking: () => {
        const fresh = createPassengers(1);
        set({
          passengers: fresh,
          activePassengerId: fresh[0].id,
          passengerCount: 1,
          seatOverrides: {},
          seatLock: null,
          undoStack: [],
          activeFilters: new Set(),
          bookingRef: null,
          currentStep: 'passengers',
          aircraftConfig: '3-2',
        });
      },
    }),
    {
      name: 'skywings-booking',
      partialize: (state) => ({
        passengers: state.passengers,
        passengerCount: state.passengerCount,
        activePassengerId: state.activePassengerId,
        aircraftConfig: state.aircraftConfig,
        currentStep: state.currentStep,
        bookingRef: state.bookingRef,
      }),
    }
  )
);
