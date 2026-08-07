import type { PatientScenario, DoctorDecision, PostActionLog } from '../types/clinical';

/**
 * Service for generating patient SMS preview tickets post-approval.
 */
export function generateSmsNotification(patient: PatientScenario, decision: DoctorDecision): PostActionLog {
  const followUpDays = decision.approvedFollowUpDays || patient.draft.recommendedFollowUpDays;
  const firstName = patient.patientName.split(' ')[0];

  const message = `Hello ${firstName}, your medical evaluation has been reviewed by ${decision.doctorName || 'Dr. Jenkins'}. ` +
    `Treatment Plan: ${(decision.approvedTreatmentPlan || patient.draft.proposedTreatmentPlan).join('; ')}. ` +
    `Please follow up in ${followUpDays} day(s). If symptoms worsen, seek immediate emergency care.`;

  return {
    id: `sms-tx-${Date.now()}`,
    actionType: 'patient_notification',
    status: decision.status === 'rejected' ? 'failed' : 'completed',
    details: `SMS notification ticket generated for ${patient.patientName}.`,
    timestamp: new Date().toISOString(),
    payload: {
      recipientPhone: '+1 (555) 019-2834',
      messageBody: message
    }
  };
}
