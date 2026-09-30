/** Minimale className-helper (geen extra dependency nodig). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
