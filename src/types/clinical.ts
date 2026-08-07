export type PipelineStage = 
  | 'idle' 
  | 'ingestion' 
  | 'analysis' 
  | 'urgent_bypass' 
  | 'drafting' 
  | 'doctor_review' 
  | 'approved' 
  | 'rejected';

export type UrgencyLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Vitals {
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spo2?: number;
  tempC?: number;
  respiratoryRate?: number;
}

export interface ExtractedFields {
  chiefComplaint: string;
  onsetAndDuration: string;
  symptoms: string[];
  vitals?: Vitals;
  knownConditions: string[];
  currentMedications: string[];
  allergies: string[];
  rawSourceType: 'text' | 'voice' | 'pdf' | 'scan';
}

export interface FlaggedAbnormality {
  id: string;
  parameter: string;
  value: string;
  referenceRange: string;
  severity: 'warning' | 'critical';
  clinicalContext: string;
}

export interface AnalysisResult {
  urgency: UrgencyLevel;
  riskScore: number; // 0 - 100
  abnormalities: FlaggedAbnormality[];
  historicalComparison: string;
  urgentBypassTriggered: boolean;
  urgentAlertMessage?: string;
  timestamp: string;
}

export interface ClinicalDraft {
  clinicalSummary: string;
  suggestedDiagnoses: { code: string; name: string; probability: number }[];
  proposedTreatmentPlan: string[];
  patientCommunicationDraft: string;
  recommendedFollowUpDays: number;
}

export interface DoctorDecision {
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  doctorName: string;
  doctorNotes: string;
  approvedSummary: string;
  approvedTreatmentPlan: string[];
  approvedFollowUpDays: number;
  timestamp?: string;
}

export interface PostActionLog {
  id: string;
  actionType: 'patient_notification' | 'ehr_update' | 'schedule_followup';
  status: 'pending' | 'completed' | 'failed';
  details: string;
  timestamp: string;
  payload: Record<string, any>;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  stage: string;
  actor: 'Ingestion Agent' | 'Analysis Agent' | 'Draft Agent' | 'Urgent Alert System' | 'Doctor (Human)' | 'EHR Connector' | 'SMS Gateway' | 'Scheduler';
  action: string;
  details: string;
  colorCategory: 'gray' | 'teal' | 'coral' | 'red' | 'pink' | 'amber' | 'green';
}

export interface PatientScenario {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  rawInput: string;
  sourceType: 'text' | 'voice' | 'pdf' | 'scan';
  extracted: ExtractedFields;
  analysis: AnalysisResult;
  draft: ClinicalDraft;
}
