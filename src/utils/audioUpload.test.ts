import { getAudioFilename, validateAudioBlob } from './audioUpload';

describe('getAudioFilename', () => {
  it('maps webm blobs to recording.webm', () => {
    expect(getAudioFilename(new Blob([], { type: 'audio/webm;codecs=opus' }))).toBe(
      'recording.webm'
    );
  });

  it('maps mp4 blobs to recording.m4a', () => {
    expect(getAudioFilename(new Blob([], { type: 'audio/mp4' }))).toBe('recording.m4a');
  });
});

describe('validateAudioBlob', () => {
  it('rejects empty or tiny blobs', () => {
    expect(validateAudioBlob(new Blob([], { type: 'audio/webm' }))).toMatch(/zu kurz/);
  });

  it('accepts blobs above the minimum size', () => {
    const blob = new Blob([new Uint8Array(2048)], { type: 'audio/webm' });
    expect(validateAudioBlob(blob)).toBeNull();
  });
});
