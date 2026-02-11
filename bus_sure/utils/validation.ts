
// validation.ts
// Basic validation helpers

export function isValidAmount(amount: number): boolean {
  return amount > 0;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
