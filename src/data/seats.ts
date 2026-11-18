import type { Seat, AircraftConfig } from '../types/booking';

// ─────────────────────────────────────────────
// 3-2 layout: cols A B C | D E  (20 rows)
// 2-3-2 layout: cols A B | D E F | G H  (20 rows)
// ─────────────────────────────────────────────

type RawSeat = Omit<Seat, 'config'>;

function mkSeat(
  row: number,
  col: string,
  category: Seat['category'],
  price: number,
  position: Seat['position'],
  status: Seat['status'] = 'available',
  features: string[] = []
): RawSeat {
  return {
    id: `${row}${col}`,
    row,
    col,
    category,
    price,
    status,
    position,
    features: [...features, position === 'window' ? 'Window' : position === 'aisle' ? 'Aisle' : 'Middle'],
  };
}

// ─── 3-2 layout seats ──────────────────────
const seats32: Seat[] = [
  // Row 1 — Emergency exit / Extra legroom
  mkSeat(1,'A','extra-legroom',350,'window','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'B','extra-legroom',350,'middle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'C','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'D','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'E','extra-legroom',350,'window','available',['Emergency Exit','Extra Legroom']),

  // Row 2
  mkSeat(2,'A','standard',0,'window','occupied'),
  mkSeat(2,'B','standard',0,'middle','available'),
  mkSeat(2,'C','premium',250,'aisle','available'),
  mkSeat(2,'D','premium',250,'aisle','occupied'),
  mkSeat(2,'E','standard',0,'window','available'),

  // Row 3
  mkSeat(3,'A','standard',0,'window','available'),
  mkSeat(3,'B','standard',0,'middle','occupied'),
  mkSeat(3,'C','standard',0,'aisle','available'),
  mkSeat(3,'D','standard',0,'aisle','available'),
  mkSeat(3,'E','standard',0,'window','occupied'),

  // Row 4
  mkSeat(4,'A','premium',250,'window','available'),
  mkSeat(4,'B','premium',250,'middle','available'),
  mkSeat(4,'C','premium',250,'aisle','available'),
  mkSeat(4,'D','premium',250,'aisle','occupied'),
  mkSeat(4,'E','premium',250,'window','available'),

  // Row 5
  mkSeat(5,'A','standard',0,'window','available'),
  mkSeat(5,'B','standard',0,'middle','available'),
  mkSeat(5,'C','standard',0,'aisle','occupied'),
  mkSeat(5,'D','standard',0,'aisle','available'),
  mkSeat(5,'E','standard',0,'window','available'),

  // Row 6
  mkSeat(6,'A','standard',0,'window','occupied'),
  mkSeat(6,'B','standard',0,'middle','available'),
  mkSeat(6,'C','standard',0,'aisle','available'),
  mkSeat(6,'D','standard',0,'aisle','occupied'),
  mkSeat(6,'E','standard',0,'window','available'),

  // Row 7
  mkSeat(7,'A','extra-legroom',350,'window','available',['Extra Legroom']),
  mkSeat(7,'B','standard',0,'middle','available'),
  mkSeat(7,'C','standard',0,'aisle','available'),
  mkSeat(7,'D','standard',0,'aisle','available'),
  mkSeat(7,'E','extra-legroom',350,'window','available',['Extra Legroom']),

  // Row 8
  mkSeat(8,'A','standard',0,'window','available'),
  mkSeat(8,'B','standard',0,'middle','occupied'),
  mkSeat(8,'C','premium',250,'aisle','available'),
  mkSeat(8,'D','premium',250,'aisle','available'),
  mkSeat(8,'E','standard',0,'window','available'),

  // Row 9
  mkSeat(9,'A','standard',0,'window','available'),
  mkSeat(9,'B','standard',0,'middle','available'),
  mkSeat(9,'C','standard',0,'aisle','occupied'),
  mkSeat(9,'D','standard',0,'aisle','available'),
  mkSeat(9,'E','standard',0,'window','occupied'),

  // Row 10
  mkSeat(10,'A','standard',0,'window','available'),
  mkSeat(10,'B','standard',0,'middle','available'),
  mkSeat(10,'C','standard',0,'aisle','available'),
  mkSeat(10,'D','standard',0,'aisle','available'),
  mkSeat(10,'E','standard',0,'window','available'),
].map(s => ({ ...s, config: '3-2' as AircraftConfig }));

