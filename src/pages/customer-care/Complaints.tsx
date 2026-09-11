import { AlertTriangle, Clock, CheckCircle, Search, Filter, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Complaints', value: '85', icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Pending', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Investigating', value: '8', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'Resolved', value: '65', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const complaints = [
  { id: 'CMP001', patient: 'John Smith', issue: 'Long waiting time in ER', priority: 'High', date: '2026-09-10', status: 'Investigating' },
  { id: 'CMP002', patient: 'Sarah Johnson', issue: 'Billing discrepancy', priority: 'High', date: '2026-09-10', status: 'Pending' },
  { id: 'CMP003', patient: 'Mike Williams', issue: 'Noise from adjacent room', priority: 'Low', date: '2026-09-09', status: 'Resolved' },
  { id: 'CMP004', patient: 'Emily Brown', issue: 'Delayed medication delivery', priority: 'High', date: '2026-09-09', status: 'Investigating' },
  { id: 'CMP005', patient: 'David Lee', issue: 'Poor food quality', priority: 'Medium', date: '2026-09-08', status: 'Resolved' },
  { id: 'CMP006', patient: 'Lisa Anderson', issue: 'Unclean facilities', priority: 'Medium', date: '2026-09-08', status: 'Pending' },
  { id: 'CMP007', patient: 'James Wilson', issue: 'Rude staff behavior', priority: 'High', date: '2026-09-07', status: 'Investigating' },
  { id: 'CMP008', patient: 'Maria Garcia', issue: 'Incorrect discharge summary', priority: 'Medium', date: '2026-09-07', status: 'Resolved' },
  { id: 'CMP009', patient: 'Robert Taylor', issue: 'Parking issues', priority: 'Low', date: '2026-09-06', status: 'Resolved' },
  { id: 'CMP010', patient: 'Jennifer Martinez', issue: 'Missing medical records', priority: 'High', date: '2026-09-06', status: 'Pending' },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-amber-100 text-amber-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Investigating: 'bg-orange-100 text-orange-800',
  Resolved: 'bg-green-100 text-green-800',
};

export default function Complaints() {
  return (
    <div className="space-y-6">
      <PageHeader title="Complaints Management" description="Track and resolve patient complaints" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Complaint ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaints.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{cmp.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{cmp.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{cmp.issue}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[cmp.priority]}`}>
                      {cmp.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cmp.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[cmp.status]}`}>
                      {cmp.status}
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