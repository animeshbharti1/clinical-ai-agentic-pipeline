import type { PatientScenario, DoctorDecision, PostActionLog } from '../types/clinical';

/**
 * Service for managing EHR local database commits.
 */
export function commitEhrRecord(patient: PatientScenario, decision: DoctorDecision): PostActionLog {
  const isApproved = decision.status === 'approved' || decision.status === 'modified';
  
  return {
    id: `ehr-tx-${Date.now()}`,
    actionType: 'ehr_update',
    status: isApproved ? 'completed' : 'failed',
    details: isApproved 
      ? `Committed clinical summary, vitals, and ${decision.approvedTreatmentPlan.length} orders to local EHR database.` 
      : 'EHR update blocked due to draft rejection.',
    timestamp: new Date().toISOString(),
    payload: {
      patientId: patient.patientId,
      patientName: patient.patientName,
      summary: decision.approvedSummary || patient.draft.clinicalSummary,
      diagnoses: patient.draft.suggestedDiagnoses,
      orders: decision.approvedTreatmentPlan || patient.draft.proposedTreatmentPlan,
      signedBy: decision.doctorName || 'Attending Physician'
    }
  };
}
