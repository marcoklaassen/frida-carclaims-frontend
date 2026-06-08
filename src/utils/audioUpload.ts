const MIN_AUDIO_BYTES = 1024;

export function getAudioFilename(blob: Blob): string {
  const type = blob.type.toLowerCase();

  if (type.includes('mp4') || type.includes('m4a') || type.includes('aac')) {
    return 'recording.m4a';
  }
  if (type.includes('ogg')) {
    return 'recording.ogg';
  }
  if (type.includes('wav')) {
    return 'recording.wav';
  }
  if (type.includes('mpeg') || type.includes('mp3')) {
    return 'recording.mp3';
  }

  return 'recording.webm';
}

export function validateAudioBlob(blob: Blob): string | null {
  if (blob.size < MIN_AUDIO_BYTES) {
    return `Aufnahme zu kurz oder leer (${blob.size} Bytes). Bitte erneut sprechen.`;
  }
  return null;
}
