import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, LogOut, MessageSquare, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';

type UserRole = 'super-admin' | 'manager' | 'receptionist' | 'customer-care' | 'nurse' | 'doctor' | 'laboratory' | 'pharmacist' | 'accountant' | 'hr' | 'patient';

interface DashboardLayoutProps {
  role: UserRole;
}

const roleNames: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  'manager': 'Hospital Manager',
  'receptionist': 'Receptionist',
  'customer-care': 'Customer Care',
  'nurse': 'Nurse',
  'doctor': 'Doctor',
  'laboratory': 'Laboratory Staff',
  'pharmacist': 'Pharmacist',
  'accountant': 'Accountant',
  'hr': 'HR Manager',
  'patient': 'Patient',
};

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const staffName = 'Abdulkadir Nafiu Oladimeji';
  const initials = staffName.split(' ').map(n => n[0]).join('').slice(0, 2);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <Link
              to="/chat"
              className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Link>

            <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative border-l border-gray-200 pl-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {staffName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-dark-900">{staffName}</p>
                    <p className="text-xs text-gray-500">{roleNames[role]}</p>
                  </div>
                  <Link
                    to="/chat"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
