import React, { useState } from "react";
import { Download, RefreshCw, ChevronDown, Sparkles } from "lucide-react";
import { TicketConfirmationCard } from "../ui/TicketConfirmationCard";
import { AirplaneWindowGallery } from "../ui/AirplaneWindowGallery";
import { useBookingStore } from "../../store/bookingStore";
import { meals } from "../../data/meals";
import {
  calculateSeatTotal,
  calculateMealTotal,
  calculateTaxes,
} from "../../utils/pricing";
import { mockFlight } from "../../data/flights";

export function ConfirmationPage() {
  const { passengers, getSeats, bookingRef, resetBooking } = useBookingStore();
  const seats = getSeats();
  const mealPrices = Object.fromEntries(meals.map((m) => [m.id, m.price]));
  const seatTotal = calculateSeatTotal(passengers, seats);
  const mealTotal = calculateMealTotal(passengers, mealPrices);
  const baseFare = 2499 * passengers.length;
  const taxes = calculateTaxes(seatTotal + baseFare, mealTotal);
  const grandTotal = baseFare + seatTotal + mealTotal + taxes;

  const [downloading, setDownloading] = useState(false);

  const passengersList = passengers.map((p) => ({
    name: p.name,
    seat: p.assignedSeatId ?? "12A",
  }));

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const ticketEl = document.getElementById("printable-ticket-card");
      if (!ticketEl) return;

      const canvas = await html2canvas(ticketEl, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SkyWings-Ticket-${bookingRef || "CONFIRMED"}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const scrollToCabin = () => {
    document.getElementById("cabin-experience-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* ── Screen-Fitted Compact Confirmation Section ── */}
      <div className="max-w-md w-full mx-auto flex flex-col items-center">
        {/* Compact Official 21st.dev Ticket */}
        <div id="printable-ticket-card" className="w-full flex justify-center">
          <TicketConfirmationCard
            ticketId={bookingRef || "SKY789012"}
            amount={grandTotal}
            date={new Date()}
            cardHolder={passengers[0]?.name || "Primary Passenger"}
            last4Digits="4242"
            barcodeValue={bookingRef || "SKY789012"}
            flightRoute={{
              fromCode: mockFlight.origin.code,
              fromCity: mockFlight.origin.city,
              toCode: mockFlight.destination.code,
              toCity: mockFlight.destination.city,
              flightNumber: mockFlight.flightNumber,
              time: `${mockFlight.origin.time} - ${mockFlight.destination.time}`,
            }}
            passengersList={passengersList}
          />
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-[360px] flex gap-2.5 mt-4">
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPdf}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            {downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Ticket</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetBooking}
            className="py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>

        {/* ── Scroll Down Indicator Animation ── */}
        <div
          onClick={scrollToCabin}
          className="mt-6 flex flex-col items-center gap-1.5 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>In-Flight Window Experience Below</span>
          </span>
          <div className="w-7 h-7 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-slate-600 group-hover:border-slate-500 scroll-indicator-bounce transition-colors">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Full-Width Responsive Airplane Window Gallery ── */}
      <section
        id="cabin-experience-section"
        className="max-w-5xl w-full mx-auto mt-10 scroll-mt-6"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm w-full overflow-hidden">
          <AirplaneWindowGallery />
        </div>
      </section>
    </div>
  );
}
