import React from 'react';
import {
  FormControl,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Field, FieldArray, Formik, FormikErrors } from 'formik';
import { stackDirection, stackSpacing } from '../../config';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import { WitnessesFormState } from '../../types';
import { useStepInitialValues } from '../../hooks';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';
import * as Yup from 'yup';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from 'react-router';
import { mapDTO } from '../../mapping/dtoMapper';
import { ClaimsApi, Claimsdata, CreateClaimByPIDRequest } from '../../api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const witnessesFormValidator = Yup.object().shape({
  exisingWitness: Yup.string().required('Musst gesetzt werden'),
  witnessesCount: Yup.number().when('existingWitness', (val, schema) => {
    console.log(val);
    if (val[0] === '1') {
      schema.lessThan(1, 'Zeugen fehlen');
      console.log(schema);
      return schema;
    }
    return schema;
  }),
  witnesses: Yup.array().of(
    Yup.object().shape({
      salutation: Yup.string().required('Anrede benötigt'),
      surName: Yup.string().required('Vorname benötigt'),
      lastName: Yup.string().required('Nachname benötigt'),
      street: Yup.string()
        .required('Straße benötigt')
        .min(10, 'Zeichen zu kurz'),
      houseNr: Yup.string().required('Hausnummer erforderlich'),
      postalCode: Yup.number().required('Postleitzahl benötigt'),
      place: Yup.string().required('Ort benötigt'),
      email: Yup.string()
        .email('Musst in Emailformat sein')
        .required('Email benötigt'),
    })
  ),
});

export async function sendClaimsdataRequest() {
  // Create Post Request
  const claimsdata: Claimsdata = mapDTO();
  const { policyNumber } = claimsdata.policyholder;

  const postRequest: CreateClaimByPIDRequest = {
    policyNumber: policyNumber!,
    claimsdata,
  };
  sessionStorage.setItem('claimsdataRequest', JSON.stringify(postRequest));
  // API Object
  const api: ClaimsApi = new ClaimsApi();

  return api.createClaimByPID(postRequest);
}

const defaultWitnessState: WitnessesFormState = {
  existingWitness: '',
  witnesses: [],
};

