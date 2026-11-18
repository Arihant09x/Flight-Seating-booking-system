import type { Seat, Passenger, AircraftConfig, SeatCategory } from '../types/booking';

// ─── Formatting ─────────────────────────────
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Pricing ────────────────────────────────
export function calculateSeatTotal(passengers: Passenger[], seats: Seat[]): number {
  const seatMap = new Map(seats.map(s => [s.id, s]));
  return passengers.reduce((total, p) => {
    if (!p.assignedSeatId) return total;
    const seat = seatMap.get(p.assignedSeatId);
    return total + (seat?.price ?? 0);
  }, 0);
}

export function calculateMealTotal(
  passengers: Passenger[],
  mealPrices: Record<string, number>
): number {
  return passengers.reduce((total, p) => {
    if (!p.mealId) return total;
    return total + (mealPrices[p.mealId] ?? 0);
  }, 0);
}

export function calculateTaxes(seatTotal: number, mealTotal: number): number {
  return Math.round((seatTotal + mealTotal) * 0.05);
}

// ─── Seat layout helpers ─────────────────────
export function getColsForConfig(config: AircraftConfig): {
  left: string[];
  middle?: string[];
  right: string[];
} {
  if (config === '3-2') {
    return { left: ['A', 'B', 'C'], right: ['D', 'E'] };
  }
  return { left: ['A', 'B'], middle: ['D', 'E', 'F'], right: ['G', 'H'] };
}

export function getRowsForConfig(seats: Seat[]): number[] {
  const rows = [...new Set(seats.map(s => s.row))];
  return rows.sort((a, b) => a - b);
}

// ─── Seat recommendation ─────────────────────
export type RecommendationType = 'cheapest' | 'window' | 'aisle' | 'extra-legroom';

export function recommendSeat(
  seats: Seat[],
  type: RecommendationType,
  assignments: Set<string>
): Seat | null {
  const available = seats.filter(
    s => s.status === 'available' && !assignments.has(s.id)
  );
  if (available.length === 0) return null;

  switch (type) {
    case 'cheapest':
      return available.sort((a, b) => a.price - b.price)[0];
    case 'window':
      return available.find(s => s.position === 'window') ?? available[0];
    case 'aisle':
      return available.find(s => s.position === 'aisle') ?? available[0];
    case 'extra-legroom':
      return available.find(s => s.category === 'extra-legroom') ?? available[0];
  }
}

export function recommendationReason(type: RecommendationType): string {
  switch (type) {
    case 'cheapest': return 'Lowest price available seat';
    case 'window': return 'Best window view';
    case 'aisle': return 'Easy aisle access';
    case 'extra-legroom': return 'Maximum leg space';
  }
}

// ─── Category label & colour ─────────────────
export function categoryLabel(cat: SeatCategory): string {
  switch (cat) {
    case 'standard': return 'Standard';
    case 'premium': return 'Premium';
    case 'extra-legroom': return 'Extra Legroom';
    case 'emergency-exit': return 'Emergency Exit';
  }
}

export function categoryColor(cat: SeatCategory): string {
  switch (cat) {
    case 'standard': return '#09090b';
    case 'premium': return '#27272a';
    case 'extra-legroom': return '#52525b';
    case 'emergency-exit': return '#18181b';
  }
}

// ─── Validation ──────────────────────────────
export function validateSeatAssignment(
  seatId: string,
  passengerId: string,
  passengers: Passenger[],
  seats: Seat[]
): { valid: boolean; reason?: string } {
  const seat = seats.find(s => s.id === seatId);
  if (!seat) return { valid: false, reason: 'Seat not found.' };
  if (seat.status === 'occupied') return { valid: false, reason: 'This seat is already occupied.' };

  // Check if another passenger already has this seat
  const existing = passengers.find(
    p => p.id !== passengerId && p.assignedSeatId === seatId
  );
  if (existing) {
    return { valid: false, reason: `Seat ${seatId} is already assigned to ${existing.name}.` };
  }
  return { valid: true };
}

export function getAvailableSeats(seats: Seat[], assignments: Set<string>): Seat[] {
  return seats.filter(s => s.status === 'available' && !assignments.has(s.id));
}

export function getPassengerSeat(passenger: Passenger, seats: Seat[]): Seat | null {
  if (!passenger.assignedSeatId) return null;
  return seats.find(s => s.id === passenger.assignedSeatId) ?? null;
}

// ─── Booking reference ───────────────────────
export function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'SKY' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
