import { Search, MessageSquare, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Enquiries', value: '245', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Open', value: '18', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'In Progress', value: '8', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Resolved', value: '219', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const enquiries = [
  { id: 'ENQ001', patient: 'John Smith', subject: 'Appointment rescheduling request', type: 'General', date: '2026-09-10', status: 'Open' },
  { id: 'ENQ002', patient: 'Sarah Johnson', subject: 'Insurance coverage inquiry', type: 'Billing', date: '2026-09-10', status: 'In Progress' },
  { id: 'ENQ003', patient: 'Mike Williams', subject: 'Lab results clarification', type: 'Medical', date: '2026-09-09', status: 'Open' },
  { id: 'ENQ004', patient: 'Emily Brown', subject: 'Prescription refill question', type: 'Pharmacy', date: '2026-09-09', status: 'Resolved' },
  { id: 'ENQ005', patient: 'David Lee', subject: 'Ward visiting hours', type: 'General', date: '2026-09-08', status: 'Resolved' },
  { id: 'ENQ006', patient: 'Lisa Anderson', subject: 'Discharge process inquiry', type: 'Administrative', date: '2026-09-08', status: 'In Progress' },
  { id: 'ENQ007', patient: 'James Wilson', subject: 'Payment plan options', type: 'Billing', date: '2026-09-07', status: 'Resolved' },
  { id: 'ENQ008', patient: 'Maria Garcia', subject: 'Specialist referral status', type: 'Medical', date: '2026-09-07', status: 'Open' },
  { id: 'ENQ009', patient: 'Robert Taylor', subject: 'Parking availability', type: 'General', date: '2026-09-06', status: 'Resolved' },
  { id: 'ENQ010', patient: 'Jennifer Martinez', subject: 'Medical records request', type: 'Administrative', date: '2026-09-06', status: 'Open' },
];

const statusColors: Record<string, string> = {
  Open: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800',
};

export default function Enquiries() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Enquiries" description="Manage patient inquiries and requests" />
      
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
              placeholder="Search enquiries..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enquiry ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{enq.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{enq.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{enq.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{enq.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{enq.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[enq.status]}`}>
                      {enq.status}
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