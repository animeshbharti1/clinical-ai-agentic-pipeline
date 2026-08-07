import React from 'react';
import type { ClinicalDraft } from '../types/clinical';
import { 
  FileCheck, 
  Sparkles, 
  Stethoscope, 
  MessageSquare, 
  Tag, 
  ListOrdered, 
  RefreshCw, 
  ArrowRight,
  CheckCircle,
  MessageCircleCode
} from 'lucide-react';

interface DraftPanelProps {
  draft: ClinicalDraft;
  isRedrafting?: boolean;
  reDraftFeedback?: string | null;
  revisionCount?: number;
  onSendToDoctor?: () => void;
  onTriggerReDraft?: () => void;
}

export const DraftPanel: React.FC<DraftPanelProps> = ({ 
  draft,
  isRedrafting = false,
  reDraftFeedback,
  revisionCount = 1,
  onSendToDoctor,
  onTriggerReDraft
}) => {
  return (
    <div className="glass-panel p-6 border-pink-500/40 space-y-6 relative overflow-hidden">
      {/* Background Pink Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-pink-500/20 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <FileCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-pink-200">Draft Agent</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-600/50 text-[11px] font-mono font-bold">
                REVISION #{revisionCount}
              </span>
            </div>
            <p className="text-xs text-pink-300/70">Clinical Note Generation, ICD-10 Coding & Action Synthesis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onTriggerReDraft && (
            <button 
              onClick={onTriggerReDraft}
              disabled={isRedrafting}
              className="px-3 py-1.5 rounded-lg bg-pink-950 hover:bg-pink-900 text-pink-200 text-xs font-semibold border border-pink-600/50 flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRedrafting ? 'animate-spin' : ''}`} />
              Re-Synthesize LLM Note
            </button>
          )}

          <span className="px-3 py-1 rounded-full bg-pink-950/60 text-pink-300 border border-pink-700/50 text-xs font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            {isRedrafting ? 'LLM RE-DRAFTING IN PROGRESS...' : 'LLM GENERATION COMPLETE'}
          </span>
        </div>
      </div>

      {/* Re-Draft Feedback Banner if Physician Feedback Exists */}
      {reDraftFeedback && (
        <div className="p-3.5 rounded-xl bg-pink-950/80 border-2 border-pink-500 text-pink-100 space-y-1 relative z-10 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <MessageCircleCode className="w-4 h-4 text-pink-400" />
              PHYSICIAN RE-DRAFT FEEDBACK INCORPORATED (REVISION #{revisionCount})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-800 text-white font-bold">
              AGENT UPDATED
            </span>
          </div>
          <p className="text-xs text-pink-200 italic">
            "{reDraftFeedback}"
          </p>
        </div>
      )}

      {/* Loading Overlay Spinner if Currently Re-Drafting */}
      {isRedrafting ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 glass-card border-pink-500/40">
          <div className="p-4 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 animate-pulse">
            <RefreshCw className="w-10 h-10 animate-spin text-pink-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-pink-200">Re-Synthesizing Clinical Draft...</h4>
            <p className="text-xs text-slate-300">
              Draft Agent is processing physician feedback and refining diagnostic coding & treatment orders.
            </p>
          </div>
        </div>
      ) : (
        /* Main Grid of Generated Content */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Left Column: Generated Clinical Summary & Diagnoses */}
          <div className="space-y-4">
            <div className="glass-card p-4 border-pink-500/40 bg-pink-950/10 space-y-2">
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-2">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-pink-400" />
                  Drafted Clinical Narrative (SOAP Note)
                </span>
                <span className="text-[10px] text-pink-400 font-mono">Ver: #{revisionCount}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 text-xs leading-relaxed font-sans">
                {draft.clinicalSummary}
              </div>
            </div>

            <div className="glass-card p-4 border-slate-700 space-y-2">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-pink-400" />
                Suggested Diagnoses & Billing Codes (ICD-10)
              </span>
              <div className="space-y-2">
                {draft.suggestedDiagnoses.map((diag, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-pink-300 mr-2">{diag.code}</span>
                      <span className="text-slate-200">{diag.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-pink-300 font-mono text-[11px]">
                      {(diag.probability * 100).toFixed(0)}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Proposed Orders & Patient Communication Draft */}
          <div className="space-y-4">
            <div className="glass-card p-4 border-pink-500/40 space-y-2">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-pink-400" />
                Proposed Treatment Plan & Clinical Orders ({draft.proposedTreatmentPlan.length})
              </span>
              <div className="space-y-1.5">
                {draft.proposedTreatmentPlan.map((order, i) => (
                  <div key={i} className="p-2.5 rounded bg-slate-900/80 border border-pink-500/20 text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-900/60 text-pink-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{order}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 border-slate-700 space-y-2">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                Drafted Patient Advisory Message
              </span>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 text-xs italic leading-relaxed">
                "{draft.patientCommunicationDraft}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      {onSendToDoctor && !isRedrafting && (
        <div className="pt-4 border-t border-pink-500/20 flex items-center justify-between relative z-10">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Revised draft ready for physician evaluation.
          </span>
          <button
            onClick={onSendToDoctor}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 transition transform hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Send Revised Draft to Doctor Review Gate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
