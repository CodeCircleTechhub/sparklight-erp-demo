import { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingCart, CheckCircle, Loader2, AlertCircle, Plus, X, PackageCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const naira = (n?: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export default function PurchaseRecords() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [counts, setCounts] = useState({ monthTotal: 0, pending: 0, completed: 0 });
  const [medicines, setMedicines] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ supplier: '', notes: '', items: [{ medicine: '', quantity: '1', unitPrice: '' }] });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy/purchases');
      setPurchases(data.purchases || []);
      setCounts({ monthTotal: data.monthTotal || 0, pending: data.pending || 0, completed: data.completed || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load purchase records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = async () => {
    setForm({ supplier: '', notes: '', items: [{ medicine: '', quantity: '1', unitPrice: '' }] });
    setFormError('');
    setShowForm(true);
    if (!medicines.length) {
      try {
        const [medRes, supRes] = await Promise.all([api.get('/pharmacy'), api.get('/pharmacy/suppliers')]);
        setMedicines(medRes.data.medicines || []);
        setSuppliers(supRes.data.suppliers || []);
      } catch (err: any) {
        setFormError(err.response?.data?.message || 'Failed to load medicines/suppliers');
      }
    }
  };

  const setItem = (i: number, patch: Partial<{ medicine: string; quantity: string; unitPrice: string }>) => {
    setForm((f) => ({ ...f, items: f.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  };

  const save = async () => {
    const items = form.items
      .filter((it) => it.medicine)
      .map((it) => ({ medicine: it.medicine, quantity: Number(it.quantity) || 1, unitPrice: Number(it.unitPrice) || 0 }));
    if (!items.length) {
      setFormError('Select at least one medicine');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const { data } = await api.post('/pharmacy/purchases', { supplier: form.supplier || null, items, notes: form.notes });
      setNotice({ type: 'ok', text: `Purchase ${data.purchase?.purchaseId || ''} created — receive it to restock inventory.` });
      setShowForm(false);
      await load();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create purchase');
    } finally {
      setSaving(false);
    }
  };

  const receive = async (p: any) => {
    setBusyId(p._id);
    setError('');
    try {
      const { data } = await api.put(`/pharmacy/purchases/${p._id}/receive`);
      setNotice({ type: 'ok', text: `${p.purchaseId} received — ${data.restocked} medicine${data.restocked === 1 ? '' : 's'} restocked.` });
      await load();
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to receive purchase' });
    } finally {
      setBusyId(null);
    }
  };

  const stats = [
    { label: 'This Month', value: naira(counts.monthTotal), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Orders', value: String(counts.pending), icon: ShoppingCart, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', value: String(counts.completed), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const field = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Records"
        icon={ShoppingCart}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Purchase
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading purchase records...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Purchase ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.purchaseId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.supplierName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(p.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(p.items || []).length} items</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{naira(p.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === 'Pending' ? (
                        <button
                          onClick={() => receive(p)}
                          disabled={busyId === p._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {busyId === p._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />}
                          Receive
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No purchase records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !saving && setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">New Purchase</h3>
              <button onClick={() => setShowForm(false)} disabled={saving} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Stock is booked into inventory when the purchase is received.</p>
            {formError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className={field}>
                  <option value="">Select supplier (optional)</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
              {form.items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end border border-gray-200 rounded-lg p-2">
                  <div className="col-span-6">
                    <label className="block text-xs text-gray-500 mb-1">Medicine</label>
                    <select value={it.medicine} onChange={(e) => setItem(i, { medicine: e.target.value })} className={field}>
                      <option value="">Select medicine</option>
                      {medicines.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Qty</label>
                    <input type="number" min={1} value={it.quantity} onChange={(e) => setItem(i, { quantity: e.target.value })} className={field} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">Unit Price (₦)</label>
                    <input type="number" min={0} value={it.unitPrice} onChange={(e) => setItem(i, { unitPrice: e.target.value })} className={field} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))}
                      disabled={form.items.length === 1}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-30 p-1"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, items: [...f.items, { medicine: '', quantity: '1', unitPrice: '' }] }))}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add item
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={field} placeholder="Optional notes" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
