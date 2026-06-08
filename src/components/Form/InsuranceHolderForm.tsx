import React from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Field, Formik } from 'formik';
import { stackDirection, stackSpacing } from '../../config';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import dayjs from 'dayjs';
import { InsuranceHolderFormState } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useStepInitialValues } from '../../hooks';
import { FormTextField } from '../FormTextField';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';
import { withDatePickerInputProps } from '../../utils/formFieldUtils';

const defaultInsuranceHolderState: InsuranceHolderFormState = {
    allRiskInsurance: '',
    carBrand: '',
    carModel: '',
    chassisNr: '',
    currentKM: '',
    greenCardNr: '',
    insuranceCompany: '',
    insuranceHolderEmail: '',
    insuranceHolderName: '',
    insuranceHolderPlace: '',
    insuranceHolderPostalCode: '',
    insuranceHolderSalutation: '',
    insuranceHolderStreet: '',
    insuranceHolderStreetNr: '',
    insuranceHolderSurName: '',
    insuranceHolderTelephone: '',
    insuranceID: '',
    licenseNumber: '',
    pretaxes: '',
    validDateGreenCard: dayjs(),
};

export function InsuranceHolderForm() {
  const navigate = useNavigate();
  const initialValues = useStepInitialValues(
    'insurance-holder-a',
    defaultInsuranceHolderState
  );

  const handlePrev = () => navigate('/accident');

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log("InsuranceHolderForm -> values", values)
        const string = JSON.stringify(values);
        sessionStorage.setItem('insurance-holder-a', string);
        window.scrollTo(0, 0);
        navigate('/driver-of-insurance-holder-a');
      }}
    >
      {({ errors, values, handleChange, setValues, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid item container xs={12} id="insurance-holder">
            <Grid item xs={12}>
              <Typography variant="h4" className="mb-3">
                Angaben zum Versicherungsnehmer A
              </Typography>
              <Grid item xs={4} className="mb-3">
                <FormControl fullWidth>
                  <InputLabel>* Anrede</InputLabel>
                  <Field
                    id="insuranceHolderSalutation"
                    name="insuranceHolderSalutation"
                    component={CustomizedSelectForFormik}
                    defaultValue=""
                  >
                    <MenuItem key="insuranceHolder-none" value=""></MenuItem>
                    <MenuItem key="insuranceHolder-herr" value="Herr">
                      Herr
                    </MenuItem>
                    <MenuItem key="insuranceHolder-frau" value="Frau">
                      Frau
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="insuranceHolderName"
                    value={values.insuranceHolderName}
                    onChange={handleChange}
                    label="* Name"
                    fullWidth
                  />
                  <FormTextField
                    name="insuranceHolderSurName"
                    value={values.insuranceHolderSurName}
                    onChange={handleChange}
                    label="* Vorname"
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="insuranceHolderStreet"
                    value={values.insuranceHolderStreet}
                    onChange={handleChange}
                    label="* Straße"
                    fullWidth
                  />
                  <FormTextField
                    name="insuranceHolderStreetNr"
                    value={values.insuranceHolderStreetNr}
                    onChange={handleChange}
                    label="* Hausnummer"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="insuranceHolderPostalCode"
                    value={values.insuranceHolderPostalCode}
                    onChange={handleChange}
                    label="* Postleitzahl"
                  />
                  <FormTextField
                    name="insuranceHolderPlace"
                    value={values.insuranceHolderPlace}
                    onChange={handleChange}
                    label="* Ort"
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    type="tel"
                    name="insuranceHolderTelephone"
                    value={values.insuranceHolderTelephone}
                    onChange={handleChange}
                    label="Telefonnummer"
                    fullWidth
                  />
                  <FormTextField
                    type="email"
                    name="insuranceHolderEmail"
                    value={values.insuranceHolderEmail}
                    onChange={handleChange}
                    label="* Email"
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item md={4} xs={12} className="mb-3">
                <FormControl fullWidth>
                  <InputLabel>
                    Beteht Berechtigung zum Vorsteuerabzug?
                  </InputLabel>
                  <Field
                    name="pretaxes"
                    values={values.pretaxes}
                    component={CustomizedSelectForFormik}
                    defaultValue=""
                  >
                    <MenuItem key="pretaxes-none" value=""></MenuItem>
                    <MenuItem key="pretaxes-yes" value="1">
                      Ja
                    </MenuItem>
                    <MenuItem key="pretayes-no" value="0">
                      Nein
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    helperText="z.B.: Mercedes Benz, Audi etc."
                    label="* Automarke"
                    name="carBrand"
                    value={values.carBrand}
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormTextField
                    helperText="z.B.: CLA, A4 etc."
                    label="* Automodell"
                    name="carModel"
                    value={values.carModel}
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormTextField
                    helperText="z.B.: BGJ9854."
                    label="* Amtliches Kennzeichen"
                    name="licenseNumber"
                    value={values.licenseNumber}
                    onChange={handleChange}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="insuranceCompany"
                    value={values.insuranceCompany}
                    label="* Gesellschaft"
                    helperText="Name des Versicherungsgesellschaft"
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormTextField
                    name="insuranceID"
                    value={values.insuranceID}
                    label="* Versicherungsscheinnummer"
                    helperText="Identifikationsnummer der Versicherung"
                    onChange={handleChange}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="chassisNr"
                    value={values.chassisNr}
                    label="* Fahrgestellnummer"
                    helperText="Fahrzeugzulassung"
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormTextField
                    name="currentKM"
                    value={values.currentKM}
                    label="* Aktueller KM-Stand"
                    helperText="Siehe Tachometer des Autos"
                    onChange={handleChange}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={8} className="mb-3">
                <Stack direction={stackDirection} spacing={stackSpacing}>
                  <FormTextField
                    name="greenCardNr"
                    value={values.greenCardNr}
                    label="Nummer der Grünen Karte des Versicherers"
                    onChange={handleChange}
                    fullWidth
                  />
                  <LocalizationProvider
                    label="Gültig bis:"
                    dateAdapter={AdapterDayjs}
                    adapterLocale="de"
                  >
                    <MobileDatePicker
                      label="Gültig bis:"
                      value={values.validDateGreenCard}
                      onChange={(newValue) =>
                        setValues({
                          ...values,
                          validDateGreenCard: newValue,
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...withDatePickerInputProps(
                            params,
                            values.validDateGreenCard
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} className="mb-3">
                <FormControl fullWidth>
                  <InputLabel>Besteht eine Vollkaskoversicherung?</InputLabel>
                  <Field
                    name="allRiskInsurance"
                    value={values.allRiskInsurance}
                    component={CustomizedSelectForFormik}
                    defaultValue=""
                  >
                    <MenuItem key="allRiskInsurance-none" value=""></MenuItem>
                    <MenuItem key="allRiskInsraunce-yes" value="1">
                      Ja
                    </MenuItem>
                    <MenuItem key="allRiskInsrance-no" value="0">
                      Nein
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={handlePrev}
                  >
                    Zurück
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Weiter
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="insurance-holder-a"
            formValues={values}
            setFormValues={setValues}
          />
        </form>
      )}
    </Formik>
  );
}
