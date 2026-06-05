import {
  ClaimsdataHasVehicleDamageEnum,
  ClaimsdataInjuredPersonEnum,
  ClaimsdataLanguageEnum,
  ClaimsdataWitnessExistsEnum,
  VehicleDriverDamageCausedByEnum,
  VehicleDriverVehicleDrivingAbilityEnum,
} from '../api';
import { mapClaimsdataToStepStates } from './reverseDtoMapper';

describe('mapClaimsdataToStepStates', () => {
  it('maps accident top-level fields to carclaimsDetails', () => {
    const result = mapClaimsdataToStepStates({
      language: ClaimsdataLanguageEnum.De,
      accidentCity: 'Bedburg',
      accidentPostalCode: '50181',
      accidentStreetName: 'Germaniastraße',
      accidentStreetNumber: '1b',
      accidentDescription: 'Auffahrunfall',
      accidentPoliceNumber: '2024-ABC',
      accidentDate: new Date('2019-08-24'),
      accidentTime: '08:30:00',
    });

    expect(result['carclaimsDetails']).toMatchObject({
      language: 'DE',
      place: 'Bedburg',
      postalCode: '50181',
      street: 'Germaniastraße',
      houseNr: '1b',
      accidentDetails: 'Auffahrunfall',
      processingNr: '2024-ABC',
    });
  });

  it('maps injured and misc damage enums to form radio values', () => {
    const result = mapClaimsdataToStepStates({
      injuredPerson: ClaimsdataInjuredPersonEnum.True,
      injuredPersonNumber: '2',
      hasVehicleDamage: ClaimsdataHasVehicleDamageEnum.False,
      vehicleDamageDescription: 'Zaunschaden',
    });

    expect(result['injuredDetails']).toEqual({
      injured: '1',
      injuredCount: 2,
    });
    expect(result['miscellaneousDamages']).toEqual({
      otherDamages: '0',
      damages: 'Zaunschaden',
    });
  });

  it('maps policyholder and vehicle driver nested data', () => {
    const result = mapClaimsdataToStepStates({
      policyholder: {
        personalInformation: {
          formOfAddress: 'Herr',
          firstName: 'Max',
          lastName: 'Mustermann',
          postalCode: '50181',
          city: 'Bedburg',
          streetName: 'Hauptstraße',
          streetNumber: '10',
          phoneNumber: '+491234',
          emailAddress: 'max@example.com',
        },
        vehicleMake: 'BMW',
        vehicleType: 'M5',
        vehicleReg: 'BM LD1234',
        comprehensiveInsurance: 'true',
      },
      vehicleDriver: {
        personalInformation: {
          formOfAddress: 'Frau',
          firstName: 'Erika',
          lastName: 'Muster',
        },
        driverLicensenumber: 'DR123456',
        vehicleDrivingAbility: VehicleDriverVehicleDrivingAbilityEnum.True,
        damageCausedBy: VehicleDriverDamageCausedByEnum.Auffahren,
        driverDamagedpartsGraphic: ['hinten links', 'Motorhaube'],
      },
    });

    expect(result['insurance-holder-a']).toMatchObject({
      insuranceHolderSalutation: 'Herr',
      insuranceHolderName: 'Max',
      insuranceHolderSurName: 'Mustermann',
      carBrand: 'BMW',
      allRiskInsurance: '1',
    });

    expect(result['driver-a']).toMatchObject({
      driverSalutation: 'Frau',
      driverHolderName: 'Erika',
      driverHolderSurName: 'Muster',
      driverHolderDriverLicense: 'DR123456',
      victimReadyToDrive: 'Yes',
      whichDamageToVictim: 1,
      driverHolderDamagePlace: ['hinten links', 'Motorhaube'],
    });
  });

  it('maps witness data with swapped name fields used by the form', () => {
    const result = mapClaimsdataToStepStates({
      witnessExists: ClaimsdataWitnessExistsEnum.True,
      witnessCount: '1',
      witness: [
        {
          personalInformation: {
            formOfAddress: 'Herr',
            firstName: 'Hans',
            lastName: 'Schmidt',
            streetName: 'Zeugenweg',
            streetNumber: '3',
            postalCode: '12345',
            city: 'Köln',
            phoneNumber: '+49999',
            emailAddress: 'hans@example.com',
          },
        },
      ],
    });

    expect(result['witness']).toMatchObject({
      existingWitness: '1',
      witnessesCount: 1,
      witnesses: [
        {
          salutation: 'Herr',
          surName: 'Hans',
          lastName: 'Schmidt',
          street: 'Zeugenweg',
          houseNr: '3',
          postalCode: '12345',
          place: 'Köln',
          telephone: '+49999',
          email: 'hans@example.com',
        },
      ],
    });
  });
});
