import React from 'react';
import type { AuditEntry } from '../types/clinical';
import { ShieldCheck, Download, Clock } from 'lucide-react';

interface AuditLogPanelProps {
  logs: AuditEntry[];
}

export const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ logs }) => {
  const getBadgeStyle = (category: AuditEntry['colorCategory']) => {
    switch (category) {
      case 'teal': return 'bg-teal-950 text-teal-300 border-teal-700/60';
      case 'coral': return 'bg-orange-950 text-orange-300 border-orange-700/60';
      case 'red': return 'bg-red-950 text-red-300 border-red-500 font-bold animate-pulse';
      case 'pink': return 'bg-pink-950 text-pink-300 border-pink-700/60';
      case 'amber': return 'bg-amber-950 text-amber-300 border-amber-600 font-bold';
      case 'green': return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'gray':
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `clinical_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-panel p-6 border-slate-700 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Audit & Compliance Log</h3>
            <p className="text-xs text-slate-400">
              HIPAA & Regulatory Traceability: Every AI action & human decision logged immutably.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Total Entries: {logs.length}</span>
          <button 
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-600 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Log (JSON)
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Stage / Pipeline Node</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Trace Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                  No audit log entries recorded yet. Run the clinical pipeline to generate logs.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-mono uppercase ${getBadgeStyle(log.colorCategory)}`}>
                      {log.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-300">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
