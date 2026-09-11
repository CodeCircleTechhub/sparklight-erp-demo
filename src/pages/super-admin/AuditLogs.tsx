import { FileText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const logs = [
  { timestamp: '2026-09-11 10:32:15', user: 'Dr. Smith', role: 'Doctor', action: 'Patient Discharged', record: 'Patient #4521 - John Doe', ip: '192.168.1.101' },
  { timestamp: '2026-09-11 10:15:42', user: 'Nurse Adams', role: 'Nurse', action: 'Medication Administered', record: 'Patient #4398 - Sarah Connor', ip: '192.168.1.102' },
  { timestamp: '2026-09-11 09:48:30', user: 'Reception', role: 'Receptionist', action: 'Appointment Created', record: 'Dr. Patel - Orthopedics', ip: '192.168.1.103' },
  { timestamp: '2026-09-11 09:30:18', user: 'Lab Tech', role: 'Laboratory', action: 'Results Uploaded', record: 'Blood work - Patient #4456', ip: '192.168.1.104' },
  { timestamp: '2026-09-11 09:12:05', user: 'Admin', role: 'Super Admin', action: 'Staff Added', record: 'Emily Chen - ER Department', ip: '192.168.1.100' },
  { timestamp: '2026-09-11 08:55:44', user: 'Dr. Johnson', role: 'Doctor', action: 'Surgery Scheduled', record: 'Appendectomy - Room 3B', ip: '192.168.1.105' },
  { timestamp: '2026-09-11 08:40:22', user: 'Finance', role: 'Accountant', action: 'Bill Generated', record: 'Patient #4401 - ₦3,200', ip: '192.168.1.106' },
  { timestamp: '2026-09-11 08:22:11', user: 'Pharmacist', role: 'Pharmacist', action: 'Prescription Filled', record: 'Patient #4500 - Amoxicillin', ip: '192.168.1.107' },
  { timestamp: '2026-09-10 17:45:33', user: 'Dr. Lee', role: 'Doctor', action: 'Diagnosis Recorded', record: 'Patient #4510 - Hypertension', ip: '192.168.1.108' },
  { timestamp: '2026-09-10 16:20:09', user: 'Manager', role: 'Manager', action: 'Report Generated', record: 'Monthly Revenue Report', ip: '192.168.1.109' },
];

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" icon={FileText} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              defaultValue="2026-09-10"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              defaultValue="2026-09-11"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input
              type="text"
              placeholder="Search user..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none">
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Record</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap font-mono text-xs">{row.timestamp}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.user}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                      {row.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.action}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.record}</td>
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap font-mono text-xs">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
