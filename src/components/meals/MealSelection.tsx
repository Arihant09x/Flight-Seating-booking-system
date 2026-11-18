import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Salad,
  Soup,
  Leaf,
  Sprout,
  Check,
  ArrowRight,
  User,
  Sparkles,
} from "lucide-react";
import { meals } from "../../data/meals";
import { useBookingStore } from "../../store/bookingStore";
import { formatPrice } from "../../utils/pricing";
import { cn } from "../../lib/utils";
import type { Meal } from "../../types/booking";

function getMealIcon(iconName: string) {
  switch (iconName) {
    case "salad":
      return <Salad className="w-5 h-5 text-zinc-900" />;
    case "soup":
      return <Soup className="w-5 h-5 text-zinc-900" />;
    case "utensils":
      return <Utensils className="w-5 h-5 text-zinc-900" />;
    case "leaf":
      return <Leaf className="w-5 h-5 text-zinc-900" />;
    case "sprout":
      return <Sprout className="w-5 h-5 text-zinc-900" />;
    default:
      return <Utensils className="w-5 h-5 text-zinc-900" />;
  }
}

export function MealSelection() {
  const {
    passengers,
    activePassengerId,
    setMeal,
    setCurrentStep,
    setActivePassenger,
  } = useBookingStore();

  const activeIndex = passengers.findIndex((p) => p.id === activePassengerId);
  const activePassenger = passengers[activeIndex];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950">
            In-Flight Dining & Meals
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Choose optional chef-curated meals for each passenger
          </p>
        </div>

        <div className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200">
          {passengers.filter((p) => p.mealId).length} of {passengers.length} selected
        </div>
      </div>

      {/* Passenger Selection Tabs */}
      <div className="p-4 sm:p-6 pb-2 border-b border-zinc-100 bg-zinc-50/50 flex gap-2 overflow-x-auto">
        {passengers.map((p) => {
          const isActive = p.id === activePassengerId;
          const hasMeal = !!p.mealId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePassenger(p.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2",
                isActive
                  ? "border-zinc-950 bg-white text-zinc-950 shadow-xs"
                  : "border-zinc-200 bg-white/70 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold",
                  isActive ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-700"
                )}
              >
                P{p.number}
              </div>
              <span>{p.name}</span>
              {hasMeal && <Check className="w-3.5 h-3.5 stroke-[3] text-zinc-900" />}
            </button>
          );
        })}
      </div>

      {/* Active Passenger Meals Grid */}
      <div className="p-6 sm:p-8">
        {activePassenger && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Select meal for:{" "}
                <span className="text-zinc-950 underline">{activePassenger.name}</span>
              </span>

              {activePassenger.mealId && (
                <button
                  type="button"
                  onClick={() => setMeal(activePassenger.id, null)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 underline"
                >
                  Clear meal for {activePassenger.name}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {meals.map((meal) => {
                const isSelected = activePassenger.mealId === meal.id;

                return (
                  <div
                    key={meal.id}
                    onClick={() =>
                      setMeal(
                        activePassenger.id,
                        isSelected ? null : meal.id
                      )
                    }
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 card-hover",
                      isSelected
                        ? "border-zinc-950 bg-zinc-50 shadow-xs"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    )}
                  >
                    {/* Meal Icon Badge */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 transition-colors",
                        isSelected
                          ? "bg-white border-zinc-950 shadow-xs"
                          : "bg-zinc-100 border-zinc-200"
                      )}
                    >
                      {getMealIcon(meal.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-zinc-950 leading-tight">
                          {meal.name}
                        </h4>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {meal.description}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {meal.category}
                        </span>
                        <span className="text-xs font-bold text-zinc-950">
                          {meal.price === 0 ? "Included Free" : formatPrice(meal.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Single Unified Primary Action Button at bottom */}
      <div className="p-6 sm:p-8 pt-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          Meal selection is optional. You can proceed without selecting a meal.
        </span>

        <button
          type="button"
          onClick={() => setCurrentStep("review")}
          className="px-8 py-3.5 rounded-2xl bg-zinc-950 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
        >
          <span>Proceed to Booking Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
