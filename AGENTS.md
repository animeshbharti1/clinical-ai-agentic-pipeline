# 🤖 Agent Directory & Capabilities Guide

This document details the roles, inputs, outputs, logic, and fail-safe triggers for each AI Agent operating within the **Autonomous Clinical AI Agentic Pipeline**.

---

## 1. 🩵 Ingestion & Extraction Agent (Teal Node)

### 📌 Role & Responsibilities
The Ingestion Agent serves as the multimodal entry point of the clinical pipeline. It ingests raw unstructured patient data (PDF reports, voice transcripts, telemetry scans, raw text) and structures it into standardized clinical FHIR-compatible fields.

* **Primary Color**: Teal (`#0D9488`)
* **Input Payload**: PDF files, raw text, telemetry snapshots, voice recordings.
* **Output Payload**: Structured JSON containing extracted demographics, chief complaint, vitals, symptoms, current medications, and allergies.

### ⚙️ Extraction Logic & Features
* **Multimodal PDF OCR**: Parses text streams from PDF files and converts unstructured text into clean key-value pairs.
* **Basic Details Extractor**: Automatically identifies **Patient Name**, **Age**, **Gender**, **MRN / Record ID**.
* **Vitals & Clinical Data Extractor**:
  * **Blood Pressure** (Systolic / Diastolic mmHg)
  * **Heart Rate** (bpm)
  * **Oxygen Saturation** (`SpO2 %`)
  * **Temperature** (`°C`) & **Respiratory Rate**
  * **Current Medications & Allergies**

---

## 2. 🧡 Clinical Risk & Abnormality Analysis Agent (Coral Node)

### 📌 Role & Responsibilities
The Analysis Agent evaluates the extracted patient payload against clinical baselines, computes an objective risk score (0-100), flags dangerous abnormalities, and determines urgency levels.

* **Primary Color**: Coral (`#F97316`)
* **Input Payload**: Structured clinical fields from Ingestion Agent.
* **Output Payload**: Risk score (0-100), flagged abnormalities table, historical baseline comparison, and urgency classification (`critical`, `high`, `moderate`, `low`).

### ⚙️ Analysis Logic & Risk Scoring
* **Risk Score Computation (0 - 100)**:
  * `90 - 100`: Critical emergency (STEMI, Cardiac Arrest, Stroke, Anaphylaxis).
  * `55 - 89`: High / Moderate urgency (Asthma exacerbation, Hypoxemia, Severe Pain).
  * `0 - 54`: Low / Routine care (Post-op checkup, Health maintenance).
* **Abnormality Detection**: Compares vitals and telemetry against standard reference ranges:
  * `Systolic BP > 160 mmHg` → Flagged Hypertensive Crisis.
  * `Heart Rate > 110 bpm` → Flagged Tachycardia.
  * `SpO2 < 94%` → Flagged Hypoxemia / Respiratory Distress.
  * `2.5mm ST-elevation` → Flagged Acute Ischemia / STEMI.

---

## 3. 🔴 Urgent Case Bypass Fast-Track Agent (Red Node)

### 📌 Role & Responsibilities
A high-priority fail-safe mechanism. If the Analysis Agent detects a critical emergency (`urgency == "critical"`), the Red Bypass fast-tracks an immediate alert directly to the physician dashboard before AI drafting completes.

* **Primary Color**: Red (`#EF4444`)
* **Trigger Condition**: Risk Score `≥ 90` or critical emergency flags detected.
* **Pitch Value Proposition**: *"AI drafting never delays a critical life-saving alert."*

### ⚙️ Fast-Track Mechanism
* Bypasses standard multi-agent queue delays.
* Displays a prominent pulsing red banner on the Doctor Review Dashboard.
* Sends priority alert payload with diagnostic telemetry snapshots.

---

## 4. 🩷 Clinical SOAP Note & Prescription Draft Agent (Pink Node)

### 📌 Role & Responsibilities
Synthesizes the extracted fields and risk analysis into a complete, professional clinical SOAP note, proposes ICD-10 diagnostic codes, drafts treatment orders, and handles physician revision loops.

* **Primary Color**: Pink (`#EC4899`)
* **Input Payload**: Structured patient fields, risk score, and historical baseline data.
* **Output Payload**: SOAP Note (Subjective, Objective, Assessment, Plan), suggested ICD-10 codes with match probabilities, treatment order checklist, and patient communication draft.

### ⚙️ Interactive Revision Loop (`REVISION #2`)
* **Physician Re-Draft Integration**: If a doctor requests changes (e.g. *"Add oral steroid burst and reduce follow-up to 3 days"*), the Draft Agent re-synthesizes the note, updates revision counters, displays a loading spinner, and returns the revised draft to the Amber Gate.

---

## 5. 🟡 Human Physician Approval Gatekeeper (Amber Node)

### 📌 Role & Responsibilities
The single mandatory checkpoint that **all** AI outputs must pass through before any action is executed. No prescriptions, EHR updates, or notifications fire without human authorization.

* **Primary Color**: Amber (`#F59E0B`)
* **Centerpiece UI**: Interactive Doctor Review Dashboard.

### ⚙️ Physician Control Capabilities
* ✏️ **Edit Summary & Treatment Orders**: Doctors can edit clinical text, add/delete prescription orders, and modify follow-up timelines.
* ❌ **Reject Draft**: Rejection blocks downstream actions, displays a `DRAFT REJECTED BY PHYSICIAN` alert, and allows manual prescription overrides.
* 🔄 **Request AI Re-Draft**: Sends specific feedback back to the Draft Agent for instant re-synthesis.
* ✅ **Approve & Dispatch**: Digitally signs the prescription and triggers post-approval actions.

---

## 6. 🟢 Post-Approval Execution Agents (Green Nodes)

### 📌 Role & Responsibilities
Automated action runners that execute only after receiving authorization from the Amber Approval Gate.

* **Primary Color**: Green (`#10B981`)
* **Outputs**:
  1. **Patient Notification Ticket**: Generates patient SMS preview ticket with instructions.
  2. **EHR Record Commit**: Commits clinical summary, vitals, and orders to local EHR database.
  3. **Follow-Up Scheduler**: Books follow-up appointments based on recommended days.
  4. **Audit Trail Logger**: Writes timestamped record to immutable compliance log with JSON export download.
