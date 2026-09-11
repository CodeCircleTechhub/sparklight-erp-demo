import { Send, CheckCheck, Eye, AlertCircle, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Messages Sent', value: '1,250', icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Delivered', value: '1,180', icon: CheckCheck, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Read', value: '890', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Failed', value: '70', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const messages = [
  { id: 'MSG001', patient: 'John Smith', type: 'SMS', subject: 'Appointment Reminder', sentDate: '2026-09-10', status: 'Read' },
  { id: 'MSG002', patient: 'Sarah Johnson', type: 'Email', subject: 'Lab Results Available', sentDate: '2026-09-10', status: 'Delivered' },
  { id: 'MSG003', patient: 'Mike Williams', type: 'SMS', subject: 'Prescription Ready', sentDate: '2026-09-10', status: 'Read' },
  { id: 'MSG004', patient: 'Emily Brown', type: 'Push', subject: 'Appointment Confirmation', sentDate: '2026-09-09', status: 'Read' },
  { id: 'MSG005', patient: 'David Lee', type: 'SMS', subject: 'Payment Reminder', sentDate: '2026-09-09', status: 'Failed' },
  { id: 'MSG006', patient: 'Lisa Anderson', type: 'Email', subject: 'Health Newsletter', sentDate: '2026-09-08', status: 'Delivered' },
  { id: 'MSG007', patient: 'James Wilson', type: 'SMS', subject: 'Follow-up Reminder', sentDate: '2026-09-08', status: 'Read' },
  { id: 'MSG008', patient: 'Maria Garcia', type: 'Push', subject: 'New Service Available', sentDate: '2026-09-07', status: 'Sent' },
  { id: 'MSG009', patient: 'Robert Taylor', type: 'Email', subject: 'Insurance Update', sentDate: '2026-09-07', status: 'Failed' },
  { id: 'MSG010', patient: 'Jennifer Martinez', type: 'SMS', subject: 'Feedback Request', sentDate: '2026-09-06', status: 'Read' },
];

const statusColors: Record<string, string> = {
  Read: 'bg-green-100 text-green-800',
  Delivered: 'bg-blue-100 text-blue-800',
  Sent: 'bg-gray-100 text-gray-800',
  Failed: 'bg-red-100 text-red-800',
};

const typeColors: Record<string, string> = {
  SMS: 'bg-amber-100 text-amber-800',
  Email: 'bg-blue-100 text-blue-800',
  Push: 'bg-purple-100 text-purple-800',
};

export default function Communication() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Communication" description="Manage patient communications and notifications" />
      
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
              placeholder="Search messages..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Message ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sent Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{msg.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{msg.patient}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[msg.type]}`}>
                      {msg.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{msg.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{msg.sentDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[msg.status]}`}>
                      {msg.status}
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