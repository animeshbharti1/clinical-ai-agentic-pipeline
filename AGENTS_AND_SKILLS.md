# 🤖 Agents & Skills Specification

This document provides a technical breakdown separating **Autonomous Agents** from **Reusable Clinical Skills**, along with the system file architecture (Frontend, Shared, Prompt Templates).

---

## 🤖 Agents vs. 🛠️ Skills Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CLINICAL AI PIPELINE                             │
├──────────────────────────────────────┬──────────────────────────────────────────┤
│           AUTONOMOUS AGENTS          │             REUSABLE SKILLS              │
├──────────────────────────────────────┼──────────────────────────────────────────┤
│ 1. Ingestion & Extraction Agent      │ • Multimodal Document & PDF Stream OCR   │
│ 2. Clinical Risk Analysis Agent      │ • FHIR Demographic & Vital Extraction    │
│ 3. Urgent Red Bypass Fast-Track      │ • Clinical Risk Classification (0-100)   │
│ 4. SOAP Note & Draft Agent           │ • Abnormality Threshold Evaluation       │
│ 5. Human Physician Approval Gate     │ • SOAP Note Synthesis                    │
│ 6. Post-Approval Execution Runners   │ • ICD-10 Diagnostic Code & Probability   │
│                                      │ • Re-Draft Revision Loop & Feedback      │
│                                      │ • Post-Approval Action Dispatch          │
└──────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 🤖 1. Autonomous AI Agents

Agents are stateful autonomous actors operating within the clinical pipeline. Each agent possesses a specific node role, color indicator, input payload, and output contract.

### 🩵 Agent 1: Ingestion & Extraction Agent (Teal)
* **File Component**: [`src/components/IngestionPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/IngestionPanel.tsx)
* **System Prompt**: [`src/prompts/ingestion.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/ingestion.ts)
* **Role**: Ingests raw unstructured patient files (PDF, scan, voice, text) and structures them into FHIR-compatible fields.
* **Outputs**: Structured patient demographics, vitals, symptoms, current medications, and allergies.

### 🧡 Agent 2: Clinical Risk & Abnormality Analysis Agent (Coral)
* **File Component**: [`src/components/AnalysisPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/AnalysisPanel.tsx)
* **System Prompt**: [`src/prompts/analysis.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/analysis.ts)
* **Role**: Evaluates extracted patient data against clinical reference ranges, computes an objective risk score (0-100), and flags vital abnormalities.
* **Outputs**: Risk score gauge, abnormality table, historical baseline comparison, and urgency rating.

