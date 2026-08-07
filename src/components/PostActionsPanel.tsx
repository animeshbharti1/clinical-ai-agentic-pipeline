import React from 'react';
import type { PatientScenario, DoctorDecision } from '../types/clinical';
import { 
  CheckCircle2, 
  MessageSquare, 
  Database, 
  Calendar, 
  Smartphone, 
  Check
} from 'lucide-react';

interface PostActionsPanelProps {
  patient: PatientScenario;
  decision: DoctorDecision;
}

export const PostActionsPanel: React.FC<PostActionsPanelProps> = ({ patient, decision }) => {
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + decision.approvedFollowUpDays);
  const formattedFollowUp = followUpDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-panel p-6 border-emerald-500/40 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-200">Post-Approval Action Execution</h3>
            <p className="text-xs text-emerald-300/70">
              Downstream system actions triggered ONLY after human doctor approval gate.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold flex items-center gap-1.5 shadow">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          3/3 ACTIONS EXECUTED
        </span>
      </div>

      {/* Grid of 3 Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Action 1: Notify Patient (SMS Simulation) */}
        <div className="glass-card p-4 border-emerald-500/30 space-y-3 bg-emerald-950/10 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                1. Notify Patient
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-mono border border-emerald-600/40">
                SMS DELIVERED
              </span>
            </div>

            {/* Simulated Phone Mockup */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-slate-400" />
                  To: {patient.patientName} (+1 555-0192)
                </span>
                <span>Just Now</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                "Hello {patient.patientName.split(' ')[0]}, your clinical summary and care plan have been approved by {decision.doctorName}. Next follow-up booked for {formattedFollowUp}."
              </p>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> Carrier ACK: 200 OK (Twilio Gateway)
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            * Hackathon Simulation: Notification logged to gateway panel.
          </div>
        </div>

        {/* Action 2: Update EHR Record (Local DB Write) */}
        <div className="glass-card p-4 border-emerald-500/30 space-y-3 bg-emerald-950/10 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                2. Update EHR Record
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-mono border border-emerald-600/40">
                DB COMMIT OK
              </span>
            </div>

            {/* Local DB Row View */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1">
                <span>TABLE: patient_encounters</span>
                <span className="text-emerald-400">ID: {patient.patientId}</span>
              </div>
              <div className="text-slate-300 text-[11px] space-y-1 pt-1">
                <div><span className="text-slate-500">signed_by:</span> {decision.doctorName}</div>
                <div><span className="text-slate-500">status:</span> <strong className="text-emerald-300">COMPLETED_VERIFIED</strong></div>
                <div><span className="text-slate-500">orders_count:</span> {decision.approvedTreatmentPlan.length} Active</div>
                <div><span className="text-slate-500">updated_at:</span> {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            * Hackathon Simulation: Written to SQLite local DB table.
          </div>
        </div>

        {/* Action 3: Schedule Follow-Up (Book Appointment) */}
        <div className="glass-card p-4 border-emerald-500/30 space-y-3 bg-emerald-950/10 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                3. Schedule Follow-Up
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-mono border border-emerald-600/40">
                BOOKED
              </span>
            </div>

            {/* Appointment Ticket */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-semibold text-emerald-300">{formattedFollowUp}</span>
                <span className="text-slate-400 font-mono text-[10px]">09:30 AM</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Clinic Suite 4B • Post-care evaluation with {decision.doctorName}
              </p>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                <span>SLOT_CONFIRMED</span>
                <span>Interval: +{decision.approvedFollowUpDays}d</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            * Hackathon Simulation: Appointment row created in schedule table.
          </div>
        </div>

      </div>
    </div>
  );
};
