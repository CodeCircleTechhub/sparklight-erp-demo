import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Unpaid'];

function approvalHint(role: string) {
  if (role === 'hr') return 'Awaiting Manager and Super Admin approval.';
  if (role === 'manager') return 'Awaiting HR and Super Admin approval.';
  return 'Awaiting Manager and HR approval.';
}

interface ApplyLeaveModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ApplyLeaveModal({ open, onClose, onSubmitted }: ApplyLeaveModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setMessage('');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const submit = async () => {
    if (!form.startDate || !form.endDate) {
      setMessage('Please select start and end dates');
      return;
    }
    setSubmitting(true);
    try {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      await api.post('/hr/leave', {
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        days,
        reason: form.reason,
      });
      setMessage(`success|Leave request submitted. ${approvalHint(user?.role || '')}`);
      setForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
      onSubmitted?.();
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.replace('success|', '')}
            </div>
          )}
          <div>
            <label className={labelClass}>Leave Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputClass}
            >
              {leaveTypes.map((t) => (
                <option key={t} value={t}>{t} Leave</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className={inputClass}
              rows={3}
              placeholder="Reason for leave..."
            />
          </div>
          <p className="text-xs text-gray-500">{approvalHint(user?.role || '')}</p>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting || !form.startDate || !form.endDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
