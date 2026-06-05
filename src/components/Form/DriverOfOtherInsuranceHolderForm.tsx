import React, { useState, useCallback, useMemo } from 'react';
import { useStepInitialValues } from '../../hooks';
import { VoiceInputButton } from '../VoiceInput/VoiceInputButton';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
  Autocomplete,
} from '@mui/material';
import { Field, Formik } from 'formik';
import {
  DamagedPlace,
  Decisions,
  Salutations,
  stackDirection,
  stackSpacing,
  TypesOfDamage,
} from '../../config';
import { CustomizedSelectForFormik } from '../CustomizedSelectForFormik';
import CarDamageImg from '../../assets/images/car-damage.png';
import {
  DriverOfOtherInsuranceHolderFormState,
  OtherInsuranceHolderFormState,
} from '../../types';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  rejectStyle,
  acceptStyle,
  focusedStyle,
  baseStyle,
} from '../HDIDropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export function DriverOfOtherInsuranceHolderForm() {
  const navigate = useNavigate();
  const [isInsuranceHolder, setInsuranceHolder] = useState<boolean>(false);
  const [files, setFiles] = useState<(File & { path?: string })[]>([]);
  const [imgsURL, setImgsUrl] = useState<string[]>([]);
  const handleDecisionChange = useCallback(
    (e: React.SyntheticEvent<Element, Event>, checked: string) => {
      if (checked === 'Yes') setInsuranceHolder(true);
      else setInsuranceHolder(false);
    },
    []
  );

  const onDrop = useCallback((acceptedFiles: (File & { path?: string })[]) => {
    setFiles((old) => [...old, ...acceptedFiles]);
    setImgsUrl((old) => [...old, ...acceptedFiles.map((f) => f.path!)]);
  }, []);

  const deleteFile = (index: number) => {
    const copy: (File & { path?: string })[] = structuredClone(files);
    copy.splice(index, 1);
    setFiles(copy);
    setImgsUrl(copy.map((f) => f.path!));
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        'image/png': ['png'],
        'image/jpeg': ['jpeg'],
        'image/jpg': ['jpg'],
      },
    });

  React.useEffect(() => {
    if (files.length > 0) {
      const promises = files.map((file, i) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function (e) {
            resolve(reader.result as string);
          };
        });
      });
      Promise.all(promises).then((urls) => {
        setImgsUrl(urls);
      });
    }
  }, [files]);

  const handlePrev = () => navigate('/insurance-holder-b');

  const storedValues = useStepInitialValues(
    'driver-b',
    {} as DriverOfOtherInsuranceHolderFormState
  );

  const initialState = useMemo(() => {
    let state: DriverOfOtherInsuranceHolderFormState = { ...storedValues };

    if (isInsuranceHolder) {
      const driverHolderString = sessionStorage.getItem('insurance-holder-b');
      if (driverHolderString) {
        const driverHolder: OtherInsuranceHolderFormState =
          JSON.parse(driverHolderString);
        const {
          otherInsuranceHolderSurName,
          otherInsuranceHolderName,
          otherInsuranceHolderPlace,
          otherInsuranceHolderPostalCode,
          otherInsuranceHolderTelephone,
          otherInsuranceHolderStreet,
          otherInsuranceHolderStreetNr,
          otherInsuranceHolderSalutation,
        } = driverHolder;
        state = {
          ...state,
          otherDriverHolderSurName: otherInsuranceHolderSurName,
          otherDriverSalutation: otherInsuranceHolderSalutation as
            | 'Herr'
            | 'Frau'
            | '',
          otherDriverHolderName: otherInsuranceHolderName,
          otherDriverHolderStreet: otherInsuranceHolderStreet,
          otherDriverHolderStreetNr: otherInsuranceHolderStreetNr,
          otherDriverHolderPostalCode: otherInsuranceHolderPostalCode,
          otherDriverHolderPlace: otherInsuranceHolderPlace,
          otherDriverHolderTelephone: otherInsuranceHolderTelephone,
        };
      }
    }

    return state;
  }, [storedValues, isInsuranceHolder]);

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      onSubmit={(values) => {
        const extendedValues = {
          ...values,
          files,
          imgsURL,
        };
        // console.log(JSON.parse(sessionStorage.getItem('carclaimsDetails')!));
        // console.log(JSON.parse(sessionStorage.getItem('injuredDetails')!));
        // console.log(
        //   JSON.parse(sessionStorage.getItem('miscellaneousDamages')!)
        // );
        // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-b')!));
        // console.log(JSON.parse(sessionStorage.getItem('driver-a')!));
        // console.log(JSON.parse(sessionStorage.getItem('insurance-holder-a')!));
        const string = JSON.stringify(extendedValues);
        sessionStorage.setItem('driver-b', string);
        window.scrollTo(0, 0);
        navigate('/witnesses');
      }}
    >
      {({ values, errors, handleSubmit, handleChange, setFieldValue, setValues }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1} id="other-driver-of-holder">
            <Typography variant="h6" className="mb-3">
              Angaben zum Fahrzeuglenker B
            </Typography>
            <Grid item xs={12} className="mb-3">
              <Typography variant="body1" className="mb-3">
                Ist der Fahrzeuglenker der Versicherungsnehmer?
              </Typography>
              <Field onChange={handleDecisionChange} component={RadioGroup}>
                {Decisions.map((dmg, i) => (
                  <FormControlLabel
                    value={dmg}
                    key={`isInsuranceHolder-${i}`}
                    control={<Radio />}
                    label={dmg === 'Yes' ? 'Ja' : 'Nein'}
                  />
                ))}
              </Field>
            </Grid>
            {!isInsuranceHolder && (
              <>
                <Grid item xs={12} md={8} className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel>* Anrede</InputLabel>
                    <Field
                      name="otherDriverSalutation"
                      values={values.otherDriverSalutation}
                      component={CustomizedSelectForFormik}
                      defaultValue=""
                    >
                      {Salutations.map((sal, i) => (
                        <MenuItem
                          key={`other-driverSalutations-${i}`}
                          value={sal}
                        >
                          {sal}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <TextField
                      name="otherDriverHolderName"
                      value={values.otherDriverHolderName}
                      label="* Name"
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      name="otherDriverHolderSurName"
                      value={values.otherDriverHolderSurName}
                      label="* Vorname"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <TextField
                      name="otherDriverHolderDriverLicense"
                      value={values.otherDriverHolderDriverLicense}
                      label="* Führerschein-Nr.:"
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      name="otherDriverHolderIssuer"
                      value={values.otherDriverHolderIssuer}
                      label="* Ausgestellt durch:"
                      helperText="zuständige Fahrzulassungsbehörde"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <TextField
                      name="otherDriverHolderStreet"
                      value={values.otherDriverHolderStreet}
                      onChange={handleChange}
                      label="* Straße"
                      fullWidth
                    />
                    <TextField
                      name="otherDriverHolderStreetNr"
                      value={values.otherDriverHolderStreetNr}
                      onChange={handleChange}
                      label="* Hausnummer"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <TextField
                      name="otherDriverHolderPostalCode"
                      value={values.otherDriverHolderPostalCode}
                      label="* Postleitzahl"
                      onChange={handleChange}
                    />
                    <TextField
                      name="otherDriverHolderPlace"
                      value={values.otherDriverHolderPlace}
                      label="* Ort"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction={stackDirection} spacing={stackSpacing}>
                    <TextField
                      type="tel"
                      name="otherDriverHolderTelephone"
                      value={values.otherDriverHolderTelephone}
                      onChange={handleChange}
                      label="Telefonnummer"
                      fullWidth
                      helperText="z.B.: 49/1767887954"
                    />
                  </Stack>
                </Grid>
              </>
            )}
            {isInsuranceHolder && (
              <>
                <Grid item xs={12} md={8} className="mb-3">
                  <Stack direction="column" spacing={stackSpacing}>
                    <b>Anrede: </b>{' '}
                    <p>
                      {values.otherDriverSalutation === 'Herr'
                        ? 'Herr'
                        : 'Frau'}{' '}
                    </p>
                    <b>Nach- und Vorname: </b>
                    <p>
                      {values.otherDriverHolderName},{' '}
                      {values.otherDriverHolderSurName}
                    </p>
                    <b>Anschrift: </b>
                    <p>
                      {values.otherDriverHolderStreet}{' '}
                      {values.otherDriverHolderStreetNr} <br />
                      {values.otherDriverHolderPostalCode}{' '}
                      {values.otherDriverHolderPlace}
                    </p>
                    <b>Kontaktdetails: </b>
                    <p>{values.otherDriverHolderTelephone}</p>
                  </Stack>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={8} className="mb-3">
              <Stack direction={stackDirection} spacing={stackSpacing}>
                <Grid item xs={12} md={4} className="mb-3">
                  <img src={CarDamageImg} alt="Placeholder" width="100%" />
                  <Typography variant="body2">
                    * Markieren Sie die Stelle, wo der Unfall passiert ist
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Autocomplete
                    multiple
                    id=""
                    options={DamagedPlace.map((option) => option.label)}
                    onChange={(event, value) =>
                      setFieldValue('otherDriverHolderDamagePlace', value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{ ...params.inputProps, readOnly: true }}
                        variant="outlined"
                        label="Markieren Sie die Unfallstellen"
                        placeholder="Unfallstellen"
                      />
                    )}
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <TextField
                multiline
                fullWidth
                minRows={4}
                variant="outlined"
                placeholder="Sichtbare Schäden"
                value={values.otherDriverHolderVisibleDamage}
                name="otherDriverHolderVisibleDamage"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <TextField
                minRows={4}
                variant="outlined"
                multiline
                placeholder="Bemerkungen"
                value={values.otherDriverHolderNotes}
                name="otherDriverHolderNotes"
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Typography variant="h6" className="mb-3">
                Anhänge
              </Typography>
              <Grid item xs={12}>
                <Grid item xs={12} className="img-attachment">
                  <div
                    {...getRootProps({
                      className: 'dropzone',
                      style: style as any,
                    })}
                  >
                    <input {...getInputProps()} />
                    <Stack direction="column">
                      <div className="text-center">
                        <AttachFileIcon />
                        <p>Bilder reinziehen oder auf Fläche klicken!</p>
                        <p>
                          Sie können auch nützliche Dokumente wie Führerschein
                          und Personalausweis hochladen.
                        </p>
                        <p>(akzeptierte Bildformate: JPG, JPEG, PNG)</p>
                      </div>
                    </Stack>
                  </div>
                  <div className="attached-images d-flex my-3">
                    {files?.map((file, i) => (
                      <div key={`attached-file-${i}`} className="mx-2">
                        <div className="d-flex flex-column jusitfy-content-center">
                          <img
                            src={imgsURL[i]}
                            height={100}
                            width="100"
                            style={{ objectFit: 'contain' }}
                            alt={`Uploaded attachment ${i + 1}`}
                            className="mx-auto"
                          />
                          <span className="d-flex justify-content-center my-1">
                            {file.path}
                          </span>
                          <Button
                            color="error"
                            variant="contained"
                            className="mt-2"
                            onClick={() => deleteFile(i)}
                          >
                            <DeleteIcon className="me-1" />
                            Löschen
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} className="mb-3">
              <Typography variant="body2">
                * Ist das Fahrzeug vom Beschädigten fahrbereit?
              </Typography>
              <FormControl>
                <RadioGroup
                  name="otherVictimReadyToDrive"
                  onChange={handleChange}
                >
                  {Decisions.map((dec, i) => (
                    <FormControlLabel
                      label={dec === 'Yes' ? 'Ja' : 'Nein'}
                      key={`other-victimReadyToDrive-${i}`}
                      value={dec}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Field
                name="otherVictimReadyToDrive"
                value={values.otherVictimReadyToDrive}
                onChange={handleChange}
                component={RadioGroup}
              ></Field>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body2">
                Wie kam es zu dem Schaden am Fahrzeug der beschädigten Person?
              </Typography>
              <FormControl>
                <RadioGroup
                  name="otherWhichDamageToVictim"
                  onChange={handleChange}
                >
                  {TypesOfDamage.map((dmg, i) => (
                    <FormControlLabel
                      label={dmg.label}
                      value={dmg.key}
                      key={`whichDamageToVictim-${i}`}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
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
            stepKey="driver-b"
            currentState={values}
            onValuesMerged={(merged) => setValues({ ...values, ...merged })}
          />
        </form>
      )}
    </Formik>
  );
}
