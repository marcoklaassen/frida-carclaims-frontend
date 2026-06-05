import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'stopped' | 'error';

const MIME_TYPES = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', ''];

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }
  return MIME_TYPES.find((type) => !type || MediaRecorder.isTypeSupported(type)) ?? '';
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('');

  const cleanupStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        const blob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current || 'audio/webm',
        });
        setAudioBlob(blob);
        setStatus('stopped');
        cleanupStream();
      };

      recorder.start();
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
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
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
