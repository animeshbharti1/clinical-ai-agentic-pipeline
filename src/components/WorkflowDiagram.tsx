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
    return currentStage === stageName ? 'node-active-glow font-semibold scale-105' : 'opacity-90 hover:opacity-100';
  };

  return (
    <div className="w-full glass-panel p-6 relative overflow-hidden transition-all duration-300">
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Autonomous Clinical Workflow Pipeline</h2>
            <p className="text-xs text-slate-400">Sequential AI Agent Chain & Doctor Approval Checkpoint</p>
          </div>
        </div>

        {/* Minimalist 3-Color Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> AI Agent Nodes
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Human Approval Gate
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> Urgent Bypass
          </span>
        </div>
      </div>

      {/* Main Flow Layout Container */}
      <div className="flex flex-col items-center gap-3 py-2 max-w-4xl mx-auto">
        
        {/* Node 1: Patient Symptoms or Report */}
        <div 
          onClick={() => onNodeClick && onNodeClick('idle')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-gray ${getStageClass('idle')} transition-all duration-200 cursor-pointer text-center relative shadow-sm`}
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>01. Patient Symptoms & Medical Report</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">PDF report, scan, voice transcript, or raw text intake</div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 my-0.5 animate-bounce" />

        {/* Node 2: Ingestion & Extraction Agent */}
        <div 
          onClick={() => onNodeClick && onNodeClick('ingestion')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-teal ${getStageClass('ingestion')} transition-all duration-200 cursor-pointer text-center relative shadow-sm`}
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>02. Ingestion & Extraction Agent</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Agentic OCR, structures data into FHIR clinical fields</div>
        </div>

        <ArrowDown className="w-4 h-4 text-teal-500/60 my-0.5" />

        {/* Row 3: Analysis Agent + Urgent Case Bypass */}
        <div className="w-full max-w-2xl flex items-center justify-center gap-4 relative">
          {/* Analysis Agent */}
          <div 
            onClick={() => onNodeClick && onNodeClick('analysis')}
            className={`flex-1 p-3.5 rounded-xl border node-coral ${getStageClass('analysis')} transition-all duration-200 cursor-pointer text-center relative shadow-sm`}
          >
            <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>03. Clinical Risk Analysis Agent</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Computes 0-100 risk score & evaluates vitals</div>
          </div>

          {/* Urgent Bypass Direct Alert (Red Box) */}
          <div 
            onClick={() => onNodeClick && onNodeClick('urgent_bypass')}
            className={`w-52 p-3.5 rounded-xl border node-red ${urgentBypassTriggered ? 'node-red-active' : 'opacity-60'} transition-all duration-200 cursor-pointer text-center relative shadow-sm`}
          >
            <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>Urgent Case Bypass</span>
            </div>
            <div className="text-[11px] text-red-300 mt-0.5">Direct Alert to Doctor Workstation</div>
            {urgentBypassTriggered && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse shadow">
                TRIGGERED!
              </span>
            )}
          </div>
        </div>

        {/* Connector arrow down */}
        <div className="w-full max-w-2xl flex justify-between px-16 relative my-0.5">
          <ArrowDown className="w-4 h-4 text-teal-500/60 mx-auto" />
          {urgentBypassTriggered && (
            <div className="absolute right-10 top-0 text-xs text-red-400 font-mono italic animate-pulse flex items-center gap-1">
              <span>Fast-track direct alert!</span>
            </div>
          )}
        </div>

        {/* Node 4: Draft Agent */}
        <div 
          onClick={() => onNodeClick && onNodeClick('drafting')}
          className={`w-full max-w-md p-3.5 rounded-xl border node-pink ${getStageClass('drafting')} transition-all duration-200 cursor-pointer text-center relative shadow-sm`}
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-sm">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>04. Clinical SOAP Note & Draft Agent</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Synthesizes SOAP narrative, ICD-10 & treatment plan</div>
        </div>

        <ArrowDown className="w-4 h-4 text-teal-500/60 my-0.5" />

        {/* Node 5: Doctor Review Dashboard (Centerpiece Amber Checkpoint) */}
        <div 
          onClick={() => onNodeClick && onNodeClick('doctor_review')}
          className={`w-full max-w-lg p-4 rounded-2xl border-2 node-amber ${getStageClass('doctor_review')} transition-all duration-200 cursor-pointer text-center relative shadow-md transform`}
        >
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40 inline-block mb-1">
            HUMAN APPROVAL GATE
          </span>
          <div className="flex items-center justify-center gap-2 text-amber-200 font-extrabold text-base">
            <Stethoscope className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>05. Doctor Review Dashboard</span>
          </div>
          <div className="text-xs text-amber-300/80 font-medium mt-1">
            Approve, edit prescriptions, or request AI re-draft (`REVISION #2`)
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-amber-500/60 my-0.5" />

        {/* Post-Approval 3 Parallel Actions */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          {/* Action 1 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-200 cursor-pointer text-center shadow-sm`}
          >
            <div className="flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Notify Patient (SMS)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Send preview ticket</div>
          </div>

          {/* Action 2 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-200 cursor-pointer text-center shadow-sm`}
          >
            <div className="flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
              <Database className="w-4 h-4 text-teal-400" />
              <span>Update EHR Record</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Commit signed summary</div>
          </div>

          {/* Action 3 */}
          <div 
            onClick={() => onNodeClick && onNodeClick('approved')}
            className={`p-3 rounded-xl border node-green ${getStageClass('approved')} transition-all duration-200 cursor-pointer text-center shadow-sm`}
          >
            <div className="flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Schedule Follow-Up</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Book clinic slot</div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 my-0.5" />

        {/* Node 7: Audit & Compliance Log */}
        <div 
          onClick={() => onNodeClick && onNodeClick('approved')}
          className={`w-full max-w-md p-3 rounded-xl border node-gray ${getStageClass('approved')} transition-all duration-200 cursor-pointer text-center shadow-sm`}
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>06. Immutable Audit & Compliance Log</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Records every AI execution & doctor sign-off with JSON download</div>
        </div>

      </div>
    </div>
  );
};
