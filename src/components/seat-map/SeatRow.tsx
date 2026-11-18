import type { Seat, Passenger } from '../../types/booking';
import { SeatButton } from './Seat';
import { cn } from '../../lib/utils';

interface SeatRowProps {
  rowNum: number;
  left: Seat[];
  middle?: Seat[];
  right: Seat[];
  passengers: Passenger[];
  activeFilters: Set<string>;
  assignedSeatIds: Set<string>;
  onSeatClick: (seatId: string) => void;
  isExitRow: boolean;
}

function getSeatPassenger(seat: Seat, passengers: Passenger[]): Passenger | null {
  return passengers.find(p => p.assignedSeatId === seat.id) ?? null;
}

function isSeatFiltered(seat: Seat, activeFilters: Set<string>): boolean {
  if (activeFilters.size === 0) return false;
  if (seat.status === 'occupied') return true;
  if (activeFilters.has('free') && seat.price === 0) return false;
  if (activeFilters.has('premium') && seat.category === 'premium') return false;
  if (activeFilters.has('extra-legroom') && seat.category === 'extra-legroom') return false;
  if (activeFilters.has('window') && seat.position === 'window') return false;
  if (activeFilters.has('aisle') && seat.position === 'aisle') return false;
  return true;
}

function PlaceholderSeat({ col }: { col: string }) {
  return (
    <div
      className="w-9 h-9 rounded-lg border-2 border-dashed border-slate-200 opacity-30 flex items-center justify-center text-[10px] text-slate-400"
    >
      {col}
    </div>
  );
}

export function SeatRow({
  rowNum,
  left,
  middle,
  right,
  passengers,
  activeFilters,
  assignedSeatIds,
  onSeatClick,
  isExitRow,
}: SeatRowProps) {
  return (
    <div className={cn('flex items-center gap-2 relative', isExitRow && 'my-2')}>
      {/* Exit row indicator */}
      {isExitRow && (
        <div className="absolute -left-10 text-[10px] font-bold text-red-500 rotate-90 tracking-widest">EXIT</div>
      )}

      {/* Row number */}
      <div className="w-7 text-center text-xs font-semibold text-slate-400">{rowNum}</div>

      {/* Left block */}
      <div className="flex gap-1">
        {left.map(seat => (
          <SeatButton
            key={seat.id}
            seat={seat}
            assignedPassenger={getSeatPassenger(seat, passengers)}
            isFiltered={isSeatFiltered(seat, activeFilters)}
            onSelect={onSeatClick}
          />
        ))}
        {/* Placeholder if missing */}
        {left.length === 0 && <PlaceholderSeat col="?" />}
      </div>

      {/* Aisle */}
      <div className="w-5 flex items-center justify-center">
        <div className="h-6 w-0.5 bg-slate-200 rounded-full" />
      </div>

      {/* Middle block (2-3-2) */}
      {middle !== undefined && (
        <>
          <div className="flex gap-1">
            {middle.map(seat => (
              <SeatButton
                key={seat.id}
                seat={seat}
                assignedPassenger={getSeatPassenger(seat, passengers)}
                isFiltered={isSeatFiltered(seat, activeFilters)}
                onSelect={onSeatClick}
              />
            ))}
          </div>
          <div className="w-5 flex items-center justify-center">
            <div className="h-6 w-0.5 bg-slate-200 rounded-full" />
          </div>
        </>
      )}

      {/* Right block */}
      <div className="flex gap-1">
        {right.map(seat => (
          <SeatButton
            key={seat.id}
            seat={seat}
            assignedPassenger={getSeatPassenger(seat, passengers)}
            isFiltered={isSeatFiltered(seat, activeFilters)}
            onSelect={onSeatClick}
          />
        ))}
      </div>
    </div>
  );
}