### 🔴 Agent 3: Urgent Red Case Bypass Fast-Track Agent (Red)
* **File Component**: [`src/components/UrgentBypassBanner.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/UrgentBypassBanner.tsx)
* **Role**: High-priority fail-safe mechanism that bypasses standard note drafting to display an immediate pulsing alert banner on the doctor dashboard during acute emergencies (STEMI, stroke, anaphylaxis).
* **Trigger**: `urgency == "critical"` or `riskScore >= 90`.

### 🩷 Agent 4: Clinical SOAP Note & Prescription Draft Agent (Pink)
* **File Component**: [`src/components/DraftPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/DraftPanel.tsx)
* **System Prompt**: [`src/prompts/soap.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/soap.ts)
* **Role**: Synthesizes Subjective, Objective, Assessment, and Plan (SOAP) clinical notes, suggests matching ICD-10 diagnostic codes, and drafts treatment order checklists. Handles the interactive **Re-Draft Revision Loop (`REVISION #2`)** based on doctor feedback.

### 🟡 Agent 5: Human Physician Approval Gatekeeper (Amber)
* **File Component**: [`src/components/DoctorDashboard.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/DoctorDashboard.tsx)
* **Role**: The single mandatory checkpoint through which all AI drafts must pass. Allows doctors to edit summaries, modify treatment checklists, request AI re-drafts, or reject/approve the prescription.

### 🟢 Agent 6: Post-Approval Execution Runners (Green)
* **File Component**: [`src/components/PostActionsPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/PostActionsPanel.tsx)
* **Role**: Automated execution runners that fire only after physician approval, dispatching patient SMS preview tickets, EHR local DB commit records, and follow-up appointment schedules.

---

## 🛠️ 2. Reusable Clinical Skills

Skills are modular, stateless functional capabilities utilized by one or more AI Agents.

* **• Risk Classification Skill**: Computes clinical risk scores (0-100) based on vital severity thresholds (e.g. Systolic BP > 160, HR > 110, SpO2 < 94%, 2.5mm ST-elevation).
* **• Medication & Vitals Extraction Skill**: Parses text streams to extract drug names, dosages, frequencies, and numerical vital sign ranges.
* **• SOAP Generation Skill**: Synthesizes structured clinical narratives following Subjective, Objective, Assessment, and Plan medical standards.
* **• ICD-10 Mapping Skill**: Maps clinical assessment findings to standardized ICD-10 diagnosis codes with probability match confidence scores (e.g., `I21.1 STEMI (94%)`).
* **• Re-Draft Revision Loop Skill**: Processes physician revision feedback, updates revision counters (`REVISION #2`), and re-synthesizes clinical notes.
* **• FHIR Payload Serialization Skill**: Serializes extracted clinical data into FHIR-compatible JSON schemas.

---

## 📁 3. System File Architecture

### 🎨 Frontend UI Components (`src/components/`)
- [`src/components/Header.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/Header.tsx): Scenario selector, speed toggle (`Step 1.5s` vs `Fast 0.4s`), pipeline controls.
- [`src/components/WorkflowDiagram.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/WorkflowDiagram.tsx): Visual pipeline flowchart with active node glow.
- [`src/components/IngestionPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/IngestionPanel.tsx): Ingestion Agent (Teal) & PDF uploader.
- [`src/components/AnalysisPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/AnalysisPanel.tsx): Clinical Risk Analysis Agent (Coral) & Risk Gauge.
- [`src/components/UrgentBypassBanner.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/UrgentBypassBanner.tsx): Red Urgent Bypass fast-track alert.
- [`src/components/DraftPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/DraftPanel.tsx): SOAP Note Agent (Pink) & Re-Draft revision UI.
- [`src/components/DoctorDashboard.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/DoctorDashboard.tsx): Centerpiece Amber Doctor Approval Gate.
- [`src/components/PostActionsPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/PostActionsPanel.tsx): Green post-approval execution panels.
- [`src/components/AuditLogPanel.tsx`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/components/AuditLogPanel.tsx): Immutable compliance log with JSON export.

### 📜 Clinical Prompt Templates (`src/prompts/`)
- [`src/prompts/ingestion.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/ingestion.ts): Prompts for FHIR data extraction & OCR parsing.
- [`src/prompts/analysis.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/analysis.ts): Prompts for risk scoring & abnormality threshold detection.
- [`src/prompts/soap.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/prompts/soap.ts): Prompts for SOAP note synthesis, ICD-10 coding & re-draft revision loops.

### 🔗 Shared Data & Utility Layer (`src/types/`, `src/services/`, `src/utils/`, `src/data/`)
- [`src/services/aiService.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/services/aiService.ts): Live LLM inference service (`generateLiveSoapDraft`) supporting OpenAI, Google Gemini API, and OpenRouter with user hand-entry credentials and zero-latency local fallback.
- [`src/types/clinical.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/types/clinical.ts): TypeScript type interfaces for patient scenarios, FHIR fields, analysis, draft, and audit records.
- [`src/utils/filePatientParser.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/utils/filePatientParser.ts): Multimodal text/PDF stream parser & automated risk classifier.
- [`src/data/mockPatients.ts`](file:///c:/Users/anime/Desktop/Projects/Task%20A%201/src/data/mockPatients.ts): Preset mock patient datasets (Critical STEMI, Moderate Asthma, Routine Checkup).
