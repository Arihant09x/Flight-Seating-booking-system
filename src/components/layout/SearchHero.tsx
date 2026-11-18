import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Palmtree,
  Train,
  Bus,
  Car,
  FileText,
  Send,
  ArrowLeftRight,
  ChevronDown,
  Compass,
  CreditCard,
  MapPin,
  Gift,
  PhoneCall,
  Languages,
  ShieldAlert,
  ArrowRight,
  Check,
  Plane,
} from "lucide-react";
import { useBookingStore } from "../../store/bookingStore";
import { AirplaneWindowGallery } from "../ui/AirplaneWindowGallery";
import { BrandLogo } from "../ui/BrandLogo";

interface SearchHeroProps {
  onSearch: () => void;
}

const CATEGORIES = [
  { id: "flight", label: "Flights", icon: Plane, active: true },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "homestays", label: "HomeStays", icon: Home },
  { id: "holidays", label: "Holiday Packages", icon: Palmtree },
  { id: "trains", label: "Trains", icon: Train },
  { id: "buses", label: "Buses", icon: Bus },
  { id: "cabs", label: "Cabs", icon: Car },
  { id: "visa", label: "Visa Services", icon: FileText },
  { id: "charter", label: "Charter Jets", icon: Send },
];

const FARE_TYPES = [
  { id: "regular", label: "Regular / Normal Fares", desc: "Standard fares" },
  { id: "armed", label: "Armed Forces Fares", desc: "Up to ₹600 off" },
  { id: "student", label: "Student Fares", desc: "Extra baggage allowance" },
  { id: "senior", label: "Senior Citizen Fares", desc: "Up to ₹600 off" },
  { id: "doctors", label: "Doctors & Nurses", desc: "Up to ₹600 off" },
];

const OFFERS = [
  {
    id: "off-1",
    title: "YEAR-END ESCAPES: Up to 25% Off on Flights",
    subtitle: "Valid on domestic flights with free cancellation & date change.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    code: "FLYHIGH",
  },
  {
    id: "off-2",
    title: "Exclusive Card Cashback: Save ₹1,500",
    subtitle: "Applicable on leading bank cards on minimum booking of ₹5,000.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    code: "CARDPROMO",
  },
];

