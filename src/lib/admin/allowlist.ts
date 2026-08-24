// Hard-coded admin allowlist. Until real auth + RBAC ships, the founder can
// access /admin by being listed here. Add founder emails as the team grows.
export const ADMIN_EMAILS: string[] = [
  "demo@sponsordesk.io",
  "founder@sponsordesk.io",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
