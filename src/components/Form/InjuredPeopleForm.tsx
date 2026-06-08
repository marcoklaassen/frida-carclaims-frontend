import React from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { stackDirection, stackSpacing } from '../../config';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import { InjuredPeopleFormState } from '../../types';
import { ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStepInitialValues } from '../../hooks';
import { FormTextField } from '../FormTextField';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';

const defaultInjuredState: InjuredPeopleFormState = {};

export function InjuredPeopleForm() {
  const navigate = useNavigate();
  const initialValues = useStepInitialValues('injuredDetails', defaultInjuredState);

  const handleBack = () => navigate('/driver-of-insurance-holder-a');
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
        const string = JSON.stringify(values);
        sessionStorage.setItem('injuredDetails', string);
        window.scrollTo(0, 0);
        navigate('/miscellaneous-damage');
      }}
      // validateOnChange
      // validate={(values) => {
      //   if (values.injured === '1') {
      //     if (!values.injuredCount || isNaN(values.injuredCount!)) {
      //       return {
      //         injuredCount: 'Kein Zahl gesetzt',
      //       };
      //     }
      //   }
      // }}
    >
      {({ values, handleChange, handleSubmit, errors, touched, setValues }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} id="injured-container">
            <Grid item xs={12}>
              <Grid item md={4}>
                <Typography variant="h6" className="my-3">
                  Gab es Verletzte?
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>* Verletzte</InputLabel>
                  <Field
                    name="injured"
                    value={values.injured}
                    component={CustomizedSelectForFormik}
                    defaultValue=""
                  >
                    <MenuItem value={''} key={'injured-null'}></MenuItem>
                    <MenuItem value={'1'} key={'injured-yes'}>
                      Ja
                    </MenuItem>
                    <MenuItem value="0" key={'injured-none'}>
                      Nein
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
            {values.injured === '1' && (
              <>
                <Grid item xs={12} md={8}>
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <FormTextField
                      label="* Anzahl der Verletzte"
                      value={values.injuredCount}
                      onChange={handleChange}
                      name="injuredCount"
                      type="number"
                      helperText={
                        errors.injuredCount &&
                        touched.injuredCount && (
                          <span className="text-danger">
                            {errors.injuredCount}
                          </span>
                        )
                      }
                    />
                  </Stack>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <ButtonGroup>
                <Button color="error" variant="contained" onClick={handleBack}>
                  Zurück
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Weiter
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="injuredDetails"
            formValues={values}
            setFormValues={setValues}
          />
        </form>
      )}
    </Formik>
  );
}
