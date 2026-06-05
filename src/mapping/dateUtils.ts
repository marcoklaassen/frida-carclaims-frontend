import dayjs, { Dayjs } from 'dayjs';

export function parseToDayjs(value: unknown): Dayjs | null {
  if (value == null || value === '') {
    return null;
  }

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value : null;
  }

  if (typeof value === 'string' || value instanceof Date) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  return null;
}

export function toApiDate(value: unknown): Date | undefined {
  const parsed = parseToDayjs(value);
  return parsed ? parsed.toDate() : undefined;
}

export function toApiTime(value: unknown): string | undefined {
  const parsed = parseToDayjs(value);
  return parsed ? parsed.format('HH:mm:ss') : undefined;
}

export function toIsoString(value: unknown): string | undefined {
  const parsed = parseToDayjs(value);
  return parsed ? parsed.toISOString() : undefined;
}
