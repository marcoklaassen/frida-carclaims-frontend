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
  Tooltip,
} from '@mui/material';
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileTimePicker,
} from '@mui/x-date-pickers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Field, Formik, FormikProps } from 'formik';
import { Languages } from '../../config';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import { CarclaimsDetailsState } from '../../types';
import dayjs from 'dayjs';
import { useGetAddress, useStepInitialValues } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';
// import * as Yup from 'yup';

// const carclaimsDatailsValidator = Yup.object().shape({
//   language: Yup.string().required('Gesetzte Sprache erforderlich'),
//   accidentDate: Yup.date().required('Datum des Unfalls erforderlich'),
//   accidentTime: Yup.date().required('Zeit des Unfalls erforderlich'),
//   street: Yup.string()
//     .required('Straße des Unfallortes erforderlich')
//     .min(5, 'Mindestens 5 Zeichen erforderlich'),
//   postalCode: Yup.number()
//     .required('Postleitzahl erforderlich')
//     .typeError('Nur in Zahlenform'),
//   place: Yup.string()
//     .required('Ort der Unfallstelle erforderlich')
//     .min(3, 'Mindestens 3 Zeichen erforderlich'),
//   houseNr: Yup.string().required('Hausnummer erforderlich'),
//   accidentDetails: Yup.string(),
//   processNr: Yup.string(),
// });

const defaultCarclaimsDetails: CarclaimsDetailsState = {
  accidentDate: dayjs(),
  accidentTime: dayjs(),
  language: 'DE',
  street: '',
  houseNr: '',
  place: '',
  postalCode: '',
};

type CarclaimsDetailsFormContentProps = {
  formik: FormikProps<CarclaimsDetailsState>;
  loading: boolean;
  address: ReturnType<typeof useGetAddress>['address'];
  onGeolocation: () => void;
  onBack: () => void;
};

function CarclaimsDetailsFormContent({
  formik,
  loading,
  address,
  onGeolocation,
  onBack,
}: CarclaimsDetailsFormContentProps) {
  const { handleChange, handleSubmit, errors, touched, setValues, values } =
    formik;

  React.useEffect(() => {
    if (address) {
      setValues({
        ...values,
        street: address.address.road,
        houseNr: address.address.house_number,
        place: address.address.city,
        postalCode: address.address.postcode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} id="kfz-details" className="mb-3">
            <Grid item xs={12}>
              <Typography variant="h4" className="mb-3">
                Angaben zum Unfallort
              </Typography>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    * Sprache
                  </InputLabel>
                  <Field
                    id="language"
                    name="language"
                    component={CustomizedSelectForFormik}
                    defaultValue="DE"
                  >
                    {Languages.map((language, i) => (
                      <MenuItem value={language} key={`language-${i}`}>
                        {language}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.language && touched && <span>{errors.language}</span>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  className="mt-4 mb-2"
                  name="processingNr"
                  value={values.processingNr}
                  onChange={handleChange}
                  fullWidth
                  label="Bearbeitungs-Nr"
                  helperText="- von dem Unfallsbericht der Polizei"
                />
                {touched.processingNr && errors.processingNr && (
                  <span>{errors.processingNr}</span>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Stack
                className="my-2"
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                spacing={{ xs: 1, md: 2 }}
              >
                <LocalizationProvider
                  label="* Datum des Unfalls:"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="de"
                >
                  <MobileDatePicker
                    label="* Datum des Unfalls"
                    value={values.accidentDate}
                    onChange={(newValue) =>
                      setValues({
                        ...values,
                        accidentDate: newValue,
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {errors.accidentDate && touched.accidentDate && (
                    <span>{errors.accidentDate}</span>
                  )}
                </LocalizationProvider>
                <LocalizationProvider
                  label="* Uhrzeit des Unfalls"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="de"
                >
                  <MobileTimePicker
                    label="* Uhrzeit des Unfalls"
                    value={values.accidentTime}
                    onChange={(newValue) =>
                      setValues({
                        ...values,
                        accidentTime: newValue,
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {errors.accidentTime && touched.accidentTime && (
                    <span>{errors.accidentTime}</span>
                  )}
                </LocalizationProvider>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" className="mb-3">
                Wo ist der Schaden enststanden?
              </Typography>
              <Typography variant="body1" className="mb-5">
                Je genauer Sie den Ort angeben, umso schneller können wir Ihren
                Schaden erfassen.
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 1, md: 2 }}
              >
                <TextField
                  name="street"
                  id="street"
                  label="* Straße"
                  value={values.street}
                  onChange={handleChange}
                  fullWidth
                  helperText={
                    errors.street &&
                    touched.street && (
                      <span className="text-danger">{errors.street}</span>
                    )
                  }
                />
                <TextField
                  name="houseNr"
                  id="houseNr"
                  label="* Hausnummer"
                  value={values.houseNr}
                  onChange={handleChange}
                  helperText={
                    errors.houseNr &&
                    touched.houseNr && (
                      <span className="text-danger">{errors.houseNr}</span>
                    )
                  }
                />

                <Tooltip title="Geolocation erfassen">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onGeolocation}
                    disabled={loading}
                  >
                    <LocationOnIcon />
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 1, md: 2 }}
              >
                <TextField
                  name="postalCode"
                  id="postalCode"
                  label="* Postleitzahl"
                  value={values.postalCode}
                  onChange={handleChange}
                  helperText={
                    errors.postalCode &&
                    touched.postalCode && (
                      <span className="text-danger">{errors.postalCode}</span>
                    )
                  }
                />
                <TextField
                  name="place"
                  id="place"
                  label="* Ort"
                  value={values.place}
                  onChange={handleChange}
                  fullWidth
                  helperText={
                    errors.place &&
                    touched.place && (
                      <span className="text-danger">{errors.place}</span>
                    )
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                // color="neutral"
                multiline
                minRows={4}
                variant="outlined"
                placeholder="Beschreibung"
                fullWidth
                value={values.accidentDetails}
                name="accidentDetails"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="error"
                  onClick={onBack}
                >
                  Zurück
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  Weiter
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="carclaimsDetails"
            language={values.language}
            currentState={values}
            onValuesMerged={(merged) => setValues({ ...values, ...merged })}
          />
        </form>
  );
}

export function CarclaimsDetailsForm() {
  const initialValues = useStepInitialValues(
    'carclaimsDetails',
    defaultCarclaimsDetails
  );
  const { loading, address, handleClicked } = useGetAddress();
  const navigate = useNavigate();

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
        const string = JSON.stringify(values);
        sessionStorage.setItem('carclaimsDetails', string);
        window.scrollTo(0, 0);
        navigate('/insurance-holder-a');
      }}
    >
      {(formik) => (
        <CarclaimsDetailsFormContent
          formik={formik}
          loading={loading}
          address={address}
          onGeolocation={handleClicked}
          onBack={() => navigate('/')}
        />
      )}
    </Formik>
  );
}
