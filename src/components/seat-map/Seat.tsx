import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';
import type { Seat, Passenger } from '../../types/booking';
import { formatPrice, categoryLabel } from '../../utils/pricing';

interface SeatProps {
  seat: Seat;
  assignedPassenger: Passenger | null;
  isFiltered: boolean;
  onSelect: (seatId: string) => void;
}

export function SeatButton({ seat, assignedPassenger, isFiltered, onSelect }: SeatProps) {
  const isOccupied = seat.status === 'occupied';
  const isSelected = !!assignedPassenger;

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.button
            whileTap={!isOccupied ? { scale: 0.9 } : undefined}
            onClick={() => !isOccupied && onSelect(seat.id)}
            disabled={isOccupied}
            aria-label={`Seat ${seat.id}, ${categoryLabel(seat.category)}, ${seat.position}, ${isOccupied ? 'Occupied' : formatPrice(seat.price)}`}
            aria-pressed={isSelected}
            className={cn(
              'w-8 h-9 rounded-lg border-2 flex flex-col items-center justify-center text-[10px] font-bold transition-all relative',
              isOccupied && 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-40',
              isSelected && 'bg-zinc-950 border-zinc-950 text-white font-bold shadow-xs',
              !isOccupied && !isSelected && seat.price === 0 && 'bg-white border-zinc-300 hover:border-zinc-950 text-zinc-800',
              !isOccupied && !isSelected && seat.price > 0 && 'bg-zinc-100 border-zinc-800 hover:bg-zinc-200 text-zinc-950',
              isFiltered && !isSelected && 'opacity-25'
            )}
          >
            {isSelected ? (
              <span className="text-white font-black text-[10px]">P{assignedPassenger!.number}</span>
            ) : isOccupied ? (
              <span className="opacity-30">✕</span>
            ) : (
              <span>{seat.col}</span>
            )}
          </motion.button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 bg-zinc-950 text-white border border-zinc-800 rounded-xl shadow-xl p-3 max-w-xs text-xs"
            sideOffset={6}
          >
            <div className="font-bold text-white text-sm mb-1">Seat {seat.id}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400 text-[11px]">
              <span>Category</span>
              <span className="font-medium text-white">{categoryLabel(seat.category)}</span>
              <span>Position</span>
              <span className="font-medium text-white capitalize">{seat.position}</span>
              <span>Price</span>
              <span className="font-semibold text-white">{formatPrice(seat.price)}</span>
              <span>Status</span>
              <span className="font-medium text-white">
                {isOccupied ? 'Occupied' : isSelected ? `Passenger ${assignedPassenger!.number}` : 'Available'}
              </span>
            </div>
            <Tooltip.Arrow className="fill-zinc-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
