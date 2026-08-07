import React from 'react';
import type { PipelineStage, UrgencyLevel } from '../types/clinical';
import { 
  FileText, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  FileCheck, 
  Stethoscope, 
  MessageSquare, 
  Database, 
  Calendar, 
  ShieldCheck,
  Zap,
  ArrowDown
} from 'lucide-react';

interface WorkflowDiagramProps {
  currentStage: PipelineStage;
  urgency: UrgencyLevel;
  urgentBypassTriggered: boolean;
  onNodeClick?: (stage: PipelineStage) => void;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  currentStage,
  urgentBypassTriggered,
  onNodeClick
}) => {
  const getStageClass = (stageName: PipelineStage) => {
    return currentStage === stageName ? 'node-active-glow ring-2 ring-blue-400 font-semibold scale-105' : 'opacity-85 hover:opacity-100';
  };

  return (
    <div className="w-full glass-panel p-5 relative overflow-hidden transition-all duration-300">
      {/* Visual Header Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-100 tracking-wide">Autonomous Clinical Workflow Pipeline</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-mono">
            Hackathon Agentic Demo
          </span>
        </div>

        {/* Color Key Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Gray: Data/Logs
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> Teal: Ingestion
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span> Coral: Analysis
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> Red: Urgent Bypass
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span> Pink: Drafting
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Amber: Doctor Gate
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Green: Post-Actions
          </span>
        </div>
      </div>

      {/* Main Flow Layout Container */}
      <div className="flex flex-col items-center gap-3 py-2 max-w-4xl mx-auto">
        
        {/* Node 1: Patient Symptoms or Report (Gray) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('idle')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-gray ${getStageClass('idle')} transition-all duration-300 cursor-pointer text-center relative shadow-lg`}
        >
          <div className="flex items-center justify-center gap-2 text-slate-200 font-semibold">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Patient symptoms or report</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Text, voice, PDF, scan upload</div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 my-0.5 animate-bounce" />

        {/* Node 2: Ingestion & Extraction Agent (Teal) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('ingestion')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-teal ${getStageClass('ingestion')} transition-all duration-300 cursor-pointer text-center relative shadow-lg`}
        >
          <div className="flex items-center justify-center gap-2 text-teal-200 font-semibold">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Ingestion & extraction agent</span>
          </div>
          <div className="text-xs text-teal-300/70 mt-0.5">OCR, structure into fields</div>
        </div>

        <ArrowDown className="w-4 h-4 text-teal-500 my-0.5" />

        {/* Row 3: Analysis Agent (Coral) + Urgent Case Bypass (Red) */}
        <div className="w-full max-w-2xl flex items-center justify-center gap-4 relative">
          {/* Analysis Agent */}
          <div 
            onClick={() => onNodeClick && onNodeClick('analysis')}
            className={`flex-1 p-3.5 rounded-xl border node-coral ${getStageClass('analysis')} transition-all duration-300 cursor-pointer text-center relative shadow-lg`}
          >
            <div className="flex items-center justify-center gap-2 text-orange-200 font-semibold">
              <Activity className="w-4 h-4 text-orange-400" />
              <span>Analysis agent</span>
            </div>
            <div className="text-xs text-orange-300/70 mt-0.5">Compare history, flag abnormal</div>
          </div>

          {/* Urgent Bypass Direct Alert (Red Box) */}
          <div 
            onClick={() => onNodeClick && onNodeClick('urgent_bypass')}
            className={`w-48 p-3 rounded-xl border node-red ${urgentBypassTriggered ? 'node-red-active' : 'opacity-60'} transition-all duration-300 cursor-pointer text-center relative shadow-lg`}
          >
            <div className="flex items-center justify-center gap-1.5 text-red-200 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
              <span>Urgent case</span>
            </div>
            <div className="text-[11px] text-red-300/90 font-medium mt-0.5">Direct Alert Bypass</div>
            {urgentBypassTriggered && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse shadow">
                TRIGGERED!
              </span>
            )}
          </div>
        </div>

        {/* Connector arrow down to Draft agent with optional urgent bypass line overlay */}
        <div className="w-full max-w-2xl flex justify-between px-16 relative my-0.5">
          <ArrowDown className="w-4 h-4 text-orange-500 mx-auto" />
          {urgentBypassTriggered && (
            <div className="absolute right-12 top-0 text-xs text-red-400 font-mono italic animate-pulse flex items-center gap-1">
              <span>Fast-track bypass to doctor!</span>
            </div>
          )}
        </div>

        {/* Node 4: Draft Agent (Pink) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('drafting')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-pink ${getStageClass('drafting')} transition-all duration-300 cursor-pointer text-center relative shadow-lg`}
        >
          <div className="flex items-center justify-center gap-2 text-pink-200 font-semibold">
            <FileCheck className="w-4 h-4 text-pink-400" />
            <span>Draft agent</span>
          </div>
          <div className="text-xs text-pink-300/70 mt-0.5">Summary & suggested next steps</div>
        </div>

        <ArrowDown className="w-4 h-4 text-pink-500 my-0.5" />

        {/* Node 5: Doctor Review Dashboard (Amber - Centerpiece Checkpoint) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('doctor_review')}
          className={`w-full max-w-lg p-4 rounded-2xl border-2 node-amber ${getStageClass('doctor_review')} transition-all duration-300 cursor-pointer text-center relative shadow-xl transform`}
        >
          <div className="flex items-center justify-center gap-2 text-amber-200 font-extrabold text-base">
            <Stethoscope className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Doctor review dashboard</span>
          </div>
          <div className="text-xs text-amber-300/90 font-medium mt-1">
            Approve, edit, or reject (The one gate everything must pass through)
          </div>
          <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono">
            HUMAN APPROVAL GATE
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-amber-500 my-0.5" />

        {/* Post-Approval 3 Parallel Actions (Green Boxes) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          {/* Action 1 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-300 cursor-pointer text-center shadow-lg`}
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-200 font-semibold text-xs">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Notify patient</span>
            </div>
            <div className="text-[11px] text-emerald-300/70 mt-0.5">Send confirmation</div>
          </div>

          {/* Action 2 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-300 cursor-pointer text-center shadow-lg`}
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-200 font-semibold text-xs">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Update EHR record</span>
            </div>
            <div className="text-[11px] text-emerald-300/70 mt-0.5">Save approved summary</div>
          </div>

          {/* Action 3 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-300 cursor-pointer text-center shadow-lg`}
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-200 font-semibold text-xs">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Schedule follow-up</span>
            </div>
            <div className="text-[11px] text-emerald-300/70 mt-0.5">Book next appointment</div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-emerald-500 my-0.5" />

        {/* Node 7: Audit & Compliance Log (Gray Box) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('approved')}
          className={`w-full max-w-md p-3 rounded-xl border node-gray ${getStageClass('approved')} transition-all duration-300 cursor-pointer text-center shadow-md`}
        >
          <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Audit & compliance log</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Every AI action & human decision</div>
        </div>

      </div>
    </div>
  );
};
