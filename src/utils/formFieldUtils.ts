import { TextFieldProps } from '@mui/material';
import dayjs from 'dayjs';

export function hasFieldValue(value: unknown): boolean {
  if (value == null || value === '') {
    return false;
  }

  if (dayjs.isDayjs(value)) {
    return value.isValid();
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function coerceTextFieldValue(value: unknown): string | number {
  if (value == null) {
    return '';
  }

  if (typeof value === 'number') {
    return value;
  }

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value.format('DD.MM.YYYY') : '';
  }

  return String(value);
}

export function withDatePickerInputProps(
  params: TextFieldProps,
  value: unknown
): TextFieldProps {
  const shrink =
    params.InputLabelProps?.shrink ??
    (hasFieldValue(value) || hasFieldValue(params.inputProps?.value));

  return {
    ...params,
    InputLabelProps: {
      ...params.InputLabelProps,
      shrink,
    },
  };
}
