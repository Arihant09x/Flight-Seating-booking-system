import React from "react";
import { Calendar, Users, ArrowLeft, Plane } from "lucide-react";
import { mockFlight } from "../../data/flights";
import { useBookingStore } from "../../store/bookingStore";
import { ProgressStepper } from "./ProgressStepper";
import { BrandLogo } from "../ui/BrandLogo";

interface AppHeaderProps {
  onBackToSearch?: () => void;
}

export function AppHeader({ onBackToSearch }: AppHeaderProps) {
  const { currentStep, passengerCount } = useBookingStore();

  return (
    <header className="stepper-header-gradient text-white shadow-lg sticky top-0 z-40 border-b border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-700/50 gap-4">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            {onBackToSearch && (
              <button
                type="button"
                onClick={onBackToSearch}
                title="Return to flight search"
                className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <BrandLogo variant="light" size="sm" />
          </div>

          {/* Central Flight Route Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-800/70 rounded-full border border-slate-700 text-xs font-semibold backdrop-blur-xs">
            <span className="text-white font-black">{mockFlight.origin.code}</span>
            <span className="text-slate-400 font-normal hidden sm:inline">{mockFlight.origin.city}</span>
            <div className="flex items-center gap-1 text-slate-400 px-1">
              <div className="w-3.5 h-px bg-slate-600" />
              <Plane className="w-3.5 h-3.5 text-sky-400 rotate-90" />
              <div className="w-3.5 h-px bg-slate-600" />
            </div>
            <span className="text-white font-black">{mockFlight.destination.code}</span>
            <span className="text-slate-400 font-normal hidden sm:inline">{mockFlight.destination.city}</span>
          </div>

          {/* Right Flight Meta */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {new Date(mockFlight.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-white">{passengerCount}</span>
              <span>{passengerCount > 1 ? "Passengers" : "Passenger"}</span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="py-2.5">
          <ProgressStepper currentStep={currentStep} />
        </div>
      </div>
    </header>
  );
}
