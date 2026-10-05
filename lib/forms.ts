/** The demo quote form's only check. Nothing is saved or sent: the form ends in the reveal. */
export function zipError(value: string): string | null {
  return /^\d{5}$/.test(value.trim()) ? null : "Please enter a 5-digit ZIP code.";
}
