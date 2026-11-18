import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Armchair, User } from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { formatPrice } from "../../utils/pricing";

export function ActivePassengerBanner() {
  const { passengers, activePassengerId, setActivePassenger, removeSeat, getSeats } =
    useBookingStore();
  const seats = getSeats();

  const activeIndex = passengers.findIndex((p) => p.id === activePassengerId);
  const activePassenger = passengers[activeIndex];

  if (!activePassenger) return null;

  const assignedSeat = seats.find((s) => s.id === activePassenger.assignedSeatId);

  const goNext = () => {
    const next = passengers[(activeIndex + 1) % passengers.length];
    setActivePassenger(next.id);
  };

  const goPrev = () => {
    const prev = passengers[(activeIndex - 1 + passengers.length) % passengers.length];
    setActivePassenger(prev.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-zinc-250 bg-white p-3.5 shadow-xs flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Navigation arrow */}
        <button
          type="button"
          onClick={goPrev}
          disabled={passengers.length <= 1}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous passenger"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Passenger Avatar Badge */}
        <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
          P{activePassenger.number}
        </div>

        {/* Passenger Meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 truncate">
              {activePassenger.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              {activeIndex + 1} of {passengers.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs mt-0.5">
            {assignedSeat ? (
              <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
                <Armchair className="w-3.5 h-3.5" />
                <span>
                  Seat {assignedSeat.id} ({formatPrice(assignedSeat.price)})
                </span>
                <button
                  type="button"
                  onClick={() => removeSeat(activePassenger.id)}
                  title="Remove seat"
                  className="p-0.5 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-zinc-500 text-[11px]">
                Click an available seat on the cabin layout below to assign
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goNext}
          disabled={passengers.length <= 1}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next passenger"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
