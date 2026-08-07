import React from 'react';
import type { AnalysisResult, UrgencyLevel } from '../types/clinical';
import { Activity, ShieldAlert, History, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical':
        return <span className="px-3 py-1 rounded-full bg-red-900/80 text-red-200 border border-red-500 font-bold text-xs animate-pulse flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> CRITICAL - URGENT BYPASS</span>;
      case 'high':
        return <span className="px-3 py-1 rounded-full bg-orange-900/80 text-orange-200 border border-orange-500 font-bold text-xs">HIGH RISK</span>;
      case 'moderate':
        return <span className="px-3 py-1 rounded-full bg-amber-900/80 text-amber-200 border border-amber-500 font-medium text-xs">MODERATE RISK</span>;
      case 'low':
      default:
        return <span className="px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-500 font-medium text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> LOW RISK / ROUTINE</span>;
    }
  };

  return (
    <div className="glass-panel p-6 border-orange-500/30 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-orange-500/20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-200">Analysis Agent</h3>
            <p className="text-xs text-orange-300/70">Risk Stratification, Abnormality Detection & Baseline Comparison</p>
          </div>
        </div>
        <div>
          {getUrgencyBadge(analysis.urgency)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Meter Gauge */}
        <div className="glass-card p-5 border-orange-500/30 flex flex-col items-center justify-center text-center space-y-3 bg-gradient-to-b from-orange-950/20 to-slate-900/90">
          <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Computed Clinical Risk Score</span>
          
          <div className="relative flex items-center justify-center">
            {/* Visual Ring */}
            <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center ${
              analysis.riskScore > 75 ? 'border-red-500 text-red-400 shadow-lg shadow-red-900/40' :
              analysis.riskScore > 40 ? 'border-orange-500 text-orange-400' : 'border-emerald-500 text-emerald-400'
            }`}>
              <div className="text-center">
                <span className="text-3xl font-extrabold font-mono">{analysis.riskScore}</span>
                <span className="text-[10px] block text-slate-400 uppercase">/ 100 Risk</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 px-2">
            {analysis.urgentBypassTriggered ? (
              <strong className="text-red-400 block font-semibold">
                ⚠️ Urgent Bypass Rule Matched: Direct notification to attending physician activated.
              </strong>
            ) : (
              <span className="text-slate-400">Standard clinical workflow queue position maintained.</span>
            )}
          </p>
        </div>

        {/* Flagged Abnormalities List */}
        <div className="glass-card p-4 border-slate-700 md:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              Flagged Abnormalities & Clinical Context ({analysis.abnormalities.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Automated Rule Engine</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {analysis.abnormalities.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                No critical or abnormal clinical parameters detected.
              </div>
            ) : (
              analysis.abnormalities.map((abn) => (
                <div 
                  key={abn.id} 
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    abn.severity === 'critical' ? 'bg-red-950/40 border-red-500/60 text-red-200' : 'bg-orange-950/30 border-orange-500/40 text-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      {abn.severity === 'critical' ? <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" /> : <TrendingUp className="w-3.5 h-3.5 text-orange-400" />}
                      {abn.parameter}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      abn.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-800 text-orange-100'
                    }`}>
                      {abn.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-300">
                    <div>Value: <strong className="text-white">{abn.value}</strong></div>
                    <div>Reference: <span className="text-slate-400">{abn.referenceRange}</span></div>
                  </div>
                  <p className="text-[11px] text-slate-300 pt-1 italic border-t border-slate-700/50 mt-1">
                    "{abn.clinicalContext}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Baseline Historical Comparison */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-orange-500/20 flex items-start gap-3">
        <History className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-orange-300 uppercase tracking-wider block">Historical Patient Baseline Analysis</span>
          <p className="text-slate-300 leading-relaxed">{analysis.historicalComparison}</p>
        </div>
      </div>
    </div>
  );
};
