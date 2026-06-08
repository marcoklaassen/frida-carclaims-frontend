import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'stopped' | 'error';

// Prefer opus-in-webm; plain audio/webm is last because some browsers produce bad containers.
const MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
] as const;

const RECORDING_TIMESLICE_MS = 250;
const MIN_RECORDING_MS = 500;

export function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }

  for (const type of MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return '';
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('');
  const startedAtRef = useRef<number>(0);

  const cleanupStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startedAtRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    chunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setError(
        'Audioaufnahme wird von diesem Browser nicht unterstützt. Bitte HTTPS oder localhost verwenden.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const durationMs = Date.now() - startedAtRef.current;
        const blobType = mimeTypeRef.current || chunksRef.current[0]?.type || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: blobType });

        if (durationMs < MIN_RECORDING_MS || blob.size < 1024) {
          setError(
            'Aufnahme zu kurz oder ohne Audiodaten. Bitte länger sprechen und erneut versuchen.'
          );
          setStatus('error');
        } else {
          setAudioBlob(blob);
          setStatus('stopped');
        }

        cleanupStream();
      };

      recorder.onerror = () => {
        cleanupStream();
        setStatus('error');
        setError('Aufnahme fehlgeschlagen. Bitte erneut versuchen.');
      };

      startedAtRef.current = Date.now();
      recorder.start(RECORDING_TIMESLICE_MS);
      setStatus('recording');
    } catch {
      cleanupStream();
      setStatus('error');
      setError(
        'Mikrofonzugriff verweigert oder nicht verfügbar. Bitte Berechtigung erteilen.'
      );
    }
  }, [cleanupStream]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return;
    }

    // Flush any buffered audio before finalizing the container.
    if (typeof recorder.requestData === 'function') {
      recorder.requestData();
    }
    recorder.stop();
  }, []);

  const reset = useCallback(() => {
    cleanupStream();
    setAudioBlob(null);
    setError(null);
    setStatus('idle');
  }, [cleanupStream]);

  return {
    status,
    isRecording: status === 'recording',
    audioBlob,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}
