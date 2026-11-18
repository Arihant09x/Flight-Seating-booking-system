import type { Flight } from '../types/booking';

export const mockFlight: Flight = {
  id: 'SW-6E421',
  airline: 'SkyWings',
  flightNumber: '6E-421',
  origin: { code: 'DEL', city: 'Delhi', time: '06:30' },
  destination: { code: 'BLR', city: 'Bangalore', time: '09:15' },
  duration: '2h 45m',
  date: '2026-12-25',
  aircraft: 'Airbus A321neo',
  defaultConfig: '3-2',
};
