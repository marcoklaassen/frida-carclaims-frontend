import {
  Claimsdata,
  Person,
  Policyholder,
  VehicleDriver,
  VehicleDriverDamageCausedByEnum,
  Witness,
} from '../api';
import { TypesOfDamage } from '../config';
import { StepStorageKey } from './stepStorageKeys';
import {
  CarclaimsDetailsState,
  DriverOfInsuranceHolderFormState,
  DriverOfOtherInsuranceHolderFormState,
  InjuredPeopleFormState,
  InsuranceHolderFormState,
  MiscellaneousDamagesFormState,
  OtherInsuranceHolderFormState,
  WitnessDetails,
  WitnessesFormState,
} from '../types';
import dayjs, { Dayjs } from 'dayjs';

type StepStates = Partial<Record<StepStorageKey, object>>;

function hasDefinedValues(obj: object): boolean {
  return Object.values(obj).some((v) => v !== undefined && v !== null && v !== '');
}

function mapTriStateEnum(value?: string): string {
  switch (value) {
    case 'true':
      return '1';
    case 'false':
      return '0';
    default:
      return '';
  }
}

function mapDrivingAbility(value?: string): 'Yes' | 'No' | '' {
  switch (value) {
    case 'true':
      return 'Yes';
    case 'false':
      return 'No';
    default:
      return '';
  }
}

function mapFormOfAddress(value?: string): '' | 'Herr' | 'Frau' {
  switch (value) {
    case 'Herr':
      return 'Herr';
    case 'Frau':
      return 'Frau';
    default:
      return '';
  }
}

function parseDate(value?: Date | string): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

function parseTime(value?: string): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(`1970-01-01T${value}`);
  return parsed.isValid() ? parsed : null;
}

function mapDamageCausedBy(value?: VehicleDriverDamageCausedByEnum): number | undefined {
  if (!value) return undefined;
  const entry = TypesOfDamage.find((t) => {
    const normalizedLabel = t.label.replace(/\s+/g, ' ').trim();
    const normalizedValue = value.replace(/\s+/g, ' ').trim();
    return (
      normalizedLabel === normalizedValue ||
      t.label === value ||
      (value === 'Rangieren/Parken' && t.key === 2) ||
      (value === 'Überholvorgang' && t.key === 6)
    );
  });
  return entry?.key;
}

function mapDamagedParts(
  parts?: string[]
): string[] | undefined {
  if (!parts?.length) return undefined;
  return parts;
}

function mapPersonToDriverFields(
  person?: Person,
  prefix: 'driver' | 'otherDriver' = 'driver'
): Record<string, unknown> {
  if (!person) return {};

  const salutationKey =
    prefix === 'driver' ? 'driverSalutation' : 'otherDriverSalutation';
  const nameKey =
    prefix === 'driver' ? 'driverHolderName' : 'otherDriverHolderName';
  const surNameKey =
    prefix === 'driver' ? 'driverHolderSurName' : 'otherDriverHolderSurName';
  const streetKey =
    prefix === 'driver' ? 'driverHolderStreet' : 'otherDriverHolderStreet';
  const streetNrKey =
    prefix === 'driver' ? 'driverHolderStreetNr' : 'otherDriverHolderStreetNr';
  const postalKey =
    prefix === 'driver'
      ? 'driverHolderPostalCode'
      : 'otherDriverHolderPostalCode';
  const placeKey =
    prefix === 'driver' ? 'driverHolderPlace' : 'otherDriverHolderPlace';
  const phoneKey =
    prefix === 'driver'
      ? 'driverHolderTelephone'
      : 'otherDriverHolderTelephone';

  return {
    [salutationKey]: mapFormOfAddress(person.formOfAddress),
    [nameKey]: person.firstName,
    [surNameKey]: person.lastName,
    [streetKey]: person.streetName,
    [streetNrKey]: person.streetNumber,
    [postalKey]: person.postalCode,
    [placeKey]: person.city,
    [phoneKey]: person.phoneNumber,
  };
}

