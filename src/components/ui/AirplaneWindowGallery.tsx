import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Compass, Wind, Plane, MapPin } from "lucide-react";

interface WindowItem {
  id: string;
  seat: string;
  destination: string;
  country: string;
  altitude: string;
  image: string;
  description: string;
}

const WINDOWS: WindowItem[] = [
  {
    id: "win-1",
    seat: "12A",
    destination: "Bengaluru",
    country: "India",
    altitude: "36,000 FT",
    image:
      "https://images.unsplash.com/photo-1756920819744-4c23321b1c6c?q=80&w=1200&auto=format&fit=crop",
    description: "Cruising over the Deccan plateau towards Kempegowda International Airport.",
  },
  {
    id: "win-2",
    seat: "14F",
    destination: "Western Ghats",
    country: "India",
    altitude: "38,000 FT",
    image:
      "https://images.unsplash.com/photo-1786378678562-a7833837ce13?q=80&w=1200&auto=format&fit=crop",
    description: "Spectacular misty cloud formations along the mountain ridge.",
  },
  {
    id: "win-3",
    seat: "18A",
    destination: "Mumbai Coast",
    country: "India",
    altitude: "24,000 FT",
    image:
      "https://images.unsplash.com/photo-1751475470074-9ede6328010e?q=80&w=1200&auto=format&fit=crop",
    description: "Evening coastal approach with golden sun glinting across the Arabian sea.",
  },
];

export function AirplaneWindowGallery() {
  const [shades, setShades] = useState<Record<string, boolean>>({
    "win-1": false,
    "win-2": false,
    "win-3": false,
  });
  const [activeWindow, setActiveWindow] = useState<WindowItem | null>(null);

  const toggleShade = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShades((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-2.5 shadow-2xs">
          <Plane className="w-3.5 h-3.5 text-sky-600" />
          <span>Interactive Cabin View</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
          In-Flight Airplane Window Gallery
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto leading-relaxed">
          Experience the journey at 36,000 feet. Click a window to expand the landscape view or tap the handle to pull the shade.
        </p>
      </div>

      {/* Windows Row with ample container padding to prevent cutoffs */}
      <div className="w-full flex items-center justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-2 px-4">
        {WINDOWS.map((win) => {
          const isClosed = shades[win.id];
          return (
            <div
              key={win.id}
              onClick={() => !isClosed && setActiveWindow(win)}
              className="flex flex-col items-center cursor-pointer group flex-shrink-0"
            >
              {/* Window Frame Container with realistic airplane rounded oval bezel */}
              <div className="relative w-32 h-48 sm:w-40 sm:h-60 md:w-44 md:h-64 rounded-[40px] sm:rounded-[46px] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 p-2 sm:p-2.5 shadow-xl transition-transform duration-300 group-hover:scale-105 border border-slate-300/80">
                {/* Inner Window Recess */}
                <div className="relative w-full h-full rounded-[34px] sm:rounded-[38px] overflow-hidden bg-slate-950 border-2 border-slate-400/80 shadow-inner">
                  {/* Sky Scenery */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${win.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                  </div>

                  {/* Window Glass Reflection Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

                  {/* Pull-down Shade */}
                  <motion.div
                    initial={false}
                    animate={{ y: isClosed ? "0%" : "-85%" }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className="absolute inset-0 bg-slate-100 flex flex-col justify-end p-2 border-b-4 border-slate-300 shadow-md z-10"
                  >
                    {/* Horizontal blind ridges */}
                    <div className="space-y-1.5 opacity-30 my-auto">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-0.5 bg-slate-400 w-full rounded" />
                      ))}
                    </div>

                    {/* Shade Handle */}
                    <button
                      type="button"
                      onClick={(e) => toggleShade(win.id, e)}
                      title={isClosed ? "Open window shade" : "Close window shade"}
                      className="w-12 h-3.5 mx-auto rounded-full bg-slate-200 border border-slate-300 shadow-inner flex items-center justify-center hover:bg-slate-300 transition-colors"
                    >
                      <div className="w-4 h-1 bg-slate-500 rounded-full" />
                    </button>
                  </motion.div>

                  {/* Hover indicator */}
                  {!isClosed && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <span className="text-[10px] bg-slate-900/80 text-white backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm">
                        <Eye className="w-3 h-3 text-sky-400" /> View Out
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Window Metadata */}
              <div className="mt-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                  <span>Seat {win.seat}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-mono text-[11px] font-medium">{win.altitude}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{win.destination}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-bleed Scenery Modal */}
      <AnimatePresence>
        {activeWindow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveWindow(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white"
            >
              <button
                type="button"
                onClick={() => setActiveWindow(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src={activeWindow.image}
                  alt={activeWindow.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{activeWindow.country}</span>
                      <span>•</span>
                      <span>Seat {activeWindow.seat} Observation</span>
                    </div>
                    <h2 className="text-2xl font-display font-black">{activeWindow.destination}</h2>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">
                        Cruise Altitude
                      </div>
                      <div className="text-sm font-mono font-bold text-white">
                        {activeWindow.altitude}
                      </div>
                    </div>
                    <Wind className="w-5 h-5 text-sky-400" />
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeWindow.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-sky-400" /> Heading East-Southeast 114°
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveWindow(null)}
                    className="font-semibold text-white hover:text-sky-300 transition-colors"
                  >
                    Return to Cabin View
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}