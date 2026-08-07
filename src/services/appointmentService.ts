import type { PatientScenario, DoctorDecision, PostActionLog } from '../types/clinical';

/**
 * Service for scheduling follow-up clinic appointments post-approval.
 */
export function scheduleFollowUp(patient: PatientScenario, decision: DoctorDecision): PostActionLog {
  const followUpDays = decision.approvedFollowUpDays || patient.draft.recommendedFollowUpDays;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + followUpDays);
  const formattedDate = targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return {
    id: `apt-tx-${Date.now()}`,
    actionType: 'schedule_followup',
    status: decision.status === 'rejected' ? 'failed' : 'completed',
    details: `Follow-up appointment booked for ${formattedDate} (${followUpDays} days out).`,
    timestamp: new Date().toISOString(),
    payload: {
      patientId: patient.patientId,
      patientName: patient.patientName,
      scheduledDate: formattedDate,
      department: patient.analysis.urgency === 'critical' ? 'Cardiology Follow-Up Clinic' : patient.analysis.urgency === 'moderate' ? 'Pulmonology Outpatient Clinic' : 'General Adult Medicine'
    }
  };
}
