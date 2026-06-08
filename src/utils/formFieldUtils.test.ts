import { hasFieldValue, coerceTextFieldValue } from './formFieldUtils';
import dayjs from 'dayjs';

describe('hasFieldValue', () => {
  it('returns false for empty values', () => {
    expect(hasFieldValue('')).toBe(false);
    expect(hasFieldValue(null)).toBe(false);
    expect(hasFieldValue(undefined)).toBe(false);
  });

  it('returns true for non-empty strings and arrays', () => {
    expect(hasFieldValue('Köln')).toBe(true);
    expect(hasFieldValue(['Front'])).toBe(true);
  });

  it('returns true for valid dayjs values', () => {
    expect(hasFieldValue(dayjs('2024-01-01'))).toBe(true);
  });
});

describe('coerceTextFieldValue', () => {
  it('coerces nullish values to empty string', () => {
    expect(coerceTextFieldValue(undefined)).toBe('');
    expect(coerceTextFieldValue(null)).toBe('');
  });

  it('preserves numbers', () => {
    expect(coerceTextFieldValue(50181)).toBe(50181);
  });
});
