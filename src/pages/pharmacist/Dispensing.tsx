import { useState, useEffect, useCallback } from 'react';
import { Pill, Calendar, Clock, Loader2, AlertCircle, Eye, X } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

const statusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  Filled: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

const patName = (d: any) =>
  d.patientName || (d.patient ? `${d.patient.firstName || ''} ${d.patient.surname || ''}`.trim() : '') || '—';

const medStatusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  Paid: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  'Not Available': 'bg-gray-100 text-gray-600',
};

// a drug still awaiting an action = nothing done on it yet (or paid but not handed over)
const isAwaiting = (m: any) => m.status === 'Pending' || m.status === 'Paid';

const monthLabel = (d: any) => {
  const raw = d.date || d.dispensedAt;
  if (!raw) return 'Undated';
  return new Date(raw).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export default function Dispensing() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, avgDaily: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState<{ id: string; name: string } | null>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy/dispensing');
      setItems(data.items || []);
      setStats(data.stats || { today: 0, week: 0, avgDaily: 0, total: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dispensing log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    { label: 'Today', value: String(stats.today), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'This Week', value: String(stats.week), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Average Daily', value: String(stats.avgDaily), icon: Pill, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  // open one patient's complete dispensing history
  const openHistory = async (p: { id: string; name: string }) => {
    if (!p.id) {
      setViewError('Patient not found on this record');
      setViewing({ id: '', name: p.name });
      setViewItems([]);
      setViewLoading(false);
      return;
    }
    setViewing(p);
    setViewItems([]);
    setViewError('');
    setViewLoading(true);
    try {
      const { data } = await api.get('/pharmacy/dispensing', { params: { patient: p.id } });
      setViewItems(data.items || []);
    } catch (err: any) {
      setViewError(err.response?.data?.message || 'Failed to load dispensing history');
    } finally {
      setViewLoading(false);
    }
  };

  // one row per patient — the full record list lives behind their View button
  const patientRows: { id: string; name: string; records: number; last: any }[] = [];
  items.forEach((d) => {
    const id = String(d.patient?._id || d.patient || '');
    const name = patName(d);
    const row = patientRows.find((r) => r.id === id || (!id && r.name === name));
    if (row) {
      row.records += 1;
      if (!row.last) row.last = d.dispensedAt || d.date || null;
    } else {
      patientRows.push({ id, name, records: 1, last: d.dispensedAt || d.date || null });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Dispensing" icon={Pill} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading dispensing log...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Records</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last dispensed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patientRows.map((p) => (
                  <tr key={p.id || p.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.records}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(p.last)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openHistory(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {patientRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">Nothing dispensed yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ------------------------------------ one patient's dispensing history */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !viewLoading && setViewing(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dispensing history — {viewing.name}</h3>
                <p className="text-xs text-gray-500">Every prescription for this patient, newest first.</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {viewError}
              </div>
            )}

            {viewLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading history...
              </div>
            ) : viewItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500 rounded-lg border border-dashed border-gray-200">
                No dispensing history for this patient yet.
              </p>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const vgroups: { label: string; items: any[] }[] = [];
                  viewItems.forEach((d) => {
                    const label = monthLabel(d);
                    const last = vgroups[vgroups.length - 1];
                    if (last && last.label === label) last.items.push(d);
                    else vgroups.push({ label, items: [d] });
                  });
                  return vgroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{group.label}</p>
                      <div className="space-y-2">
                        {group.items.map((d) => {
                          const meds = (d.medications || []).filter((m: any) => m.name);
                          const done = meds.filter((m: any) => m.status === 'Dispensed').length;
                          const awaiting = meds.filter(isAwaiting).length;
                          const qty = (d.dispensedItems || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
                          return (
                            <div key={d._id} className="rounded-lg border border-gray-200 p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-medium text-blue-600">
                                  {d.prescriptionId}
                                  <span className="ml-2 font-normal text-gray-500">{fmtDate(d.dispensedAt || d.date)}</span>
                                </p>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>
                                  {d.status}
                                </span>
                              </div>
                              <ul className="mt-2 space-y-1">
                                {meds.map((m: any, i: number) => (
                                  <li key={`${d._id}-${i}`} className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-gray-700">{m.name}</span>
                                    <span
                                      className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                        medStatusColors[m.status] || 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {m.status}
                                    </span>
                                    {m.dosage && <span className="text-xs text-gray-400">{m.dosage}</span>}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-2 text-xs text-gray-500">
                                {done}/{meds.length || 0} dispensed
                                {awaiting > 0 && (
                                  <span className="ml-2 inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                    {awaiting} awaiting action
                                  </span>
                                )}
                                {qty > 0 && <span className="ml-2">· {qty} unit(s) handed over</span>}
                                {d.dispensedByName && <span className="ml-2">· by {d.dispensedByName}</span>}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
