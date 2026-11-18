import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { meals } from "../../data/meals";
import {
  formatPrice,
  calculateSeatTotal,
  calculateMealTotal,
  calculateTaxes,
} from "../../utils/pricing";
import { cn } from "../../lib/utils";

export function BookingSummary() {
  const { passengers, getSeats, setCurrentStep, currentStep } = useBookingStore();
  const [expanded, setExpanded] = useState(true);

  const seats = getSeats();
  const mealPrices = Object.fromEntries(meals.map((m) => [m.id, m.price]));
  const seatTotal = calculateSeatTotal(passengers, seats);
  const mealTotal = calculateMealTotal(passengers, mealPrices);
  const baseFare = 2499 * passengers.length;
  const taxes = calculateTaxes(seatTotal + baseFare, mealTotal);
  const grandTotal = baseFare + seatTotal + mealTotal + taxes;

  const assignedCount = passengers.filter((p) => p.assignedSeatId).length;
  const totalPassengers = passengers.length;
  const canReview = assignedCount === totalPassengers;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-950 text-white rounded-xl flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-950">Fare Summary</div>
            <div className="text-[11px] text-zinc-500">
              {assignedCount} of {totalPassengers} seats selected
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-sm text-zinc-950">
            {formatPrice(grandTotal)}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Progress Line */}
      <div className="px-5 pb-3">
        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-950 rounded-full"
            animate={{ width: `${(assignedCount / totalPassengers) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 space-y-4">
          {/* Passenger mini items */}
          <div className="space-y-2">
            {passengers.map((p) => {
              const seat = seats.find((s) => s.id === p.assignedSeatId);
              const meal = meals.find((m) => m.id === p.mealId);

              return (
                <div
                  key={p.id}
                  className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span>{p.name}</span>
                    <span className="font-mono text-zinc-500 font-normal">
                      P{p.number}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-500 text-[11px]">
                    <span>Seat {seat ? seat.id : "Unassigned"}</span>
                    <span className="font-semibold text-zinc-800">
                      {seat ? formatPrice(seat.price) : "—"}
                    </span>
                  </div>

                  {meal && (
                    <div className="flex justify-between text-zinc-500 text-[11px]">
                      <span className="truncate pr-2">Meal: {meal.name}</span>
                      <span className="font-semibold text-zinc-800">
                        {formatPrice(meal.price)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing Ledger */}
          <div className="border-t border-zinc-100 pt-3 space-y-1.5 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Base Airfare × {totalPassengers}</span>
              <span className="font-medium text-zinc-900">{formatPrice(baseFare)}</span>
            </div>
            {seatTotal > 0 && (
              <div className="flex justify-between">
                <span>Seat Upgrades</span>
                <span className="font-medium text-zinc-900">{formatPrice(seatTotal)}</span>
              </div>
            )}
            {mealTotal > 0 && (
              <div className="flex justify-between">
                <span>In-Flight Dining</span>
                <span className="font-medium text-zinc-900">{formatPrice(mealTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes & Aviation Fees (5%)</span>
              <span className="font-medium text-zinc-900">{formatPrice(taxes)}</span>
            </div>

            <div className="pt-2.5 mt-1 border-t border-zinc-200 flex justify-between items-center text-sm font-bold text-zinc-950">
              <span>Grand Total</span>
              <span className="text-base font-black">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Action Button inside Sidebar */}
          {currentStep === "seats" && (
            <button
              type="button"
              disabled={!canReview}
              onClick={() => setCurrentStep("meals")}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs",
                canReview
                  ? "bg-zinc-950 hover:bg-black text-white"
                  : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              )}
            >
              <span>{canReview ? "Next: Choose Meals →" : `Select ${totalPassengers - assignedCount} more seat(s)`}</span>
            </button>
          )}

          {currentStep === "meals" && (
            <button
              type="button"
              onClick={() => setCurrentStep("review")}
              className="w-full py-3 rounded-xl font-bold text-xs bg-zinc-950 hover:bg-black text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>Proceed to Review →</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
