import { useState, useEffect, useCallback } from 'react';
import { Users, AlertTriangle, Heart, Search, Loader2, AlertCircle, BedDouble } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { billingBadge } from '../../utils/billingStatus';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800',
  Stable: 'bg-green-100 text-green-800',
};

const fmtWhen = (iso?: string | null) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
};

export default function MyPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchPatients = useCallback(async (q: string) => {
    setLoading(true);
    setError('');
    try {
      const [patRes, billRes] = await Promise.all([
        api.get('/nurse/patients', { params: q ? { search: q } : {} }),
        api.get('/billing/invoices').catch(() => ({ data: { invoices: [] } })),
      ]);
      setPatients(patRes.data.patients || []);
      setStats(patRes.data.stats || {});
      setInvoices(billRes.data.invoices || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPatients(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search, fetchPatients]);

  const cards = [
    { label: 'Admitted Patients', value: stats.admitted ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Assigned to Me', value: stats.mine ?? 0, icon: BedDouble, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Critical', value: stats.critical ?? 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Stable', value: stats.stable ?? 0, icon: Heart, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Patients"
        description={
          stats.mineOnly === false
            ? 'No patients assigned to you yet — showing every admitted patient'
            : 'Patients currently admitted under your care'
        }
      />

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

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or patient ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No admitted patients found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Vitals</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{patient.patientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {patient.name}
                      {patient.assignedToMe && (
                        <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                          MINE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{patient.ward || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{patient.room || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{patient.condition || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.lastVitals
                        ? `${fmtWhen(patient.lastChecked)}${
                            patient.lastVitals.bp ? ` · BP ${patient.lastVitals.bp}` : ''
                          }`
                        : 'No vitals yet'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[patient.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const badge = billingBadge(patient, invoices);
                        return (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
