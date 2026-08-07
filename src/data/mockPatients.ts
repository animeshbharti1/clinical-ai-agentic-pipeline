import type { PatientScenario } from '../types/clinical';

export const MOCK_PATIENTS: PatientScenario[] = [
  {
    id: 'case-001',
    patientId: 'PT-88349',
    patientName: 'Robert Vance',
    age: 58,
    gender: 'Male',
    sourceType: 'scan',
    rawInput: `PATIENT REPORT / TELEMETRY TRANSCRIPT:
Patient presents to triage via walk-in complaining of acute substernal chest pressure starting 45 mins ago. Describes pain as 8/10, radiating to left arm and jaw. Cold diaphoresis present.
Vitals: BP 168/98 mmHg, HR 114 bpm (sinus tachycardia), SpO2 94% on room air, Temp 36.8 C.
ECG snapshot scan notes 2.5mm ST-elevation in leads II, III, aVF (Inferior wall STEMI pattern).
History of Hypertension, Type 2 Diabetes. Current meds: Lisinopril 20mg, Metformin 1000mg. Allergy: Penicillin.`,
    extracted: {
      chiefComplaint: 'Acute substernal chest pressure radiating to left arm & jaw (8/10 pain)',
      onsetAndDuration: 'Sudden onset, 45 minutes prior to presentation',
      symptoms: [
        'Substernal chest pressure (8/10)',
        'Left arm radiation',
        'Jaw pain',
        'Cold diaphoresis',
        'Mild dyspnea'
      ],
      vitals: {
        heartRate: 114,
        bpSystolic: 168,
        bpDiastolic: 98,
        spo2: 94,
        tempC: 36.8,
        respiratoryRate: 22
      },
      knownConditions: ['Hypertension', 'Type 2 Diabetes Mellitus', 'Hyperlipidemia'],
      currentMedications: ['Lisinopril 20mg daily', 'Metformin 1000mg BID'],
      allergies: ['Penicillin (Hives)'],
      rawSourceType: 'scan'
    },
    analysis: {
      urgency: 'critical',
      riskScore: 94,
      abnormalities: [
        {
          id: 'abn-1',
          parameter: '12-Lead ECG telemetry',
          value: '2.5mm ST-elevation (Leads II, III, aVF)',
          referenceRange: '< 1.0mm elevation',
          severity: 'critical',
          clinicalContext: 'High probability of Acute Inferior Myocardial Infarction (STEMI).'
        },
        {
          id: 'abn-2',
          parameter: 'Systolic Blood Pressure',
          value: '168 mmHg',
          referenceRange: '90 - 120 mmHg',
          severity: 'warning',
          clinicalContext: 'Hypertensive response secondary to acute cardiac distress.'
        },
        {
          id: 'abn-3',
          parameter: 'Heart Rate',
          value: '114 bpm',
          referenceRange: '60 - 100 bpm',
          severity: 'warning',
          clinicalContext: 'Sinus tachycardia secondary to sympathetic surge.'
        }
      ],
      historicalComparison: 'Patient baseline HR was 72 bpm, BP 128/82 (3 months ago). Current presentation represents acute hemodynamic deviation with ischemic ECG patterns.',
      urgentBypassTriggered: true,
      urgentAlertMessage: '🚨 CRITICAL ALERT: Inferior STEMI suspected! Immediate Cath Lab activation and Attending Physician alert triggered before summary draft completion.',
      timestamp: new Date().toISOString()
    },
    draft: {
      clinicalSummary: '58-year-old male with acute onset 8/10 substernal chest pressure, diaphoresis, and ST-elevation in II, III, aVF. High suspicion for Acute Inferior STEMI. Urgent stabilization initiated.',
      suggestedDiagnoses: [
        { code: 'I21.1', name: 'ST elevation (STEMI) myocardial infarction of inferior wall', probability: 0.94 },
        { code: 'I20.0', name: 'Unstable angina pectoris', probability: 0.05 }
      ],
      proposedTreatmentPlan: [
        'Immediate Cardiology / Cath Lab Activation',
        'Stat Aspirin 325mg chewable + Clopidogrel 600mg loading dose',
        'Continuous 12-lead ECG monitoring & IV access x 2',
        'Sublingual Nitroglycerin 0.4mg q5m (if BP permits)',
        'Stat Cardiac Enzymes (Troponin T/I, CK-MB) & Stat Portable CXR'
      ],
      patientCommunicationDraft: 'Mr. Vance, your chest pain and ECG results require urgent evaluation by our cardiac team. We are preparing to transfer you directly to the cardiac suite for treatment.',
      recommendedFollowUpDays: 1
    }
  },
  {
    id: 'case-002',
    patientId: 'PT-41902',
    patientName: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    sourceType: 'voice',
    rawInput: `VOICE TRANSCRIPT (AI DICTATION):
"Hi Doctor, I've had increasing shortness of breath and wheezing since yesterday evening. My rescue inhaler Albuterol isn't helping as much as usual. I'm coughing up clear sputum. No fever. SpO2 on my home pulse oximeter was 93%. I feel tight in my chest when walking upstairs."
Vitals in clinic: BP 122/78, HR 92, SpO2 93% ambient air, RR 20. Expiratory wheezing bilaterally.`,
    extracted: {
      chiefComplaint: 'Acute exacerbation of shortness of breath and wheezing refractory to Albuterol',
      onsetAndDuration: 'Gradual worsening over 18 hours',
      symptoms: [
        'Expiratory wheezing',
        'Shortness of breath with exertion',
        'Chest tightness',
        'Cough with clear sputum'
      ],
      vitals: {
        heartRate: 92,
        bpSystolic: 122,
        bpDiastolic: 78,
        spo2: 93,
        tempC: 36.6,
        respiratoryRate: 20
      },
      knownConditions: ['Moderate Persistent Asthma', 'Allergic Rhinitis'],
      currentMedications: ['Fluticasone/Salmeterol 250/50 mcg BID', 'Albuterol HFA 90mcg PRN'],
      allergies: ['Sulfa drugs'],
      rawSourceType: 'voice'
    },
    analysis: {
      urgency: 'moderate',
      riskScore: 58,
      abnormalities: [
        {
          id: 'abn-201',
          parameter: 'Oxygen Saturation (SpO2)',
          value: '93%',
          referenceRange: '95 - 100%',
          severity: 'warning',
          clinicalContext: 'Mild hypoxemia consistent with bronchial bronchospasm.'
        },
        {
          id: 'abn-202',
          parameter: 'Auscultation',
          value: 'Bilateral expiratory wheezing',
          referenceRange: 'Clear breath sounds',
          severity: 'warning',
          clinicalContext: 'Widespread airway inflammation and bronchoconstriction.'
        }
      ],
      historicalComparison: 'Patient had similar flare-up 8 months ago responsive to oral Prednisone burst. Baseline SpO2 98%.',
      urgentBypassTriggered: false,
      timestamp: new Date().toISOString()
    },
    draft: {
      clinicalSummary: '34-year-old female presenting with acute asthma exacerbation. Suboptimal response to rescue beta-agonists. Mild hypoxemia (SpO2 93%) and diffuse expiratory wheezing.',
      suggestedDiagnoses: [
        { code: 'J45.901', name: 'Unspecified asthma with (acute) exacerbation', probability: 0.88 },
        { code: 'J20.9', name: 'Acute bronchitis, unspecified', probability: 0.12 }
      ],
      proposedTreatmentPlan: [
        'Nebulized Albuterol 2.5mg + Ipratropium 0.5mg (DuoNeb) stat',
        'Oral Prednisone 40mg daily x 5 days',
        'Supplemental Oxygen via Nasal Cannula to maintain SpO2 > 95%',
        'Re-evaluate Peak Expiratory Flow Rate (PEFR) post-nebulizer'
      ],
      patientCommunicationDraft: 'Elena, we are giving you a breathing treatment in the clinic and prescribing a short course of oral steroids to reduce airway swelling. Please use your rescue inhaler as instructed.',
      recommendedFollowUpDays: 3
    }
  },
  {
    id: 'case-003',
    patientId: 'PT-10492',
    patientName: 'David Miller',
    age: 45,
    gender: 'Male',
    sourceType: 'text',
    rawInput: `PATIENT PORTAL CHECK-IN TEXT:
"Checking in for my 2-week post-op right knee arthroscopic partial meniscectomy follow-up. Surgical portal incisions are clean, dry, and intact without erythema or drainage. Mild peri-patellar swelling, expected post-op stiffness. Pain is 2/10 off all narcotics, using Tylenol occasionally. Walking with minimal limp."
Vitals: BP 118/74, HR 68, SpO2 99%, Temp 36.5 C.`,
    extracted: {
      chiefComplaint: 'Routine 2-week post-operative checkup following right knee arthroscopy',
      onsetAndDuration: 'Post-op Day 14',
      symptoms: [
        'Mild right knee stiffness',
        'Occasional mild discomfort (2/10)'
      ],
      vitals: {
        heartRate: 68,
        bpSystolic: 118,
        bpDiastolic: 74,
        spo2: 99,
        tempC: 36.5,
        respiratoryRate: 14
      },
      knownConditions: ['Right Meniscal Tear (S/P Arthroscopy)'],
      currentMedications: ['Acetaminophen 500mg PRN'],
      allergies: ['No Known Drug Allergies (NKDA)'],
      rawSourceType: 'text'
    },
    analysis: {
      urgency: 'low',
      riskScore: 12,
      abnormalities: [],
      historicalComparison: 'Patient recovering on expected clinical trajectory. Pain score improved from 6/10 at Post-Op Day 3 to 2/10 today.',
      urgentBypassTriggered: false,
      timestamp: new Date().toISOString()
    },
    draft: {
      clinicalSummary: '45-year-old male 14 days post right knee arthroscopic meniscectomy. Surgical sites well healed, minimal effusion, pain well controlled (2/10). Excellent surgical recovery.',
      suggestedDiagnoses: [
        { code: 'Z48.812', name: 'Encounter for surgical aftercare following arthroscopy', probability: 0.98 }
      ],
      proposedTreatmentPlan: [
        'Remove portal steristrips; inspect incision wounds',
        'Advance physical therapy to home quadriceps strengthening exercises',
        'Full weight bearing as tolerated',
        'Return to work / light office duties cleared'
      ],
      patientCommunicationDraft: 'David, your surgical knee is healing wonderfully. You may advance your activity as tolerated and continue your home exercises.',
      recommendedFollowUpDays: 30
    }
  }
];
