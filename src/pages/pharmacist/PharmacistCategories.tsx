import { useState, useEffect, useCallback } from 'react';
import { Package, Pill, Loader2, AlertCircle, Plus, X, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const naira = (n?: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
const cardColors = ['bg-blue-50 text-blue-600', 'bg-red-50 text-red-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600', 'bg-teal-50 text-teal-600'];

interface CatMedicine {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

export default function PharmacistCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOriginal, setEditOriginal] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState('');
  const [deleting, setDeleting] = useState('');

  // expandable medicine panel (edit / add price in place)
  const [expanded, setExpanded] = useState<string | null>(null);
  const [panelMeds, setPanelMeds] = useState<CatMedicine[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelError, setPanelError] = useState('');
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [savingPrice, setSavingPrice] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);
  const [medForm, setMedForm] = useState({ name: '', stock: '', price: '' });
  const [medSaving, setMedSaving] = useState(false);
  const [medError, setMedError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/pharmacy/categories');
      setCategories(data.categories || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadPanel = useCallback(async (cat: string) => {
    setPanelLoading(true);
    setPanelError('');
    try {
      let meds: CatMedicine[] = [];
      if (cat === 'Uncategorized') {
        const { data } = await api.get('/pharmacy');
        meds = (data.medicines || []).filter((m: any) => !m.category);
      } else {
        const { data } = await api.get('/pharmacy', { params: { category: cat } });
        meds = data.medicines || [];
      }
      setPanelMeds(meds);
      setPriceDrafts(Object.fromEntries(meds.map((m) => [m._id, String(m.price ?? 0)])));
    } catch (err: any) {
      setPanelError(err.response?.data?.message || 'Failed to load medicines');
      setPanelMeds([]);
    } finally {
      setPanelLoading(false);
    }
  }, []);

  const togglePanel = (cat: string) => {
    if (expanded === cat) {
      setExpanded(null);
      setShowAddMed(false);
      setMedError('');
      return;
    }
    setExpanded(cat);
    setShowAddMed(false);
    setMedError('');
    loadPanel(cat);
  };

  const openAdd = () => {
    setEditOriginal(null);
    setNewName('');
    setAddError('');
    setShowModal(true);
  };

  const openEdit = (name: string) => {
    setEditOriginal(name);
    setNewName(name);
    setAddError('');
    setShowModal(true);
  };

  const saveCategory = async () => {
    const name = newName.trim();
    if (!name) {
      setAddError('Enter a category name');
      return;
    }
    setSaving(true);
    setAddError('');
    try {
      if (editOriginal) {
        await api.put(`/pharmacy/categories/${encodeURIComponent(editOriginal)}`, { name });
      } else {
        await api.post('/pharmacy/categories', { name });
      }
      setNewName('');
      setShowModal(false);
      setEditOriginal(null);
      await loadCategories();
    } catch (err: any) {
      setAddError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (name: string) => {
    if (!window.confirm(`Delete category "${name}"? Medicines using it will move to Uncategorized.`)) return;
    setDeleting(name);
    try {
      await api.delete(`/pharmacy/categories/${encodeURIComponent(name)}`);
      if (expanded === name) setExpanded(null);
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting('');
    }
  };

  const savePrice = async (med: CatMedicine) => {
    const value = Number(priceDrafts[med._id]);
    if (!Number.isFinite(value) || value < 0) {
      setPanelError('Price must be zero or more');
      return;
    }
    setSavingPrice(med._id);
    setPanelError('');
    try {
      await api.put(`/pharmacy/${med._id}`, { price: value });
      setPanelMeds((prev) => prev.map((m) => (m._id === med._id ? { ...m, price: value } : m)));
    } catch (err: any) {
      setPanelError(err.response?.data?.message || 'Failed to save price');
    } finally {
      setSavingPrice('');
    }
  };

  const addMedicine = async () => {
    const name = medForm.name.trim();
    if (!name) {
      setMedError('Medicine name is required');
      return;
    }
    const stock = Number(medForm.stock || 0);
    const price = Number(medForm.price || 0);
    if (!Number.isFinite(stock) || stock < 0 || !Number.isFinite(price) || price < 0) {
      setMedError('Stock and price must be zero or more');
      return;
    }
    setMedSaving(true);
    setMedError('');
    try {
      await api.post('/pharmacy', {
        name,
        category: expanded || '',
        stock,
        price,
        minimumStock: 10,
      });
      setMedForm({ name: '', stock: '', price: '' });
      if (expanded) await loadPanel(expanded);
      await loadCategories();
    } catch (err: any) {
      setMedError(err.response?.data?.message || 'Failed to add medicine');
    } finally {
      setMedSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        icon={Package}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading categories...
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">No categories yet.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className={`w-12 h-12 rounded-lg ${cardColors[i % cardColors.length]} flex items-center justify-center`}>
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(cat.name)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                  title="Edit category"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => removeCategory(cat.name)}
                  disabled={deleting === cat.name}
                  className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  title="Delete category"
                >
                  {deleting === cat.name ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-600" />
                  )}
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.count} medicine{cat.count === 1 ? '' : 's'}</p>
            <p className="text-sm text-gray-500">Total Value: {naira(cat.totalValue)}</p>

            <button
              onClick={() => togglePanel(cat.name)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {expanded === cat.name ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {expanded === cat.name ? 'Hide medicines' : 'Edit prices / add medicine'}
            </button>

            {expanded === cat.name && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                {panelLoading ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading medicines...
                  </div>
                ) : panelError ? (
                  <p className="text-sm text-red-600">{panelError}</p>
                ) : panelMeds.length === 0 ? (
                  <p className="text-sm text-gray-400">No medicines in this category yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {panelMeds.map((m) => (
                      <li key={m._id} className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-700 flex-1 min-w-0 truncate" title={m.name}>
                          {m.name}
                          <span className="block text-xs text-gray-400">{m.stock} in stock</span>
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={priceDrafts[m._id] ?? ''}
                          onChange={(e) => setPriceDrafts((d) => ({ ...d, [m._id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') savePrice(m);
                          }}
                          className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Price"
                        />
                        <button
                          onClick={() => savePrice(m)}
                          disabled={savingPrice === m._id}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {savingPrice === m._id && <Loader2 className="w-3 h-3 animate-spin" />}
                          Save
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {showAddMed ? (
                  <div className="mt-3 border border-gray-200 rounded-lg p-2 space-y-2">
                    <input
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                      placeholder="Medicine name"
                      autoFocus
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={0}
                        value={medForm.stock}
                        onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                        placeholder="Stock"
                        className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        min={0}
                        value={medForm.price}
                        onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                        placeholder="Price (₦)"
                        className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {medError && <p className="text-xs text-red-600">{medError}</p>}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowAddMed(false);
                          setMedError('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addMedicine}
                        disabled={medSaving}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {medSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAddMed(true);
                      setMedError('');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                    Add medicine with price
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => !saving && setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editOriginal ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => !saving && setShowModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Category name</label>
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setAddError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !saving) saveCategory();
              }}
              autoFocus
              maxLength={60}
              placeholder="e.g. Antibiotic"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {addError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {addError}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => !saving && setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editOriginal ? 'Save changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
