const dashboardRoutes: Record<string, string> = {
  'super-admin': '/admin/dashboard',
  manager: '/manager/dashboard',
  receptionist: '/receptionist/dashboard',
  'customer-care': '/customer-care/dashboard',
  'senior-customer-care': '/customer-care/dashboard',
  nurse: '/nurse/dashboard',
  'head-nurse': '/nurse/dashboard',
  'assistant-head-nurse': '/nurse/dashboard',
  matron: '/nurse/dashboard',
  doctor: '/doctor/dashboard',
  laboratory: '/laboratory/dashboard',
  pharmacist: '/pharmacist/dashboard',
  accountant: '/accountant/dashboard',
  hr: '/hr/dashboard',
  patient: '/patient/dashboard',
};

export function getDashboardRoute(role: string): string {
  return dashboardRoutes[role] || '/login';
}
