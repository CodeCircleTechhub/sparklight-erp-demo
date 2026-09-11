import { CalendarOff } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Pending', value: '5', icon: CalendarOff, color: 'yellow' as const },
  { title: 'Approved', value: '12', icon: CalendarOff, color: 'green' as const },
  { title: 'Rejected', value: '2', icon: CalendarOff, color: 'red' as const },
  { title: 'On Leave', value: '8', icon: CalendarOff, color: 'blue' as const },
];

const leaves = [
  { name: 'Dr. Soo Kim', department: 'Dermatology', type: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-15', days: 15, status: 'On Leave' },
  { name: 'Nurse Amy Clark', department: 'Pediatrics', type: 'Sick Leave', startDate: '2026-09-08', endDate: '2026-09-12', days: 5, status: 'On Leave' },
  { name: 'Dr. Wei Lee', department: 'General', type: 'Annual Leave', startDate: '2026-09-18', endDate: '2026-09-22', days: 5, status: 'Approved' },
  { name: 'Carlos Garcia', department: 'Laboratory', type: 'Personal Leave', startDate: '2026-09-20', endDate: '2026-09-21', days: 2, status: 'Pending' },
  { name: 'Fatima Hassan', department: 'Pharmacy', type: 'Annual Leave', startDate: '2026-09-25', endDate: '2026-09-27', days: 3, status: 'Pending' },
  { name: 'James Wilson', department: 'Accounting', type: 'Sick Leave', startDate: '2026-09-05', endDate: '2026-09-07', days: 3, status: 'Approved' },
  { name: 'Dr. Anna Nguyen', department: 'Ophthalmology', type: 'Annual Leave', startDate: '2026-09-10', endDate: '2026-09-14', days: 5, status: 'Rejected' },
  { name: 'Grace Adams', department: 'Pediatrics', type: 'Maternity Leave', startDate: '2026-09-15', endDate: '2026-12-15', days: 92, status: 'Pending' },
];

const statusColor = (s: string) => {
  if (s === 'Approved' || s === 'On Leave') return 'bg-green-100 text-green-700';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
  if (s === 'Rejected') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

export default function Leave() {
  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" icon={CalendarOff} />

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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Leave Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Start Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">End Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.type}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.startDate}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.endDate}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.days}</td>
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