// ─── 2-3-2 layout seats ──────────────────────
const seats232: Seat[] = [
  // Row 1 — Emergency exit
  mkSeat(1,'A','extra-legroom',350,'window','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'B','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'D','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'E','extra-legroom',350,'middle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'F','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'G','extra-legroom',350,'aisle','available',['Emergency Exit','Extra Legroom']),
  mkSeat(1,'H','extra-legroom',350,'window','available',['Emergency Exit','Extra Legroom']),

  // Row 2
  mkSeat(2,'A','standard',0,'window','occupied'),
  mkSeat(2,'B','standard',0,'aisle','available'),
  mkSeat(2,'D','premium',250,'aisle','available'),
  mkSeat(2,'E','premium',250,'middle','available'),
  mkSeat(2,'F','premium',250,'aisle','occupied'),
  mkSeat(2,'G','standard',0,'aisle','available'),
  mkSeat(2,'H','standard',0,'window','available'),

  // Row 3
  mkSeat(3,'A','standard',0,'window','available'),
  mkSeat(3,'B','standard',0,'aisle','occupied'),
  mkSeat(3,'D','standard',0,'aisle','available'),
  mkSeat(3,'E','standard',0,'middle','available'),
  mkSeat(3,'F','standard',0,'aisle','occupied'),
  mkSeat(3,'G','standard',0,'aisle','available'),
  mkSeat(3,'H','standard',0,'window','occupied'),

  // Row 4
  mkSeat(4,'A','premium',250,'window','available'),
  mkSeat(4,'B','premium',250,'aisle','available'),
  mkSeat(4,'D','premium',250,'aisle','occupied'),
  mkSeat(4,'E','premium',250,'middle','available'),
  mkSeat(4,'F','premium',250,'aisle','available'),
  mkSeat(4,'G','premium',250,'aisle','available'),
  mkSeat(4,'H','premium',250,'window','available'),

  // Row 5
  mkSeat(5,'A','standard',0,'window','available'),
  mkSeat(5,'B','standard',0,'aisle','available'),
  mkSeat(5,'D','standard',0,'aisle','available'),
  mkSeat(5,'E','standard',0,'middle','occupied'),
  mkSeat(5,'F','standard',0,'aisle','available'),
  mkSeat(5,'G','standard',0,'aisle','occupied'),
  mkSeat(5,'H','standard',0,'window','available'),

  // Row 6
  mkSeat(6,'A','standard',0,'window','occupied'),
  mkSeat(6,'B','standard',0,'aisle','available'),
  mkSeat(6,'D','extra-legroom',350,'aisle','available',['Extra Legroom']),
  mkSeat(6,'E','extra-legroom',350,'middle','available',['Extra Legroom']),
  mkSeat(6,'F','extra-legroom',350,'aisle','available',['Extra Legroom']),
  mkSeat(6,'G','standard',0,'aisle','available'),
  mkSeat(6,'H','standard',0,'window','available'),

  // Row 7
  mkSeat(7,'A','standard',0,'window','available'),
  mkSeat(7,'B','standard',0,'aisle','available'),
  mkSeat(7,'D','standard',0,'aisle','occupied'),
  mkSeat(7,'E','standard',0,'middle','available'),
  mkSeat(7,'F','standard',0,'aisle','available'),
  mkSeat(7,'G','standard',0,'aisle','available'),
  mkSeat(7,'H','standard',0,'window','available'),

  // Row 8
  mkSeat(8,'A','standard',0,'window','available'),
  mkSeat(8,'B','standard',0,'aisle','occupied'),
  mkSeat(8,'D','standard',0,'aisle','available'),
  mkSeat(8,'E','standard',0,'middle','available'),
  mkSeat(8,'F','standard',0,'aisle','available'),
  mkSeat(8,'G','standard',0,'aisle','occupied'),
  mkSeat(8,'H','standard',0,'window','available'),

  // Row 9
  mkSeat(9,'A','standard',0,'window','available'),
  mkSeat(9,'B','standard',0,'aisle','available'),
  mkSeat(9,'D','premium',250,'aisle','available'),
  mkSeat(9,'E','premium',250,'middle','occupied'),
  mkSeat(9,'F','premium',250,'aisle','available'),
  mkSeat(9,'G','standard',0,'aisle','available'),
  mkSeat(9,'H','standard',0,'window','available'),

  // Row 10
  mkSeat(10,'A','standard',0,'window','available'),
  mkSeat(10,'B','standard',0,'aisle','available'),
  mkSeat(10,'D','standard',0,'aisle','available'),
  mkSeat(10,'E','standard',0,'middle','available'),
  mkSeat(10,'F','standard',0,'aisle','available'),
  mkSeat(10,'G','standard',0,'aisle','available'),
  mkSeat(10,'H','standard',0,'window','available'),
].map(s => ({ ...s, config: '2-3-2' as AircraftConfig }));

export const allSeats: Record<AircraftConfig, Seat[]> = {
  '3-2': seats32,
  '2-3-2': seats232,
};

export function getSeatsForConfig(config: AircraftConfig): Seat[] {
  return allSeats[config];
}