export function WitnessesForm() {
  const navigate = useNavigate();
  const initialValues = useStepInitialValues('witness', defaultWitnessState);

  async function sendClaimsdata() {
    sendClaimsdataRequest()
      .then((response: Claimsdata) => {
        // console.log('This is my Response: ' + JSON.stringify(response));
        sessionStorage.setItem('claimsdataResult', JSON.stringify(response));
        handleForward();
      })
      .catch((error) => {
        alert('Fehler beim Übermitteln der Schadendaten' + error);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePrev = () => navigate('/driver-of-insurance-holder-b');
  const handleForward = () => navigate('/results');
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        const string = JSON.stringify(values);
        sessionStorage.setItem('witness', string);
        // console.log(JSON.parse(sessionStorage.getItem('carclaimsDetails')!));
        // console.log(JSON.parse(sessionStorage.getItem('injuredDetails')!));
        // console.log(
        //   JSON.parse(sessionStorage.getItem('miscellaneousDamages')!)
        // );
        // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-b')!));
        // console.log(JSON.parse(sessionStorage.getItem('driver-b')!));
        // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-a')!));
        // console.log(values);
        // alert('Submit data');
        window.scrollTo(0, 0);
      }}
      // validationSchema={witnessesFormValidator}
    >
      {({ values, handleChange, handleSubmit, errors, touched, setValues }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} id="witness-container" className="mb-3">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="my-3">
                Gab es Zeugen?
              </Typography>
              <FormControl fullWidth>
                <InputLabel>* Zeugen?</InputLabel>
                <Field
                  name="existingWitness"
                  value={values.existingWitness}
                  component={CustomizedSelectForFormik}
                  defaultValue=""
                  onChange={handleChange}
                >
                  <MenuItem value={''} key={'witness-null'}></MenuItem>
                  <MenuItem value={'1'} key={'witness-yes'}>
                    Ja
                  </MenuItem>
                  <MenuItem value="0" key={'witness-none'}>
                    Nein
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            {values.existingWitness === '1' && (
              <>
                <Grid item xs={12} md={12}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="witnessesCount"
                      type="number"
                      onChange={handleChange}
                      label="Anzahl der Zeugen"
                      fullWidth
                      helperText={
                        errors.witnessesCount &&
                        touched.witnessesCount && (
                          <span className="text-danger">
                            {errors.witnessesCount}
                          </span>
                        )
                      }
                    />
                  </Grid>
                </Grid>
                {values.witnessesCount && values.witnessesCount > 0 && (
                  <FieldArray
                    name="witnesses"
                    render={(renderHelper) => {
                      const ArrayErrors = (
                        errors: FormikErrors<WitnessesFormState>
                      ) =>
                        typeof errors.witnesses === 'string' ? (
                          <div>{errors.witnesses}</div>
                        ) : null;
                      return (
                        <>
                          {Array.from(Array(values.witnessesCount))
                            .map((v) => ({
                              salutation: '',
                              surName: '',
                              lastName: '',
                              street: '',
                              houseNr: '',
                              postalCode: '',
                              place: '',
                              telephone: '',
                              email: '',
                            }))
                            .map((val, i) => (
                              <Grid
                                key={`witness-${i}`}
                                item
                                xs={12}
                                className="witness-details"
                              >
                                <Typography variant="body2" className="mb-3">
                                  Angaben zum Zeugen {`'${i + 1}'`}
                                </Typography>
                                <Grid item md={2} xs={12} className="mb-3">
                                  <FormControl fullWidth>
                                    <InputLabel>* Anrede?</InputLabel>
                                    <Field
                                      name={`witnesses[${i}].salutation`}
                                      // value={`witnesses[${i}].salutation`}
                                      component={CustomizedSelectForFormik}
                                      defaultValue=""
                                    >
                                      <MenuItem
                                        value={''}
                                        key={'witness-s-none'}
                                      ></MenuItem>
                                      <MenuItem
                                        value={'Herr'}
                                        key={'witness-m'}
                                      >
                                        Herr
                                      </MenuItem>
                                      <MenuItem value="Frau" key={'witness-f'}>
                                        Frau
                                      </MenuItem>
                                    </Field>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={8} className="mb-3">
                                  <Stack
                                    direction={stackDirection}
                                    spacing={stackSpacing}
                                  >
                                    <TextField
                                      label="* Name"
                                      name={`witnesses[${i}].lastName`}
                                      // value={`witnesses[${i}].lastName`}
                                      onChange={handleChange}
                                      fullWidth
                                    />
                                    <TextField
                                      label="* Vorname"
                                      name={`witnesses[${i}].surName`}
                                      // value={`witnesses[${i}].surname`}
                                      onChange={handleChange}
                                      fullWidth
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} md={8} className="mb-3">
                                  <Stack
                                    direction={stackDirection}
                                    spacing={stackSpacing}
                                  >
                                    <TextField
                                      label="* Straße"
                                      name={`witnesses[${i}].street`}
                                      onChange={handleChange}
                                      // value={`witnesses[${i}].street`}
                                      fullWidth
                                    />
                                    <TextField
                                      label="* Hausnummer"
                                      name={`witnesses[${i}].houseNr`}
                                      onChange={handleChange}
                                      // value={`witnesses[${i}].houseNr`}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} md={8} className="mb-3">
                                  <Stack
                                    direction={stackDirection}
                                    spacing={stackSpacing}
                                  >
                                    <TextField
                                      label="* Postleitzahl"
                                      name={`witnesses[${i}].postalCode`}
                                      onChange={handleChange}
                                      // value={`witnesses[${i}].postalCode`}
                                    />
                                    <TextField
                                      label="* Ort"
                                      name={`witnesses[${i}].place`}
                                      onChange={handleChange}
                                      // value={`witnesses[${i}].place`}
                                      fullWidth
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} md={8} className="mb-3">
                                  <Stack
                                    direction={stackDirection}
                                    spacing={stackSpacing}
                                  >
                                    <TextField
                                      label="* Email"
                                      type="email"
                                      // value={`witnesses[${i}].email`}
                                      name={`witnesses[${i}].email`}
                                      onChange={handleChange}
                                      fullWidth
                                    />
                                    <TextField
                                      label="* Telefonnummer"
                                      type="tel"
                                      name={`witnesses[${i}].telephone`}
                                      // value={`witnesses[${i}].telephone`}
                                      onChange={handleChange}
                                      fullWidth
                                    />
                                  </Stack>
                                </Grid>
                                <ArrayErrors {...errors} />
                              </Grid>
                            ))}
                        </>
                      );
                    }}
                  />
                )}
              </>
            )}
            <Grid item xs={12}>
              <ButtonGroup>
                <Button variant="contained" color="error" onClick={handlePrev}>
                  Zurück
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendClaimsdata}
                  type="submit"
                >
                  Senden
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="witness"
            currentState={values}
            onValuesMerged={(merged) => setValues({ ...values, ...merged })}
          />
        </form>
      )}
    </Formik>
  );
}
