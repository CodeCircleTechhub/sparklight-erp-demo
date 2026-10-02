import { useEffect, useMemo, useState } from 'react';
import { X, Loader2, Save, AlertCircle, Plus, Trash2, Receipt } from 'lucide-react';
import api from '../../services/api';

export const INVOICE_TYPES = [
  'Consultation',
  'Lab Tests',
  'Surgery',
  'Medication',
  'Hospital Stay',
  'Other',
];

export interface BillingPatient {
  _id: string;
  patientId?: string;
  name?: string;
}

interface LineItem {
  description: string;
  amount: string;
}

interface Props {
  /** when provided, the bill is raised for this patient only */
  patient?: BillingPatient;
  onClose: () => void;
  onSaved?: (invoice: any) => void;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
const selectClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function PatientBillingModal({ patient, onClose, onSaved }: Props) {
  const [patients, setPatients] = useState<BillingPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientId, setPatientId] = useState(patient?._id || '');
  const [type, setType] = useState('Consultation');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', amount: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const needsPatient = !patient?._id;

  useEffect(() => {
    if (!needsPatient) return;
    let cancelled = false;
    (async () => {
      setPatientsLoading(true);
      try {
        const { data } = await api.get('/patients', { params: { limit: 500 } });
        const list = (data.patients || data || []).map((p: any) => ({
          _id: p._id,
          patientId: p.patientId,
          name: [p.firstName, p.surname].filter(Boolean).join(' ') || p.patientId || p._id,
        }));
        if (!cancelled) setPatients(list);
      } catch {
        if (!cancelled) setError('Could not load the patient list');
      } finally {
        if (!cancelled) setPatientsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [needsPatient]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [items],
  );

  const setItem = (index: number, key: keyof LineItem, value: string) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const resolvedPatient = patient?._id || patientId;
    if (!resolvedPatient) {
      setError('Select a patient');
      return;
    }
    const lineItems = items
      .filter((i) => i.description.trim() && Number(i.amount) > 0)
      .map((i) => ({ description: i.description.trim(), amount: Number(i.amount) }));
    if (!lineItems.length) {
      setError('Add at least one item with a description and amount');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post('/billing/invoices', {
        patient: resolvedPatient,
        items: lineItems,
        type,
        totalAmount: lineItems.reduce((s, i) => s + i.amount, 0),
        dueDate: dueDate || undefined,
        notes: notes || '',
      });
      onSaved?.(data.invoice);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setSaving(false);
    }
  };

  const label = (p: BillingPatient) => p.name || p.patientId || p._id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !saving) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">New Patient Bill</h3>
              <p className="text-sm text-gray-500">
                {patient
                  ? `${patient.name || ''}${patient.patientId ? ` (${patient.patientId})` : ''}`
                  : 'Raised by a doctor or nurse'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {needsPatient && (
            <div>
              <label className={labelClass}>Patient *</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">
                  {patientsLoading ? 'Loading patients...' : 'Select patient'}
                </option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {label(p)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bill Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {INVOICE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Items</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => setItem(index, 'description', e.target.value)}
                    placeholder="Item / service"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => setItem(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    className={`${inputClass} w-32`}
                  />
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                    disabled={items.length === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-40"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { description: '', amount: '' }])}
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add item
            </button>
          </div>

          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Anything the accounts team should know"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Total{' '}
              <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Create Bill'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
