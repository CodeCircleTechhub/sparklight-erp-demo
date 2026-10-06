import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  ClipboardList,
  FileText,
  Pill,
  FlaskConical,
  CreditCard,
  BarChart3,
  Settings,
  ClipboardCheck,
  DollarSign,
  User,
  History,
  Bell,
  UserPlus,
  Search,
  ListOrdered,
  MessageCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Activity,
  BedDouble,
  Heart,
  Building,
  Scan,
  CalendarCheck,
  LogOut,
  Clock,
  Loader,
  FolderOpen,
  Package,
  CheckCircle,
  Truck,
  Receipt,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Wallet,
  Calendar,
  Briefcase,
  FileCheck,
  UserSearch,
  TestTube,
  CalendarOff,
  KeyRound,
} from 'lucide-react';
import Logo from '../logo/Logo';
import type { LucideIcon } from 'lucide-react';

export type UserRole =
  | 'super-admin'
  | 'manager'
  | 'receptionist'
  | 'customer-care'
  | 'senior-customer-care'
  | 'nurse'
  | 'doctor'
  | 'laboratory'
  | 'pharmacist'
  | 'accountant'
  | 'hr'
  | 'patient';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  children?: { label: string; to: string }[];
}

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

// receptionist and customer care are the same person — one merged front-desk menu
const frontDeskNav: NavItem[] = [
  { label: 'Front Desk Dashboard', to: '/receptionist/dashboard', icon: LayoutDashboard },
  { label: 'Customer Care Dashboard', to: '/customer-care/dashboard', icon: Users },
  { label: 'Register Patient', to: '/receptionist/register-patient', icon: UserPlus },
  { label: 'Patient Search', to: '/receptionist/patient-search', icon: Search },
  { label: 'Patient Visits', to: '/receptionist/patient-visits', icon: ClipboardList },
  { label: 'Front Desk Appointments', to: '/receptionist/appointments', icon: Calendar },
  { label: 'Queue Management', to: '/receptionist/queue', icon: ListOrdered },
  { label: 'Patient Documents', to: '/receptionist/documents', icon: FileText },
  { label: 'Room Allocation', to: '/receptionist/allocation', icon: BedDouble },
  { label: 'Cases (View Only)', to: '/receptionist/cases', icon: ClipboardCheck },
  { label: 'Case Management', to: '/customer-care/cases', icon: ClipboardList },
  { label: 'Escalations', to: '/customer-care/escalations', icon: AlertTriangle },
  { label: 'Internal Requests', to: '/customer-care/internal-requests', icon: FolderOpen },
  { label: 'Patients & Balances', to: '/customer-care/patients', icon: Users },
  { label: 'Discharged Patients', to: '/customer-care/discharged', icon: LogOut },
  { label: 'Patient Enquiries', to: '/customer-care/enquiries', icon: MessageCircle },
  { label: 'Complaints', to: '/customer-care/complaints', icon: AlertCircle },
  { label: 'Feedback', to: '/customer-care/feedback', icon: Star },
  { label: 'Care Appointments', to: '/customer-care/appointments', icon: CalendarCheck },
  { label: 'Patient Communication', to: '/customer-care/communication', icon: MessageSquare },
  { label: 'My Leave', to: '/receptionist/my-leave', icon: CalendarOff },
  { label: 'Notifications', to: '/receptionist/notifications', icon: Bell },
  { label: 'Send Patient Notice', to: '/customer-care/notifications', icon: Bell },
  { label: 'Chat', to: '/chat', icon: MessageSquare },
];