function mapVehicleDriverToFormState(
  driver?: VehicleDriver,
  variant: 'a' | 'b' = 'a'
): DriverOfInsuranceHolderFormState | DriverOfOtherInsuranceHolderFormState {
  if (!driver) return {};

  const personFields = mapPersonToDriverFields(
    driver.personalInformation,
    variant === 'a' ? 'driver' : 'otherDriver'
  );

  if (variant === 'a') {
    const damageKey = mapDamageCausedBy(driver.damageCausedBy);
    return {
      ...personFields,
      driverHolderDriverLicense: driver.driverLicensenumber,
      driverHolderIssuer: driver.licenseIssuedBy,
      driverHolderDamagePlace: mapDamagedParts(driver.driverDamagedpartsGraphic),
      driverHolderVisibleDamage: driver.driverVisibleDamage,
      driverHolderNotes: driver.driverComments,
      victimReadyToDrive: mapDrivingAbility(driver.vehicleDrivingAbility) as
        | 'Yes'
        | 'No'
        | undefined,
      whichDamageToVictim: damageKey,
    } as DriverOfInsuranceHolderFormState;
  }

  const damageKey = mapDamageCausedBy(driver.damageCausedBy);
  return {
    ...personFields,
    otherDriverHolderDriverLicense: driver.driverLicensenumber,
    otherDriverHolderIssuer: driver.licenseIssuedBy,
    otherDriverHolderDamagePlace: mapDamagedParts(driver.driverDamagedpartsGraphic),
    otherDriverHolderVisibleDamage: driver.driverVisibleDamage,
    otherDriverHolderNotes: driver.driverComments,
    otherVictimReadyToDrive: mapDrivingAbility(driver.vehicleDrivingAbility) as
      | 'Yes'
      | 'No'
      | '',
    otherWhichDamageToVictim: damageKey,
  } as DriverOfOtherInsuranceHolderFormState;
}

function mapPersonToPolicyholderFields(
  person?: Person,
  prefix: 'insurance' | 'otherInsurance' = 'insurance'
): Record<string, unknown> {
  if (!person) return {};

  if (prefix === 'insurance') {
    return {
      insuranceHolderSalutation: mapFormOfAddress(person.formOfAddress),
      insuranceHolderName: person.firstName,
      insuranceHolderSurName: person.lastName,
      insuranceHolderStreet: person.streetName,
      insuranceHolderStreetNr: person.streetNumber,
      insuranceHolderPostalCode: person.postalCode,
      insuranceHolderPlace: person.city,
      insuranceHolderTelephone: person.phoneNumber,
      insuranceHolderEmail: person.emailAddress,
    };
  }

  return {
    otherInsuranceHolderSalutation: mapFormOfAddress(person.formOfAddress),
    otherInsuranceHolderName: person.firstName,
    otherInsuranceHolderSurName: person.lastName,
    otherInsuranceHolderStreet: person.streetName,
    otherInsuranceHolderStreetNr: person.streetNumber,
    otherInsuranceHolderPostalCode: person.postalCode,
    otherInsuranceHolderPlace: person.city,
    otherInsuranceHolderTelephone: person.phoneNumber,
    otherInsuranceHolderEmail: person.emailAddress,
  };
}

function mapPolicyholderToFormState(
  policyholder?: Policyholder,
  variant: 'a' | 'b' = 'a'
): InsuranceHolderFormState | OtherInsuranceHolderFormState {
  if (!policyholder) return {};

  const personFields = mapPersonToPolicyholderFields(
    policyholder.personalInformation,
    variant === 'a' ? 'insurance' : 'otherInsurance'
  );

  if (variant === 'a') {
    return {
      ...personFields,
      pretaxes: mapTriStateEnum(policyholder.inputTaxDeduction),
      carBrand: policyholder.vehicleMake,
      carModel: policyholder.vehicleType,
      licenseNumber: policyholder.vehicleReg,
      insuranceCompany: policyholder.insuranceCompany,
      insuranceID: policyholder.policyNumber,
      chassisNr: policyholder.vin,
      currentKM: policyholder.currentMileage?.toString(),
      greenCardNr: policyholder.greencardNumber,
      validDateGreenCard: parseDate(policyholder.greencardExpirydate),
      allRiskInsurance: mapTriStateEnum(policyholder.comprehensiveInsurance),
    } as InsuranceHolderFormState;
  }

  return {
    ...personFields,
    otherPretaxes: mapTriStateEnum(policyholder.inputTaxDeduction),
    otherCarBrand: policyholder.vehicleMake,
    otherCarModel: policyholder.vehicleType,
    otherLicenseNumber: policyholder.vehicleReg,
    otherInsuranceCompany: policyholder.insuranceCompany,
    otherInsuranceID: policyholder.policyNumber,
    otherChassisNr: policyholder.vin,
    otherCurrentKM: policyholder.currentMileage?.toString(),
    otherGreenCardNr: policyholder.greencardNumber,
    otherValidDateGreenCard: parseDate(policyholder.greencardExpirydate),
    otherAllRiskInsurance: mapTriStateEnum(policyholder.comprehensiveInsurance),
  } as OtherInsuranceHolderFormState;
}

