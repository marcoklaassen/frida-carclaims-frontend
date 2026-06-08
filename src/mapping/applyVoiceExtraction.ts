import { Claimsdata } from '../api';
import { mergeDefined } from '../utils/mergeDefined';
import { normalizeStepValuesForForm } from './normalizeStepValuesForForm';
import { mapClaimsdataToStepStates } from './reverseDtoMapper';
import { StepStorageKey } from './stepStorageKeys';

function readStorageStep(key: StepStorageKey): Record<string, unknown> {
  const raw = sessionStorage.getItem(key);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function applyVoiceExtraction(
  partialClaimsdata: Partial<Claimsdata>,
  currentStepKey: StepStorageKey
): Record<string, unknown> {
  const stepUpdates = mapClaimsdataToStepStates(partialClaimsdata);
  let currentStepMerged: Record<string, unknown> = {};

  for (const [key, updates] of Object.entries(stepUpdates) as Array<
    [StepStorageKey, object]
  >) {
    const existing = readStorageStep(key);
    const merged = mergeDefined(existing, updates as Record<string, unknown>);
    sessionStorage.setItem(key, JSON.stringify(merged));

    if (key === currentStepKey) {
      currentStepMerged = merged;
    }
  }

  return normalizeStepValuesForForm(currentStepKey, currentStepMerged);
}
