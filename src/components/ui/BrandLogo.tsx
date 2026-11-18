import React from "react";

interface BrandLogoProps {
  variant?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({
  variant = "light",
  showTagline = true,
  size = "md",
}: BrandLogoProps) {
  const isLight = variant === "light";

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Aerodynamic SVG Wing Crest Emblem */}
      <div
        className={`${iconSizes[size]} rounded-xl flex items-center justify-center p-1.5 transition-transform hover:scale-105 ${
          isLight
            ? "bg-white text-slate-900 shadow-md ring-1 ring-white/20"
            : "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main wing blade */}
          <path
            d="M5 19L23 8C25.5 6.5 28 8.5 27 11L21 21C19.5 23.5 16.5 24.5 13.5 24L6 21C4 20.5 3.5 19.5 5 19Z"
            fill={isLight ? "#0f172a" : "#38bdf8"}
          />
          {/* Accent secondary blade */}
          <path
            d="M8 20.5L20 13C22 12 24 13.5 23 15.5L19 22.5C18 24 15.5 25 13.5 24.5L7 22C5.5 21.5 5.5 21 8 20.5Z"
            fill={isLight ? "#38bdf8" : "#ffffff"}
            opacity={isLight ? 0.9 : 0.85}
          />
          <circle cx="26" cy="8.5" r="1.5" fill={isLight ? "#38bdf8" : "#ffffff"} />
        </svg>
      </div>

      <div>
        <div
          className={`font-display font-black tracking-tight leading-none ${textSizes[size]} ${
            isLight ? "text-white" : "text-slate-900"
          }`}
        >
          SkyWings
        </div>
        {showTagline && (
          <span
            className={`text-[9px] font-mono tracking-widest uppercase block mt-0.5 ${
              isLight ? "text-sky-300" : "text-slate-500"
            }`}
          >
            Airlines &amp; Airways
          </span>
        )}
      </div>
    </div>
  );
}
