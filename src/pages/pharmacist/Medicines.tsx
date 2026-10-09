import { useState, useEffect, useCallback, useRef } from 'react';
import { Package, AlertTriangle, XCircle, Search, Loader2, AlertCircle, CheckCircle, Plus, Pencil, X, DollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-800',
  Active: 'bg-green-100 text-green-800',
  'Low Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-800',
  Expired: 'bg-red-100 text-red-800',
  Disposed: 'bg-gray-100 text-gray-600',
};

const naira = (n?: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
const fmtExpiry = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—';

const medStatus = (m: any) => {
  if (m.disposedAt) return 'Disposed';
  if (m.expiryDate && new Date(m.expiryDate) < new Date()) return 'Expired';
  return m.status || 'In Stock';
};

const emptyForm = { name: '', category: '', stock: '', minimumStock: '10', price: '', expiryDate: '', supplier: '' };

export default function Medicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<any>(emptyForm);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const debounce = useRef<number | null>(null);

  const load = useCallback(async (q = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy', { params: q ? { search: q } : {} });
      setMedicines(data.medicines || []);
      setCounts({ total: data.total || 0, inStock: data.inStock || 0, lowStock: data.lowStock || 0, outOfStock: data.outOfStock || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load medicines');
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
    debounce.current = window.setTimeout(() => load(q), 400);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setForm({
      name: m.name || '',
      category: m.category || '',
      stock: String(m.stock ?? 0),
      minimumStock: String(m.minimumStock ?? 10),
      price: String(m.price ?? 0),
      expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : '',
      supplier: m.supplier || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setFormError('Medicine name is required');
      return;
    }
    const stock = Number(form.stock);
    const price = Number(form.price);
    const minimumStock = Number(form.minimumStock);
    if (!(stock >= 0) || !(price >= 0) || !(minimumStock >= 0)) {
      setFormError('Stock, minimum stock and price must be zero or more');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const body = {
        name: form.name.trim(),
        category: form.category.trim(),
        stock,
        minimumStock,
        price,
        expiryDate: form.expiryDate || null,
        supplier: form.supplier.trim(),
      };
      if (editing) {
        await api.put(`/pharmacy/${editing._id}`, body);
        setNotice({ type: 'ok', text: `${body.name} updated.` });
      } else {
        await api.post('/pharmacy', body);
        setNotice({ type: 'ok', text: `${body.name} added to inventory.` });
      }
      setShowForm(false);
      await load(search);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  const now = new Date();
  const expiredCount = medicines.filter((m) => m.expiryDate && new Date(m.expiryDate) < now && !m.disposedAt).length;
  const activeCount = medicines.filter((m) => !m.disposedAt && (!m.expiryDate || new Date(m.expiryDate) >= now)).length;
  const stats = [
    { label: 'Total', value: String(counts.total), icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Active', value: String(activeCount), icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Low Stock', value: String(counts.lowStock), icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Expired', value: String(expiredCount), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    {
      label: 'Stock Value',
      value: naira(
        medicines
          .filter((m) => !m.disposedAt)
          .reduce((s, m) => s + (Number(m.price) || 0) * (Number(m.stock) || 0), 0)
      ),
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
  ];

  const field = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicines"
        icon={Package}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading medicines...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicines.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{m.medicineId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{m.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.category || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.stock}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{naira(m.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtExpiry(m.expiryDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[medStatus(m)] || 'bg-gray-100 text-gray-700'}`}>
                        {medStatus(m)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No medicines found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !saving && setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button onClick={() => setShowForm(false)} disabled={saving} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="e.g. Amoxicillin 500mg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field} placeholder="e.g. Antibiotic" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input type="number" min={0} value={form.minimumStock} onChange={(e) => setForm({ ...form, minimumStock: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                  <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={field} />
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
                {editing ? 'Save changes' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
