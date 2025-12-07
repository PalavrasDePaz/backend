export const normalizeDate = (
  value: string | Date | null | undefined
): Date | null => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};
