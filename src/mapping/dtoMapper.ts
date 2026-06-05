import {
  VehicleDriver,
  Policyholder,
  PersonFormOfAddressEnum,
  PersonTitleEnum,
  VehicleDriverDriverDamagedpartsGraphicEnum,
  VehicleDriverVehicleDrivingAbilityEnum,
  VehicleDriverDamageCausedByEnum,
  Claimsdata,
  ClaimsdataLanguageEnum,
  ClaimsdataInjuredPersonEnum,
  ClaimsdataWitnessExistsEnum,
  PolicyholderInputTaxDeductionEnum,
  PolicyholderComprehensiveInsuranceEnum,
  Witness,
  ClaimsdataHasVehicleDamageEnum,
  VehicleDriverDamagedCarImagesInner,
} from '../api';
import {
  CarclaimsDetailsState,
  DriverOfInsuranceHolderFormState,
  DriverOfOtherInsuranceHolderFormState,
  InjuredPeopleFormState,
  InsuranceHolderFormState,
  MiscellaneousDamagesFormState,
  OtherInsuranceHolderFormState,
  WitnessDetails,
} from '../types';
import { toApiDate, toApiTime } from './dateUtils';

function createImageBase64(
  imgsURL: string[] | undefined,
  files: Array<{ path?: string }> | undefined
): { file: string; path: string }[] {
  if (!imgsURL?.length) {
    return [];
  }

  return imgsURL.map((url: string, index: number) => {
    const base64Data = url.split(',')[1];

    return {
      file: base64Data,
      path: files?.[index]?.path || 'Hello',
    };
  });
}

function mapDamagedParts(damagedParts: string[]) {
  return damagedParts.map((place) => {
    switch (place) {
      case 'vorne links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.VorneLinks;
      case 'vorne rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.VorneRechts;
      case 'Seite vorne links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.SeiteVorneLinks;
      case 'Seite vorne rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.SeiteVorneRechts;
      case 'Seite hinten links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.SeiteHintenLinks;
      case 'Seite hinten rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.SeiteHintenRechts;
      case 'Fahrertür links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.FahrertrLinks;
      case 'Beifahrertür rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.BeifahrertrRechts;
      case 'hintere Tür links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.HintereTrLinks;
      case 'hintere Tür rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.HintereTrRechts;
      case 'hinten links':
        return VehicleDriverDriverDamagedpartsGraphicEnum.HintenLinks;
      case 'hinten rechts':
        return VehicleDriverDriverDamagedpartsGraphicEnum.HintenRechts;
      case 'Frontscheibe':
        return VehicleDriverDriverDamagedpartsGraphicEnum.Frontscheibe;
      case 'Heckscheibe':
        return VehicleDriverDriverDamagedpartsGraphicEnum.Heckscheibe;
      case 'Dach':
        return VehicleDriverDriverDamagedpartsGraphicEnum.Dach;
      case 'Motorhaube':
        return VehicleDriverDriverDamagedpartsGraphicEnum.Motorhaube;
      case 'Kofferraum':
        return VehicleDriverDriverDamagedpartsGraphicEnum.Kofferraum;
      default:
        return VehicleDriverDriverDamagedpartsGraphicEnum.Dach;
    }
  });
}

