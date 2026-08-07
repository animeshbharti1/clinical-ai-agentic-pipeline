import { useState, useEffect } from 'react';
import { MOCK_PATIENTS } from './data/mockPatients';
import type { 
  PatientScenario, 
  PipelineStage, 
  DoctorDecision, 
  AuditEntry 
} from './types/clinical';
import { Header } from './components/Header';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { IngestionPanel } from './components/IngestionPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { UrgentBypassBanner } from './components/UrgentBypassBanner';
import { DraftPanel } from './components/DraftPanel';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PostActionsPanel } from './components/PostActionsPanel';
import { AuditLogPanel } from './components/AuditLogPanel';
import { 
  Layers, 
  Cpu, 
  Activity, 
  FileCheck, 
  Stethoscope, 
  CheckCircle2, 
  ShieldCheck,
  Info
} from 'lucide-react';

export function App() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('case-001');
  const [patient, setPatient] = useState<PatientScenario>(MOCK_PATIENTS[0]);
  const [currentStage, setCurrentStage] = useState<PipelineStage>('idle');
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<'step' | 'fast'>('step');
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [doctorDecision, setDoctorDecision] = useState<DoctorDecision | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'ingestion' | 'analysis' | 'draft' | 'doctor' | 'actions' | 'audit'>('workflow');
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  
  // Re-draft tracking states
  const [isRedrafting, setIsRedrafting] = useState<boolean>(false);
  const [reDraftFeedback, setReDraftFeedback] = useState<string | null>(null);
  const [revisionCount, setRevisionCount] = useState<number>(1);

  // Update selected patient on dropdown change
  useEffect(() => {
    const found = MOCK_PATIENTS.find((p) => p.id === selectedPatientId) || MOCK_PATIENTS[0];
    setPatient(JSON.parse(JSON.stringify(found)));
    setCurrentStage('idle');
    setDoctorDecision(null);
    setReDraftFeedback(null);
    setRevisionCount(1);
    setIsRedrafting(false);
  }, [selectedPatientId]);

  const addAuditLog = (
    stage: string, 
    actor: AuditEntry['actor'], 
    action: string, 
    details: string, 
    colorCategory: AuditEntry['colorCategory']
  ) => {
    const newEntry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      stage,
      actor,
      action,
      details,
      colorCategory
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Automated Pipeline runner simulation
  const runAutoPipeline = (targetPatient: PatientScenario = patient) => {
    setIsPipelineRunning(true);
    setCurrentStage('ingestion');
    setDoctorDecision(null);
    setReDraftFeedback(null);
    setRevisionCount(1);
    setActiveTab('workflow');

    const delay = autoPlaySpeed === 'step' ? 1400 : 400;

    // Log Start
    addAuditLog(
      'Ingestion & Extraction', 
      'Ingestion Agent', 
      'INSPECT_PAYLOAD', 
      `Received unstructured input payload for ${targetPatient.patientName} (${targetPatient.sourceType.toUpperCase()})`, 
      'teal'
    );

    setTimeout(() => {
      // Move to Analysis
      setCurrentStage('analysis');
      addAuditLog(
        'Analysis & Risk', 
        'Analysis Agent', 
        'COMPUTE_RISK_SCORE', 
        `Risk score computed: ${targetPatient.analysis.riskScore}/100 (${targetPatient.analysis.urgency.toUpperCase()}). Abnormalities flagged: ${targetPatient.analysis.abnormalities.length}`, 
        'coral'
      );

      // Check Urgent Bypass condition
      if (targetPatient.analysis.urgentBypassTriggered) {
        addAuditLog(
          'Urgent Bypass', 
          'Urgent Alert System', 
          'DIRECT_PHYSICIAN_ALERT', 
          `🚨 RED ALERT: ${targetPatient.analysis.urgentAlertMessage || 'Critical patient flags detected!'}`, 
          'red'
        );
      }

      setTimeout(() => {
        // Move to Drafting
        setCurrentStage('drafting');
        addAuditLog(
          'Draft Generation', 
          'Draft Agent', 
          'SYNTHESIZE_CLINICAL_NOTE', 
          `Generated clinical summary, ${targetPatient.draft.suggestedDiagnoses.length} ICD-10 suggestions & proposed treatment orders`, 
          'pink'
        );

        setTimeout(() => {
          // Arrive at Doctor Review Dashboard
          setCurrentStage('doctor_review');
          setIsPipelineRunning(false);
          setActiveTab('doctor');
          addAuditLog(
            'Doctor Review Gate', 
            'Doctor (Human)', 
            'WAITING_HUMAN_APPROVAL', 
            `Draft delivered to human approval checkpoint for ${targetPatient.patientName}. Doctor review required.`, 
            'amber'
          );
        }, delay);
      }, delay);
    }, delay);
  };

  const handleResetPipeline = () => {
    setCurrentStage('idle');
    setDoctorDecision(null);
    setIsPipelineRunning(false);
    setReDraftFeedback(null);
    setRevisionCount(1);
    setIsRedrafting(false);
    setActiveTab('workflow');
  };

  // Handler when user uploads a custom file / PDF report
  const handlePatientScenarioCreated = (newScenario: PatientScenario) => {
    setPatient(newScenario);
    setDoctorDecision(null);
    setReDraftFeedback(null);
    setRevisionCount(1);
    addAuditLog(
      'Ingestion Agent', 
      'Ingestion Agent', 
      'FILE_REPORT_UPLOADED', 
      `Uploaded patient document ingested: "${newScenario.patientName}". Parsing text and extracting FHIR fields.`, 
      'teal'
    );
    // Run 3-Agent pipeline automatically for newly uploaded patient file!
    runAutoPipeline(newScenario);
  };

  const handleDoctorApprove = (decision: DoctorDecision) => {
    setDoctorDecision(decision);
    setCurrentStage('approved');
    setActiveTab('actions');

    // Audit logs for human approval and post actions
    addAuditLog(
      'Doctor Approval', 
      'Doctor (Human)', 
      'APPROVE_CLINICAL_DRAFT', 
      `Approved by ${decision.doctorName} with ${decision.approvedTreatmentPlan.length} orders & ${decision.approvedFollowUpDays}d follow-up interval.`, 
      'amber'
    );

    addAuditLog(
      'Post-Action 1', 
      'SMS Gateway', 
      'DISPATCH_PATIENT_SMS', 
      `Patient confirmation SMS dispatched to ${patient.patientName} (+1 555-0192). Status: DELIVERED 200 OK`, 
      'green'
    );

    addAuditLog(
      'Post-Action 2', 
      'EHR Connector', 
      'COMMIT_EHR_RECORD', 
      `Approved summary & orders written to local EHR database table patient_encounters for ID ${patient.patientId}`, 
      'green'
    );

    addAuditLog(
      'Post-Action 3', 
      'Scheduler', 
      'BOOK_APPOINTMENT_SLOT', 
      `Appointment row inserted into clinic schedule for +${decision.approvedFollowUpDays} days`, 
      'green'
    );
  };

  const handleDoctorReject = (notes: string) => {
    setCurrentStage('rejected');
    setActiveTab('doctor');
    addAuditLog(
      'Doctor Review Gate', 
      'Doctor (Human)', 
      'REJECT_DRAFT', 
      `❌ Draft REJECTED by physician. Downstream actions blocked. Reason: "${notes}"`, 
      'red'
    );
  };

  // Interactive AI Re-Drafting Flow
  const handleDoctorReDraft = (feedback: string) => {
    setCurrentStage('drafting');
    setActiveTab('draft');
    setIsRedrafting(true);
    setReDraftFeedback(feedback);

    addAuditLog(
      'Doctor Review Gate', 
      'Doctor (Human)', 
      'REQUEST_RE_DRAFT', 
      `Requested AI re-drafting. Physician feedback: "${feedback}"`, 
      'pink'
    );

    // Simulate Agentic LLM Re-synthesis
    setTimeout(() => {
      const nextRev = revisionCount + 1;
      setRevisionCount(nextRev);

      const updatedDraft = {
        ...patient.draft,
        clinicalSummary: `[REVISION #${nextRev} - INCORPORATING PHYSICIAN FEEDBACK]: ${patient.draft.clinicalSummary}\n\n• Agent Update Rationale: Refined per attending physician feedback: "${feedback}". Diagnostic confidence calibrated.`,
        proposedTreatmentPlan: [
          ...patient.draft.proposedTreatmentPlan,
          `Revised Order (Physician Directive): ${feedback}`
        ]
      };

      setPatient({
        ...patient,
        draft: updatedDraft
      });

      setIsRedrafting(false);

      addAuditLog(
        'Draft Agent', 
        'Draft Agent', 
        'RE_SYNTHESIZE_NOTE', 
        `Completed Revision #${nextRev} incorporating physician directive: "${feedback}"`, 
        'pink'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950 pb-16">
      {/* Top Bar Header */}
      <Header 
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
        onRunAutoPipeline={() => runAutoPipeline(patient)}
        onResetPipeline={handleResetPipeline}
        autoPlaySpeed={autoPlaySpeed}
        onToggleSpeed={setAutoPlaySpeed}
        isPipelineRunning={isPipelineRunning}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Urgent Bypass Alert Header Banner (If Urgent Case) */}
        {patient.analysis.urgentBypassTriggered && (currentStage === 'analysis' || currentStage === 'urgent_bypass' || currentStage === 'drafting' || currentStage === 'doctor_review') && (
          <UrgentBypassBanner 
            patientName={patient.patientName}
            patientId={patient.patientId}
            alertMessage={patient.analysis.urgentAlertMessage || 'Critical emergency flags detected in patient report!'}
            onJumpToDashboard={() => setActiveTab('doctor')}
          />
        )}

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800">
          
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'workflow' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Workflow Map
          </button>

          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ingestion' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            2. Ingestion Agent
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'analysis' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-orange-400" />
            3. Analysis Agent
            {patient.analysis.urgentBypassTriggered && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'draft' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-4 h-4 text-pink-400" />
            4. Draft Agent {revisionCount > 1 && `(Rev #${revisionCount})`}
          </button>

          {/* Doctor Approval Gate Tab */}
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'doctor' 
                ? currentStage === 'rejected' ? 'bg-red-600 text-white shadow-lg' : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : currentStage === 'rejected' ? 'text-red-400 border border-red-500/40 bg-red-950/30' : 'text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-amber-400" />
            5. Doctor Approval (Gate)
            {currentStage === 'doctor_review' && (
              <span className="px-2 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] animate-bounce font-bold">
                READY
              </span>
            )}
            {currentStage === 'rejected' && (
              <span className="px-2 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                REJECTED
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            disabled={!doctorDecision || currentStage === 'rejected'}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'actions' ? 'bg-emerald-600 text-white shadow-lg' : (doctorDecision && currentStage !== 'rejected') ? 'text-emerald-300 hover:bg-emerald-950/40' : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            6. Post-Approval Actions
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'audit' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            7. Audit Log ({auditLogs.length})
          </button>
        </div>

        {/* Pitch Banner / Key Concept Bar */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Continuous Autonomous Workflow:</strong> Patient data enters → 3 AI Agents process in sequence → Doctor approves at single gate → 3 Post-Approval Actions fire automatically.
            </span>
          </div>
          <span className="font-mono text-slate-400 text-[11px] hidden md:inline">
            Active Patient: <strong className="text-teal-300">{patient.patientName}</strong>
          </span>
        </div>

        {/* Tab 1: Workflow Diagram View */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <WorkflowDiagram 
              currentStage={currentStage}
              urgency={patient.analysis.urgency}
              urgentBypassTriggered={patient.analysis.urgentBypassTriggered}
              onNodeClick={(stage) => {
                if (stage === 'ingestion') setActiveTab('ingestion');
                else if (stage === 'analysis') setActiveTab('analysis');
                else if (stage === 'urgent_bypass') setActiveTab('doctor');
                else if (stage === 'drafting') setActiveTab('draft');
                else if (stage === 'doctor_review') setActiveTab('doctor');
                else if (stage === 'approved') setActiveTab('actions');
              }}
            />
          </div>
        )}

        {/* Tab 2: Ingestion Panel */}
        {activeTab === 'ingestion' && (
          <IngestionPanel 
            patient={patient}
            onRawInputChange={(newRaw) => setPatient({ ...patient, rawInput: newRaw })}
            onPatientScenarioCreated={handlePatientScenarioCreated}
          />
        )}

        {/* Tab 3: Analysis Panel */}
        {activeTab === 'analysis' && (
          <AnalysisPanel analysis={patient.analysis} />
        )}

        {/* Tab 4: Draft Panel */}
        {activeTab === 'draft' && (
          <DraftPanel 
            draft={patient.draft}
            isRedrafting={isRedrafting}
            reDraftFeedback={reDraftFeedback}
            revisionCount={revisionCount}
            onSendToDoctor={() => {
              setCurrentStage('doctor_review');
              setActiveTab('doctor');
            }}
            onTriggerReDraft={() => handleDoctorReDraft(reDraftFeedback || 'Refining clinical narrative.')}
          />
        )}

        {/* Tab 5: Doctor Review Dashboard (Centerpiece) */}
        {activeTab === 'doctor' && (
          <DoctorDashboard 
            patient={patient}
            currentStage={currentStage}
            onApprove={handleDoctorApprove}
            onReject={handleDoctorReject}
            onReDraft={handleDoctorReDraft}
            onReset={handleResetPipeline}
            onViewAudit={() => setActiveTab('audit')}
          />
        )}

        {/* Tab 6: Post-Approval Actions Panel */}
        {activeTab === 'actions' && doctorDecision && currentStage !== 'rejected' && (
          <PostActionsPanel patient={patient} decision={doctorDecision} />
        )}

        {/* Tab 7: Audit Log Panel */}
        {activeTab === 'audit' && (
          <AuditLogPanel logs={auditLogs} />
        )}

      </main>
    </div>
  );
}
export default App;
