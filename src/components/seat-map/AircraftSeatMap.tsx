import React, { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Sparkles,
  Undo2,
  Trash2,
  Info,
  ArrowRight,
  Plane,
} from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { SeatLegend } from "./SeatLegend";
import {
  getColsForConfig,
  getRowsForConfig,
  recommendSeat,
  recommendationReason,
  formatPrice,
  categoryLabel,
  type RecommendationType,
} from "../../utils/pricing";
import type { AircraftConfig, Seat, Passenger } from "../../types/booking";
import { cn } from "../../lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

// ── BookMyShow Style Seat Button ──
function BMSSeatButton({
  seat,
  assignedPassenger,
  dimmed,
  onSelect,
}: {
  seat: Seat;
  assignedPassenger: Passenger | null;
  dimmed: boolean;
  onSelect: (id: string) => void;
}) {
  const isOccupied = seat.status === "occupied";
  const isSelected = !!assignedPassenger;

  return (
    <Tooltip.Provider delayDuration={120}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            disabled={isOccupied}
            onClick={() => !isOccupied && onSelect(seat.id)}
            aria-label={`Seat ${seat.id}, ${categoryLabel(seat.category)}, ${
              isOccupied ? "Occupied" : formatPrice(seat.price)
            }`}
            className={cn(
              "w-8 h-9 rounded-lg border-2 flex flex-col items-center justify-center transition-all seat-bms relative",
              isOccupied &&
                "bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50",
              isSelected &&
                "bg-zinc-950 border-zinc-950 text-white font-bold shadow-md scale-105 z-10",
              !isOccupied &&
                !isSelected &&
                seat.price === 0 &&
                "bg-white border-zinc-300 hover:border-zinc-950 text-zinc-800 hover:bg-zinc-50",
              !isOccupied &&
                !isSelected &&
                seat.price > 0 &&
                "bg-zinc-50 border-zinc-800 hover:bg-zinc-100 text-zinc-950 font-semibold",
              dimmed && !isSelected && "opacity-25"
            )}
          >
            {isSelected ? (
              <span className="text-[10px] font-black tracking-tight">
                P{assignedPassenger!.number}
              </span>
            ) : isOccupied ? (
              <span className="text-[10px] font-semibold opacity-40">✕</span>
            ) : (
              <span className="text-[10px] font-bold">{seat.col}</span>
            )}

            {!isOccupied && !isSelected && (
              <span className="text-[8px] font-mono leading-none text-zinc-500">
                {seat.price === 0 ? "₹0" : `₹${seat.price}`}
              </span>
            )}
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 bg-zinc-950 text-white rounded-xl shadow-2xl p-3 text-xs max-w-[200px] border border-zinc-800"
            sideOffset={6}
          >
            <div className="font-bold text-sm text-white mb-1">Seat {seat.id}</div>
            <div className="space-y-1 text-zinc-400 text-[11px]">
              <div className="flex justify-between gap-3">
                <span>Category</span>
                <span className="text-white font-semibold">
                  {categoryLabel(seat.category)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Position</span>
                <span className="text-white font-semibold capitalize">
                  {seat.position}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Price</span>
                <span className="text-white font-bold">
                  {formatPrice(seat.price)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Status</span>
                <span className={isOccupied ? "text-zinc-500" : "text-white"}>
                  {isOccupied
                    ? "Occupied"
                    : isSelected
                    ? `Assigned to ${assignedPassenger!.name}`
                    : "Available"}
                </span>
              </div>
            </div>
            {seat.features.length > 0 && (
              <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-wrap gap-1">
                {seat.features.map((f) => (
                  <span
                    key={f}
                    className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
            <Tooltip.Arrow className="fill-zinc-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const FILTERS = [
  { id: "free", label: "Free (₹0)" },
  { id: "premium", label: "Premium" },
  { id: "extra-legroom", label: "Extra Legroom" },
  { id: "window", label: "Window" },
  { id: "aisle", label: "Aisle" },
];

const RECS: { type: RecommendationType; label: string }[] = [
  { type: "cheapest", label: "Cheapest" },
  { type: "window", label: "Window" },
  { type: "aisle", label: "Aisle" },
  { type: "extra-legroom", label: "Extra Legroom" },
];

const EXIT_ROWS = new Set([1, 7]);

export function AircraftSeatMap() {
  const {
    passengers,
    aircraftConfig,
    setAircraftConfig,
    assignSeat,
    undoLastAction,
    clearAllSeats,
    activeFilters,
    toggleFilter,
    clearFilters,
    getSeats,
    getAllAssignedSeatIds,
    setCurrentStep,
    undoStack,
  } = useBookingStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const seats = getSeats();
  const assignedIds = getAllAssignedSeatIds();
  const { left: leftCols, middle: middleCols, right: rightCols } =
    getColsForConfig(aircraftConfig);
  const rows = getRowsForConfig(seats);
  const allAssigned = passengers.every((p) => !!p.assignedSeatId);

  const handleSeatClick = (seatId: string) => {
    const result = assignSeat(seatId);
    if (!result.success) {
      toast.error(result.reason ?? "Seat is not available.");
    } else {
      const seat = seats.find((s) => s.id === seatId);
      toast.success(`Seat ${seatId} Assigned`, {
        description: seat?.price === 0 ? "Standard Free Seat" : `Added ${formatPrice(seat?.price ?? 0)}`,
        duration: 1800,
      });
    }
  };

  const handleRecommend = (type: RecommendationType) => {
    const seat = recommendSeat(seats, type, assignedIds);
    if (!seat) {
      toast.error("No matching seats available.");
      return;
    }
    toast.info(`Recommended Seat: ${seat.id}`, {
      description: recommendationReason(type),
      action: {
        label: "Assign",
        onClick: () => handleSeatClick(seat.id),
      },
    });
  };

  const isDimmed = (seat: Seat): boolean => {
    if (activeFilters.size === 0) return false;
    if (seat.status === "occupied") return true;
    if (activeFilters.has("free") && seat.price === 0) return false;
    if (activeFilters.has("premium") && seat.category === "premium") return false;
    if (activeFilters.has("extra-legroom") && seat.category === "extra-legroom")
      return false;
    if (activeFilters.has("window") && seat.position === "window") return false;
    if (activeFilters.has("aisle") && seat.position === "aisle") return false;
    return true;
  };

  const getPassengerForSeat = (seat: Seat) =>
    passengers.find((p) => p.assignedSeatId === seat.id) ?? null;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Top Header & Layout Switcher */}
      <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            Aircraft Seating Layout
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            BookMyShow-style interactive layout. Select a seat for active passenger.
          </p>
        </div>

        {/* Aircraft Layout Config Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          {(["3-2", "2-3-2"] as AircraftConfig[]).map((cfg) => (
            <button
              key={cfg}
              type="button"
              onClick={() => setAircraftConfig(cfg)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                aircraftConfig === cfg
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Layout {cfg}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Smart Recommendations Toolbar */}
      <div className="px-6 sm:px-8 py-3.5 bg-zinc-50/70 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-bold text-zinc-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all",
                activeFilters.has(f.id)
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {f.label}
            </button>
          ))}
          {activeFilters.size > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-400 hover:text-zinc-700 underline ml-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Actions (Undo & Clear) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undoLastAction}
            disabled={undoStack.length === 0}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={assignedIds.size === 0}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Smart Recommendations Bar */}
      <div className="px-6 sm:px-8 py-2.5 bg-zinc-100/60 border-b border-zinc-200/60 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 font-bold text-zinc-600 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          <span>Quick Suggest:</span>
        </div>
        {RECS.map((r) => (
          <button
            key={r.type}
            onClick={() => handleRecommend(r.type)}
            className="px-2.5 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-900 hover:text-white font-medium transition-colors"
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Clear Confirmation Banner */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-900 text-white px-6 sm:px-8 py-3 flex items-center justify-between"
          >
            <span className="text-xs font-medium">
              Clear all passenger seat selections?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllSeats();
                  setShowClearConfirm(false);
                  toast.info("All seat selections cleared.");
                }}
                className="px-3 py-1 bg-white text-zinc-950 font-bold rounded-lg text-xs"
              >
                Yes, Clear
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 text-zinc-300 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Interactive Seat Map Screen ── */}
      <div className="seat-map-scroll p-6 sm:p-8">
        <div className="min-w-fit mx-auto max-w-lg">
          {/* Cockpit / Screen Indicator */}
          <div className="mb-8">
            <div className="w-48 mx-auto h-2 bg-zinc-900 rounded-t-full shadow-md" />
            <div className="text-center mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600 tracking-wider uppercase border border-zinc-200">
                <Plane className="w-3 h-3 text-zinc-800" />
                <span>Cockpit / Front of Cabin</span>
              </div>
            </div>
          </div>

          {/* Column Letter Labels */}
          <div className="flex items-center mb-3 pl-7">
            <div className="flex gap-1.5">
              {leftCols.map((c) => (
                <div
                  key={c}
                  className="w-8 text-center text-[11px] font-bold text-zinc-400"
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="w-8" />
            {middleCols && (
              <>
                <div className="flex gap-1.5">
                  {middleCols.map((c) => (
                    <div
                      key={c}
                      className="w-8 text-center text-[11px] font-bold text-zinc-400"
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <div className="w-8" />
              </>
            )}
            <div className="flex gap-1.5">
              {rightCols.map((c) => (
                <div
                  key={c}
                  className="w-8 text-center text-[11px] font-bold text-zinc-400"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Rows Layout */}
          <div className="space-y-2">
            {rows.map((rowNum) => {
              const isExit = EXIT_ROWS.has(rowNum);
              const getSeat = (col: string) =>
                seats.find((s) => s.row === rowNum && s.col === col);

              return (
                <div key={rowNum} className={cn("relative", isExit && "pt-3")}>
                  {/* Exit Indicator */}
                  {isExit && (
                    <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 px-1">
                      <span>◀ Exit Door</span>
                      <div className="h-px bg-zinc-200 flex-1 mx-3" />
                      <span>Exit Door ▶</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    {/* Row Number */}
                    <div className="w-7 text-center text-[11px] font-mono font-bold text-zinc-400 flex-shrink-0">
                      {rowNum}
                    </div>

                    {/* Left Block */}
                    <div className="flex gap-1.5">
                      {leftCols.map((col) => {
                        const seat = getSeat(col);
                        if (!seat) return <div key={col} className="w-8 h-9" />;
                        return (
                          <BMSSeatButton
                            key={seat.id}
                            seat={seat}
                            assignedPassenger={getPassengerForSeat(seat)}
                            dimmed={isDimmed(seat)}
                            onSelect={handleSeatClick}
                          />
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 text-center text-[10px] text-zinc-300 font-mono select-none">
                      •
                    </div>

                    {/* Middle Block (2-3-2) */}
                    {middleCols && (
                      <>
                        <div className="flex gap-1.5">
                          {middleCols.map((col) => {
                            const seat = getSeat(col);
                            if (!seat) return <div key={col} className="w-8 h-9" />;
                            return (
                              <BMSSeatButton
                                key={seat.id}
                                seat={seat}
                                assignedPassenger={getPassengerForSeat(seat)}
                                dimmed={isDimmed(seat)}
                                onSelect={handleSeatClick}
                              />
                            );
                          })}
                        </div>
                        <div className="w-8 text-center text-[10px] text-zinc-300 font-mono select-none">
                          •
                        </div>
                      </>
                    )}

                    {/* Right Block */}
                    <div className="flex gap-1.5">
                      {rightCols.map((col) => {
                        const seat = getSeat(col);
                        if (!seat) return <div key={col} className="w-8 h-9" />;
                        return (
                          <BMSSeatButton
                            key={seat.id}
                            seat={seat}
                            assignedPassenger={getPassengerForSeat(seat)}
                            dimmed={isDimmed(seat)}
                            onSelect={handleSeatClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rear of Cabin Indicator */}
          <div className="mt-8 text-center">
            <div className="w-32 mx-auto h-1.5 bg-zinc-300 rounded-b-full" />
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mt-2">
              Aircraft Galley & Restrooms
            </div>
          </div>
        </div>
      </div>

      {/* Legend Area */}
      <div className="p-6 sm:p-8 pt-0">
        <SeatLegend />
      </div>

      {/* Single Unified Primary Action Button at bottom */}
      <div className="p-6 sm:p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
          <Info className="w-4 h-4 text-zinc-500" />
          <span>
            {passengers.filter((p) => p.assignedSeatId).length} of{" "}
            {passengers.length} seats assigned
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCurrentStep("meals")}
          disabled={!allAssigned}
          className={cn(
            "px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm",
            allAssigned
              ? "bg-zinc-950 hover:bg-black text-white hover:gap-3"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          )}
        >
          <span>
            {allAssigned
              ? "Proceed to Meal Selection"
              : `Assign ${passengers.length - assignedIds.size} More Seat(s)`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