export function mapDTO(): Claimsdata {
  // Log Session Storage Objects
  // console.log('carclaimsDetails');
  // console.log(JSON.parse(sessionStorage.getItem('carclaimsDetails')!));
  // console.log('insurance-holder-a');
  // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-a')!));
  // console.log('driver-a');
  // console.log(JSON.parse(sessionStorage.getItem('driver-a')!));
  // console.log('injuredDetails');
  // console.log(JSON.parse(sessionStorage.getItem('injuredDetails')!));
  // console.log('miscellaneousDamages');
  // console.log(JSON.parse(sessionStorage.getItem('miscellaneousDamages')!));
  // console.log('insurance-holder-b');
  // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-b')!));
  // console.log('driver-b');
  // console.log(JSON.parse(sessionStorage.getItem('driver-b')!));
  // console.log('witness');
  // console.log(JSON.parse(sessionStorage.getItem('witness')!));

  // Objekte instanzieren
  let vehicleDriver: VehicleDriver = {};
  let otherVehicleDriver: VehicleDriver = {};
  let policyholder: Policyholder = {};
  let otherPolicyholder: Policyholder = {};
  let witness: Witness[] = [];
  //  Variablen instanzieren
  let existingWitness: string | undefined;
  let witnessesCount: string | undefined;

  //Driver A
  const driverHolderString = sessionStorage.getItem('driver-a');
  if (driverHolderString) {
    const {
      driverSalutation,
      driverHolderSurName,
      driverHolderName,
      driverHolderPostalCode,
      driverHolderPlace,
      driverHolderStreet,
      driverHolderStreetNr,
      driverHolderTelephone,
      driverHolderDriverLicense,
      driverHolderIssuer,
      driverHolderDamagePlace,
      driverHolderVisibleDamage,
      driverHolderNotes,
      victimReadyToDrive,
      whichDamageToVictim,
    }: DriverOfInsuranceHolderFormState = JSON.parse(driverHolderString);

    const driverDamagedpartsGraphic: VehicleDriverDriverDamagedpartsGraphicEnum[] =
      driverHolderDamagePlace ? mapDamagedParts(driverHolderDamagePlace) : [];

    const driverHolderFileUploads = JSON.parse(driverHolderString);
    const {
      imgsURL,
      files,
    }: {
      imgsURL: string[];
      files: File &
        {
          path?: string;
        }[];
    } = driverHolderFileUploads;

    const driverholderImgs: Array<VehicleDriverDamagedCarImagesInner> =
      createImageBase64(imgsURL, files);

    console.log('Driver A: ' + driverHolderDamagePlace);

    vehicleDriver = {
      personalInformation: {
        formOfAddress: (() => {
          switch (driverSalutation) {
            case 'Herr':
              return PersonFormOfAddressEnum.Herr;
            case 'Frau':
              return PersonFormOfAddressEnum.Frau;
            default:
              return PersonFormOfAddressEnum.NotSpecified;
          }
        })(),
        title: PersonTitleEnum.Dr, //Existiert nicht im Front End
        lastName: driverHolderSurName,
        firstName: driverHolderName,
        postalCode: driverHolderPostalCode,
        city: driverHolderPlace,
        streetName: driverHolderStreet,
        streetNumber: driverHolderStreetNr,
        phoneNumber: driverHolderTelephone,
        emailAddress: 'bob.brown@example.com', //Existiert nicht im Front End
      },
      driverLicensenumber: driverHolderDriverLicense,
      licenseIssuedBy: driverHolderIssuer,

      damagedCarImages: driverholderImgs,
      damagedWindowImages: [],
      driverDamagedpartsGraphic: driverDamagedpartsGraphic,
      driverVisibleDamage: driverHolderVisibleDamage,
      driverComments: driverHolderNotes,
      vehicleDrivingAbility: (() => {
        switch (victimReadyToDrive) {
          case 'Yes':
            return VehicleDriverVehicleDrivingAbilityEnum.True;
          case 'No':
            return VehicleDriverVehicleDrivingAbilityEnum.False;
          default:
            return VehicleDriverVehicleDrivingAbilityEnum.NotSpecified;
        }
      })(),
      damageCausedBy: (() => {
        switch (Number(whichDamageToVictim)) {
          case 1:
            return VehicleDriverDamageCausedByEnum.Auffahren;
          case 2:
            return VehicleDriverDamageCausedByEnum.RangierenParken;
          case 3:
            return VehicleDriverDamageCausedByEnum.MissachtungDerVorfahrt;
          case 4:
            return VehicleDriverDamageCausedByEnum.Abbiegen;
          case 5:
            return VehicleDriverDamageCausedByEnum.AbkommenVonDerFahrbahn;
          case 6:
            return VehicleDriverDamageCausedByEnum.Berholvorgang;
          case 7:
            return VehicleDriverDamageCausedByEnum.Spurwechsel;
          case 8:
            return VehicleDriverDamageCausedByEnum.Sonstiges;
          default:
            return VehicleDriverDamageCausedByEnum.Abbiegen;
        }
      })(),
      typeOfWildlife: 'Deer', //Existiert nicht im Front End
      certificateForWildlife: 'wildlife_certificate.pdf', //Existiert nicht im Front End
      garageLocation: 'Garage 1', //Existiert nicht im Front End
    };
  }
  //Driver B
  const driverHolderOtherString = sessionStorage.getItem('driver-b');
  if (driverHolderOtherString) {
    const driverHolderOther: DriverOfOtherInsuranceHolderFormState = JSON.parse(
      driverHolderOtherString
    );
    const {
      otherDriverSalutation,
      otherDriverHolderSurName,
      otherDriverHolderName,
      otherDriverHolderPostalCode,
      otherDriverHolderPlace,
      otherDriverHolderStreet,
      otherDriverHolderStreetNr,
      otherDriverHolderTelephone,
      otherDriverHolderDriverLicense,
      otherDriverHolderIssuer,
      otherDriverHolderDamagePlace,
      otherDriverHolderVisibleDamage,
      otherDriverHolderNotes,
      otherVictimReadyToDrive,
      otherWhichDamageToVictim,
    } = driverHolderOther;

    const driverDamagedpartsGraphic: VehicleDriverDriverDamagedpartsGraphicEnum[] =
      otherDriverHolderDamagePlace
        ? mapDamagedParts(otherDriverHolderDamagePlace)
        : [];

    const otherDriverHolderFileUploads = JSON.parse(driverHolderOtherString);
    const {
      imgsURL,
      files,
    }: {
      imgsURL: string[];
      files: File &
        {
          path?: string;
        }[];
    } = otherDriverHolderFileUploads;

    const otherDriverholderImgs: Array<VehicleDriverDamagedCarImagesInner> =
      createImageBase64(imgsURL, files);

    otherVehicleDriver = {
      personalInformation: {
        formOfAddress: (() => {
          switch (otherDriverSalutation) {
            case 'Herr':
              return PersonFormOfAddressEnum.Herr;
            case 'Frau':
              return PersonFormOfAddressEnum.Frau;
            default:
              return PersonFormOfAddressEnum.NotSpecified;
          }
        })(),
        title: PersonTitleEnum.Dr, //Existiert nicht im Front End
        lastName: otherDriverHolderSurName,
        firstName: otherDriverHolderName,
        postalCode: otherDriverHolderPostalCode,
        city: otherDriverHolderPlace,
        streetName: otherDriverHolderStreet,
        streetNumber: otherDriverHolderStreetNr,
        phoneNumber: otherDriverHolderTelephone,
        emailAddress: 'bob.brown@example.com', //Existiert nicht im Front End
      },
      driverLicensenumber: otherDriverHolderDriverLicense,
      licenseIssuedBy: otherDriverHolderIssuer,
      damagedCarImages: otherDriverholderImgs,
      damagedWindowImages: [], //Existiert nicht im Front End
      driverDamagedpartsGraphic: driverDamagedpartsGraphic,
      driverVisibleDamage: otherDriverHolderVisibleDamage,
      driverComments: otherDriverHolderNotes,
      vehicleDrivingAbility: (() => {
        switch (otherVictimReadyToDrive) {
          case 'Yes':
            return VehicleDriverVehicleDrivingAbilityEnum.True;
          case 'No':
            return VehicleDriverVehicleDrivingAbilityEnum.False;
          default:
            return VehicleDriverVehicleDrivingAbilityEnum.NotSpecified;
        }
      })(),
      damageCausedBy: (() => {
        switch (Number(otherWhichDamageToVictim)) {
          case 1:
            return VehicleDriverDamageCausedByEnum.Auffahren;
          case 2:
            return VehicleDriverDamageCausedByEnum.RangierenParken;
          case 3:
            return VehicleDriverDamageCausedByEnum.MissachtungDerVorfahrt;
          case 4:
            return VehicleDriverDamageCausedByEnum.Abbiegen;
          case 5:
            return VehicleDriverDamageCausedByEnum.AbkommenVonDerFahrbahn;
          case 6:
            return VehicleDriverDamageCausedByEnum.Berholvorgang;
          case 7:
            return VehicleDriverDamageCausedByEnum.Spurwechsel;
          case 8:
            return VehicleDriverDamageCausedByEnum.Sonstiges;
          default:
            return VehicleDriverDamageCausedByEnum.Abbiegen;
        }
      })(),
      typeOfWildlife: 'Deer', //Existiert nicht im Front End
      certificateForWildlife: 'wildlife_certificate.pdf', //Existiert nicht im Front End
      garageLocation: 'Garage 1', //Existiert nicht im Front End
    };
  }

  console.log('Driver A:', JSON.stringify(vehicleDriver, null, 2));

  //Policyholder A
  const insuranceHolderString = sessionStorage.getItem('insurance-holder-a');
  if (insuranceHolderString) {
    const insuranceHolder: InsuranceHolderFormState = JSON.parse(
      insuranceHolderString
    );
    const {
      insuranceHolderSalutation,
      insuranceHolderSurName,
      insuranceHolderName,
      insuranceHolderPostalCode,
      insuranceHolderPlace,
      insuranceHolderStreet,
      insuranceHolderStreetNr,
      insuranceHolderTelephone,
      insuranceHolderEmail,
      carBrand,
      carModel,
      licenseNumber,
      pretaxes,
      insuranceCompany,
      insuranceID,
      chassisNr,
      currentKM,
      greenCardNr,
      validDateGreenCard,
      allRiskInsurance,
    } = insuranceHolder;

    console.log('Normal: ' + allRiskInsurance);

    policyholder = {
      personalInformation: {
        formOfAddress: (() => {
          switch (insuranceHolderSalutation) {
            case 'Herr':
              return PersonFormOfAddressEnum.Herr;
            case 'Frau':
              return PersonFormOfAddressEnum.Frau;
            default:
              return PersonFormOfAddressEnum.NotSpecified;
          }
        })(),
        title: PersonTitleEnum.Dr, //Existiert nicht im Front End
        lastName: insuranceHolderSurName,
        firstName: insuranceHolderName,
        postalCode: insuranceHolderPostalCode,
        city: insuranceHolderPlace,
        streetName: insuranceHolderStreet,
        streetNumber: insuranceHolderStreetNr,
        phoneNumber: insuranceHolderTelephone,
        emailAddress: insuranceHolderEmail,
      },
      inputTaxDeduction: (() => {
        if (!pretaxes) {
          return PolicyholderInputTaxDeductionEnum.NotSpecified;
        }
        switch (Number(pretaxes)) {
          case 1:
            return PolicyholderInputTaxDeductionEnum.True;
          case 0:
            return PolicyholderInputTaxDeductionEnum.False;
          default:
            return PolicyholderInputTaxDeductionEnum.NotSpecified;
        }
      })(),
      vehicleMake: carBrand,
      vehicleType: carModel,
      vehicleReg: licenseNumber,
      insuranceCompany: insuranceCompany,
      policyNumber: insuranceID,
      vin: chassisNr,
      currentMileage: currentKM ? parseInt(currentKM) : undefined,
      greencardNumber: greenCardNr,
      greencardExpirydate: toApiDate(validDateGreenCard),
      comprehensiveInsurance: (() => {
        if (!allRiskInsurance) {
          return PolicyholderComprehensiveInsuranceEnum.NotSpecified;
        }
        switch (Number(allRiskInsurance)) {
          case 1:
            return PolicyholderComprehensiveInsuranceEnum.True;
          case 0:
            return PolicyholderComprehensiveInsuranceEnum.False;
          default:
            return PolicyholderComprehensiveInsuranceEnum.NotSpecified;
        }
      })(),
    };
  }
  //Policyholder B
  const otherInsuranceHolderString =
    sessionStorage.getItem('insurance-holder-b');
  if (otherInsuranceHolderString) {
    const otherInsuranceHolder: OtherInsuranceHolderFormState = JSON.parse(
      otherInsuranceHolderString
    );
    const {
      otherInsuranceHolderSalutation,
      otherInsuranceHolderSurName,
      otherInsuranceHolderName,
      otherInsuranceHolderPostalCode,
      otherInsuranceHolderPlace,
      otherInsuranceHolderStreet,
      otherInsuranceHolderStreetNr,
      otherInsuranceHolderTelephone,
      otherInsuranceHolderEmail,
      otherCarBrand,
      otherCarModel,
      otherLicenseNumber,
      otherPretaxes,
      otherInsuranceCompany,
      otherInsuranceID,
      otherChassisNr,
      otherCurrentKM,
      otherGreenCardNr,
      otherValidDateGreenCard,
      otherAllRiskInsurance,
    } = otherInsuranceHolder;

    console.log('OTHER: ' + otherAllRiskInsurance);

    otherPolicyholder = {
      personalInformation: {
        formOfAddress: (() => {
          switch (otherInsuranceHolderSalutation) {
            case 'Herr':
              return PersonFormOfAddressEnum.Herr;
            case 'Frau':
              return PersonFormOfAddressEnum.Frau;
            default:
              return PersonFormOfAddressEnum.NotSpecified;
          }
        })(),
        title: PersonTitleEnum.Dr, //Existiert nicht im Front End
        lastName: otherInsuranceHolderSurName,
        firstName: otherInsuranceHolderName,
        postalCode: otherInsuranceHolderPostalCode,
        city: otherInsuranceHolderPlace,
        streetName: otherInsuranceHolderStreet,
        streetNumber: otherInsuranceHolderStreetNr,
        phoneNumber: otherInsuranceHolderTelephone,
        emailAddress: otherInsuranceHolderEmail,
      },
      inputTaxDeduction: (() => {
        if (!otherPretaxes) {
          return PolicyholderInputTaxDeductionEnum.NotSpecified;
        }
        switch (Number(otherPretaxes)) {
          case 1:
            return PolicyholderInputTaxDeductionEnum.True;
          case 0:
            return PolicyholderInputTaxDeductionEnum.False;
          default:
            return PolicyholderInputTaxDeductionEnum.NotSpecified;
        }
      })(),
      vehicleMake: otherCarBrand,
      vehicleType: otherCarModel,
      vehicleReg: otherLicenseNumber,
      insuranceCompany: otherInsuranceCompany,
      policyNumber: otherInsuranceID,
      vin: otherChassisNr,
      currentMileage: otherCurrentKM ? parseInt(otherCurrentKM) : undefined,
      greencardNumber: otherGreenCardNr,
      greencardExpirydate: toApiDate(otherValidDateGreenCard),
      comprehensiveInsurance: (() => {
        if (!otherAllRiskInsurance) {
          return PolicyholderComprehensiveInsuranceEnum.NotSpecified;
        }
        switch (Number(otherAllRiskInsurance)) {
          case 1:
            return PolicyholderComprehensiveInsuranceEnum.True;
          case 0:
            return PolicyholderComprehensiveInsuranceEnum.False;
          default:
            return PolicyholderComprehensiveInsuranceEnum.NotSpecified;
        }
      })(),
    };
  }

  console.log('Policyholder A:', JSON.stringify(policyholder, null, 2));

  //Witness
  const witnessesString = sessionStorage.getItem('witness');
  if (witnessesString) {
    const witnessData = JSON.parse(witnessesString) as {
      witnesses?: WitnessDetails[];
      existingWitness?: string;
      witnessesCount?: number;
    };
    const witnesses = witnessData.witnesses ?? [];
    existingWitness = witnessData.existingWitness;
    witnessesCount = witnessData.witnessesCount?.toString();

    witness = witnesses.map((witness) => {
      return {
        personalInformation: {
          formOfAddress: (() => {
            switch (witness.salutation) {
              case 'Herr':
                return PersonFormOfAddressEnum.Herr;
              case 'Frau':
                return PersonFormOfAddressEnum.Frau;
              default:
                return PersonFormOfAddressEnum.NotSpecified;
            }
          })(),
          title: PersonTitleEnum.Dr, //Existiert nicht im Front End
          lastName: witness.surName,
          firstName: witness.lastName,
          postalCode: witness.postalCode,
          city: witness.place,
          streetName: witness.street,
          streetNumber: witness.houseNr,
          phoneNumber: witness.telephone,
          emailAddress: witness.email,
        },
      };
    });
  }

  //CarclaimsDetailsState
  let carclaimsDetails: CarclaimsDetailsState = {
    language: '',
    accidentDate: null,
    accidentTime: null,
    street: '',
    postalCode: '',
    place: '',
    houseNr: '',
    accidentDetails: '',
    processingNr: '',
  };

  const carclaimsDetailsString = sessionStorage.getItem('carclaimsDetails');
  if (carclaimsDetailsString) {
    carclaimsDetails = JSON.parse(carclaimsDetailsString);
  }

  const {
    language,
    accidentDate,
    accidentTime,
    street,
    postalCode,
    place,
    houseNr,
    accidentDetails,
    processingNr,
  } = carclaimsDetails;

  console.log('CarclaimsDetails: ' + language);

  // InjuredDetailsString
  let injuredDetails: InjuredPeopleFormState = {
    injured: '',
    injuredCount: undefined,
  };

  const injuredDetailsString = sessionStorage.getItem('injuredDetails');
  if (injuredDetailsString) {
    injuredDetails = JSON.parse(injuredDetailsString);
  }

  // MiscellaneousDamages
  let miscellaneousDamagesDetails: MiscellaneousDamagesFormState = {
    otherDamages: null,
    damages: '',
  };

  const miscellaneousDamagesString = sessionStorage.getItem(
    'miscellaneousDamages'
  );
  if (miscellaneousDamagesString) {
    miscellaneousDamagesDetails = JSON.parse(miscellaneousDamagesString);
  }

  //Body des API Requests
  const claimsdata: Claimsdata = {
    language: (() => {
      switch (language) {
        case 'DE':
          return ClaimsdataLanguageEnum.De;
        case 'EN':
          return ClaimsdataLanguageEnum.En;
        case 'FR':
          return ClaimsdataLanguageEnum.Fr;
        case 'ES':
          return ClaimsdataLanguageEnum.Es;
        case 'IT':
          return ClaimsdataLanguageEnum.It;
        case 'NL':
          return ClaimsdataLanguageEnum.Nl;
        case 'PL':
          return ClaimsdataLanguageEnum.Pl;
        default:
          return ClaimsdataLanguageEnum.De;
      }
    })(),
    accidentDate: toApiDate(accidentDate),
    accidentTime: toApiTime(accidentTime),
    accidentPostalCode: postalCode,
    accidentCity: place,
    accidentStreetName: street,
    accidentStreetNumber: houseNr,
    accidentDescription: accidentDetails,
    accidentPoliceNumber: processingNr,

    hasVehicleDamage: (() => {
      if (!miscellaneousDamagesDetails?.otherDamages) {
        return ClaimsdataHasVehicleDamageEnum.NotSpecified;
      }
      switch (Number(miscellaneousDamagesDetails.otherDamages)) {
        case 1:
          return ClaimsdataHasVehicleDamageEnum.True;
        case 0:
          return ClaimsdataHasVehicleDamageEnum.False;
        default:
          return ClaimsdataHasVehicleDamageEnum.NotSpecified;
      }
    })(),

    vehicleDamageDescription: miscellaneousDamagesDetails.damages,
    injuredPerson: (() => {
      if (!injuredDetails?.injured) {
        return ClaimsdataInjuredPersonEnum.NotSpecified;
      }
      switch (Number(injuredDetails.injured)) {
        case 1:
          return ClaimsdataInjuredPersonEnum.True;
        case 0:
          return ClaimsdataInjuredPersonEnum.False;
        default:
          return ClaimsdataInjuredPersonEnum.NotSpecified;
      }
    })(),
    injuredPersonNumber: injuredDetails.injuredCount?.toString(),
    witnessExists: (() => {
      if (!existingWitness) {
        return ClaimsdataWitnessExistsEnum.NotSpecified;
      }
      switch (Number(existingWitness)) {
        case 1:
          return ClaimsdataWitnessExistsEnum.True;
        case 0:
          return ClaimsdataWitnessExistsEnum.False;
        default:
          return ClaimsdataWitnessExistsEnum.NotSpecified;
      }
    })(),
    witnessCount: witnessesCount?.toString(),
    witness: witness,

    vehicleDriver: vehicleDriver,
    otherVehicleDriver: otherVehicleDriver,
    policyholder: policyholder,
    otherPolicyholder: otherPolicyholder,
  };

  return claimsdata;
}
