import { useState, useEffect, useCallback } from 'react';
import {
  HeartPulse,
  Search,
  Loader2,
  AlertCircle,
  Plus,
  CalendarClock,
  CheckCircle2,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/ui/PageComponents';
import PatientHistoryModal from '../../components/shared/PatientHistoryModal';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (t?: string) => {
  if (!t) return '';
  const [hRaw, m] = t.split(':');
  const h = Number(hRaw);
  if (Number.isNaN(h)) return t;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${m || '00'} ${ampm}`;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

interface AntenatalItem {
  _id: string;
  patient: any;
  patientName: string;
  patientId: string;
  lmp: string | null;
  edd: string | null;
  gravida: number | null;
  para: number | null;
  nextVisitDate: string | null;
  nextVisitTime: string;
  notes: string;
  status: 'Active' | 'Completed';
  outcome?: string;
  completedAt?: string | null;
}

// Antenatal care register — controlled by BOTH nurses and doctors.
// A woman is enrolled here until she gives birth, then removed (completed).
export default function AntenatalPage() {
  const [items, setItems] = useState<AntenatalItem[]>([]);
  const [status, setStatus] = useState<'Active' | 'All'>('Active');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  // enroll modal
  const [showAdd, setShowAdd] = useState(false);
  const [patientQuery, setPatientQuery] = useState('');
  const [patientHits, setPatientHits] = useState<any[]>([]);
  const [picked, setPicked] = useState<any | null>(null);
  const [form, setForm] = useState({ lmp: '', edd: '', gravida: '', para: '', nextVisitDate: '', nextVisitTime: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchList = useCallback(async (q: string, st: 'Active' | 'All') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/antenatal', {
        params: { status: st, ...(q ? { search: q } : {}) },
      });
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load antenatal list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchList(search.trim(), status), 300);
    return () => clearTimeout(t);
  }, [search, status, fetchList]);

  // patient picker search (debounced)
  useEffect(() => {
    if (!showAdd) return;
    const q = patientQuery.trim();
    if (q.length < 2) {
      setPatientHits([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/nurse/patients', { params: { search: q } });
        setPatientHits((data.patients || []).slice(0, 8));
      } catch {
        setPatientHits([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [patientQuery, showAdd]);

  const resetForm = () => {
    setForm({ lmp: '', edd: '', gravida: '', para: '', nextVisitDate: '', nextVisitTime: '', notes: '' });
    setPicked(null);
    setPatientQuery('');
    setPatientHits([]);
    setFormError('');
  };

  const enroll = async () => {
    if (!picked) return setFormError('Select a patient first');
    setSaving(true);
    setFormError('');
    try {
      await api.post('/antenatal', {
        patient: picked._id,
        lmp: form.lmp || '',
        edd: form.edd || '',
        gravida: form.gravida,
        para: form.para,
        nextVisitDate: form.nextVisitDate,
        nextVisitTime: form.nextVisitTime,
        notes: form.notes,
      });
      setShowAdd(false);
      resetForm();
      fetchList(search.trim(), status);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to enroll patient');
    } finally {
      setSaving(false);
    }
  };

  const markDelivered = async (item: AntenatalItem) => {
    const name = item.patientName || 'this patient';
    if (!window.confirm(`Remove ${name} from antenatal care? (she has given birth / left the programme)`)) return;
    setBusy(item._id);
    try {
      await api.post(`/antenatal/${item._id}/complete`, { outcome: 'Delivered' });
      fetchList(search.trim(), status);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setBusy(null);
    }
  };

  const reopen = async (item: AntenatalItem) => {
    setBusy(item._id);
    try {
      await api.post(`/antenatal/${item._id}/reopen`);
      fetchList(search.trim(), status);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setBusy(null);
    }
  };

  const activeCount = items.filter((i) => i.status === 'Active').length;
  const dueSoon = items.filter(
    (i) => i.status === 'Active' && i.nextVisitDate && new Date(i.nextVisitDate).getTime() <= Date.now() + 7 * 86400000
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Antenatal"
        description="Pregnant women under antenatal care with their next visit schedule. Enrol on admission; remove once she gives birth."
        icon={HeartPulse}
        action={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAdd(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add to Antenatal
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-100">
              <HeartPulse className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{status === 'Active' ? activeCount : items.length}</p>
              <p className="text-sm text-gray-500">{status === 'Active' ? 'Active' : 'Total shown'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100">
              <CalendarClock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dueSoon}</p>
              <p className="text-sm text-gray-500">Visit due within 7 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter((i) => i.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-500">Completed (given birth)</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or patient ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 self-start">
              {(['Active', 'All'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    status === s ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s === 'Active' ? 'Active' : 'All (incl. completed)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading antenatal list...
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={HeartPulse}
              title="No antenatal patients"
              description="Enrol a pregnant patient to start tracking her visits here."
            />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">LMP</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">EDD</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">G / P</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Next Visit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => {
                  const pid = item.patient?._id || item.patient;
                  const overdue =
                    item.status === 'Active' &&
                    item.nextVisitDate &&
                    new Date(item.nextVisitDate).getTime() < Date.now();
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.patientId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-full bg-pink-100 text-pink-700 ring-1 ring-pink-200 px-2 py-0.5 text-[11px] font-semibold">
                            Antenatal
                          </span>
                          {item.patientName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(item.lmp)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(item.edd)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.gravida ?? '—'} / {item.para ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.nextVisitDate ? (
                          <span className={overdue ? 'font-semibold text-red-600' : 'text-gray-700'}>
                            {fmtDate(item.nextVisitDate)}
                            {item.nextVisitTime ? ` · ${fmtTime(item.nextVisitTime)}` : ''}
                            {overdue ? ' (overdue)' : ''}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Active' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status === 'Active' ? 'Under care' : item.outcome || 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewing(pid)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                            title="View chart"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          {item.status === 'Active' ? (
                            <button
                              onClick={() => markDelivered(item)}
                              disabled={busy === item._id}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
                              title="She has given birth — remove from antenatal"
                            >
                              {busy === item._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Given birth
                            </button>
                          ) : (
                            <button
                              onClick={() => reopen(item)}
                              disabled={busy === item._id}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                              title="Re-open this record"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewing && <PatientHistoryModal patientId={viewing} onClose={() => setViewing(null)} />}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Add patient to Antenatal</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Patient *</label>
                {picked ? (
                  <div className="flex items-center justify-between rounded-lg border border-pink-200 bg-pink-50 px-3 py-2">
                    <span className="text-sm font-medium text-gray-900">
                      {picked.name} <span className="text-gray-500">({picked.patientId})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPicked(null);
                        setPatientQuery('');
                      }}
                      className="text-xs text-pink-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={patientQuery}
                        onChange={(e) => setPatientQuery(e.target.value)}
                        placeholder="Search name or patient ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    {patientHits.length > 0 && (
                      <ul className="mt-1 max-h-44 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                        {patientHits.map((p) => (
                          <li key={p._id}>
                            <button
                              type="button"
                              onClick={() => {
                                setPicked(p);
                                setPatientHits([]);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-pink-50"
                            >
                              <span className="font-medium text-gray-900">{p.name}</span>{' '}
                              <span className="text-gray-500">({p.patientId})</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">LMP</label>
                  <input
                    type="date"
                    value={form.lmp}
                    max={todayStr()}
                    onChange={(e) => setForm({ ...form, lmp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">EDD</label>
                  <input
                    type="date"
                    value={form.edd}
                    onChange={(e) => setForm({ ...form, edd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gravida</label>
                  <input
                    type="number"
                    min={0}
                    value={form.gravida}
                    onChange={(e) => setForm({ ...form, gravida: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Para</label>
                  <input
                    type="number"
                    min={0}
                    value={form.para}
                    onChange={(e) => setForm({ ...form, para: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Next visit date</label>
                  <input
                    type="date"
                    value={form.nextVisitDate}
                    min={todayStr()}
                    onChange={(e) => setForm({ ...form, nextVisitDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Next visit time</label>
                  <input
                    type="time"
                    value={form.nextVisitTime}
                    onChange={(e) => setForm({ ...form, nextVisitTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Risk factors, booking notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={enroll}
                disabled={saving || !picked}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Enrol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
