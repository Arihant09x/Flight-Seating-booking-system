import type { Passenger } from '../types/booking';

export const PASSENGER_COLORS = [
  '#09090b', // Pitch Black
  '#27272a', // Zinc 800
  '#3f3f46', // Zinc 700
  '#52525b', // Zinc 600
  '#18181b', // Zinc 900
];

export function createPassengers(count: number): Passenger[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `passenger-${i + 1}`,
    name: `Passenger ${i + 1}`,
    number: i + 1,
    assignedSeatId: null,
    mealId: null,
    color: PASSENGER_COLORS[i % PASSENGER_COLORS.length],
  }));
}
