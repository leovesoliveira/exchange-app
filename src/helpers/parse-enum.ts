export function parseEnum<T extends Record<string, string | number>>(
  enumObj: T,
  value: unknown,
): T[keyof T] {
  if (!Object.values(enumObj).includes(value as T[keyof T])) {
    throw new Error(`'${value}' value is invalid`);
  }

  return value as T[keyof T];
}
