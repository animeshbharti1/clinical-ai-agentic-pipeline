import React, { useState } from 'react';
import type { PatientScenario, DoctorDecision, PipelineStage } from '../types/clinical';
import { 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Edit3, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Send, 
  Calendar,
  Lock,
  RotateCcw,
  ShieldAlert,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoctorDashboardProps {
  patient: PatientScenario;
  currentStage: PipelineStage;
  onApprove: (decision: DoctorDecision) => void;
  onReject: (notes: string) => void;
  onReDraft: (feedback: string) => void;
  onReset?: () => void;
  onViewAudit?: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patient,
  currentStage,
  onApprove,
  onReject,
  onReDraft,
  onReset,
  onViewAudit
}) => {
  const [editableSummary, setEditableSummary] = useState(patient.draft.clinicalSummary);
  const [treatmentOrders, setTreatmentOrders] = useState<string[]>(patient.draft.proposedTreatmentPlan);
  const [newOrderText, setNewOrderText] = useState('');
  const [followUpDays, setFollowUpDays] = useState(patient.draft.recommendedFollowUpDays);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [doctorSignature, setDoctorSignature] = useState('Dr. Sarah Jenkins, MD (Attending Physician)');
  const [isEditing, setIsEditing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const isRejected = currentStage === 'rejected' || rejectionReason !== null;

  const handleToggleOrder = (index: number) => {
    const updated = [...treatmentOrders];
    updated.splice(index, 1);
    setTreatmentOrders(updated);
  };

  const handleAddOrder = () => {
    if (newOrderText.trim()) {
      setTreatmentOrders([...treatmentOrders, newOrderText.trim()]);
      setNewOrderText('');
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback safe
    }
  };

  const handleApproveSubmit = () => {
    triggerConfetti();
    setRejectionReason(null);
    onApprove({
      status: 'approved',
      doctorName: doctorSignature,
      doctorNotes: doctorNotes || (isRejected ? 'Override approved after doctor manual edit.' : 'Approved with clinical oversight.'),
      approvedSummary: editableSummary,
      approvedTreatmentPlan: treatmentOrders,
      approvedFollowUpDays: followUpDays,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleRejectClick = () => {
    const reason = doctorNotes.trim() || 'Draft rejected by attending physician due to clinical discrepancy.';
    setRejectionReason(reason);
    onReject(reason);
  };

  return (
    <div className={`glass-panel p-6 border-2 ${isRejected ? 'border-red-500/80 shadow-red-950/50' : 'border-amber-500/60 shadow-amber-950/40'} shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300`}>
      {/* Background Amber/Red Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${isRejected ? 'bg-red-500/10' : 'bg-amber-500/10'} rounded-full blur-3xl pointer-events-none`} />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/30 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${isRejected ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-amber-500/20 text-amber-400 border-amber-500/50'} border shadow-inner`}>
            <Stethoscope className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-extrabold text-amber-200 tracking-tight">Doctor Review Dashboard</h3>
              <span className={`px-2.5 py-0.5 rounded-full ${isRejected ? 'bg-red-950 text-red-300 border-red-500 font-bold' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'} border text-[11px] font-mono uppercase`}>
                {isRejected ? 'DRAFT REJECTED - DOCTOR EDIT MODE' : 'HUMAN APPROVAL GATE'}
              </span>
            </div>
            <p className="text-xs text-amber-300/80">
              The single gate all AI clinical outputs must pass through. Doctors retain 100% control to edit prescriptions & override.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-mono">
            Patient: <strong className="text-white">{patient.patientName}</strong> ({patient.patientId})
          </span>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isEditing ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Done Editing' : 'Edit AI Summary'}
          </button>
        </div>
      </div>

      {/* Prominent Rejection Banner if Rejected */}
      {isRejected && (
        <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 text-red-100 shadow-xl space-y-3 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 rounded-lg text-white font-bold flex-shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>DRAFT REJECTED BY PHYSICIAN</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-800 font-mono">EDIT PRESCRIPTION ENABLED</span>
              </h4>
              <p className="text-xs text-red-200">
                <strong>Rejection Rationale:</strong> "{rejectionReason || doctorNotes || 'Draft rejected due to clinical discrepancy.'}"
              </p>
              <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-0.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Doctor Option: You can modify the summary and treatment orders below, then click "Approve Edited Prescription".</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-red-800/80">
            <div className="flex items-center gap-2">
              {onViewAudit && (
                <button 
                  onClick={onViewAudit}
                  className="px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white font-semibold text-xs border border-red-500 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> View Audit Entry
                </button>
              )}
              <button 
                onClick={() => {
                  setRejectionReason(null);
                  onReDraft(doctorNotes || 'Re-evaluating draft after physician rejection.');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-pink-400" /> Request AI Re-Draft
              </button>
              {onReset && (
                <button 
                  onClick={onReset}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Reset
                </button>
              )}
            </div>

            {/* Direct Approve Override Button when Rejected */}
            <button
              onClick={handleApproveSubmit}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs border border-emerald-400 shadow-lg flex items-center gap-1.5 transition transform hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Approve Edited Prescription & Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Critical Alert Ribbon if Urgent Bypass */}
      {patient.analysis.urgentBypassTriggered && !isRejected && (
        <div className="p-3 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>
              <strong>URGENT BYPASS NOTICE:</strong> This case was flagged as CRITICAL by the Analysis Agent. Urgent alert was delivered directly to your workstation before completion of full draft.
            </span>
          </div>
          <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded">
            HIGH PRIORITY
          </span>
        </div>
      )}

      {/* Main Split Grid - Fully Interactive for Doctor Edits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: AI Pipeline Data Snapshot (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Patient Vitals & Extracted Overview */}
          <div className="glass-card p-4 border-slate-700 space-y-3">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Ingestion Agent Output
            </span>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p><strong>Chief Complaint:</strong> {patient.extracted.chiefComplaint}</p>
              <p><strong>Duration:</strong> {patient.extracted.onsetAndDuration}</p>
              <p><strong>Meds:</strong> {patient.extracted.currentMedications.join(', ')}</p>
              <p><strong>Allergies:</strong> <span className="text-amber-400 font-semibold">{patient.extracted.allergies.join(', ')}</span></p>
            </div>
          </div>

          {/* Analysis & Risk Flags Overview */}
          <div className="glass-card p-4 border-slate-700 space-y-3">
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Analysis Agent Flags
            </span>
            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-bold ${patient.analysis.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {patient.analysis.riskScore}/100 ({patient.analysis.urgency.toUpperCase()})
                </span>
              </div>
              <div className="space-y-1">
                {patient.analysis.abnormalities.map((a, i) => (
                  <div key={i} className="p-1.5 rounded bg-slate-900/90 text-[11px] text-orange-200 border border-orange-500/20">
                    ⚠️ {a.parameter}: <strong className="text-white">{a.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="glass-card p-4 border-amber-500/30 bg-amber-950/20 space-y-2">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Attending Physician Signature
            </label>
            <input 
              type="text"
              value={doctorSignature}
              onChange={(e) => setDoctorSignature(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

        </div>

        {/* Right Column: Interactive Clinical Note & Prescription Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Editable Clinical Summary */}
          <div className="glass-card p-4 border-amber-500/40 space-y-2 bg-amber-950/10">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Physician Clinical Note & Summary (Editable)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Doctor Editing Unlocked
              </span>
            </div>

            <textarea 
              value={editableSummary}
              onChange={(e) => setEditableSummary(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs leading-relaxed focus:ring-2 focus:ring-amber-500 outline-none resize-none font-sans"
              placeholder="Edit physician clinical summary..."
            />
          </div>

          {/* Treatment Orders & Prescription Checklist (Doctor Editable) */}
          <div className="glass-card p-4 border-amber-500/40 space-y-3 bg-amber-950/10">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-amber-400" />
                Doctor Authorized Treatment Plan & Prescriptions ({treatmentOrders.length})
              </span>
              <span className="text-[11px] text-teal-300 font-mono">Add / Remove Orders Below</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {treatmentOrders.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-xs italic bg-slate-900/60 rounded-lg">
                  No prescription orders active. Add custom physician orders below.
                </div>
              ) : (
                treatmentOrders.map((ord, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-100 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{ord}</span>
                    </div>
                    <button 
                      onClick={() => handleToggleOrder(idx)}
                      className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1 rounded bg-slate-800 border border-red-500/30 font-semibold transition"
                      title="Remove Order"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Custom Prescription Order */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <input 
                type="text"
                value={newOrderText}
                onChange={(e) => setNewOrderText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOrder()}
                placeholder="Type custom prescription / physician order (e.g. Prednisone 40mg PO x 5d)..."
                className="flex-1 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
              <button 
                onClick={handleAddOrder}
                className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1"
              >
                + Add Order
              </button>
            </div>
          </div>

          {/* Follow-Up Scheduling & Doctor Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-3.5 border-slate-700 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Schedule Follow-up Interval
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min={1}
                  max={30}
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="px-3 py-1 bg-amber-950 text-amber-300 rounded font-mono font-bold text-xs border border-amber-600/50">
                  {followUpDays} Day{followUpDays > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="glass-card p-3.5 border-slate-700 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Physician Internal Rationale / Notes
              </label>
              <input 
                type="text"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Physician notes for care team or audit log..."
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Checkpoint Action Buttons (Approve, Re-draft, Reject) */}
      <div className="pt-4 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Approval unlocks downstream EHR, Patient SMS & Scheduling actions.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Re-Draft Button */}
          <button
            onClick={() => onReDraft(doctorNotes || 'Please refine treatment rationale.')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Request AI Re-Draft
          </button>

          {/* Reject Button */}
          {!isRejected && (
            <button
              onClick={handleRejectClick}
              className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 font-extrabold text-xs border border-red-500 shadow-lg shadow-red-950/60 transition flex items-center gap-1.5 transform hover:scale-105"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              Reject Draft
            </button>
          )}

          {/* Primary APPROVE Button */}
          <button
            onClick={handleApproveSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/60 transition flex items-center gap-2 transform hover:scale-105"
          >
            <Send className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span>{isRejected ? 'APPROVE EDITED PRESCRIPTION' : 'APPROVE & DISPATCH POST-ACTIONS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
