export type BillingBadge = { label: string; className: string };

const BADGES: Record<string, BillingBadge> = {
  Paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
  Pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  'No bills': { label: 'No bills', className: 'bg-gray-100 text-gray-600' },
};

const invoicePatientId = (inv: any): string =>
  String(inv?.patient?._id ?? inv?.patient ?? '');

const patientIdOf = (row: any): string => {
  const raw = row?.patient?._id ?? row?.patient ?? row?._id;
  return raw ? String(raw) : '';
};

// Paid = every active invoice for this patient was confirmed by Accounts.
// Pending = at least one invoice has not been marked paid yet.
// No bills = the patient has no invoices (nothing for Accounts to confirm).
export function billingBadge(row: any, invoices: any[]): BillingBadge {
  const id = patientIdOf(row);
  if (!id) return BADGES['No bills'];
  const own = (invoices || []).filter((inv) => invoicePatientId(inv) === id);
  const active = own.filter((inv) => inv?.status !== 'Cancelled');
  if (active.length === 0) return BADGES['No bills'];
  if (active.every((inv) => inv?.status === 'Paid')) return BADGES.Paid;
  return BADGES.Pending;
}
