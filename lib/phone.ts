/** Georgian mobile numbers: +995 followed by 9 digits starting with 5. */
export const GE_PREFIX = "+995";

/** Keeps digits only, drops a pasted +995/995 prefix, and caps at 9 digits. */
export function normalizeGeorgianMobile(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("995") && digits.length > 9) digits = digits.slice(3);
  return digits.slice(0, 9);
}

/** "5XX XX XX XX" grouping for display while typing. */
export function formatGeorgianMobile(digits: string): string {
  const d = normalizeGeorgianMobile(digits);
  return [d.slice(0, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

export function isValidGeorgianMobile(input: string): boolean {
  return /^5\d{8}$/.test(normalizeGeorgianMobile(input));
}

/** E.164 form, e.g. "+995574077779", or null when invalid. */
export function toE164(input: string): string | null {
  return isValidGeorgianMobile(input) ? `${GE_PREFIX}${normalizeGeorgianMobile(input)}` : null;
}
