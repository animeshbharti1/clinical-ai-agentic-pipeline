import React from 'react';
import { MOCK_PATIENTS } from '../data/mockPatients';
import { Activity, Play, RotateCcw, Layers } from 'lucide-react';

interface HeaderProps {
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onRunAutoPipeline: () => void;
  onResetPipeline: () => void;
  autoPlaySpeed: 'step' | 'fast';
  onToggleSpeed: (speed: 'step' | 'fast') => void;
  isPipelineRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPatientId,
  onSelectPatient,
  onRunAutoPipeline,
  onResetPipeline,
  autoPlaySpeed,
  onToggleSpeed,
  isPipelineRunning
}) => {
  return (
    <header className="w-full glass-panel p-4 border-b border-slate-700/80 sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 via-blue-600 to-amber-500 text-slate-950 shadow-lg shadow-blue-500/20 font-bold">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">ClinicaAI</h1>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                HUMAN-IN-THE-LOOP HACKATHON
              </span>
            </div>
            <p className="text-xs text-slate-400">Continuous 3-Agent Workflow & Doctor Review Gate</p>
          </div>
        </div>

        {/* Demo Preset Case Selector */}
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Select Preset Scenario:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => onSelectPatient(e.target.value)}
            disabled={isPipelineRunning}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {MOCK_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.analysis.urgency === 'critical' ? '🔴 URGENT: ' : p.analysis.urgency === 'moderate' ? '🟠 MODERATE: ' : '🟢 ROUTINE: '}
                {p.patientName} ({p.extracted.chiefComplaint.slice(0, 35)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Presentation & Execution Controls */}
        <div className="flex items-center space-x-3">
          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => onToggleSpeed('step')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                autoPlaySpeed === 'step' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Step (1.5s)
            </button>
            <button
              onClick={() => onToggleSpeed('fast')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                autoPlaySpeed === 'fast' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fast (0.4s)
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={onResetPipeline}
            disabled={isPipelineRunning}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
            title="Reset Pipeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Run Demo Pipeline Button */}
          <button
            onClick={onRunAutoPipeline}
            disabled={isPipelineRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-blue-600 to-amber-500 hover:from-teal-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-blue-950/50 transition flex items-center gap-2 transform hover:scale-105"
          >
            <Play className={`w-4 h-4 text-slate-950 fill-slate-950 ${isPipelineRunning ? 'animate-spin' : ''}`} />
            <span>{isPipelineRunning ? 'Agents Processing...' : 'RUN AGENT PIPELINE'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
