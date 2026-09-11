import { Shield } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const roles = [
  { name: 'Super Admin', description: 'Full system access with all permissions', staffCount: 1, permissionsCount: 24, status: 'Active' },
  { name: 'Manager', description: 'Department management and oversight', staffCount: 4, permissionsCount: 18, status: 'Active' },
  { name: 'Receptionist', description: 'Patient registration and appointment scheduling', staffCount: 8, permissionsCount: 10, status: 'Active' },
  { name: 'Customer Care', description: 'Patient inquiries and complaint resolution', staffCount: 6, permissionsCount: 8, status: 'Active' },
  { name: 'Nurse', description: 'Patient care and medication administration', staffCount: 32, permissionsCount: 12, status: 'Active' },
  { name: 'Doctor', description: 'Diagnosis, prescriptions, and consultations', staffCount: 28, permissionsCount: 16, status: 'Active' },
  { name: 'Laboratory', description: 'Lab tests and result management', staffCount: 12, permissionsCount: 10, status: 'Active' },
  { name: 'Pharmacist', description: 'Medication dispensing and inventory', staffCount: 10, permissionsCount: 9, status: 'Active' },
  { name: 'Accountant', description: 'Financial records and billing management', staffCount: 6, permissionsCount: 11, status: 'Inactive' },
  { name: 'HR', description: 'Staff records and attendance management', staffCount: 4, permissionsCount: 14, status: 'Active' },
];

const statusColor = (s: string) => {
  return s === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
};

export default function StaffRoles() {
  return (
    <div className="space-y-6">
      <PageHeader title="Staff Roles & Permissions" icon={Shield} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Role Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff Count</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Permissions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((row) => (
                <tr key={row.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.description}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.staffCount}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.permissionsCount}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
