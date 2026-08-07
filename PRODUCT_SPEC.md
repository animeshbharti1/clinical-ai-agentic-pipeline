# 📋 Product Specification: Autonomous Clinical AI Pipeline

> **Document Version**: 1.0.0  
> **Status**: Approved & Implemented  
> **Target System**: Autonomous Clinical AI Agentic Pipeline  

---

## 1. 🚨 Problem

Modern emergency rooms and outpatient clinics face three critical operational failures:

1. **High Administrative Burden**:
   - Clinicians spend up to 40% of their working hours manually transcribing unstructured patient reports, calculating risk scores, writing SOAP notes, and entering EHR data.
2. **Dangerous Triage Bottlenecks**:
   - Traditional sequential AI workflows wait for the entire clinical note and treatment plan to be drafted before notifying attending physicians. During acute emergencies (e.g., ST-Elevation Myocardial Infarction [STEMI], Acute Stroke, or Anaphylaxis), this delay can be life-threatening.
3. **AI Autonomy & Safety Risks**:
   - Allowing AI models to directly commit EHR records or dispatch prescriptions without human verification exposes healthcare providers to severe liability and patient safety hazards caused by AI hallucinations.

---

## 2. 👤 Users

| User Persona | Role | Key Needs |
| :--- | :--- | :--- |
| **Attending Physician / ER Doctor** | Primary Gatekeeper | Wants instant emergency alerts, clear clinical summaries, and full control to edit or reject AI-proposed treatment plans. |
| **Triage Nurse / Practitioner** | Front-line Intake Specialist | Needs fast, accurate extraction of vitals and FHIR patient demographics from incoming PDF scans and telemetry reports. |
| **Clinical Compliance Officer** | Regulatory & Audit Supervisor | Requires an immutable, timestamped compliance log tracking every AI extraction, risk score, physician edit, and dispatch event. |

---

## 3. 🎯 Goals

* **⚡ 70%+ Reduction in Documentation Overhead**: Automatically convert raw unstructured patient intake data (PDF, scan, text) into structured FHIR clinical fields and SOAP notes.
* **🚨 Zero Delay on Critical Alerts**: Implement an **Urgent Case Bypass (Red Node)** that alerts the attending physician *immediately* when risk score $\ge 90$ or acute STEMI flags are detected — ensuring AI drafting never delays emergency care.
* **🔒 100% Human-in-the-Loop Authorization**: Enforce a mandatory **Physician Approval Gatekeeper (Amber Node)**. No prescriptions, EHR commits, or patient notifications execute without explicit doctor sign-off.
* **🔄 Interactive Physician Feedback Loop**: Enable doctors to edit clinical text, modify order checklists, or request AI re-drafts (`REVISION #2`) with custom instructions.
* **📜 Immutable Compliance Logging**: Record all actions, timestamps, and physician modifications in an exportable audit log.

---

## 4. 💡 Assumptions

* **Input Data Formats**: Incoming patient intake payloads arrive via PDF files, image scans, voice transcripts, or raw text blocks.
* **Physician Control**: Doctors require an intuitive, single-checkpoint UI (Doctor Review Dashboard) to edit orders, change follow-up days, and sign prescriptions.
* **Simulated Execution Environment**: Post-approval actions (EHR database commit, patient SMS, appointment scheduling) are executed via realistic mock runners suitable for live hackathon demonstration.

---

## 5. 📖 User Stories

### Story 1: Triage Document Ingestion
> **As a** Triage Nurse,  
> **I want** to drop or upload a patient's clinical PDF report into the system,  
> **So that** demographics, vitals, symptoms, medications, and allergies are automatically extracted into structured FHIR fields without manual data entry.

### Story 2: Critical Emergency Fast-Track
> **As an** Emergency Room Physician,  
> **I want** acute critical cases (such as STEMI chest pain or severe hypoxemia) to immediately trigger a pulsing red alert on my dashboard,  
> **So that** I am notified instantly without waiting for the full AI SOAP note to be generated.

