// AnimatedTicket — 21st.dev-style premium flight ticket component
import * as React from 'react';
import { cn } from "../../lib/utils";
import { CheckCircle, Plane } from 'lucide-react';

// ── Barcode ──────────────────────────────────────────────────────
const Barcode = ({ value }: { value: string }) => {
  const hash = value.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  const rng = (s: number) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
  const bars = Array.from({ length: 60 }, (_, i) => ({ width: rng(hash + i) > 0.65 ? 2.5 : 1.5 }));
  const spacing = 1.5;
  const totalW = bars.reduce((a, b) => a + b.width + spacing, 0) - spacing;
  const svgW = 240; const svgH = 60;
  let cx = (svgW - totalW) / 2;

  return (
    <div className="flex flex-col items-center py-2">
      <svg xmlns="http://www.w3.org/2000/svg" width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="fill-slate-800">
        {bars.map((bar, i) => {
          const x = cx; cx += bar.width + spacing;
          return <rect key={i} x={x} y="5" width={bar.width} height="50" />;
        })}
      </svg>
      <p className="text-xs text-slate-400 tracking-[0.25em] mt-1 font-mono">{value}</p>
    </div>
  );
};

// ── Confetti ─────────────────────────────────────────────────────
export const ConfettiExplosion = () => {
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#f97316', '#ec4899'];
  return (
    <>
      <style>{`@keyframes cf-fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 120 }, (_, i) => (
          <div key={i} className="absolute rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-5 + Math.random() * 5}%`,
              width: `${6 + Math.random() * 6}px`,
              height: `${10 + Math.random() * 8}px`,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `cf-fall ${2 + Math.random() * 3}s ${Math.random() * 1.5}s linear forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// ── Main ticket ───────────────────────────────────────────────────
export interface TicketProps extends React.HTMLAttributes<HTMLDivElement> {
  ticketId: string;
  amount: number;
  date: Date;
  cardHolder: string;
  last4Digits: string;
  barcodeValue: string;
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  fromTime: string;
  toTime: string;
  flightNumber: string;
  aircraft: string;
  passengerSeats: { name: string; seat: string; color: string }[];
}

export const AnimatedTicket = React.forwardRef<HTMLDivElement, TicketProps>(
  ({ className, ticketId, amount, date, cardHolder, last4Digits, barcodeValue,
    fromCode, toCode, fromCity, toCity, fromTime, toTime, flightNumber, aircraft,
    passengerSeats, ...props }, ref) => {

    const [showConfetti, setShowConfetti] = React.useState(false);
    React.useEffect(() => {
      const t1 = setTimeout(() => setShowConfetti(true), 100);
      const t2 = setTimeout(() => setShowConfetti(false), 5500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    const fmtDate = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

    return (
      <>
        {showConfetti && <ConfettiExplosion />}
        <div
          ref={ref}
          className={cn(
            'relative w-full max-w-sm mx-auto font-sans',
            'animate-in fade-in-0 zoom-in-90 duration-700',
            className
          )}
          {...props}
        >
          {/* ── Ticket card ──── */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-visible relative">

            {/* Header gradient */}
            <div className="hero-gradient rounded-t-3xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white -rotate-45" />
                  </div>
                  <span className="font-bold text-lg">SkyWings</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-mono">{flightNumber}</span>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-black">{fromCode}</div>
                  <div className="text-sky-200 text-sm">{fromCity}</div>
                  <div className="text-white font-bold mt-1">{fromTime}</div>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1 mx-4">
                  <div className="text-xs text-sky-200 uppercase tracking-widest">{aircraft}</div>
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-px bg-white/30" />
                    <Plane className="w-5 h-5 text-white mx-2 rotate-90" />
                    <div className="flex-1 h-px bg-white/30" />
                  </div>
                  <div className="text-xs text-sky-200">Non-stop</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">{toCode}</div>
                  <div className="text-sky-200 text-sm">{toCity}</div>
                  <div className="text-white font-bold mt-1">{toTime}</div>
                </div>
              </div>
            </div>

            {/* Tear notches */}
            <div className="relative flex items-center px-0 -my-0.5">
              <div className="w-5 h-10 bg-slate-100 rounded-r-full border-r border-slate-200 flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
              <div className="w-5 h-10 bg-slate-100 rounded-l-full border-l border-slate-200 flex-shrink-0" />
            </div>

            {/* Success badge */}
            <div className="flex justify-center -mt-5 mb-3 relative z-10">
              <div className="bg-white rounded-full p-1 shadow-lg border-2 border-green-100">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-700">Booking Confirmed!</div>
                <div className="text-xs text-slate-400 mt-0.5">Your seats are reserved</div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Booking ID</div>
                  <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{ticketId}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Total Paid</div>
                  <div className="font-bold text-blue-700 text-sm mt-0.5">{fmt}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Date &amp; Time</div>
                  <div className="font-medium text-slate-800 text-sm mt-0.5">{fmtDate}</div>
                </div>
              </div>

              {/* Passengers */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-2">Passengers</div>
                <div className="space-y-2">
                  {passengerSeats.map((ps, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: ps.color }}>
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{ps.name}</span>
                      </div>
                      <span className="font-black text-blue-700 text-base">{ps.seat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card used */}
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <div className="relative w-9 h-6 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-90" style={{ width: '60%' }} />
                  <div className="absolute right-0 top-0 rounded-full bg-amber-400 opacity-90" style={{ width: '60%', height: '100%' }} />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{cardHolder}</div>
                  <div className="text-slate-400 font-mono text-xs tracking-widest">•••• {last4Digits}</div>
                </div>
              </div>

              {/* Barcode */}
              <div className="border-t border-dashed border-slate-200 pt-3">
                <Barcode value={barcodeValue} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);
AnimatedTicket.displayName = 'AnimatedTicket';
