import React from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import { MiscellaneousDamagesFormState } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useStepInitialValues } from '../../hooks';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';

const defaultMiscState: MiscellaneousDamagesFormState = {
  otherDamages: '',
  damages: '',
};

export function MiscellaneousDamagesForm() {
  const navigate = useNavigate();
  const initialValues = useStepInitialValues(
    'miscellaneousDamages',
    defaultMiscState
  );

  const handlePrev = () => navigate('/injured');

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      // validateOnChange
      // validate={(values) => {
      //   if (!values.damages)
      //     return {
      //       damages: 'Beschreibung fehlt',
      //     };
      //   if (values.otherDamages === '1' && values.damages) {
      //     if (values.damages === '')
      //       return {
      //         damages: 'Sachschäden fehlen',
      //       };

      //     if (values.damages.length < 10)
      //       return {
      //         damages: 'Beschreibung der Schäden zu kurz.',
      //       };
      //   }
      // }}
      onSubmit={(values) => {
        console.log(values);
        const string = JSON.stringify(values);
        sessionStorage.setItem('miscellaneousDamages', string);
        window.scrollTo(0, 0);
        navigate('/insurance-holder-b');
      }}
    >
      {({ errors, touched, handleChange, handleSubmit, values, setValues }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} id="other-damages">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="my-3">
                Gab es andere Sachschäden?
              </Typography>
              <FormControl fullWidth>
                <InputLabel>* Sachschaden?</InputLabel>
                <Field
                  name="otherDamages"
                  value={values.otherDamages}
                  component={CustomizedSelectForFormik}
                  defaultValue=""
                >
                  <MenuItem value={''} key={'damage-null'}></MenuItem>
                  <MenuItem value={'1'} key={'damage-yes'}>
                    Ja
                  </MenuItem>
                  <MenuItem value="0" key={'damage-none'}>
                    Nein
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            {values.otherDamages === '1' && (
              <>
                <Grid item xs={12} md={10}>
                  <Typography variant="caption">
                    Zum Beispiel: Straßenlampe gestoßen, Bauwerk beschädigt usw.
                  </Typography>
                  <TextField
                    className="mt-2"
                    multiline
                    rows={10}
                    onChange={handleChange}
                    name="damages"
                    label="Schäden"
                    value={values.damages}
                    fullWidth
                    helperText={
                      errors.damages &&
                      touched.damages && (
                        <span className="text-danger">{errors.damages}</span>
                      )
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <ButtonGroup>
                <Button color="error" variant="contained" onClick={handlePrev}>
                  Zurück
                </Button>
                <Button color="primary" variant="contained" type="submit">
                  Weiter
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <VoiceInputButton
            stepKey="miscellaneousDamages"
            currentState={values}
            onValuesMerged={(merged) => setValues({ ...values, ...merged })}
          />
        </form>
      )}
    </Formik>
  );
}
