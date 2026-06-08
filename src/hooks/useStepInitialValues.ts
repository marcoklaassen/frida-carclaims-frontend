import { useMemo } from 'react';
import { mergeDefined } from '../utils/mergeDefined';
import { normalizeStepValuesForForm } from '../mapping/normalizeStepValuesForForm';
import { StepStorageKey } from '../mapping/stepStorageKeys';

export function useStepInitialValues<T extends object>(
  storageKey: StepStorageKey,
  defaults: T
): T {
  return useMemo(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return defaults;

    try {
      const stored = JSON.parse(raw) as Record<string, unknown>;
      const withDates = normalizeStepValuesForForm(storageKey, stored);
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
