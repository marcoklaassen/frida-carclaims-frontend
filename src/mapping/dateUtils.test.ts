import dayjs from 'dayjs';
import { parseToDayjs, toApiDate, toApiTime } from './dateUtils';

describe('dateUtils', () => {
  it('returns null for empty and corrupt values', () => {
    expect(parseToDayjs(null)).toBeNull();
    expect(parseToDayjs('')).toBeNull();
    expect(parseToDayjs({})).toBeNull();
    expect(parseToDayjs(dayjs('invalid'))).toBeNull();
  });

  it('parses dayjs and ISO strings', () => {
    const now = dayjs('2026-06-05T10:15:00');
    expect(parseToDayjs(now)?.isValid()).toBe(true);
    expect(parseToDayjs('2026-06-05T10:15:00.000Z')?.isValid()).toBe(true);
  });

  it('converts valid values for mapDTO without throwing', () => {
    const date = toApiDate(dayjs('2026-06-05'));
    expect(date).toBeInstanceOf(Date);
    expect(date?.toISOString()).toContain('2026-06-05');

    expect(toApiDate(null)).toBeUndefined();
    expect(toApiDate({})).toBeUndefined();
    expect(toApiTime(dayjs('2026-06-05T14:30:00'))).toBe('14:30:00');
  });
});
