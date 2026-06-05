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
import { OtherInsuranceHolderFormState } from '../../types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useStepInitialValues } from '../../hooks';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';

const defaultOtherInsuranceHolderState: OtherInsuranceHolderFormState = {
  otherValidDateGreenCard: dayjs(),
};

export function OtherInsuranceHolderForm() {
  const navigate = useNavigate();
  const initialValues = useStepInitialValues(
    'insurance-holder-b',
    defaultOtherInsuranceHolderState
  );

  const handlePrev = () => navigate('/miscellaneous-damage');

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log("OtherInsuranceHolderForm -> values", values)
        const string = JSON.stringify(values);
        sessionStorage.setItem('insurance-holder-b', string);
        window.scrollTo(0, 0);
        navigate('/driver-of-insurance-holder-b');
      }}
    >
      {({ errors, values, handleSubmit, handleChange, setValues }) => (
        <form onSubmit={handleSubmit}>
          <Grid item xs={12} id="other-insurance-holder">
            <Typography variant="h4" className="mb-3">
              Angaben zum Versicherungsnehmer B
            </Typography>
            <Grid item xs={4} className="mb-3">
              <FormControl fullWidth>
                <InputLabel>* Anrede</InputLabel>
                <Field
                  id="otherInsuranceHolderSalutation"
                  name="otherInsuranceHolderSalutation"
                  component={CustomizedSelectForFormik}
                  defaultValue=""
                >
                  <MenuItem key="otherInsuranceHolder-none" value=""></MenuItem>
                  <MenuItem key="otherInsuranceHolder-herr" value="Herr">
                    Herr
                  </MenuItem>
                  <MenuItem key="otherInsuranceHolder-frau" value="Frau">
                    Frau
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherInsuranceHolderName"
                  value={values.otherInsuranceHolderName}
                  onChange={handleChange}
                  label="* Name"
                  fullWidth
                />
                <TextField
                  name="otherInsuranceHolderSurName"
                  value={values.otherInsuranceHolderSurName}
                  onChange={handleChange}
                  label="* Vorname"
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherInsuranceHolderStreet"
                  value={values.otherInsuranceHolderStreet}
                  onChange={handleChange}
                  label="* Straße"
                  fullWidth
                />
                <TextField
                  name="otherInsuranceHolderStreetNr"
                  value={values.otherInsuranceHolderStreetNr}
                  onChange={handleChange}
                  label="* Hausnummer"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherInsuranceHolderPostalCode"
                  value={values.otherInsuranceHolderPostalCode}
                  onChange={handleChange}
                  label="* Postleitzahl"
                />
                <TextField
                  name="otherInsuranceHolderPlace"
                  value={values.otherInsuranceHolderPlace}
                  onChange={handleChange}
                  label="* Ort"
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  type="tel"
                  name="otherInsuranceHolderTelephone"
                  value={values.otherInsuranceHolderTelephone}
                  onChange={handleChange}
                  label="* Telefonnummer"
                  fullWidth
                />
                <TextField
                  type="email"
                  name="otherInsuranceHolderEmail"
                  value={values.otherInsuranceHolderEmail}
                  onChange={handleChange}
                  label="* Email"
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12} className="mb-3">
              <FormControl fullWidth>
                <InputLabel>Besteht Berechtigung zum Vorsteuerabzug?</InputLabel>
                <Field
                  name="otherPretaxes"
                  values={values.otherPretaxes}
                  component={CustomizedSelectForFormik}
                  defaultValue=""
                >
                  <MenuItem key="other-pretaxes-none" value=""></MenuItem>
                  <MenuItem key="other-pretaxes-yes" value="1">
                    Ja
                  </MenuItem>
                  <MenuItem key="other-pretayes-no" value="0">
                    Nein
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  helperText="z.B.: Mercedes Benz, Audi etc."
                  label="* Automarke"
                  name="otherCarBrand"
                  value={values.otherCarBrand}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  helperText="z.B.: CLA, A4 etc."
                  label="* Automodell"
                  name="otherCarModel"
                  value={values.otherCarModel}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  helperText="z.B.: BGJ9854."
                  label="* Amtliches Kennzeichen"
                  name="otherLicenseNumber"
                  value={values.otherLicenseNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherInsuranceCompany"
                  value={values.otherInsuranceCompany}
                  label="* Gesellschaft"
                  helperText="Name des Versicherungsgesellschaft"
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="otherInsuranceID"
                  value={values.otherInsuranceID}
                  label="* Versicherungsscheinnummer"
                  helperText="Identifikationsnummer der Versicherung"
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherChassisNr"
                  value={values.otherChassisNr}
                  label="* Fahrgestellnummer"
                  helperText="Fahrzeugzulassung"
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="otherCurrentKM"
                  value={values.otherCurrentKM}
                  label="* Aktueller KM-Stand"
                  helperText="Siehe Tachometer des Autos"
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <TextField
                  name="otherGreenCardNr"
                  value={values.otherGreenCardNr}
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
                    value={values.otherValidDateGreenCard}
                    onChange={(newValue) =>
                      setValues({
                        ...values,
                        otherValidDateGreenCard: newValue,
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} className="mb-3">
              <FormControl fullWidth>
                <InputLabel>Besteht eine Vollkaskoversicherung?</InputLabel>
                <Field
                  name="otherAllRiskInsurance"
                  value={values.otherAllRiskInsurance}
                  component={CustomizedSelectForFormik}
                  defaultValue=""
                >
                  <MenuItem
                    key="other-allRiskInsurance-none"
                    value=""
                  ></MenuItem>
                  <MenuItem key="other-allRiskInsraunce-yes" value="1">
                    Ja
                  </MenuItem>
                  <MenuItem key="other-allRiskInsrance-no" value="0">
                    Nein
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup>
                <Button color="error" variant="contained" onClick={handlePrev}>
                  Zurück
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Weiter
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="insurance-holder-b"
            currentState={values}
            onValuesMerged={(merged) => setValues({ ...values, ...merged })}
          />
        </form>
      )}
    </Formik>
  );
}
