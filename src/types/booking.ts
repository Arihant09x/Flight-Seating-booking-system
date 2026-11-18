// ============================================================
// Core TypeScript Types
// ============================================================

export type SeatCategory = 'standard' | 'premium' | 'extra-legroom' | 'emergency-exit';
export type SeatStatus = 'available' | 'occupied' | 'selected';
export type SeatPosition = 'window' | 'middle' | 'aisle';
export type AircraftConfig = '3-2' | '2-3-2';

export interface Seat {
  id: string;           // e.g. "1A"
  row: number;
  col: string;          // e.g. "A"
  category: SeatCategory;
  price: number;        // 0 = free
  status: SeatStatus;
  position: SeatPosition;
  features: string[];   // e.g. ["Extra legroom", "Window"]
  config: AircraftConfig; // which layout this seat belongs to
}

export interface Passenger {
  id: string;
  name: string;
  number: number;       // 1-based
  assignedSeatId: string | null;
  mealId: string | null;
  color: string;        // unique colour for this passenger's markers
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg' | 'vegan' | 'jain';
  price: number;
  icon: string;         // emoji
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: { code: string; city: string; time: string };
  destination: { code: string; city: string; time: string };
  duration: string;
  date: string;
  aircraft: string;
  defaultConfig: AircraftConfig;
}

export type BookingStep = 'flight' | 'passengers' | 'seats' | 'meals' | 'review' | 'payment' | 'confirmation';

export interface SeatAssignment {
  passengerId: string;
  seatId: string;
}

export interface BookingSummary {
  passengers: Passenger[];
  flight: Flight;
  seatAssignments: SeatAssignment[];
  mealSelections: { passengerId: string; mealId: string }[];
  seatTotal: number;
  mealTotal: number;
  taxes: number;
  grandTotal: number;
}

export interface UndoAction {
  type: 'assign' | 'remove';
  passengerId: string;
  previousSeatId: string | null;
  newSeatId: string | null;
}

export interface SeatLock {
  seatId: string;
  expiresAt: number; // timestamp ms
}
