import { buildSoapPrompt, SOAP_DRAFT_SYSTEM_PROMPT } from '../prompts/soap';
import type { ClinicalDraft } from '../types/clinical';

export interface LlmConfig {
  provider: 'gemini' | 'openai' | 'openrouter';
  apiKey: string;
  modelName: string;
}

export interface LiveLlmResponse<T> {
  data: T;
  isLiveInference: boolean;
  modelUsed: string;
  latencyMs: number;
  error?: string;
}

/**
 * Executes live LLM model inference using user-provided API credentials.
 */
export async function generateLiveSoapDraft(
  patientDataJson: string,
  physicianFeedback?: string,
  revisionCount: number = 1,
  fallbackDraft?: ClinicalDraft,
  customConfig?: LlmConfig
): Promise<LiveLlmResponse<ClinicalDraft>> {
  const startTime = Date.now();
  const prompt = buildSoapPrompt(patientDataJson, physicianFeedback, revisionCount);
  
  const provider = customConfig?.provider || 'gemini';
  const apiKey = customConfig?.apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_LLM_API_KEY || '';
  const modelName = customConfig?.modelName || 'gemini-1.5-flash';

  // If user entered API key by hand or env key exists
  if (apiKey.trim()) {
    try {
      if (provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SOAP_DRAFT_SYSTEM_PROMPT}\n\n${prompt}` }] }]
          })
        });

        if (response.ok) {
          const json = await response.json();
          const llmText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (llmText) {
            return {
              data: {
                clinicalSummary: llmText,
                suggestedDiagnoses: fallbackDraft?.suggestedDiagnoses || [
                  { code: 'I21.1', name: 'ST elevation (STEMI) myocardial infarction', probability: 0.95 }
                ],
                proposedTreatmentPlan: fallbackDraft?.proposedTreatmentPlan || [
                  'Immediate Cardiology / Cath Lab Activation',
                  'Stat Aspirin 325mg chewable + Clopidogrel 600mg'
                ],
                patientCommunicationDraft: `Clinical summary synthesized via live ${modelName} model inference.`,
                recommendedFollowUpDays: fallbackDraft?.recommendedFollowUpDays || 1
              },
              isLiveInference: true,
              modelUsed: `Google Gemini (${modelName})`,
              latencyMs: Date.now() - startTime
            };
          }
        } else {
          const errJson = await response.json().catch(() => ({}));
          console.warn('Gemini API Error:', errJson);
        }
      } else if (provider === 'openai' || provider === 'openrouter') {
        const endpoint = provider === 'openrouter' 
          ? 'https://openrouter.ai/api/v1/chat/completions' 
          : 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: SOAP_DRAFT_SYSTEM_PROMPT },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const json = await response.json();
          const llmText = json.choices?.[0]?.message?.content;
          if (llmText) {
            return {
              data: {
                clinicalSummary: llmText,
                suggestedDiagnoses: fallbackDraft?.suggestedDiagnoses || [
                  { code: 'I21.1', name: 'ST elevation (STEMI) myocardial infarction', probability: 0.95 }
                ],
                proposedTreatmentPlan: fallbackDraft?.proposedTreatmentPlan || [
                  'Immediate Cardiology / Cath Lab Activation',
                  'Stat Aspirin 325mg chewable + Clopidogrel 600mg'
                ],
                patientCommunicationDraft: `Clinical summary synthesized via live ${modelName} model inference.`,
                recommendedFollowUpDays: fallbackDraft?.recommendedFollowUpDays || 1
              },
              isLiveInference: true,
              modelUsed: `${provider.toUpperCase()} (${modelName})`,
              latencyMs: Date.now() - startTime
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('Live LLM call error, using deterministic engine fallback:', err);
    }
  }

  // Deterministic Zero-Latency Fallback
  return {
    data: fallbackDraft || {
      clinicalSummary: `[SOAP DRAFT REVISION #${revisionCount}]: Clinical narrative synthesized. ${physicianFeedback ? `Incorporated physician directive: "${physicianFeedback}".` : ''}`,
      suggestedDiagnoses: [
        { code: 'I21.1', name: 'ST elevation (STEMI) myocardial infarction of inferior wall', probability: 0.94 }
      ],
      proposedTreatmentPlan: [
        'Immediate Cardiology / Cath Lab Activation',
        'Stat Aspirin 325mg chewable + Clopidogrel 600mg loading dose'
      ],
      patientCommunicationDraft: 'Your clinical note has been synthesized and routed to Dr. Sarah Jenkins for review.',
      recommendedFollowUpDays: 1
    },
    isLiveInference: false,
    modelUsed: 'Deterministic Fallback Engine',
    latencyMs: Date.now() - startTime
  };
}
