export const STEP_STORAGE_KEYS = [
  'carclaimsDetails',
  'insurance-holder-a',
  'driver-a',
  'injuredDetails',
  'miscellaneousDamages',
  'insurance-holder-b',
  'driver-b',
  'witness',
] as const;

export type StepStorageKey = (typeof STEP_STORAGE_KEYS)[number];