const navConfig: Record<UserRole, NavItem[]> = {
  'super-admin': [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    {
      label: 'Patients',
      to: '/admin/patients',
      icon: Users,
      children: [
        { label: 'All Patients', to: '/admin/patients' },
        { label: 'Register Patient', to: '/admin/patients/register' },
        { label: 'Patient Visits', to: '/admin/patients/visits' },
        { label: 'Discharged Patients', to: '/admin/discharged' },
      ],
    },
    {
      label: 'Appointments',
      to: '/admin/appointments',
      icon: Calendar,
      children: [
        { label: 'All Appointments', to: '/admin/appointments' },
        { label: "Today's Appointments", to: '/admin/appointments/today' },
        { label: 'Queue', to: '/admin/queue' },
      ],
    },
    { label: 'Ward & Bed Allocation', to: '/admin/wards', icon: BedDouble },
    {
      label: 'Staff Management',
      to: '/admin/staff',
      icon: UserCog,
      children: [
        { label: 'All Staff', to: '/admin/staff' },
        { label: 'Add Staff', to: '/admin/staff/add' },
        { label: 'Staff Roles', to: '/admin/staff/roles' },
      ],
    },
    {
      label: 'Clinical',
      to: '/admin/clinical',
      icon: Stethoscope,
      children: [
        { label: 'Consultations', to: '/admin/clinical/consultations' },
        { label: 'Diagnoses', to: '/admin/clinical/diagnoses' },
        { label: 'Medical Records', to: '/admin/clinical/records' },
        { label: 'Prescriptions', to: '/admin/clinical/prescriptions' },
      ],
    },
    { label: 'Laboratory', to: '/admin/laboratory', icon: FlaskConical },
    { label: 'Pharmacy', to: '/admin/pharmacy', icon: Pill },
    {
      label: 'Billing',
      to: '/admin/billing',
      icon: CreditCard,
      children: [
        { label: 'Invoices', to: '/admin/billing/invoices' },
        { label: 'Payments', to: '/admin/billing/payments' },
        { label: 'Outstanding', to: '/admin/billing/outstanding' },
      ],
    },
    {
      label: 'HR',
      to: '/admin/hr',
      icon: Briefcase,
      children: [
        { label: 'Employees', to: '/admin/hr/employees' },
        { label: 'Attendance', to: '/admin/hr/attendance' },
        { label: 'Leave', to: '/admin/hr/leave' },
        { label: 'Payroll', to: '/admin/hr/payroll' },
        ],
    },
    { label: 'My Leave', to: '/admin/my-leave', icon: CalendarOff },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: FileCheck },
    { label: 'Escalations', to: '/admin/escalations', icon: AlertTriangle },
    { label: 'Internal Requests', to: '/admin/internal-requests', icon: ClipboardList },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
    { label: 'Notifications', to: '/admin/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  manager: [
    { label: 'Dashboard', to: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Patients', to: '/manager/patients', icon: Users },
    { label: 'Discharged Patients', to: '/manager/discharged', icon: LogOut },
    { label: 'Visits', to: '/manager/visits', icon: ClipboardList },
    { label: 'Appointments', to: '/manager/appointments', icon: Calendar },
    { label: 'Queue', to: '/manager/queue', icon: ListOrdered },
    { label: 'Ward & Bed Allocation', to: '/manager/wards', icon: BedDouble },
    { label: 'Staff', to: '/manager/staff', icon: UserCog },
    { label: 'Clinical Overview', to: '/manager/clinical', icon: Stethoscope },
    { label: 'Pharmacy', to: '/manager/pharmacy', icon: Pill },
    { label: 'Laboratory', to: '/manager/laboratory', icon: FlaskConical },
    { label: 'Billing', to: '/manager/billing', icon: CreditCard },
    { label: 'HR', to: '/manager/hr', icon: Briefcase },
    { label: 'Leave', to: '/manager/hr/leave', icon: CalendarCheck },
    { label: 'My Leave', to: '/manager/my-leave', icon: CalendarOff },
    { label: 'Escalations', to: '/manager/escalations', icon: AlertTriangle },
    { label: 'Internal Requests', to: '/manager/internal-requests', icon: ClipboardList },
    { label: 'Reports', to: '/manager/reports', icon: BarChart3 },
    { label: 'Notifications', to: '/manager/notifications', icon: Bell },
    { label: 'Hospital Settings', to: '/manager/settings', icon: Settings },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  receptionist: frontDeskNav,
  'customer-care': frontDeskNav,
  'senior-customer-care': frontDeskNav,
  nurse: [
    { label: 'Dashboard', to: '/nurse/dashboard', icon: LayoutDashboard },
    { label: 'My Patients', to: '/nurse/my-patients', icon: Heart },
    { label: 'All Patients', to: '/nurse/patients', icon: Users },
    { label: 'Patient Queue', to: '/nurse/queue', icon: ListOrdered },
    { label: 'Vital Signs', to: '/nurse/vital-signs', icon: Activity },
    { label: 'Nursing Notes', to: '/nurse/notes', icon: FileText },
    { label: 'Admissions', to: '/nurse/admissions', icon: BedDouble },
    { label: 'Ward & Beds', to: '/nurse/ward', icon: Building },
    { label: 'Medication Tasks', to: '/nurse/medications', icon: Pill },
    { label: 'Prescriptions', to: '/nurse/prescriptions', icon: ClipboardList },
    { label: 'Billing History', to: '/nurse/billing-history', icon: Receipt },
    { label: 'My Leave', to: '/nurse/my-leave', icon: CalendarOff },
    { label: 'Notifications', to: '/nurse/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  doctor: [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'My Patients', to: '/doctor/my-patients', icon: User },
    { label: 'All Patients', to: '/doctor/patients', icon: Users },
    { label: 'Patient Queue', to: '/doctor/queue', icon: ListOrdered },
    { label: 'Consultations', to: '/doctor/consultations', icon: Stethoscope },
    { label: 'Medical Records', to: '/doctor/records', icon: FileText },
    { label: 'Diagnosis', to: '/doctor/diagnosis', icon: ClipboardCheck },
    { label: 'Prescriptions', to: '/doctor/prescriptions', icon: Pill },
    { label: 'Laboratory Requests', to: '/doctor/lab-requests', icon: FlaskConical },
    { label: 'Imaging Requests', to: '/doctor/imaging', icon: Scan },
    { label: 'Follow-ups', to: '/doctor/follow-ups', icon: CalendarCheck },
    { label: 'Admission & Ward', to: '/doctor/admission', icon: BedDouble },
    { label: 'Admitted Patients', to: '/doctor/admissions', icon: Activity },
    { label: 'Discharge', to: '/doctor/discharge', icon: LogOut },
    { label: 'Billing History', to: '/doctor/billing-history', icon: Receipt },
    { label: 'My Leave', to: '/doctor/my-leave', icon: CalendarOff },
    { label: 'Notifications', to: '/doctor/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  laboratory: [
    { label: 'Dashboard', to: '/laboratory/dashboard', icon: LayoutDashboard },
    { label: 'Test Requests', to: '/laboratory/test-requests', icon: ClipboardList },
    { label: 'Pending Tests', to: '/laboratory/pending', icon: Clock },
    { label: 'Sample Collection', to: '/laboratory/samples', icon: TestTube },
    { label: 'Processing', to: '/laboratory/processing', icon: Loader },
    { label: 'Results', to: '/laboratory/results', icon: FileCheck },
    { label: 'Test Categories', to: '/laboratory/categories', icon: FolderOpen },
    { label: 'Lab Reports', to: '/laboratory/reports', icon: BarChart3 },
    { label: 'My Leave', to: '/laboratory/my-leave', icon: CalendarOff },
    { label: 'Notifications', to: '/laboratory/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  pharmacist: [
    { label: 'Dashboard', to: '/pharmacist/dashboard', icon: LayoutDashboard },
    { label: 'Medicines', to: '/pharmacist/medicines', icon: Pill },
    { label: 'Categories', to: '/pharmacist/categories', icon: FolderOpen },
    { label: 'Stock', to: '/pharmacist/stock', icon: Package },
    { label: 'Prescriptions', to: '/pharmacist/prescriptions', icon: FileText },
    { label: 'Dispensing', to: '/pharmacist/dispensing', icon: CheckCircle },
    { label: 'Suppliers', to: '/pharmacist/suppliers', icon: Truck },
    { label: 'Purchase Records', to: '/pharmacist/purchases', icon: Receipt },
    { label: 'Expired Medicines', to: '/pharmacist/expired', icon: AlertTriangle },
    { label: 'Reports', to: '/pharmacist/reports', icon: BarChart3 },
    { label: 'My Leave', to: '/pharmacist/my-leave', icon: CalendarOff },
    { label: 'Notifications', to: '/pharmacist/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  accountant: [
    { label: 'Dashboard', to: '/accountant/dashboard', icon: LayoutDashboard },
    { label: 'Billing', to: '/accountant/billing', icon: CreditCard },
    { label: 'Invoices', to: '/accountant/invoices', icon: FileText },
    { label: 'Payments', to: '/accountant/payments', icon: DollarSign },
    { label: 'Outstanding Bills', to: '/accountant/outstanding', icon: AlertCircle },
    { label: 'Receipts', to: '/accountant/receipts', icon: Receipt },
    { label: 'Refunds', to: '/accountant/refunds', icon: RotateCcw },
    { label: 'Revenue', to: '/accountant/revenue', icon: TrendingUp },
    { label: 'Payroll', to: '/accountant/payroll', icon: Briefcase },
    { label: 'Financial Reports', to: '/accountant/reports', icon: BarChart3 },
    { label: 'Expenses', to: '/accountant/expenses', icon: Wallet },
    { label: 'My Leave', to: '/accountant/my-leave', icon: CalendarOff },
    { label: 'Notifications', to: '/accountant/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  hr: [
    { label: 'Dashboard', to: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'Employees', to: '/hr/employees', icon: Users },
    { label: 'Add Employee', to: '/hr/add-employee', icon: UserPlus },
    { label: 'Attendance', to: '/hr/attendance', icon: Clock },
    { label: 'Leave Management', to: '/hr/leave', icon: Calendar },
    { label: 'My Leave', to: '/hr/my-leave', icon: CalendarOff },
    { label: 'Staff Documents', to: '/hr/documents', icon: FileText },
    { label: 'Payroll', to: '/hr/payroll', icon: DollarSign },
    { label: 'Recruitment', to: '/hr/recruitment', icon: UserSearch },
    { label: 'Staff Reports', to: '/hr/reports', icon: BarChart3 },
    { label: 'Visits', to: '/hr/visits', icon: ClipboardList },
    { label: 'Appointments', to: '/hr/appointments', icon: Calendar },
    { label: 'Discharged Patients', to: '/hr/discharged', icon: LogOut },
    { label: 'Queue', to: '/hr/queue', icon: ListOrdered },
    { label: 'Notifications', to: '/hr/notifications', icon: Bell },
    { label: 'Chat', to: '/chat', icon: MessageSquare },
  ],
  patient: [
    { label: 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', to: '/patient/profile', icon: User },
    { label: 'Appointments', to: '/patient/appointments', icon: ClipboardList },
    { label: 'Visit History', to: '/patient/visit-history', icon: History },
    { label: 'Medical Records', to: '/patient/medical-records', icon: FileText },
    { label: 'Lab Results', to: '/patient/lab-results', icon: FlaskConical },
    { label: 'Bills & Payments', to: '/patient/bills', icon: CreditCard },
    { label: 'My Care Team', to: '/patient/care-team', icon: Stethoscope },
    { label: 'My Cases', to: '/patient/cases', icon: ClipboardList },
    { label: 'Notifications', to: '/patient/notifications', icon: Bell },
    { label: 'Change Password', to: '/patient/change-password', icon: KeyRound },
  ],
};

function SidebarContent({ role, onClose }: { role: UserRole; onClose: () => void }) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const items = navConfig[role] || [];

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <Logo size="sm" />
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.label] || false;

            if (hasChildren) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className="flex w-full items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      {item.children!.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `block rounded-md px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary-50 text-primary-600 font-medium'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent role={role} onClose={onClose} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl transition-transform">
            <SidebarContent role={role} onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
