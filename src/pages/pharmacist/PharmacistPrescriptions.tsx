import { useState, useEffect, useCallback, useRef } from 'react';
import { ClipboardList, Clock, CheckCircle, AlertCircle, Search, Loader2, Pill, X } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Filled: 'bg-blue-100 text-blue-800',
  Dispensed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

const patName = (rx: any) =>
  rx.patientName || (rx.patient ? `${rx.patient.firstName || ''} ${rx.patient.surname || ''}`.trim() : '') || '—';
const docName = (rx: any) => rx.doctorName || (rx.doctor ? rx.doctor.fullName : '') || '—';

export default function PharmacistPrescriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, filled: 0, dispensed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState<any | null>(null);
  const [qtys, setQtys] = useState<Record<number, string>>({});
  const [dispensing, setDispensing] = useState(false);
  const [modalError, setModalError] = useState('');
  const debounce = useRef<number | null>(null);

  const load = useCallback(async (q = '', st = '') => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (q) params.search = q;
      if (st) params.status = st;
      const { data } = await api.get('/pharmacy/prescriptions', { params });
      setItems(data.items || []);
      setCounts(data.stats || { pending: 0, filled: 0, dispensed: 0, total: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (q: string) => {
    setSearch(q);
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => load(q, status), 400);
  };

  const onStatus = (st: string) => {
    setStatus(st);
    load(search, st);
  };

  const openDispense = (rx: any) => {
    setTarget(rx);
    setModalError('');
    const initial: Record<number, string> = {};
    (rx.medications || []).forEach((_: any, i: number) => {
      initial[i] = '1';
    });
    setQtys(initial);
  };

  const dispense = async () => {
    if (dispensing || !target) return;
    const meds = (target.medications || []).filter((m: any) => m.name);
    if (!meds.length) {
      setModalError('This prescription has no medicines');
      return;
    }
    const bad = meds.some((_: any, i: number) => !(Number(qtys[i]) >= 1));
    if (bad) {
      setModalError('Quantity must be at least 1 for every medicine');
      return;
    }
    setDispensing(true);
    setModalError('');
    try {
      const body = { items: meds.map((m: any, i: number) => ({ name: m.name, quantity: Number(qtys[i]) || 1 })) };
      await api.post(`/pharmacy/prescriptions/${target._id}/dispense`, body);
      setNotice({ type: 'ok', text: `${target.prescriptionId || 'Prescription'} dispensed — inventory updated.` });
      setTarget(null);
      await load(search, status);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to dispense');
    } finally {
      setDispensing(false);
    }
  };

  const stats = [
    { label: 'Pending', value: String(counts.pending), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Dispensed', value: String(counts.dispensed), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Awaiting Pickup', value: String(counts.filled), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total', value: String(counts.total), icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" icon={ClipboardList} />

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

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {notice.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by ID, patient, doctor or medicine..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>Filled</option>
            <option>Dispensed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading prescriptions...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicines</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((rx) => (
                  <tr key={rx._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{rx.prescriptionId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{patName(rx)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{docName(rx)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(rx.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(rx.medications || []).length} items</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rx.status] || 'bg-gray-100 text-gray-700'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rx.status === 'Pending' || rx.status === 'Filled' ? (
                        <button
                          onClick={() => openDispense(rx)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          Dispense
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No prescriptions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !dispensing && setTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Dispense {target.prescriptionId}</h3>
              <button onClick={() => setTarget(null)} disabled={dispensing} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {patName(target)} · {docName(target)} · {fmtDate(target.date)}
            </p>
            {modalError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {modalError}
              </div>
            )}
            <p className="text-sm font-medium text-gray-700 mb-2">Medicines &amp; quantities</p>
            <div className="space-y-2">
              {(target.medications || []).map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {[m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ') || 'No dosage details'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs text-gray-500" htmlFor={`qty-${i}`}>
                      Qty
                    </label>
                    <input
                      id={`qty-${i}`}
                      type="number"
                      min={1}
                      value={qtys[i] ?? '1'}
                      onChange={(e) => setQtys((q) => ({ ...q, [i]: e.target.value }))}
                      className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              {(target.medications || []).length === 0 && <p className="text-sm text-gray-400">No medicines on this prescription.</p>}
            </div>
            <p className="text-xs text-gray-400 mt-3">Matching stock in inventory will be decremented when you dispense.</p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setTarget(null)}
                disabled={dispensing}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={dispense}
                disabled={dispensing}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {dispensing && <Loader2 className="w-4 h-4 animate-spin" />}
                Dispense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
