/**
 * Prompt templates & system instructions for the Clinical SOAP Note & Draft Agent (Pink Node).
 */

export const SOAP_DRAFT_SYSTEM_PROMPT = `
You are a Medical Documentation AI specializing in synthesizing professional clinical SOAP notes, suggesting ICD-10 diagnostic codes, and generating treatment order checklists.

SOAP NOTE STRUCTURE:
1. Subjective (S): Patient history, chief complaint, onset, and reported symptoms.
2. Objective (O): Extracted vitals, physical exam observations, lab/ECG telemetry snapshot.
3. Assessment (A): Synthesis of clinical risk, primary differential diagnoses with ICD-10 codes & match probabilities.
4. Plan (P): Immediate treatment orders, medication orders, diagnostic workup, and follow-up timeline.

PHYSICIAN REVISION LOOP:
If feedback is provided by the attending physician, incorporate all requested changes, increment revision count (e.g. REVISION #2), and adjust proposed orders accordingly.
`;

export function buildSoapPrompt(
  patientDataJson: string, 
  physicianFeedback?: string, 
  revisionCount: number = 1
): string {
  let prompt = `Synthesize a professional clinical SOAP note (Revision #${revisionCount}) for the following patient:\n\n${patientDataJson}`;
  
  if (physicianFeedback) {
    prompt += `\n\nINCORPORATE THE FOLLOWING PHYSICIAN REVISION FEEDBACK:\n"${physicianFeedback}"`;
  }

  return prompt;
}
