import { useMemo } from 'react';
import { mergeDefined } from '../utils/mergeDefined';
import { parseToDayjs } from '../mapping/dateUtils';
import { StepStorageKey } from '../mapping/stepStorageKeys';

const DATE_FIELDS = [
  'accidentDate',
  'accidentTime',
  'validDateGreenCard',
  'otherValidDateGreenCard',
] as const;

function parseStoredDates(values: Record<string, unknown>): Record<string, unknown> {
  const result = { ...values };

  for (const field of DATE_FIELDS) {
    const parsed = parseToDayjs(result[field]);
    if (parsed) {
      result[field] = parsed;
    } else {
      delete result[field];
    }
  }

  return result;
}

export function useStepInitialValues<T extends object>(
  storageKey: StepStorageKey,
  defaults: T
): T {
  return useMemo(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return defaults;

    try {
      const stored = JSON.parse(raw) as Record<string, unknown>;
      const withDates = parseStoredDates(stored);
      return mergeDefined(
        { ...defaults } as Record<string, unknown>,
        withDates
      ) as T;
    } catch {
      return defaults;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
}
