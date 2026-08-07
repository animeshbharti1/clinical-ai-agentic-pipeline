import React from 'react';
import { AlertTriangle, Bell, Zap, ArrowRight } from 'lucide-react';

interface UrgentBypassBannerProps {
  patientName: string;
  patientId: string;
  alertMessage: string;
  onJumpToDashboard: () => void;
}

export const UrgentBypassBanner: React.FC<UrgentBypassBannerProps> = ({
  patientName,
  patientId,
  alertMessage,
  onJumpToDashboard
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-2 border-red-500 rounded-2xl p-4 shadow-2xl shadow-red-900/60 relative overflow-hidden animate-pulse">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        
        {/* Left Side: Alert Title & Message */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg flex-shrink-0 animate-bounce">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-500 text-white text-xs font-black uppercase tracking-wider font-mono">
                RED URGENT BYPASS ACTIVATED
              </span>
              <span className="text-xs text-red-200 font-mono">
                Patient: <strong className="text-white">{patientName}</strong> ({patientId})
              </span>
            </div>
            <h4 className="text-base font-bold text-white leading-tight">
              {alertMessage}
            </h4>
            <p className="text-xs text-red-200/90 flex items-center gap-1 font-medium pt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="text-amber-200">Pitch Highlight:</span> "The system doesn't let AI drafting slow down a critical alert!"
            </p>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onJumpToDashboard}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-700 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 group transform hover:scale-105"
          >
            <Bell className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Open Doctor Emergency Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

      </div>
    </div>
  );
};
