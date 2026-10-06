import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import api from '../../services/api';

type Props = {
  canRemove?: boolean;
  onUpdate?: () => void;
  className?: string;
};

const fmt = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-NG', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

export default function EmergencyPanel({ canRemove = false, onUpdate, className = '' }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const fetchList = useCallback(async () => {
    try {
      const { data } = await api.get('/patients/emergency');
      setPatients(data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load emergencies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const removeEmergency = async (p: any) => {
    const label = [p.firstName, p.surname].filter(Boolean).join(' ') || 'this patient';
    if (!window.confirm(`Remove ${label} from emergency?`)) return;
    setBusy(String(p._id));
    setError('');
    try {
      await api.delete(`/patients/${p._id}/emergency`);
      await fetchList();
      onUpdate?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not remove emergency');
    } finally {
      setBusy('');
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 border-red-200 shadow-sm overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-2 px-5 py-3 bg-red-50 border-b border-red-100">
        <h3 className="flex items-center gap-2 text-sm font-bold text-red-700 uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4" />
          Emergency Patients
          <span className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs">
            {loading ? '…' : patients.length}
          </span>
        </h3>
        {!loading && patients.length === 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> All clear
          </span>
        )}
      </div>
      {error && <p className="px-5 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">{error}</p>}
      {loading ? (
        <div className="flex items-center gap-2 px-5 py-4 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading emergencies...
        </div>
      ) : patients.length === 0 ? (
        <p className="px-5 py-4 text-sm text-gray-500">No patients currently in emergency.</p>
      ) : (
        <ul className="divide-y divide-red-100">
          {patients.map((p) => (
            <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {[p.firstName, p.surname].filter(Boolean).join(' ')}
                    <span className="ml-2 text-xs font-normal text-gray-400">{p.patientId}</span>
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {p.emergencyReason ? `${p.emergencyReason} · ` : ''}
                    {p.emergencyBy ? `flagged by ${p.emergencyBy}` : 'flagged'}
                    {p.emergencyAt ? ` · ${fmt(p.emergencyAt)}` : ''}
                  </p>
                </div>
              </div>
              {canRemove && (
                <button
                  onClick={() => removeEmergency(p)}
                  disabled={busy === String(p._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Remove from emergency"
                >
                  {busy === String(p._id) ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
