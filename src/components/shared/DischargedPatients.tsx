import { useCallback, useEffect, useState } from 'react';
import { LogOut, Search, Loader2, AlertCircle, CalendarDays, UserCheck, Users } from 'lucide-react';
import api from '../../services/api';

type DischargedRow = {
  _id: string;
  admissionId?: string;
  patientName?: string;
  patient?: { _id?: string; firstName?: string; surname?: string; patientId?: string; phone?: string };
  ward?: string;
  roomNumber?: string;
  department?: string;
  reason?: string;
  admissionDate?: string;
  dischargeDate?: string;
  dischargeNotes?: string;
  dischargedByName?: string;
  doctorName?: string;
  diagnosis?: string;
  billsSettled?: boolean;
  outstanding?: number;
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export default function DischargedPatients() {
  const [items, setItems] = useState<DischargedRow[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchDischarges = useCallback(async (q?: string, f?: string, t?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (q) params.search = q;
      if (f) params.from = f;
      if (t) params.to = t;
      const { data } = await api.get('/admissions/discharged', { params });
      setItems(data.items || []);
      setStats(data.stats || { total: 0, today: 0, week: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load discharged patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDischarges();
  }, [fetchDischarges]);

  useEffect(() => {
    const t = setTimeout(() => fetchDischarges(search.trim() || undefined, from || undefined, to || undefined), 350);
    return () => clearTimeout(t);
  }, [search, from, to, fetchDischarges]);

  const cards = [
    { label: 'Discharged (all)', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Today', value: stats.today, icon: LogOut, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Last 7 days', value: stats.week, icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const input =
    'px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${c.bg}`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
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

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-end gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, admission ID, ward or doctor..."
            className={`${input} w-full pl-9`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={input} />
        </div>
        {(search || from || to) && (
          <button
            onClick={() => {
              setSearch('');
              setFrom('');
              setTo('');
            }}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">Discharged patients</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading discharged patients...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No discharged patients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward / Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admitted</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Discharged</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Discharged by</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.admissionId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className="font-medium">{row.patientName || '—'}</span>
                      {row.patient?.patientId && (
                        <span className="ml-1.5 text-xs text-gray-500">{row.patient.patientId}</span>
                      )}
                      {row.dischargeNotes && (
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[16rem] truncate" title={row.dischargeNotes}>
                          {row.dischargeNotes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.ward || '—'}
                      {row.roomNumber ? ` · ${row.roomNumber}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(row.admissionDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDateTime(row.dischargeDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        {row.dischargedByName || row.doctorName || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[14rem] truncate">
                      {row.diagnosis || row.reason || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.billsSettled === false ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          NGN {(row.outstanding || 0).toLocaleString()} outstanding
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Settled
                        </span>
                      )}
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
