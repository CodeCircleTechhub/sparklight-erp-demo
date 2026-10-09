import { useState, useEffect } from 'react';
import { ClipboardList, Clock, Cog, CheckCircle, Loader2, AlertCircle, Eye } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import LabHistoryModal from '../../components/laboratory/LabHistoryModal';
import api from '../../services/api';

const priorityColors: Record<string, string> = {
  STAT: 'bg-red-100 text-red-800',
  Urgent: 'bg-red-100 text-red-800',
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Normal: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-700',
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const patName = (t: any) =>
  t.patientName || (t.patient ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim() : '') || '—';

export default function TestRequests() {
  const [tests, setTests] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/laboratory');
        setTests(data.tests || []);
        setStats({
          total: data.total || 0,
          pending: data.pending || 0,
          inProgress: data.inProgress || 0,
          completed: data.completed || 0,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load test requests');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: 'Total', value: String(stats.total), icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Processing', value: String(stats.inProgress), icon: Cog, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: String(stats.completed), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Test Requests" icon={ClipboardList} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
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
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading test requests...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.testId || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{patName(r)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.testType || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.orderedByName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[r.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {r.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {r.status || 'Pending'}
                      </span>
                      {r.confirmedAt && (
                        <span className="ml-1.5 inline-flex rounded-full bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-semibold">Confirmed</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewing(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        title="View this patient's full lab history"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No test requests yet</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>

      {viewing && (
        <LabHistoryModal
          patientId={viewing.patient?._id || viewing.patient}
          patientName={patName(viewing)}
          initialTab="requests"
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
