import { Claimsdata, ClaimsdataToJSON } from '../api';
import { mergeDefined } from '../utils/mergeDefined';
import { mapDTO } from './dtoMapper';
import { toIsoString } from './dateUtils';
import { StepStorageKey } from './stepStorageKeys';

const DATE_FIELDS = [
  'accidentDate',
  'accidentTime',
  'validDateGreenCard',
  'otherValidDateGreenCard',
] as const;

function normalizeDatesForStorage(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...data };

  for (const field of DATE_FIELDS) {
    const iso = toIsoString(result[field]);
    if (iso) {
      result[field] = iso;
    } else {
      delete result[field];
    }
  }

  return result;
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
}

function normalizeClaimsdataForSerialization(claimsdata: Claimsdata): Claimsdata {
  return {
    ...claimsdata,
    witness: claimsdata.witness ?? [],
    vehicleDriver: claimsdata.vehicleDriver
      ? {
          ...claimsdata.vehicleDriver,
          damagedCarImages: claimsdata.vehicleDriver.damagedCarImages ?? [],
          damagedWindowImages:
            claimsdata.vehicleDriver.damagedWindowImages ?? [],
        }
      : claimsdata.vehicleDriver,
    otherVehicleDriver: claimsdata.otherVehicleDriver
      ? {
          ...claimsdata.otherVehicleDriver,
          damagedCarImages:
            claimsdata.otherVehicleDriver.damagedCarImages ?? [],
          damagedWindowImages:
            claimsdata.otherVehicleDriver.damagedWindowImages ?? [],
        }
      : claimsdata.otherVehicleDriver,
  };
}

function safeClaimsdataToJSON(claimsdata: Claimsdata): Record<string, unknown> {
  const normalized = normalizeClaimsdataForSerialization(claimsdata);

  try {
    return stripUndefined(
      ClaimsdataToJSON(normalized) as Record<string, unknown>
    );
  } catch {
    const fallback: Record<string, unknown> = {};

    if (claimsdata.language) fallback.language = claimsdata.language;
    if (claimsdata.accidentDate) {
      const iso = toIsoString(claimsdata.accidentDate);
      if (iso) fallback.accidentDate = iso.substring(0, 10);
    }
    if (claimsdata.accidentTime) fallback.accidentTime = claimsdata.accidentTime;
    if (claimsdata.accidentPostalCode) {
      fallback.accidentPostalCode = claimsdata.accidentPostalCode;
    }
    if (claimsdata.accidentCity) fallback.accidentCity = claimsdata.accidentCity;
    if (claimsdata.accidentStreetName) {
      fallback.accidentStreetName = claimsdata.accidentStreetName;
    }
    if (claimsdata.accidentStreetNumber) {
      fallback.accidentStreetNumber = claimsdata.accidentStreetNumber;
    }
    if (claimsdata.accidentDescription) {
      fallback.accidentDescription = claimsdata.accidentDescription;
    }
    if (claimsdata.accidentPoliceNumber) {
      fallback.accidentPoliceNumber = claimsdata.accidentPoliceNumber;
    }
    if (claimsdata.hasVehicleDamage) {
      fallback.hasVehicleDamage = claimsdata.hasVehicleDamage;
    }
    if (claimsdata.injuredPerson) fallback.injuredPerson = claimsdata.injuredPerson;
    if (claimsdata.witnessExists) fallback.witnessExists = claimsdata.witnessExists;
    if (claimsdata.policyholder) fallback.policyholder = claimsdata.policyholder;
    if (claimsdata.otherPolicyholder) {
      fallback.otherPolicyholder = claimsdata.otherPolicyholder;
    }
    if (claimsdata.vehicleDriver) fallback.vehicleDriver = claimsdata.vehicleDriver;
    if (claimsdata.otherVehicleDriver) {
      fallback.otherVehicleDriver = claimsdata.otherVehicleDriver;
    }

    return stripUndefined(fallback);
  }
}

export function buildVoiceCurrentState(
  stepKey: StepStorageKey,
  formValues: Record<string, unknown>
): Record<string, unknown> {
  const previous = sessionStorage.getItem(stepKey);
  let existing: Record<string, unknown> = {};

  if (previous) {
    try {
      existing = normalizeDatesForStorage(
        JSON.parse(previous) as Record<string, unknown>
      );
    } catch {
      existing = {};
    }
  }

  const merged = normalizeDatesForStorage(
    mergeDefined(existing, formValues as Record<string, unknown>)
  );

  sessionStorage.setItem(stepKey, JSON.stringify(merged));

  try {
    return safeClaimsdataToJSON(mapDTO());
  } finally {
    if (previous === null) {
      sessionStorage.removeItem(stepKey);
    } else {
      sessionStorage.setItem(stepKey, previous);
    }
  }
}
