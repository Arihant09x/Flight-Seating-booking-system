import React from "react";
import { Users, Armchair, Utensils, ClipboardCheck, CreditCard, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useBookingStore } from "../../store/bookingStore";
import type { BookingStep } from "../../types/booking";

const STEPS = [
  { id: "passengers", label: "Passengers", icon: Users },
  { id: "seats", label: "Seat Selection", icon: Armchair },
  { id: "meals", label: "In-Flight Meals", icon: Utensils },
  { id: "review", label: "Review Booking", icon: ClipboardCheck },
  { id: "payment", label: "Payment", icon: CreditCard },
] as const;

interface ProgressStepperProps {
  currentStep: string;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const { setCurrentStep } = useBookingStore();
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto w-full px-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const isUpcoming = i > currentIndex;
        const isLast = i === STEPS.length - 1;

        // Allow clicking back to completed steps
        const canClick = isCompleted;

        return (
          <React.Fragment key={step.id}>
            <div
              onClick={() => canClick && setCurrentStep(step.id as BookingStep)}
              className={cn(
                "flex items-center gap-2 group transition-all",
                canClick ? "cursor-pointer" : "cursor-default"
              )}
            >
              {/* Step Icon Badge */}
              <div
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative",
                  isActive &&
                    "bg-white text-slate-900 ring-4 ring-sky-400/40 shadow-lg scale-110",
                  isCompleted &&
                    "bg-slate-700/80 text-sky-300 border border-slate-600 group-hover:bg-slate-600",
                  isUpcoming && "bg-slate-800/60 text-slate-500 border border-slate-700/60"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "hidden sm:inline text-xs font-semibold tracking-tight transition-colors",
                  isActive && "text-white font-bold",
                  isCompleted && "text-slate-300 group-hover:text-white",
                  isUpcoming && "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-slate-800 relative overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 rounded-full",
                    isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
