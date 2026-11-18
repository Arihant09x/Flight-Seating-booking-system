import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBookingStore } from "../store/bookingStore";
import { SearchHero } from "../components/layout/SearchHero";
import { AppHeader } from "../components/layout/AppHeader";
import { PassengerSelector } from "../components/passengers/PassengerSelector";
import { AircraftSeatMap } from "../components/seat-map/AircraftSeatMap";
import { MealSelection } from "../components/meals/MealSelection";
import { BookingReview } from "../components/booking/BookingReview";
import { PaymentPage } from "../components/booking/PaymentPage";
import { ConfirmationPage } from "../components/booking/ConfirmationPage";
import { BookingSummary } from "../components/booking/BookingSummary";
import { ActivePassengerBanner } from "../components/passengers/ActivePassengerBanner";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export function FlightSeatSelectionPage() {
  const { currentStep, setCurrentStep } = useBookingStore();
  const [searched, setSearched] = useState(false);

  // 1. Initial State: Show MakeMyTrip style Search Hero
  if (!searched && currentStep === "passengers") {
    return (
      <SearchHero
        onSearch={() => {
          setSearched(true);
          setCurrentStep("passengers");
        }}
      />
    );
  }

  // 2. Booking Confirmed State: Full page ticket confirmation view
  if (currentStep === "confirmation") {
    return <ConfirmationPage />;
  }

  // 3. Active Booking Workflow
  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col font-sans">
      <AppHeader onBackToSearch={() => setSearched(false)} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Booking Content */}
          <div
            className={
              currentStep === "payment"
                ? "lg:col-span-12"
                : "lg:col-span-8 space-y-4"
            }
          >
            {/* Active Passenger Indicator Strip (Only on Seat and Meal Selection) */}
            {(currentStep === "seats" || currentStep === "meals") && (
              <ActivePassengerBanner />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {currentStep === "passengers" && <PassengerSelector />}
                {currentStep === "seats" && <AircraftSeatMap />}
                {currentStep === "meals" && <MealSelection />}
                {currentStep === "review" && <BookingReview />}
                {currentStep === "payment" && <PaymentPage />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Summary Ledger (Hidden during payment for maximum focus) */}
          {currentStep !== "payment" && (
            <div className="lg:col-span-4">
              <BookingSummary />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
