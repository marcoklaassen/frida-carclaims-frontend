import { parseToDayjs } from './dateUtils';
import { StepStorageKey } from './stepStorageKeys';

const DATE_FIELDS_BY_STEP: Partial<Record<StepStorageKey, readonly string[]>> = {
  carclaimsDetails: ['accidentDate', 'accidentTime'],
  'insurance-holder-a': ['validDateGreenCard'],
  'insurance-holder-b': ['otherValidDateGreenCard'],
};

export function normalizeStepValuesForForm(
  stepKey: StepStorageKey,
  values: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...values };
  const dateFields = DATE_FIELDS_BY_STEP[stepKey] ?? [];

  for (const field of dateFields) {
    const parsed = parseToDayjs(result[field]);
    if (parsed) {
      result[field] = parsed;
    } else if (field in result) {
      delete result[field];
    }
  }

  return result;
}