export function SearchHero({ onSearch }: SearchHeroProps) {
  const { passengerCount, setPassengerCount } = useBookingStore();
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway");
  const [fromCity, setFromCity] = useState("Delhi");
  const [fromCode, setFromCode] = useState("DEL");
  const [fromAirport, setFromAirport] = useState("Indira Gandhi International Airport India");

  const [toCity, setToCity] = useState("Bangalore");
  const [toCode, setToCode] = useState("BLR");
  const [toAirport, setToAirport] = useState("Kempegowda International Airport");

  const [selectedFare, setSelectedFare] = useState("regular");
  const [searching, setSearching] = useState(false);
  const [offerTab, setOfferTab] = useState("all");

  const swapCities = () => {
    setFromCity(toCity);
    setFromCode(toCode);
    setFromAirport(toAirport);
    setToCity(fromCity);
    setToCode(fromCode);
    setToAirport(fromAirport);
  };

  const handleSearchClick = () => {
    setSearching(true);
    setTimeout(() => {
      onSearch();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col font-sans">
      {/* ── Top Dark Navigation Bar ── */}
      <header className="mmt-hero-gradient text-white pb-24 pt-4 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-2">
            {/* Airline Logo */}
            <BrandLogo variant="light" size="md" />

            {/* Right utility items */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs text-slate-300">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <div>
                  <div className="font-semibold text-white">Introducing myBiz</div>
                  <div className="text-[10px] text-slate-400">Corporate Travel Program</div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <Compass className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="font-semibold text-white">My Trips</div>
                  <div className="text-[10px] text-slate-400">Manage Bookings</div>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-sm"
              >
                Login / Account
              </button>

              <div className="hidden sm:flex items-center gap-1 font-semibold text-white">
                <span>IN | ENG | INR</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Floating Main Search Container ── */}
      <div className="max-w-6xl mx-auto w-full px-4 -mt-20 z-20">
        {/* Floating Category Pills */}
        <div className="flex justify-center mb-2 overflow-x-auto py-1">
          <div className="bg-white rounded-2xl shadow-xl p-1.5 flex items-center gap-1 sm:gap-2 border border-slate-200">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    cat.active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Box Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8">
          {/* Top Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            {/* Trip Type Radios */}
            <div className="flex items-center gap-6">
              {[
                { id: "oneway", label: "ONEWAY" },
                { id: "roundtrip", label: "ROUNDTRIP" },
                { id: "multicity", label: "MULTICITY" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setTripType(opt.id as any)}
                  className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      tripType === opt.id
                        ? "border-slate-900 bg-slate-900"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {tripType === opt.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="text-xs font-semibold text-slate-500">
              <span className="text-slate-950 font-bold">Domestic Flights</span> | International Routes
            </div>
          </div>

          {/* Core Grid Matrix (MakeMyTrip boxed layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-300 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* FROM */}
            <div className="md:col-span-3 p-4 bg-white hover:bg-slate-50 transition-colors relative group">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                From
              </div>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="text-2xl font-display font-black text-slate-900 bg-transparent outline-none w-full tracking-tight"
              />
              <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {fromCode}, {fromAirport}
              </div>

              {/* Swap Button on border */}
              <button
                type="button"
                onClick={swapCities}
                title="Swap origin and destination"
                className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:-right-3.5 md:top-1/2 md:-translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-100 hover:rotate-180 transition-all duration-300"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>

            {/* TO */}
            <div className="md:col-span-3 p-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                To
              </div>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="text-2xl font-display font-black text-slate-900 bg-transparent outline-none w-full tracking-tight"
              />
              <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {toCode}, {toAirport}
              </div>
            </div>

            {/* DEPARTURE */}
            <div className="md:col-span-2 p-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                <span>Departure</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-display font-black text-slate-900 tracking-tight">
                25 <span className="text-base font-bold">Dec 26</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Saturday</div>
            </div>

            {/* RETURN */}
            <div className="md:col-span-2 p-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                <span>Return</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                Tap to add return date for roundtrip discounts
              </div>
            </div>

            {/* TRAVELLERS & CLASS */}
            <div className="md:col-span-2 p-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                <span>Travellers &amp; Class</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-black text-slate-900">{passengerCount}</span>
                <span className="text-xs font-bold text-slate-700">
                  {passengerCount === 1 ? "Traveller" : "Travellers"}
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    type="button"
                    onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassengerCount(Math.min(5, passengerCount + 1))}
                    className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Economy / Premium
              </div>
            </div>
          </div>

          {/* Select A Fare Type Section */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1 font-mono">Select A Fare Type:</span>
              {FARE_TYPES.map((fare) => (
                <button
                  key={fare.id}
                  type="button"
                  onClick={() => setSelectedFare(fare.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    selectedFare === fare.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {fare.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Trending: <span className="font-semibold text-slate-800">DEL → BLR</span>,{" "}
              <span className="font-semibold text-slate-800">BOM → GOA</span>
            </div>
          </div>

          {/* Floating Centered SEARCH Button */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSearchClick}
              disabled={searching}
              className="px-12 py-3.5 rounded-full bg-slate-900 hover:bg-black text-white font-display font-black text-base shadow-2xl hover:shadow-slate-900/40 flex items-center gap-2.5 transition-all border border-slate-700 tracking-wider"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SEARCHING FLIGHTS...</span>
                </>
              ) : (
                <>
                  <span>SEARCH FLIGHTS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Quick Features Row */}
        <div className="flex justify-center mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-2.5 flex items-center gap-6 sm:gap-10 text-xs font-bold text-slate-700 overflow-x-auto">
            <div className="flex items-center gap-2 cursor-pointer hover:text-black">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>Trip Ideas</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-black">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>Trip Money &amp; Easy EMI</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-black">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Nearby Getaways</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-black">
              <Gift className="w-4 h-4 text-sky-600" />
              <span>Gift Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Support and Advisory Cards ── */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800">
              <PhoneCall className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">24x7 Assistance</div>
              <div className="text-[11px] text-slate-500">Dedicated booking support</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800">
              <Languages className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Regional Support</div>
              <div className="text-[11px] text-slate-500">Available in multiple languages</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800">
              <ShieldAlert className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Travel Advisory</div>
              <div className="text-[11px] text-slate-500">Real-time airport updates</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800">
              <Check className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Instant Refunds</div>
              <div className="text-[11px] text-slate-500">Zero fee cancellations</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive 21st.dev Airplane Window Gallery Section ── */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 w-full overflow-hidden">
          <AirplaneWindowGallery />
        </div>
      </div>

      {/* ── Offers Section (MakeMyTrip Style) ── */}
      <div className="max-w-6xl mx-auto w-full px-4 my-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-display font-black text-slate-950">Special Flight Offers</h2>
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
              {["all", "bank", "domestic", "international"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setOfferTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    offerTab === tab
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab === "all" ? "All Offers" : `${tab} Offers`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow bg-slate-50/50"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{offer.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                      CODE: {offer.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleSearchClick}
                      className="text-xs font-bold text-slate-950 hover:underline flex items-center gap-1"
                    >
                      Book Flight <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
