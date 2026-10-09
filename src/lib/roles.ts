// Nursing ranks share one portal and one permission set on the frontend.
// Mirrors middleware/auth.js on the backend.

export const NURSE_ROLES = ['nurse', 'head-nurse', 'assistant-head-nurse', 'matron'] as const;
export const NURSE_LEAD_ROLES = ['head-nurse', 'assistant-head-nurse', 'matron'] as const;

export const isNurseRole = (role?: string | null): boolean =>
  !!role && (NURSE_ROLES as readonly string[]).includes(role);

// heads of nursing (and the matron) may prescribe; bedside nurses may not
export const isNurseLead = (role?: string | null): boolean =>
  !!role && (NURSE_LEAD_ROLES as readonly string[]).includes(role);

// only these ranks see the "New prescription" button
export const canPrescribe = (role?: string | null): boolean =>
  role === 'super-admin' || role === 'manager' || role === 'doctor' || isNurseLead(role);

// portals route every nursing rank through the /nurse pages
export const portalRole = (role?: string | null): string => (isNurseRole(role) ? 'nurse' : role || '');