function mapWitnessToFormDetails(witness: Witness): WitnessDetails {
  const person = witness.personalInformation;
  return {
    salutation: mapFormOfAddress(person?.formOfAddress),
    surName: person?.firstName,
    lastName: person?.lastName,
    street: person?.streetName,
    houseNr: person?.streetNumber,
    postalCode: person?.postalCode,
    place: person?.city,
    telephone: person?.phoneNumber,
    email: person?.emailAddress,
  };
}

function mapCarclaimsDetails(partial: Partial<Claimsdata>): CarclaimsDetailsState {
  const result: CarclaimsDetailsState = {
    language: partial.language ?? '',
    accidentDate: parseDate(partial.accidentDate),
    accidentTime: parseTime(partial.accidentTime),
    street: partial.accidentStreetName,
    postalCode: partial.accidentPostalCode,
    place: partial.accidentCity,
    houseNr: partial.accidentStreetNumber,
    accidentDetails: partial.accidentDescription,
    processingNr: partial.accidentPoliceNumber,
  };

  return Object.fromEntries(
    Object.entries(result).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as CarclaimsDetailsState;
}

export function mapClaimsdataToStepStates(
  partial: Partial<Claimsdata>
): StepStates {
  const result: StepStates = {};

  const accidentFields: Array<keyof Claimsdata> = [
    'language',
    'accidentDate',
    'accidentTime',
    'accidentPostalCode',
    'accidentCity',
    'accidentStreetName',
    'accidentStreetNumber',
    'accidentDescription',
    'accidentPoliceNumber',
  ];

  if (accidentFields.some((key) => partial[key] !== undefined)) {
    const mapped = mapCarclaimsDetails(partial);
    if (hasDefinedValues(mapped)) {
      result['carclaimsDetails'] = mapped;
    }
  }

  if (partial.policyholder) {
    const mapped = mapPolicyholderToFormState(partial.policyholder, 'a');
    if (hasDefinedValues(mapped)) {
      result['insurance-holder-a'] = mapped;
    }
  }

  if (partial.otherPolicyholder) {
    const mapped = mapPolicyholderToFormState(partial.otherPolicyholder, 'b');
    if (hasDefinedValues(mapped)) {
      result['insurance-holder-b'] = mapped;
    }
  }

  if (partial.vehicleDriver) {
    const mapped = mapVehicleDriverToFormState(partial.vehicleDriver, 'a');
    if (hasDefinedValues(mapped)) {
      result['driver-a'] = mapped;
    }
  }

  if (partial.otherVehicleDriver) {
    const mapped = mapVehicleDriverToFormState(partial.otherVehicleDriver, 'b');
    if (hasDefinedValues(mapped)) {
      result['driver-b'] = mapped;
    }
  }

  if (
    partial.injuredPerson !== undefined ||
    partial.injuredPersonNumber !== undefined
  ) {
    const injured: InjuredPeopleFormState = {};
    if (partial.injuredPerson !== undefined) {
      injured.injured = mapTriStateEnum(partial.injuredPerson);
    }
    if (partial.injuredPersonNumber !== undefined) {
      injured.injuredCount = parseInt(partial.injuredPersonNumber, 10) || undefined;
    }
    if (hasDefinedValues(injured)) {
      result['injuredDetails'] = injured;
    }
  }

  if (
    partial.hasVehicleDamage !== undefined ||
    partial.vehicleDamageDescription !== undefined
  ) {
    const misc: MiscellaneousDamagesFormState = {};
    if (partial.hasVehicleDamage !== undefined) {
      misc.otherDamages = mapTriStateEnum(partial.hasVehicleDamage);
    }
    if (partial.vehicleDamageDescription !== undefined) {
      misc.damages = partial.vehicleDamageDescription;
    }
    if (hasDefinedValues(misc)) {
      result['miscellaneousDamages'] = misc;
    }
  }

  if (
    partial.witnessExists !== undefined ||
    partial.witnessCount !== undefined ||
    partial.witness !== undefined
  ) {
    const witnessState: WitnessesFormState = {};
    if (partial.witnessExists !== undefined) {
      witnessState.existingWitness = mapTriStateEnum(partial.witnessExists);
    }
    if (partial.witnessCount !== undefined) {
      witnessState.witnessesCount = parseInt(partial.witnessCount, 10) || undefined;
    }
    if (partial.witness?.length) {
      witnessState.witnesses = partial.witness.map(mapWitnessToFormDetails);
    }
    if (hasDefinedValues(witnessState)) {
      result['witness'] = witnessState;
    }
  }

  return result;
}
