import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { coerceTextFieldValue, hasFieldValue } from '../utils/formFieldUtils';

export function FormTextField({
  value,
  InputLabelProps,
  placeholder,
  label,
  ...props
}: TextFieldProps) {
  const coercedValue = coerceTextFieldValue(value);
  const hasValue = hasFieldValue(value);
  const shrink =
    InputLabelProps?.shrink ?? (label ? hasValue : false);

  return (
    <TextField
      {...props}
      label={label}
      placeholder={hasValue ? undefined : placeholder}
      value={coercedValue}
      InputLabelProps={{
        ...InputLabelProps,
        shrink,
      }}
    />
  );
}
