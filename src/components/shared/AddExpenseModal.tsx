import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = ['Salaries', 'Utilities', 'Supplies', 'Equipment', 'Maintenance', 'Pharmaceuticals', 'Other'];

interface AddExpenseModalProps {
  open: boolean;
  onClose: (created?: any) => void;
}

export default function AddExpenseModal({ open, onClose }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Approved');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const reset = () => {
    setTitle('');
    setCategory('Other');
    setAmount('');
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setStatus('Approved');
    setNotes('');
    setError('');
  };

  const submit = async () => {
    if (busy) return;
    if (!title.trim() || !(Number(amount) > 0)) {
      setError('Title and a positive amount are required');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/billing/expenses', {
        title: title.trim(),
        category,
        amount: Number(amount),
        expenseDate,
        status,
        notes: notes.trim(),
      });
      reset();
      onClose(data.expense);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setBusy(false);
    }
  };

  const field = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !busy && onClose()}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Expense</h3>
          <button
            type="button"
            onClick={() => onClose()}
            disabled={busy}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={field} placeholder="e.g. Generator fuel" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦) *</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={field}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={field} placeholder="Optional details" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => onClose()}
            disabled={busy}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}
