import * as React from "react";
import { cn } from "../../lib/utils";

// --- SVG Icons ---
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CardBrandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="18"
  >
    <circle cx="8" cy="12" r="7" fill="#0f172a"></circle>
    <circle cx="16" cy="12" r="7" fill="#64748b" fillOpacity="0.8"></circle>
  </svg>
);

// --- Helper Components ---
const DashedLine = () => (
  <div
    className="w-full border-t-2 border-dashed border-slate-200"
    aria-hidden="true"
  />
);

const Barcode = ({ value }: { value: string }) => {
  const hashCode = (s: string) =>
    s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  const seed = hashCode(value);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const bars = Array.from({ length: 48 }).map((_, index) => {
    const rand = random(seed + index);
    const width = rand > 0.65 ? 2.4 : 1.2;
    return { width };
  });

  const spacing = 1.4;
  const totalWidth =
    bars.reduce((acc, bar) => acc + bar.width + spacing, 0) - spacing;
  const svgWidth = 200;
  const svgHeight = 44;
  let currentX = (svgWidth - totalWidth) / 2;

  return (
    <div className="flex flex-col items-center py-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-label={`Barcode for value ${value}`}
        className="fill-current text-slate-900"
      >
        {bars.map((bar, index) => {
          const x = currentX;
          currentX += bar.width + spacing;
          return (
            <rect key={index} x={x} y="4" width={bar.width} height="36" />
          );
        })}
      </svg>
      <p className="text-[10px] text-slate-500 font-mono tracking-[0.25em] mt-0.5">
        {value}
      </p>
    </div>
  );
};

const ConfettiExplosion = () => {
  const confettiCount = 50;
  const colors = ["#0f172a", "#38bdf8", "#64748b", "#2563eb", "#cbd5e1"];

  return (
    <>
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden="true">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-3 rounded-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-15 + Math.random() * 10}%`,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `fall ${2.2 + Math.random() * 2}s ${
                Math.random() * 1.2
              }s linear forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// --- Main Ticket Component ---
export interface TicketProps extends React.HTMLAttributes<HTMLDivElement> {
  ticketId: string;
  amount: number;
  date: Date;
  cardHolder: string;
  last4Digits: string;
  barcodeValue: string;
  flightRoute?: {
    fromCode: string;
    fromCity: string;
    toCode: string;
    toCity: string;
    flightNumber: string;
    time: string;
  };
  passengersList?: { name: string; seat: string }[];
}

export const TicketConfirmationCard = React.forwardRef<
  HTMLDivElement,
  TicketProps
>(
  (
    {
      className,
      ticketId,
      amount,
      date,
      cardHolder,
      last4Digits,
      barcodeValue,
      flightRoute,
      passengersList = [],
      ...props
    },
    ref
  ) => {
    const [showConfetti, setShowConfetti] = React.useState(false);

    React.useEffect(() => {
      const mountTimer = setTimeout(() => setShowConfetti(true), 100);
      const unmountTimer = setTimeout(() => setShowConfetti(false), 4500);
      return () => {
        clearTimeout(mountTimer);
        clearTimeout(unmountTimer);
      };
    }, []);

    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    return (
      <>
        {showConfetti && <ConfettiExplosion />}
        <div
          ref={ref}
          className={cn(
            "relative w-full max-w-[360px] mx-auto bg-white text-slate-900 border border-slate-200/90 rounded-3xl shadow-xl font-sans z-10 overflow-hidden",
            className
          )}
          {...props}
        >
          {/* Ticket cut-out notches aligned to the divider */}
          <div className="absolute -left-3 top-[170px] -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border-r border-slate-300 z-20" />
          <div className="absolute -right-3 top-[170px] -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border-l border-slate-300 z-20" />

          {/* Top Compact Header */}
          <div className="p-5 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-slate-950 to-slate-900 text-white relative">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-2 shadow-xs">
              <CheckCircleIcon className="w-5 h-5 text-sky-400" />
            </div>
            <h1 className="text-base font-display font-black tracking-tight">Booking Confirmed</h1>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Official SkyWings e-ticket issued
            </p>

            {flightRoute && (
              <div className="mt-3 flex items-center justify-between w-full px-3.5 py-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div className="text-left">
                  <div className="text-xl font-display font-black tracking-tight">{flightRoute.fromCode}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px]">{flightRoute.fromCity}</div>
                </div>
                <div className="text-center px-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-sky-300">
                    {flightRoute.flightNumber}
                  </span>
                  <div className="w-12 h-px bg-white/20 my-0.5" />
                  <span className="text-[9px] text-slate-400">{flightRoute.time}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-display font-black tracking-tight">{flightRoute.toCode}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px]">{flightRoute.toCity}</div>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Details - Compact spacing */}
          <div className="p-5 pt-4 space-y-3.5 bg-white text-xs">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ticket Reference
                </p>
                <p className="font-mono font-bold text-xs text-slate-900">{ticketId}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Fare
                </p>
                <p className="font-black text-sm text-slate-900">{formattedAmount}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Issued On</span>
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>

            {passengersList.length > 0 && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Assigned Seats
                </p>
                <div className="space-y-1">
                  {passengersList.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <span className="font-bold px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono">
                        Seat {p.seat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CardBrandIcon />
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 leading-none">{cardHolder}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">•••• {last4Digits}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified
              </span>
            </div>

            <DashedLine />

            <Barcode value={barcodeValue} />
          </div>
        </div>
      </>
    );
  }
);

TicketConfirmationCard.displayName = "TicketConfirmationCard";
