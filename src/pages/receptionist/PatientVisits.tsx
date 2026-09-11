import { ClipboardList, UserPlus, RefreshCw, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Visits", value: '126', icon: ClipboardList, color: 'bg-blue-500' },
  { label: 'New', value: '18', icon: UserPlus, color: 'bg-green-500' },
  { label: 'Returning', value: '108', icon: RefreshCw, color: 'bg-violet-500' },
  { label: 'Waiting', value: '8', icon: Clock, color: 'bg-amber-500' },
];

const visits = [
  { id: 'VST-2001', patient: 'Alice Johnson', time: '08:30 AM', department: 'Cardiology', status: 'Completed' },
  { id: 'VST-2002', patient: 'Bob Williams', time: '08:45 AM', department: 'Neurology', status: 'In Progress' },
  { id: 'VST-2003', patient: 'Carol Davis', time: '09:00 AM', department: 'Pediatrics', status: 'Waiting' },
  { id: 'VST-2004', patient: 'David Brown', time: '09:15 AM', department: 'Orthopedics', status: 'Completed' },
  { id: 'VST-2005', patient: 'Eva Martinez', time: '09:30 AM', department: 'Oncology', status: 'Completed' },
  { id: 'VST-2006', patient: 'Frank Wilson', time: '09:45 AM', department: 'Dermatology', status: 'In Progress' },
  { id: 'VST-2007', patient: 'Grace Lee', time: '10:00 AM', department: 'ENT', status: 'Waiting' },
  { id: 'VST-2008', patient: 'Henry Garcia', time: '10:15 AM', department: 'Radiology', status: 'Completed' },
  { id: 'VST-2009', patient: 'Irene Chen', time: '10:30 AM', department: 'Psychiatry', status: 'In Progress' },
  { id: 'VST-2010', patient: 'Jack Thompson', time: '10:45 AM', department: 'General', status: 'Waiting' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
};

export default function PatientVisits() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Visits" icon={ClipboardList} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Visit ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Time</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{v.id}</td>
                    <td className="py-3 text-gray-900">{v.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{v.time}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{v.department}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
