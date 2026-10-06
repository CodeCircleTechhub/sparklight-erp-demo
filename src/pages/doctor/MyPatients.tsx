import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Activity, CalendarCheck, LogOut, Search, Loader2, AlertCircle, Receipt, Eye, UserCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import PatientBillingModal from '../../components/shared/PatientBillingModal';
import PatientHistoryModal from '../../components/shared/PatientHistoryModal';
import { billingBadge } from '../../utils/billingStatus';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  'Follow-up': 'bg-yellow-100 text-yellow-800',
  Discharged: 'bg-gray-100 text-gray-800',
};

const RANGES = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'all', label: 'All' },
] as const;

type RangeKey = (typeof RANGES)[number]['key'];

function withinRange(value: string | null | undefined, range: RangeKey) {
  if (range === 'all') return true;
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === 'day') {
    return date.toDateString() === now.toDateString();
  }
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return date.getTime() >= start.getTime();
  }
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return date.getTime() >= startOfMonth.getTime();
}

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function MyPatients() {
  const location = useLocation();
  const navigate = useNavigate();
  // /doctor/my-patients = only the patients assigned to me; /doctor/patients = everybody
  const mine = location.pathname.endsWith('/my-patients');
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, followUp: 0, discharged: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [range, setRange] = useState<RangeKey>('all');
  const [billing, setBilling] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchData = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (mine) params.mine = '1';
      if (q) params.search = q;
      const [patRes, billRes] = await Promise.all([
        api.get('/doctor/patients', { params }),
        api.get('/billing/invoices').catch(() => ({ data: { invoices: [] } })),
      ]);
      setPatients(patRes.data.patients || []);
      setStats(patRes.data.stats || { total: 0, active: 0, followUp: 0, discharged: 0 });
      setInvoices(billRes.data.invoices || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [mine]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const filtered = useMemo(
    () =>
      patients.filter((p) => withinRange(p.lastVisit || p.createdAt, range)),
    [patients, range],
  );

  const rangeStats = useMemo(() => {
    if (range === 'all') return stats;
    return {
      total: filtered.length,
      active: filtered.filter((p) => p.status === 'Active').length,
      followUp: filtered.filter((p) => p.status === 'Follow-up').length,
      discharged: filtered.filter((p) => p.status === 'Discharged').length,
    };
  }, [range, filtered, stats]);

  const cards = [
    {
      label: mine ? 'Assigned to You' : 'Total',
      value: rangeStats.total,
      icon: mine ? UserCheck : Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    { label: 'Active', value: rangeStats.active, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Follow-up', value: rangeStats.followUp, icon: CalendarCheck, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Discharged', value: rangeStats.discharged, icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={mine ? 'My Patients' : 'All Patients'}
        description={
          mine
            ? 'Only the patients assigned to you — via appointment or as part of the ward care team.'
            : 'Every registered patient — open any chart to attend them; your entries are saved under your name.'
        }
        icon={mine ? UserCheck : Users}
        action={
          <button
            type="button"
            onClick={() => setBilling(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Receipt className="w-4 h-4" /> Bill Patient
          </button>
        }
      />

      {billing && (
        <PatientBillingModal
          onClose={() => setBilling(false)}
          onSaved={() => fetchData(search.trim() || undefined)}
        />
      )}

      {viewing && (
        <PatientHistoryModal
          patientId={viewing}
          onClose={() => setViewing(null)}
          onRefresh={() => fetchData(search.trim() || undefined)}
        />
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
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone no. or patient ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 self-start">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    range === r.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 self-start">
              <button
                type="button"
                onClick={() => navigate('/doctor/my-patients')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  mine ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Mine
              </button>
              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !mine ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> All
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading patients...
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {patients.length === 0
              ? mine
                ? 'No patients assigned to you yet — they appear here once an appointment is assigned to you or you admit one to your ward.'
                : 'No patients found.'
              : 'No patients in the selected period.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Age</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Billing</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.patientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.age ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.gender || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.condition || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(p.lastVisit)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.assignedToMe && (
                        <span className="inline-flex items-center gap-1 mr-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                          <UserCheck className="w-3 h-3" /> Assigned to you
                        </span>
                      )}
                      {p.assignedToName ? (
                        <span className="inline-flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span>
                            {p.assignedToName}
                            {p.assignedNurseName && (
                              <span className="text-xs text-gray-400"> - {p.assignedNurseName} (nurse)</span>
                            )}
                            {p.assignedToRole && (
                              <span className="text-xs text-gray-400"> A� {p.assignedToRole.replace(/-/g, ' ')}</span>
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned - available to all</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const badge = billingBadge(p, invoices);
                        return (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewing(p._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
