import React, { useCallback, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Fab,
  Snackbar,
  Tooltip,
  keyframes,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { submitVoiceAudio } from '../../api/voiceApi';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { applyVoiceExtraction } from '../../mapping/applyVoiceExtraction';
import { buildVoiceCurrentState } from '../../mapping/buildVoiceCurrentState';
import { StepStorageKey } from '../../mapping/stepStorageKeys';

function getLanguageFromSession(): string | undefined {
  const details = sessionStorage.getItem('carclaimsDetails');
  if (!details) return undefined;

  try {
    const parsed = JSON.parse(details) as { language?: string };
    return parsed.language;
  } catch {
    return undefined;
  }
}

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.5); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
`;

export type VoiceInputButtonProps = {
  stepKey: StepStorageKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormValues: (values: any) => void;
  formValues: object;
  language?: string;
};

export function VoiceInputButton({
  stepKey,
  setFormValues,
  formValues,
  language,
}: VoiceInputButtonProps) {
  const formValuesRef = React.useRef<Record<string, unknown>>(
    formValues as Record<string, unknown>
  );
  formValuesRef.current = formValues as Record<string, unknown>;
  const {
    isRecording,
    audioBlob,
    error: recorderError,
    startRecording,
    stopRecording,
    reset,
  } = useAudioRecorder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const showMessage = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const submitAudio = useCallback(
    async (blob: Blob) => {
      setIsSubmitting(true);
      try {
        const response = await submitVoiceAudio(blob, {
          language: language ?? getLanguageFromSession(),
          stepKey,
          currentState: buildVoiceCurrentState(stepKey, formValuesRef.current),
        });
        const merged = applyVoiceExtraction(response, stepKey);
        setFormValues({ ...formValuesRef.current, ...merged });
        showMessage('Angaben übernommen', 'success');
        reset();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Spracherkennung fehlgeschlagen';
        showMessage(message, 'error');
      } finally {
        setIsSubmitting(false);
        setPendingSubmit(false);
      }
    },
    [language, stepKey, setFormValues, showMessage, reset]
  );

  const handleMicClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isSubmitting) return;
      await startRecording();
    },
    [isSubmitting, startRecording]
  );

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setPendingSubmit(false);
      reset();
    },
    [reset]
  );

  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isSubmitting) return;

      if (isRecording) {
        setPendingSubmit(true);
        stopRecording();
        return;
      }

      if (!audioBlob) return;
      submitAudio(audioBlob);
    },
    [isSubmitting, isRecording, audioBlob, stopRecording, submitAudio]
  );

  React.useEffect(() => {
    if (recorderError) {
      showMessage(recorderError, 'error');
    }
  }, [recorderError, showMessage]);

  React.useEffect(() => {
    if (pendingSubmit && audioBlob && !isRecording && !isSubmitting) {
      submitAudio(audioBlob);
    }
  }, [pendingSubmit, audioBlob, isRecording, isSubmitting, submitAudio]);

  const showSubmitButton = isRecording || (audioBlob !== null && !isSubmitting);
  const showCancelButton = isRecording || audioBlob !== null;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          zIndex: 1300,
        }}
      >
        {showCancelButton && (
          <Tooltip title="Aufnahme abbrechen">
            <Fab
              type="button"
              size="small"
              color="error"
              aria-label="Aufnahme abbrechen"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </Fab>
          </Tooltip>
        )}

        {showSubmitButton && (
          <Tooltip title={isRecording ? 'Aufnahme beenden und senden' : 'Sprachnachricht senden'}>
            <Fab
              type="button"
              size="medium"
              color="success"
              aria-label="Sprachnachricht senden"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <CheckIcon />
              )}
            </Fab>
          </Tooltip>
        )}

        <Tooltip title={isRecording ? 'Aufnahme läuft…' : 'Spracheingabe starten'}>
          <Fab
            type="button"
            color="primary"
            aria-label="Spracheingabe starten"
            onClick={handleMicClick}
            disabled={isRecording || isSubmitting}
            sx={
              isRecording
                ? { animation: `${pulse} 1.5s infinite` }
                : undefined
            }
          >
            <MicIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
