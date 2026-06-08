import { Claimsdata } from './models/Claimsdata';

// Relative path: nginx (container) or CRA dev proxy forwards /api/ to the backend.
// Override with REACT_APP_VOICE_API_URL only when not using a reverse proxy.
const VOICE_API_URL =
  process.env.REACT_APP_VOICE_API_URL || '/api/voice/extract';

export type VoiceExtractRequest = {
  language?: string;
  currentState?: Record<string, unknown>;
};

type VoiceExtractResponse = {
  transcript?: string;
  claimsData?: Record<string, unknown>;
};

export class VoiceApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VoiceApiError';
  }
}

export async function submitVoiceAudio(
  audio: Blob,
  options: VoiceExtractRequest = {}
): Promise<Partial<Claimsdata>> {
  const formData = new FormData();
  formData.append('audio', audio, 'recording.webm');

  if (options.currentState && Object.keys(options.currentState).length > 0) {
    formData.append('currentState', JSON.stringify(options.currentState));
  }

  if (options.language) {
    formData.append('language', options.language.toLowerCase());
  }

  const response = await fetch(VOICE_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Voice API error (${response.status})`;
    try {
      const body = await response.json();
      if (body?.errors?.[0]?.detail) {
        message = body.errors[0].detail;
      } else if (body?.message) {
        message = body.message;
      } else if (typeof body?.error === 'string') {
        message = body.error;
      }
    } catch {
      // use default message
    }
    throw new VoiceApiError(message);
  }

  const json = (await response.json()) as VoiceExtractResponse;

  if (!json.claimsData) {
    throw new VoiceApiError('Voice API response missing claimsData');
  }

  return json.claimsData as Partial<Claimsdata>;
}