### Story 3: Physician Review & Order Customization
> **As an** Attending Physician,  
> **I want** to review the AI-drafted SOAP note, suggested ICD-10 codes, and proposed treatment checklist,  
> **So that** I can edit prescription orders, change follow-up timelines, or request an AI re-draft with custom feedback before approving.

### Story 4: Draft Rejection & Override
> **As a** Physician,  
> **I want** the ability to reject a flawed draft,  
> **So that** downstream automated actions are blocked, a `DRAFT REJECTED BY PHYSICIAN` alert is displayed, and I can manually enter override orders.

### Story 5: Post-Approval Automated Dispatch & Audit
> **As a** Clinical Compliance Officer,  
> **I want** all approved actions (EHR commit, SMS ticket, follow-up schedule) to be logged in a timestamped compliance log,  
> **So that** I can inspect physician sign-offs and download audit records as JSON.

---

## 6. ✅ Acceptance Criteria

### AC-1: Ingestion & Extraction Agent (Teal)
- [x] Given an uploaded PDF, text, or scan report, the system must parse and extract: **Patient Name**, **Age**, **Gender**, **MRN**, **BP**, **Heart Rate**, **SpO2**, **Temp**, **Symptoms**, **Medications**, and **Allergies**.
- [x] Extracted fields must be rendered in structured FHIR-compatible UI cards with a confidence score ($\ge 99\%$).
- [x] Includes a 2-step confirmation workflow (**"Confirm & Ingest Patient PDF"**) to verify document details before processing.

### AC-2: Clinical Risk & Abnormality Analysis Agent (Coral)
- [x] System must compute an objective **Risk Score (0-100)** and assign an urgency classification (`critical`, `high`, `moderate`, `low`).
- [x] Must flag parameter abnormalities against clinical reference baselines (e.g. Systolic BP $> 160\text{ mmHg} \rightarrow$ Hypertensive Crisis; SpO2 $< 94\% \rightarrow$ Hypoxemia; 2.5mm ST-elevation $\rightarrow$ Acute STEMI).

### AC-3: Urgent Red Case Bypass Fast-Track Agent (Red)
- [x] If Risk Score $\ge 90$ or acute emergency flags are detected, the system must immediately trigger a prominent pulsing red alert banner (**"🚨 CRITICAL BYPASS ALERT"**) on the Doctor Review Dashboard.
- [x] Urgent alert must fire before AI drafting finishes, ensuring zero delay in physician notification.

### AC-4: Clinical SOAP Note & Prescription Draft Agent (Pink)
- [x] Must synthesize a full SOAP note (Subjective, Objective, Assessment, Plan).
- [x] Must suggest ICD-10 diagnostic codes with probability match scores (e.g. `I21.1` STEMI, `94%`).
- [x] Clicking **"Request AI Re-Draft"** with physician feedback must update revision tracking (`REVISION #2`), show a loading state, and re-synthesize the note.

### AC-5: Amber Physician Approval Gatekeeper (Amber)
- [x] **No automated action** (EHR update, SMS, scheduling) can execute without explicit doctor sign-off.
- [x] Doctors must be able to edit clinical text summaries, add/remove items from the treatment plan checklist, and adjust follow-up sliders.
- [x] Clicking **"Reject Draft"** must display a prominent `DRAFT REJECTED BY PHYSICIAN` alert and block downstream execution runners.
- [x] Clicking **"Approve & Dispatch"** requires a physician digital signature and triggers post-approval execution.

### AC-6: Post-Approval Execution Runners & Audit Trail (Green & Gray)
- [x] Upon approval, the system must generate:
  1. **Patient SMS Notification Ticket** with instruction preview.
  2. **EHR Record Commit** transaction payload logged to local DB.
  3. **Follow-Up Appointment Scheduler** ticket booked for recommended days.
- [x] Every step, risk score, physician edit, and sign-off must be appended to an immutable, timestamped **Audit Log Table** with a **"Download Audit JSON"** feature.
