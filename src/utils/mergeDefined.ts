function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergeDefined(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    if (sourceValue === undefined || sourceValue === null) {
      continue;
    }

    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = mergeDefined(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}
