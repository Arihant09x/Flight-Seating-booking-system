import React from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Edit2,
  ArrowRight,
  Armchair,
  Utensils,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { meals } from "../../data/meals";
import {
  formatPrice,
  calculateSeatTotal,
  calculateMealTotal,
  calculateTaxes,
  generateBookingRef,
} from "../../utils/pricing";
import { mockFlight } from "../../data/flights";

export function BookingReview() {
  const {
    passengers,
    getSeats,
    setCurrentStep,
    setBookingRef,
    lockSeats,
  } = useBookingStore();

  const seats = getSeats();
  const mealPrices = Object.fromEntries(meals.map((m) => [m.id, m.price]));
  const seatTotal = calculateSeatTotal(passengers, seats);
  const mealTotal = calculateMealTotal(passengers, mealPrices);
  const baseFare = 2499 * passengers.length;
  const taxes = calculateTaxes(seatTotal + baseFare, mealTotal);
  const grandTotal = baseFare + seatTotal + mealTotal + taxes;

  const handleProceedToPayment = () => {
    setBookingRef(generateBookingRef());
    lockSeats();
    setCurrentStep("payment");
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            Booking Review & Summary
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Verify your flight itinerary, assigned seats and meal options
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentStep("seats")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Seats</span>
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Flight Itinerary Card */}
        <div className="p-6 rounded-2xl bg-zinc-950 text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400">
              <Plane className="w-4 h-4 text-white" />
              <span>{mockFlight.airline} • {mockFlight.flightNumber}</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 uppercase">
              {mockFlight.aircraft}
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl font-black">{mockFlight.origin.code}</div>
              <div className="text-xs text-zinc-400">{mockFlight.origin.city}</div>
              <div className="text-sm font-bold mt-1">{mockFlight.origin.time}</div>
            </div>

            <div className="flex-1 mx-6 flex flex-col items-center">
              <span className="text-[11px] font-mono text-zinc-400 mb-1">
                {mockFlight.duration} (Non-stop)
              </span>
              <div className="w-full flex items-center">
                <div className="flex-1 h-px bg-zinc-700" />
                <Plane className="w-4 h-4 text-white mx-2 rotate-90" />
                <div className="flex-1 h-px bg-zinc-700" />
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black">{mockFlight.destination.code}</div>
              <div className="text-xs text-zinc-400">{mockFlight.destination.city}</div>
              <div className="text-sm font-bold mt-1">{mockFlight.destination.time}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(mockFlight.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <span>Cabin: Economy Class</span>
          </div>
        </div>

        {/* Passenger Selections List */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Traveller Selections
          </h3>
          <div className="space-y-2.5">
            {passengers.map((p) => {
              const seat = seats.find((s) => s.id === p.assignedSeatId);
              const meal = meals.find((m) => m.id === p.mealId);

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white font-bold text-xs flex items-center justify-center">
                      P{p.number}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900">{p.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-zinc-800">
                          <Armchair className="w-3 h-3 text-zinc-600" />
                          <span>Seat: {seat ? seat.id : "Not selected"}</span>
                        </span>
                        {meal && (
                          <span className="flex items-center gap-1 font-medium text-zinc-800">
                            <Utensils className="w-3 h-3 text-zinc-600" />
                            <span>Meal: {meal.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-sm text-zinc-950">
                      {formatPrice((seat?.price ?? 0) + (meal?.price ?? 0))}
                    </span>
                    <span className="text-zinc-400 block text-[10px]">Add-ons</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Price Breakdown */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-2 text-xs">
          <h3 className="font-bold text-zinc-900 text-sm mb-3">Fare Breakdown</h3>
          <div className="flex justify-between text-zinc-600">
            <span>Base Airfare ({passengers.length} Traveller{passengers.length > 1 ? "s" : ""})</span>
            <span className="font-semibold text-zinc-900">{formatPrice(baseFare)}</span>
          </div>
          {seatTotal > 0 && (
            <div className="flex justify-between text-zinc-600">
              <span>Seat Selection Charges</span>
              <span className="font-semibold text-zinc-900">{formatPrice(seatTotal)}</span>
            </div>
          )}
          {mealTotal > 0 && (
            <div className="flex justify-between text-zinc-600">
              <span>In-Flight Meal Options</span>
              <span className="font-semibold text-zinc-900">{formatPrice(mealTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-600">
            <span>Aviation Security & GST (5%)</span>
            <span className="font-semibold text-zinc-900">{formatPrice(taxes)}</span>
          </div>

          <div className="pt-3 mt-2 border-t border-zinc-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-base text-zinc-950 block">Grand Total</span>
              <span className="text-[10px] text-zinc-500">All taxes & fees included</span>
            </div>
            <span className="text-2xl font-black text-zinc-950">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 py-1">
          <ShieldCheck className="w-4 h-4 text-zinc-900" />
          <span>Instant Confirmation • 256-bit Secure Encryption • Zero Extra Platform Fee</span>
        </div>
      </div>

      {/* Single Unified Primary Action Button at bottom */}
      <div className="p-6 sm:p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep("meals")}
          className="text-xs font-bold text-zinc-600 hover:text-zinc-950"
        >
          ← Back to Meals
        </button>

        <button
          type="button"
          onClick={handleProceedToPayment}
          className="px-8 py-3.5 rounded-2xl bg-zinc-950 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
