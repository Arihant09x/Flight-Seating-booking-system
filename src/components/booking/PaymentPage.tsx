import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Lock,
  Shield,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useBookingStore } from "../../store/bookingStore";
import {
  formatPrice,
  calculateSeatTotal,
  calculateMealTotal,
  calculateTaxes,
} from "../../utils/pricing";
import { meals } from "../../data/meals";
import { cn } from "../../lib/utils";

const LOCK_SECONDS = 10 * 60; // 10 minutes

type PayMethod = "card" | "upi" | "netbanking";

export function PaymentPage() {
  const {
    passengers,
    getSeats,
    setCurrentStep,
    seatLock,
    unlockSeats,
    bookingRef,
  } = useBookingStore();

  const seats = getSeats();
  const mealPrices = Object.fromEntries(meals.map((m) => [m.id, m.price]));
  const seatTotal = calculateSeatTotal(passengers, seats);
  const mealTotal = calculateMealTotal(passengers, mealPrices);
  const baseFare = 2499 * passengers.length;
  const taxes = calculateTaxes(seatTotal + baseFare, mealTotal);
  const grandTotal = baseFare + seatTotal + mealTotal + taxes;

  // Countdown timer for seat hold
  const [timeLeft, setTimeLeft] = useState(LOCK_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (seatLock) {
      setTimeLeft(
        Math.max(0, Math.floor((seatLock.expiresAt - Date.now()) / 1000))
      );
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          toast.error("Session expired. Seat hold has been released.", {
            duration: 5000,
          });
          unlockSeats();
          setCurrentStep("seats");
          return 0;
        }
        if (prev === 120) {
          toast.warning("2 minutes remaining to complete payment!");
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const pct = timeLeft / LOCK_SECONDS;
  const circum = 2 * Math.PI * 22;
  const dash = circum * (1 - pct);
  const urgent = timeLeft < 120;

  // Form states
  const [method, setMethod] = useState<PayMethod>("card");
  const [cardNum, setCardNum] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = () => {
    if (method === "card") {
      if (!cardNum || cardNum.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }
      if (!name.trim()) {
        toast.error("Please enter the cardholder name.");
        return;
      }
      if (!expiry || expiry.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!cvv || cvv.length < 3) {
        toast.error("Please enter a valid CVV.");
        return;
      }
    } else if (method === "upi") {
      if (!upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID (e.g., name@upi).");
        return;
      }
    } else {
      if (!bank) {
        toast.error("Please choose a bank from the list.");
        return;
      }
    }

    setProcessing(true);
    setTimeout(() => {
      clearInterval(timerRef.current!);
      setCurrentStep("confirmation");
    }, 2000);
  };

  const BANKS = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Bank", "Punjab National Bank"];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* ── Seat Lock Timer Banner ── */}
      <div
        className={cn(
          "rounded-3xl border p-5 flex items-center gap-4 bg-white shadow-xs transition-colors",
          urgent
            ? "border-red-300 bg-red-50/50"
            : "border-zinc-200 bg-zinc-50/60"
        )}
      >
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="4"
            />
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke={urgent ? "#ef4444" : "#09090b"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circum}
              strokeDashoffset={dash}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock
              className={cn(
                "w-5 h-5",
                urgent ? "text-red-500" : "text-zinc-900"
              )}
            />
          </div>
        </div>

        <div>
          <div
            className={cn(
              "font-mono font-black text-2xl tracking-tight leading-none",
              urgent ? "text-red-600" : "text-zinc-950"
            )}
          >
            {mins}:{secs}
          </div>
          <div className="text-xs font-bold text-zinc-800 mt-1">
            Seats Locked & Held for You (Ref: {bookingRef})
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            Complete transaction before hold expires to guarantee selected seats
          </div>
        </div>
      </div>

      {/* ── Main Payment Card ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">
              Payment Gateway
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select payment method to complete booking
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-zinc-400">Total Due</div>
            <div className="text-xl font-black text-zinc-950">
              {formatPrice(grandTotal)}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Payment Method Selectors */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "card", label: "Credit/Debit Card", icon: CreditCard },
              { id: "upi", label: "UPI & QR", icon: Smartphone },
              { id: "netbanking", label: "Net Banking", icon: Building2 },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as PayMethod)}
                  className={cn(
                    "p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition-all",
                    method === m.id
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-xs"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Card Input Mode */}
          {method === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCard(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-mono outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Name as on card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExp(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-mono outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-mono outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Mode */}
          {method === "upi" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-mono outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
                You will receive a payment request notification on your UPI app (GPay, PhonePe, Paytm). Approve the payment to complete ticket issuance.
              </div>
            </div>
          )}

          {/* Net Banking Mode */}
          {method === "netbanking" && (
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBank(b)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold text-left transition-all",
                      bank === b
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-zinc-50/50 text-zinc-800 hover:bg-zinc-100"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Security Tag */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
            <Shield className="w-4 h-4 text-zinc-900 flex-shrink-0" />
            <span>256-bit Bank-grade encryption. Dummy sandbox environment.</span>
          </div>

          {/* Single Unified Primary Action Button at bottom */}
          <button
            type="button"
            disabled={processing}
            onClick={handlePay}
            className="w-full py-4 rounded-2xl bg-zinc-950 hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm & Pay {formatPrice(grandTotal)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep("review")}
          disabled={processing}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 underline"
        >
          ← Return to Review Step
        </button>
      </div>
    </div>
  );
}
