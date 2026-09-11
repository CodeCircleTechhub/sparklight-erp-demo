import { Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const today = new Date().toISOString().split('T')[0];

const attendance = [
  { id: 'EMP-001', name: 'Dr. Alan Smith', department: 'Cardiology', clockIn: '07:55 AM', clockOut: '04:05 PM', hours: 8.2, status: 'Present' },
  { id: 'EMP-002', name: 'Dr. Priya Patel', department: 'Orthopedics', clockIn: '07:58 AM', clockOut: '04:02 PM', hours: 8.1, status: 'Present' },
  { id: 'EMP-003', name: 'Dr. Wei Lee', department: 'General', clockIn: '08:00 AM', clockOut: '04:00 PM', hours: 8.0, status: 'Present' },
  { id: 'EMP-004', name: 'Nurse Grace Adams', department: 'Pediatrics', clockIn: '07:30 AM', clockOut: '03:30 PM', hours: 8.0, status: 'Present' },
  { id: 'EMP-005', name: 'Dr. Lin Chen', department: 'Neurology', clockIn: '08:25 AM', clockOut: '04:30 PM', hours: 8.1, status: 'Late' },
  { id: 'EMP-006', name: 'Dr. Soo Kim', department: 'Dermatology', clockIn: '--', clockOut: '--', hours: 0, status: 'Absent' },
  { id: 'EMP-007', name: 'Carlos Garcia', department: 'Laboratory', clockIn: '07:50 AM', clockOut: '03:55 PM', hours: 8.1, status: 'Present' },
  { id: 'EMP-008', name: 'Dr. Anna Nguyen', department: 'Ophthalmology', clockIn: '08:10 AM', clockOut: '04:15 PM', hours: 8.1, status: 'Late' },
  { id: 'EMP-009', name: 'Fatima Hassan', department: 'Pharmacy', clockIn: '07:45 AM', clockOut: '03:50 PM', hours: 8.1, status: 'Present' },
  { id: 'EMP-010', name: 'James Wilson', department: 'Accounting', clockIn: '--', clockOut: '--', hours: 0, status: 'Absent' },
];

const statusColor = (s: string) => {
  if (s === 'Present') return 'bg-green-100 text-green-700';
  if (s === 'Late') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

export default function Attendance() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" icon={Clock} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
            <input
              type="date"
              defaultValue={today}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Clock In</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Clock Out</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.clockIn}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.clockOut}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.hours}h</td>
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
