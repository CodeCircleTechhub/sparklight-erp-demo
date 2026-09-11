import { Users } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total', value: '156', icon: Users, color: 'blue' as const },
  { title: 'Active', value: '142', icon: Users, color: 'green' as const },
  { title: 'On Leave', value: '8', icon: Users, color: 'yellow' as const },
  { title: 'Inactive', value: '6', icon: Users, color: 'red' as const },
];

const employees = [
  { id: 'EMP-001', name: 'Dr. Alan Smith', department: 'Cardiology', position: 'Consultant', phone: '+234 801 234 5678', status: 'Active' },
  { id: 'EMP-002', name: 'Dr. Priya Patel', department: 'Orthopedics', position: 'Senior Doctor', phone: '+234 802 345 6789', status: 'Active' },
  { id: 'EMP-003', name: 'Dr. Wei Lee', department: 'General', position: 'Medical Officer', phone: '+234 803 456 7890', status: 'Active' },
  { id: 'EMP-004', name: 'Nurse Grace Adams', department: 'Pediatrics', position: 'Head Nurse', phone: '+234 804 567 8901', status: 'Active' },
  { id: 'EMP-005', name: 'Dr. Lin Chen', department: 'Neurology', position: 'Consultant', phone: '+234 805 678 9012', status: 'Active' },
  { id: 'EMP-006', name: 'Dr. Soo Kim', department: 'Dermatology', position: 'Specialist', phone: '+234 806 789 0123', status: 'On Leave' },
  { id: 'EMP-007', name: 'Carlos Garcia', department: 'Laboratory', position: 'Lab Manager', phone: '+234 807 890 1234', status: 'Active' },
  { id: 'EMP-008', name: 'Dr. Anna Nguyen', department: 'Ophthalmology', position: 'Consultant', phone: '+234 808 901 2345', status: 'Active' },
  { id: 'EMP-009', name: 'Fatima Hassan', department: 'Pharmacy', position: 'Chief Pharmacist', phone: '+234 809 012 3456', status: 'Active' },
  { id: 'EMP-010', name: 'James Wilson', department: 'Accounting', position: 'Accountant', phone: '+234 810 123 4567', status: 'Inactive' },
];

const statusColor = (s: string) => {
  if (s === 'Active') return 'bg-green-100 text-green-700';
  if (s === 'On Leave') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-500';
};

export default function Employees() {
  return (
    <div className="space-y-6">
      <PageHeader title="Employees" icon={Users} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.position}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.phone}</td>
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
