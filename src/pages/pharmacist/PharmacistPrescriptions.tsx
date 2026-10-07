import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
  Pill,
  X,
  Pencil,
  Trash2,
  Ban,
  RotateCcw,
  PackageCheck,
  Wallet,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { formatNaira } from '../../components/charts/Charts';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Filled: 'bg-blue-100 text-blue-800',
  Dispensed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

const itemStatusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-blue-100 text-blue-800',
  Dispensed: 'bg-green-100 text-green-800',
  'Not Available': 'bg-red-100 text-red-700',
};

const patName = (rx: any) =>
  rx.patientName || (rx.patient ? `${rx.patient.firstName || ''} ${rx.patient.surname || ''}`.trim() : '') || '-';
const docName = (rx: any) => rx.doctorName || (rx.doctor ? rx.doctor.fullName : '') || '-';
const itemStatus = (m: any) => m.status || 'Pending';
const rxTotal = (rx: any) =>
  (rx.medications || []).reduce((s: number, m: any) => s + (Number(m.price) || 0), 0);
const rxPaid = (rx: any) =>
  (rx.medications || [])
    .filter((m: any) => ['Paid', 'Dispensed'].includes(itemStatus(m)))
    .reduce((s: number, m: any) => s + (Number(m.price) || 0), 0);

