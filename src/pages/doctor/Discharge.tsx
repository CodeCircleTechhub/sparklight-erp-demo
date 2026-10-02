import { useCallback, useEffect, useState } from 'react';
import { LogOut, Save, Loader2, AlertCircle, CheckCircle, Receipt } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import PatientBillingModal from '../../components/shared/PatientBillingModal';
import { COMMON_CONDITIONS } from '../../lib/clinicalOptions';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function Discharge() {
  const [patients, setPatients] = useState<any[]>([]);
  const [admission, setAdmission] = useState<any | null>(null);
  const [admittedBy, setAdmittedBy] = useState<Record<string, any>>({});
  const [discharges, setDischarges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    patient: '', admission: '', diagnosis: '', treatment: '', followUp: '', instructions: '',
  });
  const [billing, setBilling] = useState(false);
  const [bills, setBills] = useState<any[]>([]);

  // resolve the selected patient's active admission from the preloaded map
  useEffect(() => {
    setAdmission(form.patient ? admittedBy[form.patient] || null : null);
  }, [form.patient, admittedBy]);

  // bills must be settled by Accounts before discharge — surface them here
  useEffect(() => {
    let cancelled = false;
    const patientId = admission?.patient?._id;
    if (!patientId) {
      setBills([]);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get('/billing/invoices', { params: { patient: patientId } });
        if (!cancelled) setBills(data.invoices || []);
      } catch {
        if (!cancelled) setBills([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [admission]);

  const outstanding = bills.filter((i) => i.status === 'Pending' || i.status === 'Overdue');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [patientRes, dischargeRes, admissionRes] = await Promise.all([
        api.get('/doctor/patients', { params: { all: 1 } }),
        api.get('/doctor/discharges'),
        api.get('/admissions', { params: { limit: 200 } }),
      ]);
      setPatients(patientRes.data.patients || []);
      setDischarges(dischargeRes.data.items || []);
      const map: Record<string, any> = {};
      for (const a of admissionRes.data.items || []) {
        if (a.status !== 'Admitted' && a.status !== 'Transferred') continue;
        const pid = a.patient?._id || a.patient;
        if (pid) map[String(pid)] = a;
      }
      setAdmittedBy(map);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load discharges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) {
      setError('Select the patient to discharge.');
      return;
    }
    if (!admission?._id) {
      setError('This patient has no active admission to discharge.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post(`/admissions/${admission._id}/discharge`, { notes: form.instructions });

      if (admission.patient?._id) {
        if (form.diagnosis.trim() || form.treatment.trim()) {
          await api
            .post('/doctor/records', {
              patient: admission.patient._id,
              type: 'Consultation',
              diagnosis: form.diagnosis,
              notes: [form.treatment, form.instructions].filter(Boolean).join('\n'),
            })
            .catch(() => null);
        }
        if (form.followUp) {
          await api
            .post('/doctor/follow-ups', {
              patient: admission.patient._id,
              scheduledDate: form.followUp,
              reason: form.diagnosis ? `Post-discharge review: ${form.diagnosis}` : 'Post-discharge review',
              notes: form.instructions,
            })
            .catch(() => null);
        }
      }

      setForm({ patient: '', admission: '', diagnosis: '', treatment: '', followUp: '', instructions: '' });
      setAdmission(null);
      setNotice('Patient discharged.');
      await fetchData();
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.requiresSettlement) {
        setError(data.message || 'Unpaid bills must be settled by Accounts before discharge.');
        if (Array.isArray(data.outstanding) && data.outstanding.length) {
          setBills((prev) => {
            const known = new Set(prev.map((b) => b.invoiceId));
            const extra = data.outstanding.filter((o: any) => !known.has(o.invoiceId));
            return [...prev, ...extra];
          });
        }
      } else {
        setError(data?.message || 'Could not discharge patient');
      }
    } finally {
      setSaving(false);
    }
  };

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  const billingPatient = admission?.patient?._id
    ? {
        _id: admission.patient._id,
        patientId: admission.patient.patientId || '',
        name: admission.patientName || admission.patient?.firstName,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discharge Management"
        icon={LogOut}
        action={
          <button
            type="button"
            onClick={() => setBilling(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Receipt className="w-4 h-4" /> Bill Patient
          </button>
        }
      />

      {billing && (
        <PatientBillingModal
          patient={billingPatient}
          onClose={() => setBilling(false)}
          onSaved={() => setNotice('Bill created and added to the patient account.')}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Discharge</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={field}
              >
                <option value="">Select patient</option>
                {patients.map((p) => {
                  const adm = admittedBy[p._id];
                  const ward = adm ? adm.ward || adm.room?.ward || '' : '';
                  const room = adm ? adm.roomNumber || adm.room?.roomNumber || '' : '';
                  return (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.patientId ? `(${p.patientId})` : ''} —{' '}
                      {adm
                        ? `Admitted${ward ? ` · ${ward}` : ''}${room ? `/${room}` : ''}`
                        : 'Not admitted'}
                    </option>
                  );
                })}
              </select>
              {!loading && patients.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">No patients found.</p>
              )}
            </div>

            {form.patient && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                {admission ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {admission.patientName ||
                        [admission.patient?.firstName, admission.patient?.surname].filter(Boolean).join(' ')}
                      {admission.patient?.patientId ? ` · ${admission.patient.patientId}` : ''}
                    </p>
                    <p className="text-xs text-gray-600">
                      Ward/Room: {admission.ward || admission.room?.ward || '—'} /{' '}
                      {admission.roomNumber || admission.room?.roomNumber || '—'} · Admitted{' '}
                      {fmtDate(admission.admissionDate)} · {admission.status}
                      {admission.doctorName ? ` · Dr. ${admission.doctorName.replace(/^Dr\.\s*/, '')}` : ''}
                    </p>
                  </div>
                ) : (
                  <p className="text-amber-700">
                    This patient has no active admission — admit the patient before discharging.
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="Enter diagnosis... (e.g. Malaria, Typhoid, Pregnancy)"
                list="discharge-diagnosis-options"
                className={field}
              />
              <datalist id="discharge-diagnosis-options">
                {COMMON_CONDITIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Summary</label>
              <textarea
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                rows={3}
                placeholder="Summarize treatment provided..."
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                rows={2}
                placeholder="Discharge instructions..."
                className={field}
              />
            </div>

            {admission && bills.length > 0 && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  outstanding.length
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : 'border-green-200 bg-green-50 text-green-800'
                }`}
              >
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {outstanding.length
                    ? `${outstanding.length} unpaid bill(s) · NGN ${outstanding
                        .reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
                        .toLocaleString()}`
                    : 'All bills settled — ready for discharge'}
                </p>
                <ul className="mt-2 space-y-1 text-xs">
                  {bills.slice(0, 8).map((i: any) => (
                    <li key={i._id || i.invoiceId} className="flex justify-between gap-3">
                      <span>
                        {i.invoiceId} · {i.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-full font-semibold ${
                            i.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : i.status === 'Overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {i.status === 'Paid' ? 'Paid · Confirmed' : i.status}
                        </span>
                        <span className="font-medium">₦{(i.totalAmount || 0).toLocaleString()}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs">
                  {outstanding.length
                    ? 'Accounts must confirm payment before this patient can be discharged.'
                    : 'Payment confirmed by Accounts — discharge is allowed.'}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={saving || loading || outstanding.length > 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {outstanding.length > 0 ? 'Payment required before discharge' : 'Submit Discharge'}
            </button>
            {outstanding.length > 0 && (
              <p className="text-xs text-amber-700">
                {outstanding.length} bill(s) are still unpaid. Accounts must confirm payment before this
                patient can be discharged.
              </p>
            )}
          </div>
        </form>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Discharges</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : discharges.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No discharges yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {discharges.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(d.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.diagnosis || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.doctor || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
