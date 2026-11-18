import { Plane } from 'lucide-react';

export function AircraftShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Aircraft nose */}
      <div className="flex flex-col items-center mb-4 pb-4 border-b border-slate-100">
        <div className="w-16 h-16 bg-gradient-to-b from-slate-200 to-slate-100 rounded-full flex items-center justify-center shadow-inner mb-1">
          <Plane className="w-8 h-8 text-slate-500 rotate-90" />
        </div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Cockpit</div>
      </div>

      {/* Cabin body */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100 p-5 shadow-inner">
        {children}
      </div>

      {/* Tail */}
      <div className="flex justify-center mt-4 pt-4 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Tail</div>
      </div>
    </div>
  );
}