export default function PharmacistPrescriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, filled: 0, dispensed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState<any | null>(null);
  const [busy, setBusy] = useState('');
  const [priceDrafts, setPriceDrafts] = useState<Record<number, string>>({});
  const [priceEdit, setPriceEdit] = useState<Record<number, boolean>>({});
  const [modalError, setModalError] = useState('');
  const debounce = useRef<number | null>(null);

  const load = useCallback(async (q = '', st = '', silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (q) params.search = q;
      if (st) params.status = st;
      const { data } = await api.get('/pharmacy/prescriptions', { params });
      const list = data.items || [];
      setItems(list);
      setCounts(data.stats || { pending: 0, filled: 0, dispensed: 0, total: 0 });
      setTarget((t: any) => (t ? list.find((x: any) => x._id === t._id) || t : t));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      if (!silent) setLoading(false);
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

  const openManage = (rx: any) => {
    setTarget(rx);
    setModalError('');
    const drafts: Record<number, string> = {};
    const edit: Record<number, boolean> = {};
    (rx.medications || []).forEach((m: any, i: number) => {
      drafts[i] = m.price === null || m.price === undefined ? '' : String(m.price);
      edit[i] = m.price === null || m.price === undefined;
    });
    setPriceDrafts(drafts);
    setPriceEdit(edit);
  };

  const run = async (key: string, fn: () => Promise<unknown>, msg: string) => {
    if (busy) return;
    setBusy(key);
    setModalError('');
    try {
      await fn();
      setNotice({ type: 'ok', text: msg });
      await load(search, status, true);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Action failed');
    } finally {
      setBusy('');
    }
  };

  const savePrice = (idx: number, name: string) => {
    const raw = (priceDrafts[idx] ?? '').trim();
    const price = Number(raw);
    if (raw === '' || !Number.isFinite(price) || price < 0) {
      setModalError('Enter a valid price (0 or more)');
      return;
    }
    run(`${idx}-price`, () => api.put(`/pharmacy/prescriptions/${target._id}/items/${idx}/price`, { price }), `${name} priced at ${formatNaira(price)}.`).then(
      () => setPriceEdit((e) => ({ ...e, [idx]: false }))
    );
  };

  const deletePrice = (idx: number, name: string) => {
    if (!window.confirm(`Remove the price for ${name}?`)) return;
    run(`${idx}-price`, () => api.put(`/pharmacy/prescriptions/${target._id}/items/${idx}/price`, { action: 'delete' }), `Price removed for ${name}.`);
  };

  const markPaid = (idx: number, name: string) =>
    run(`${idx}-pay`, () => api.post(`/pharmacy/prescriptions/${target._id}/items/${idx}/pay`), `Payment recorded for ${name}.`);

  const dispenseItem = (idx: number, name: string) =>
    run(`${idx}-dispense`, () => api.post(`/pharmacy/prescriptions/${target._id}/items/${idx}/dispense`, { quantity: 1 }), `${name} dispensed and stock updated.`);

  const setAvailable = (idx: number, available: boolean, name: string) =>
    run(
      `${idx}-avail`,
      () => api.put(`/pharmacy/prescriptions/${target._id}/items/${idx}/availability`, { available }),
      available ? `${name} restored to pending.` : `${name} marked as not available.`
    );

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
              <Loader2 className="w-4 h-4 animate-spin" />
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Drug Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((rx) => {
                  const unresolved = (rx.medications || []).some((m: any) => itemStatus(m) !== 'Dispensed');
                  const total = rxTotal(rx);
                  const paid = rxPaid(rx);
                  return (
                    <tr key={rx._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{rx.prescriptionId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patName(rx)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{docName(rx)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(rx.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{(rx.medications || []).length} items</td>
                      <td className="px-4 py-3 text-sm">
                        {total > 0 ? (
                          <span className="font-medium text-gray-900">
                            {formatNaira(total)}
                            {paid > 0 && paid !== total && <span className="ml-1 text-xs text-green-600">({formatNaira(paid)} paid)</span>}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rx.status] || 'bg-gray-100 text-gray-700'}`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {rx.status !== 'Cancelled' && unresolved ? (
                          <button
                            onClick={() => openManage(rx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                          >
                            <Pill className="w-3.5 h-3.5" />
                            Price &amp; Dispense
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No prescriptions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !busy && setTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Price &amp; dispense {target.prescriptionId}</h3>
              <button onClick={() => setTarget(null)} disabled={!!busy} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {patName(target)} - {docName(target)} - {fmtDate(target.date)}
            </p>
            {modalError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {modalError}
              </div>
            )}

            <div className="space-y-3">
              {(target.medications || []).map((m: any, i: number) => {
                const st = itemStatus(m);
                const hasPrice = m.price !== null && m.price !== undefined;
                const editing = priceEdit[i] || !hasPrice;
                return (
                  <div key={i} className="border border-gray-200 rounded-lg px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{[m.dosage, m.frequency, m.duration].filter(Boolean).join(' - ') || 'No dosage details'}</p>
                        {m.instructions && <p className="text-xs text-gray-400">{m.instructions}</p>}
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${itemStatusColors[st] || 'bg-gray-100 text-gray-700'}`}>
                        {st}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      {editing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Price"
                            value={priceDrafts[i] ?? ''}
                            onChange={(e) => setPriceDrafts((d) => ({ ...d, [i]: e.target.value }))}
                            disabled={st === 'Paid' || st === 'Dispensed'}
                            className="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                          <button
                            onClick={() => savePrice(i, m.name)}
                            disabled={!!busy || st === 'Paid' || st === 'Dispensed'}
                            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {busy === `${i}-price` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save price'}
                          </button>
                          {hasPrice && (
                            <button
                              onClick={() => setPriceEdit((e) => ({ ...e, [i]: false }))}
                              disabled={!!busy}
                              className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{formatNaira(Number(m.price) || 0)}</span>
                          <button
                            onClick={() => setPriceEdit((e) => ({ ...e, [i]: true }))}
                            disabled={!!busy || st === 'Paid' || st === 'Dispensed'}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                            title={st === 'Paid' || st === 'Dispensed' ? 'Price is locked after payment' : 'Edit price'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deletePrice(i, m.name)}
                            disabled={!!busy || st === 'Paid' || st === 'Dispensed'}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
                            title={st === 'Paid' || st === 'Dispensed' ? 'Price is locked after payment' : 'Delete price'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {st === 'Pending' && (
                          <>
                            <button
                              onClick={() => markPaid(i, m.name)}
                              disabled={!!busy || !hasPrice}
                              title={hasPrice ? 'Record payment' : 'Set a price first'}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                              <Wallet className="w-3.5 h-3.5" /> Mark Paid
                            </button>
                            <button
                              onClick={() => setAvailable(i, false, m.name)}
                              disabled={!!busy}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50"
                            >
                              <Ban className="w-3.5 h-3.5" /> Not available
                            </button>
                          </>
                        )}
                        {st === 'Not Available' && (
                          <button
                            onClick={() => setAvailable(i, true, m.name)}
                            disabled={!!busy}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        )}
                        {st === 'Paid' && (
                          <button
                            onClick={() => dispenseItem(i, m.name)}
                            disabled={!!busy}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                          >
                            {busy === `${i}-dispense` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />} Dispense
                          </button>
                        )}
                        {st === 'Dispensed' && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Dispensed{m.dispensedAt ? ` ${fmtDate(m.dispensedAt)}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {hasPrice && (
                      <p className="mt-1.5 text-[11px] text-gray-400">
                        {m.priceSetBy ? `Priced by ${m.priceSetBy}` : ''}
                        {m.paidByName ? ` | Paid: ${m.paidByName}${m.paidAt ? ` on ${fmtDate(m.paidAt)}` : ''}` : ''}
                      </p>
                    )}
                  </div>
                );
              })}
              {(target.medications || []).length === 0 && <p className="text-sm text-gray-400">No medicines on this prescription.</p>}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
              <span className="text-gray-500">
                Total: <strong className="text-gray-900">{formatNaira(rxTotal(target))}</strong>
                <span className="mx-2 text-gray-300">|</span>
                Paid: <strong className="text-green-700">{formatNaira(rxPaid(target))}</strong>
              </span>
              <span className="text-xs text-gray-400">Set price, collect payment, then dispense each drug.</span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setTarget(null)}
                disabled={!!busy}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
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
