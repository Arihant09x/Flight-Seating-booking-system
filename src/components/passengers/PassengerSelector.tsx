import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserPlus,
  UserMinus,
  Edit3,
  Check,
  X,
  ArrowRight,
  Armchair,
  Utensils,
  CheckCircle2,
} from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { cn } from "../../lib/utils";

export function PassengerSelector() {
  const {
    passengers,
    passengerCount,
    activePassengerId,
    setPassengerCount,
    setActivePassenger,
    updatePassengerName,
    setCurrentStep,
  } = useBookingStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitEdit = (id: string) => {
    if (editName.trim()) {
      updatePassengerName(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            Passenger Details
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Specify passenger names and switch active traveller for seat assignments
          </p>
        </div>

        {/* Counter Controller */}
        <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
            disabled={passengerCount <= 1}
            className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-colors"
            aria-label="Remove passenger"
          >
            <UserMinus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-sm text-zinc-900">
            {passengerCount}
          </span>
          <button
            type="button"
            onClick={() => setPassengerCount(Math.min(5, passengerCount + 1))}
            disabled={passengerCount >= 5}
            className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-colors"
            aria-label="Add passenger"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Passengers List */}
      <div className="p-6 sm:p-8 space-y-3">
        <AnimatePresence>
          {passengers.map((passenger, index) => {
            const isActive = passenger.id === activePassengerId;
            const hasSeat = !!passenger.assignedSeatId;
            const hasMeal = !!passenger.mealId;

            return (
              <motion.div
                key={passenger.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActivePassenger(passenger.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 group",
                  isActive
                    ? "border-zinc-950 bg-zinc-50/80 shadow-xs"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                )}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Passenger Badge */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors",
                      isActive
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                    )}
                  >
                    P{passenger.number}
                  </div>

                  {/* Name & Edit Area */}
                  <div className="flex-1 min-w-0">
                    {editingId === passenger.id ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit(passenger.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="px-2.5 py-1 text-sm font-semibold rounded-lg border border-zinc-400 bg-white text-zinc-950 outline-none w-full max-w-xs focus:ring-1 focus:ring-zinc-900"
                        />
                        <button
                          type="button"
                          onClick={() => commitEdit(passenger.id)}
                          className="p-1 rounded-md bg-zinc-900 text-white hover:bg-black"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 truncate">
                          {passenger.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(passenger.id, passenger.name);
                          }}
                          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Edit name"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {isActive && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-900 text-white ml-1">
                            Active
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status Chips */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {hasSeat ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                          <Armchair className="w-3 h-3 text-zinc-700" />
                          <span>Seat {passenger.assignedSeatId}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400">
                          Seat unassigned
                        </span>
                      )}

                      {hasMeal && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                          <Utensils className="w-3 h-3 text-zinc-600" />
                          <span>Meal selected</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Status */}
                <div>
                  {hasSeat ? (
                    <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-900">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-600">
                      Select Seat →
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Single Unified Primary Action Button at bottom */}
      <div className="p-6 sm:p-8 pt-2 bg-zinc-50 border-t border-zinc-100 flex justify-end">
        <button
          type="button"
          onClick={() => setCurrentStep("seats")}
          className="px-8 py-3.5 rounded-2xl bg-zinc-950 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
        >
          <span>Continue to Seat Selection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
