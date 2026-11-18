import React from "react";

export function SeatLegend() {
  const items = [
    {
      label: "Available (Free)",
      box: "bg-white border-2 border-zinc-400 text-zinc-900",
      desc: "₹0 Standard seat",
    },
    {
      label: "Available (Upgrades)",
      box: "bg-zinc-100 border-2 border-zinc-900 text-zinc-900",
      desc: "+₹250 / +₹350 Legroom",
    },
    {
      label: "Selected Seat",
      box: "bg-zinc-950 border-2 border-zinc-950 text-white font-bold",
      desc: "Assigned to passenger",
    },
    {
      label: "Occupied",
      box: "bg-zinc-200 border-2 border-zinc-300 text-zinc-400 cursor-not-allowed",
      desc: "Unavailable",
    },
  ];

  return (
    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
        Cabin Legend & Pricing
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${item.box}`}
            >
              {item.label.includes("Selected") ? "P1" : item.label.includes("Occupied") ? "✕" : "A"}
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 leading-tight">
                {item.label}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
