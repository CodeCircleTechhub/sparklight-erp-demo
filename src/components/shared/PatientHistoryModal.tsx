import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  X,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Droplet,
  CalendarDays,
  Lock,
  FlaskConical,
  Plus,
  Save,
  FileText,
  Pill,
  Stethoscope,
  Receipt,
  Clock,
  Download,
  UserCheck,
  Activity,
  CreditCard,
  HeartPulse,
  ClipboardList,
  CalendarClock,
  BedDouble,
  TestTube,
  PackageCheck,
  CheckCircle2,
  UserCog,
  Scan,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { COMMON_TESTS, IMAGING_TESTS } from '../../lib/clinicalOptions';
import { downloadLabResultPdf, downloadLabAttachment } from '../../utils/downloadLabFile';
import {
  ConsultationForm,
  DiagnosisForm,
  RecordForm,
  VitalsForm,
  NursingNoteForm,
  PrescriptionForm,
  InvoiceForm,
  FollowUpForm,
  PatientForm,
} from './emr/EmrForms';

type TabKey =
  | 'overview'
  | 'consultations'
  | 'diagnoses'
  | 'records'
  | 'vitals'
  | 'prescriptions'
  | 'tests'
  | 'billing'
  | 'history';

interface Props {
  patientId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

const PAY_ROLES = ['accountant', 'receptionist', 'super-admin'];
const PAY_METHODS = ['Cash', 'Credit Card', 'Bank Transfer', 'Insurance', 'Online'];
const CLIN_ROLES = ['super-admin', 'manager', 'doctor', 'nurse'];
const NOTE_ROLES = ['super-admin', 'manager', 'nurse'];
const BILL_ROLES = ['super-admin', 'manager', 'accountant', 'doctor', 'nurse', 'receptionist'];
const MANAGER_ROLES = ['super-admin', 'manager'];
const LAB_ROLES = ['super-admin', 'manager', 'laboratory'];
const PHARM_ROLES = ['super-admin', 'manager', 'pharmacist'];
const EDIT_PT_ROLES = ['super-admin', 'manager', 'receptionist', 'customer-care', 'senior-customer-care'];
const EMG_MARK_ROLES = ['super-admin', 'manager', 'receptionist', 'customer-care', 'senior-customer-care', 'doctor', 'nurse'];
const EMG_REMOVE_ROLES = ['super-admin', 'manager', 'receptionist', 'customer-care', 'senior-customer-care', 'doctor', 'nurse'];
const PHARMACY_TABS = ['overview', 'prescriptions', 'billing', 'history'];

const kindMeta: Record<string, { label: string; className: string }> = {
  consultation: { label: 'Consultation', className: 'bg-blue-100 text-blue-700' },
  diagnosis: { label: 'Diagnosis', className: 'bg-purple-100 text-purple-700' },
  record: { label: 'Record', className: 'bg-indigo-100 text-indigo-700' },
  prescription: { label: 'Prescription', className: 'bg-amber-100 text-amber-800' },
  lab: { label: 'Lab Test', className: 'bg-emerald-100 text-emerald-700' },
  imaging: { label: 'Imaging', className: 'bg-cyan-100 text-cyan-700' },
  visit: { label: 'Visit', className: 'bg-sky-100 text-sky-700' },
  admission: { label: 'Admission', className: 'bg-rose-100 text-rose-700' },
  'follow-up': { label: 'Follow-up', className: 'bg-teal-100 text-teal-700' },
  invoice: { label: 'Invoice', className: 'bg-orange-100 text-orange-700' },
  payment: { label: 'Payment', className: 'bg-green-100 text-green-800' },
  vital: { label: 'Vitals', className: 'bg-rose-100 text-rose-700' },
  note: { label: 'Nursing Note', className: 'bg-teal-100 text-teal-700' },
};

const statusClass = (s?: string) => {
  switch (s) {
    case 'Completed':
    case 'Paid':
    case 'Dispensed':
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
    case 'Scheduled':
      return 'bg-amber-100 text-amber-800';
    case 'In Progress':
    case 'Called':
    case 'In Consultation':
      return 'bg-blue-100 text-blue-800';
    case 'Not Available':
      return 'bg-red-100 text-red-700';
    case 'Cancelled':
    case 'Rejected':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// per-prescription drug money summary for the doctor/nurse view
const DrugTotals = ({ rx }: { rx: any }) => {
  const items = (rx.medications || []).filter((m: any) => m && m.name);
  const total = items.reduce((s: number, m: any) => s + (Number(m.price) || 0), 0);
  if (!total) return null;
  const paid = items
    .filter((m: any) => ['Paid', 'Dispensed'].includes(m.status || 'Pending'))
    .reduce((s: number, m: any) => s + (Number(m.price) || 0), 0);
  const dispensed = items.filter((m: any) => (m.status || 'Pending') === 'Dispensed').length;
  const unavailable = items.filter((m: any) => m.status === 'Not Available').length;
  return (
    <p className="mt-2 border-t border-gray-100 pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
      <span>
        Drug total: <strong className="text-gray-900">₦{total.toLocaleString()}</strong>
      </span>
      <span>
        Paid: <strong className="text-green-700">₦{paid.toLocaleString()}</strong>
      </span>
      <span>
        Dispensed: <strong>{dispensed}/{items.length}</strong>
      </span>
      {unavailable > 0 && <span className="text-red-600">Not available: {unavailable}</span>}
    </p>
  );
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

function ActionBtn({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function TabHead({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function PatientHistoryModal({ patientId, onClose, onRefresh }: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState<TabKey>('overview');
  const [busy, setBusy] = useState(false);
  const [emgOpen, setEmgOpen] = useState(false);
  const [emgReason, setEmgReason] = useState('');

  // test builder (requirement: add list of tests, then Save once)
  const [builderOpen, setBuilderOpen] = useState(false);
  const [orderKind, setOrderKind] = useState<'lab' | 'imaging'>('lab');
  const [draftTests, setDraftTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState('');
  const [priority, setPriority] = useState('Normal');

  // result viewer
  const [viewTest, setViewTest] = useState<any>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [dlError, setDlError] = useState('');

  // in-view forms — every create/edit happens here without leaving the patient
  const [form, setForm] = useState<{ kind: string; initial?: any } | null>(null);

  // payment update
  const [paying, setPaying] = useState<any>(null);
  const [payMethod, setPayMethod] = useState('Cash');
  const [payReference, setPayReference] = useState('');

  // laboratory result entry (worked from inside the chart)
  const [resulting, setResulting] = useState<any>(null);
  const [resultText, setResultText] = useState('');
  const [resultNotes, setResultNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get(`/doctor/patients/${patientId}/history`);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load the patient record');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  // Esc closes the chart
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewTest) setViewTest(null);
        else if (form) setForm(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewTest, form, onClose]);

  const patient = data?.patient;
  const tests: any[] = useMemo(() => data?.tests || [], [data]);
  const labTests: any[] = useMemo(() => tests.filter((t) => t.category !== 'Imaging'), [tests]);
  const imgTests: any[] = useMemo(() => tests.filter((t) => t.category === 'Imaging'), [tests]);
  const consultations: any[] = useMemo(() => data?.consultations || [], [data]);
  const diagnoses: any[] = useMemo(() => data?.diagnoses || [], [data]);
  const records: any[] = useMemo(() => data?.records || [], [data]);
  const prescriptions: any[] = useMemo(() => data?.prescriptions || [], [data]);
  const invoices: any[] = useMemo(() => data?.invoices || [], [data]);
  const payments: any[] = useMemo(() => data?.payments || [], [data]);
  const vitals: any[] = useMemo(() => data?.vitals || [], [data]);
  const nursingNotes: any[] = useMemo(() => data?.nursingNotes || [], [data]);
  const followUps: any[] = useMemo(() => data?.followUps || [], [data]);
  const timeline: any[] = useMemo(() => data?.timeline || [], [data]);
  // appointments come newest-first; the first one is the patient's last appointment
  const appointments: any[] = useMemo(() => data?.appointments || [], [data]);
  const lastAppointment = appointments[0] || null;

  // full-history filtering (find any entry without scrolling forever)
  const [histQuery, setHistQuery] = useState('');
  const [histKind, setHistKind] = useState('all');
  const histKinds = useMemo(() => [...new Set(timeline.map((e) => e.kind))], [timeline]);
  const shownTimeline = useMemo(() => {
    const q = histQuery.trim().toLowerCase();
    return timeline.filter((e) => {
      if (histKind !== 'all' && e.kind !== histKind) return false;
      if (!q) return true;
      return [e.title, e.detail, e.by, e.code, kindMeta[e.kind]?.label]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [timeline, histQuery, histKind]);

  const role = user?.role || '';
  const canClin = CLIN_ROLES.includes(role);
  const canNote = NOTE_ROLES.includes(role);
  const canBill = BILL_ROLES.includes(role);
  const canPay = PAY_ROLES.includes(role);
  const canEditPt = EDIT_PT_ROLES.includes(role);
  const canMarkEmergency = EMG_MARK_ROLES.includes(role);
  const canClearEmergency = EMG_REMOVE_ROLES.includes(role);
  const canResult = LAB_ROLES.includes(role);
  const canDownloadDocs = ['super-admin', 'manager', 'laboratory', 'doctor'].includes(role);
  const canDispense = PHARM_ROLES.includes(role);
  const isPharmacist = role === 'pharmacist';
  const myId = String(user?.id || '');
  const ctx = data?.context || {};
  const assignedDoctorId = String(ctx.assignedDoctor?._id || data?.assignment?.assignedTo?._id || '');
  const assignedNurseId = String(ctx.assignedNurse?._id || '');
  const assignedToMe = !!myId && (assignedDoctorId === myId || assignedNurseId === myId);
  const ownsPrescription = (p: any) =>
    MANAGER_ROLES.includes(role) || String(p.doctor?._id || p.doctor) === myId;

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const openForm = (kind: string, initial?: any) => setForm({ kind, initial });

  const flagEmergency = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post(`/patients/${patientId}/emergency`, { reason: emgReason.trim() });
      setEmgOpen(false);
      setEmgReason('');
      flash('Patient flagged as EMERGENCY — visible on every dashboard');
      load()
        .then(() => onRefresh?.())
        .catch(() => {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not flag emergency');
    } finally {
      setBusy(false);
    }
  };

  const clearEmergency = async () => {
    if (!window.confirm('Remove this patient from emergency?')) return;
    setBusy(true);
    setError('');
    try {
      await api.delete(`/patients/${patientId}/emergency`);
      flash('Emergency cleared');
      load()
        .then(() => onRefresh?.())
        .catch(() => {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not remove emergency');
    } finally {
      setBusy(false);
    }
  };

  const onSaved = (msg: string) => {
    setForm(null);
    flash(msg);
    load()
      .then(() => onRefresh?.())
      .catch(() => {});
  };

  const onFail = (status?: number) => {
    if (status === 403 || status === 409) load();
  };

  const toggleDraft = (name: string) =>
    setDraftTests((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));

  const saveTests = async () => {
    if (!draftTests.length) return;
    setBusy(true);
    setError('');
    try {
      await api.post('/doctor/lab-requests', {
        patient: patientId,
        kind: orderKind,
        priority,
        tests: draftTests.map((testType) => ({ testType, priority })),
      });
      const n = draftTests.length;
      const what = orderKind === 'imaging' ? 'imaging request(s)' : 'test(s)';
      setDraftTests([]);
      setBuilderOpen(false);
      setPriority('Normal');
      flash(`${n} ${what} ordered for ${patient?.name || 'the patient'}.`);
      await load();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not order the tests');
    } finally {
      setBusy(false);
    }
  };

  // laboratory accepts the sample — moves the request to "Accepted / Processing"
  const acceptSample = async (t: any) => {
    setBusy(true);
    setError('');
    try {
      await api.post(`/laboratory/${t._id}/collect`, {});
      flash(`${t.testType} accepted — sample collected.`);
      await load();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not accept the sample');
    } finally {
      setBusy(false);
    }
  };

  const recordPayment = async () => {
    if (!paying) return;
    setBusy(true);
    setError('');
    try {
      await api.post(`/billing/invoices/${paying._id}/pay`, {
        amount: paying.totalAmount,
        method: payMethod,
        reference: payReference || paying.invoiceId,
      });
      setPaying(null);
      setPayReference('');
      flash(`Payment recorded for ${paying.invoiceId}.`);
      await load();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not record the payment');
    } finally {
      setBusy(false);
    }
  };

  const grab = async (fn: () => Promise<void>) => {
    setDlBusy(true);
    setDlError('');
    try {
      await fn();
    } catch (err: any) {
      setDlError(err.response?.data?.message || 'Download failed');
    } finally {
      setDlBusy(false);
    }
  };

  // laboratory releases a result from inside the chart
  const saveResult = async () => {
    if (!resulting || !resultText.trim()) return;
    setBusy(true);
    setError('');
    try {
      await api.post(`/laboratory/${resulting._id}/result`, {
        result: resultText.trim(),
        notes: resultNotes.trim(),
      });
      const type = resulting.testType;
      setResulting(null);
      setResultText('');
      setResultNotes('');
      flash(`Result released for ${type}.`);
      await load();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not release the result');
    } finally {
      setBusy(false);
    }
  };

  // pharmacy hands the medicines out from inside the chart
  const dispense = async (rx: any) => {
    setBusy(true);
    setError('');
    try {
      await api.post(`/pharmacy/prescriptions/${rx._id}/dispense`, {
        items: (rx.medications || []).map((m: any) => ({ name: m.name, quantity: 1 })),
      });
      flash(`${rx.prescriptionId} dispensed and stock updated.`);
      await load();
      onRefresh?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not dispense the prescription');
    } finally {
      setBusy(false);
    }
  };

  // one request card with its Ordered -> Accepted -> Processing -> Success tracker
  const renderTest = (t: any) => {
    const imaging = t.category === 'Imaging';
    const cancelled = t.status === 'Cancelled';
    const completed = t.status === 'Completed';
    const cur = cancelled
      ? -1
      : completed
        ? 3
        : t.status === 'In Progress'
          ? 2
          : t.sampleStatus === 'Collected'
            ? 1
            : 0;
    const steps = [
      { label: 'Ordered', at: t.date || t.createdAt },
      { label: 'Accepted', at: t.sampleDate },
      { label: 'Processing', at: t.sampleDate },
      { label: 'Success', at: t.resultedAt },
    ];
    return (
      <div
        key={t._id}
        className={`rounded-xl border p-4 ${
          completed
            ? 'border-emerald-200 bg-emerald-50/40'
            : cancelled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-200 bg-white'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 flex flex-wrap items-center gap-2">
              {imaging ? (
                <Scan className="w-4 h-4 text-cyan-600" />
              ) : (
                <FlaskConical className="w-4 h-4 text-emerald-600" />
              )}
              {t.testType}
              <span className="text-xs font-normal text-gray-400">{t.testId}</span>
              {t.priority && t.priority !== 'Normal' && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                    t.priority === 'STAT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {t.priority}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Ordered {fmtDateTime(t.date || t.createdAt)}
              {t.orderedByName
                ? ` · by ${t.orderedByName}${t.orderedBy?.staffId ? ` (${t.orderedBy.staffId})` : ''}`
                : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(t.status)}`}>
              {t.status}
            </span>
            {completed ? (
              <button
                onClick={() => {
                  setDlError('');
                  setViewTest(t);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
              >
                <FileText className="w-3.5 h-3.5" /> Open result
              </button>
            ) : canResult && !cancelled ? (
              <>
                {t.status === 'Pending' && (
                  <button
                    onClick={() => acceptSample(t)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-700 text-xs font-medium hover:bg-emerald-50 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                )}
                <button
                  onClick={() => {
                    setResulting(t);
                    setResultText('');
                    setResultNotes('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                >
                  <TestTube className="w-3.5 h-3.5" /> Enter result
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* tracking: Ordered -> Accepted -> Processing -> Success */}
        <div className="mt-3">
          {cancelled ? (
            <p className="text-xs font-medium text-gray-500">
              Cancelled / sample rejected
              {t.sampleNotes ? ` — ${t.sampleNotes}` : ''}.
            </p>
          ) : (
            <ol className="flex">
              {steps.map((s, i) => {
                const isDone = i <= cur;
                const isActive = i === cur;
                return (
                  <li key={s.label} className="flex-1 flex flex-col items-center relative">
                    {i > 0 && (
                      <span
                        className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= cur ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border-2 ${
                        isActive
                          ? 'border-blue-600 bg-blue-600 text-white ring-4 ring-blue-100'
                          : isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </span>
                    <span
                      className={`mt-1 text-[11px] font-medium ${
                        isActive ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[10px] text-gray-400 text-center leading-tight">
                      {isDone && s.at ? fmtDateTime(s.at) : ' '}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {completed && (
          <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Result released by {t.resultedBy?.fullName || t.resultedByName || 'laboratory'}
            {t.resultedBy?.staffId ? ` (${t.resultedBy.staffId})` : ''} · {fmtDateTime(t.resultedAt)}
          </p>
        )}
        {t.notes && <p className="mt-1 text-xs text-gray-500">Note: {t.notes}</p>}
      </div>
    );
  };

  const tabList: { key: TabKey; label: string; count?: number; icon: typeof User }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'consultations', label: 'Consultations', count: consultations.length, icon: Stethoscope },
    { key: 'diagnoses', label: 'Diagnoses', count: diagnoses.length, icon: Activity },
    { key: 'records', label: 'Records', count: records.length, icon: ClipboardList },
    { key: 'vitals', label: 'Vitals & Notes', count: vitals.length + nursingNotes.length, icon: HeartPulse },
    { key: 'prescriptions', label: 'Prescriptions', count: prescriptions.length, icon: Pill },
    { key: 'tests', label: 'Tests', count: tests.length, icon: FlaskConical },
    { key: 'billing', label: 'Billing', count: invoices.length, icon: Receipt },
    { key: 'history', label: 'Full History', count: timeline.length, icon: Clock },
  ];
  const tabs = tabList.filter((t) => !isPharmacist || PHARMACY_TABS.includes(t.key));

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  const renderForm = () => {
    if (!form) return null;
    const props = { patientId, initial: form.initial, onSaved, onFail, onCancel: () => setForm(null) };
    switch (form.kind) {
      case 'consultation':
        return <ConsultationForm {...props} />;
      case 'diagnosis':
        return <DiagnosisForm {...props} />;
      case 'record':
        return <RecordForm {...props} />;
      case 'vitals':
        return <VitalsForm {...props} />;
      case 'note':
        return <NursingNoteForm {...props} />;
      case 'prescription':
        return <PrescriptionForm {...props} />;
      case 'invoice':
        return <InvoiceForm {...props} />;
      case 'followUp':
        return <FollowUpForm {...props} />;
      case 'patient':
        return <PatientForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-6xl shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 shrink-0" />
              {patient?.name || 'Patient record'}
              <span className="text-sm font-medium text-blue-600">{patient?.patientId}</span>
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" /> Registered {fmtDate(patient?.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1" title="Most recent contact with care">
                <Clock className="w-3.5 h-3.5" /> Last visit {fmtDate(data?.context?.lastVisit || patient?.updatedAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {patient?.phone || 'No phone'}
              </span>
              {patient?.bloodGroup && (
                <span className="inline-flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5" /> {patient.bloodGroup}
                </span>
              )}
              {data?.context?.ward && (
                <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                  <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                  {[data.context.ward, data.context.room && `Room ${data.context.room}`, data.context.bed && `Bed ${data.context.bed}`]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!loading && patient && !patient.emergency && canMarkEmergency && !emgOpen && (
              <button
                onClick={() => {
                  setEmgReason('');
                  setEmgOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-300 hover:bg-red-100"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {emgOpen && !patient?.emergency && canMarkEmergency && (
          <div className="mx-4 mt-3 flex flex-wrap items-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={emgReason}
              onChange={(e) => setEmgReason(e.target.value)}
              placeholder="Reason (optional) — e.g. accident, cardiac, severe bleeding"
              className="flex-1 min-w-[200px] rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={flagEmergency}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Flag emergency
            </button>
            <button
              onClick={() => setEmgOpen(false)}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}

        {!loading && patient?.emergency && (
          <div className="mx-4 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-red-400 bg-red-600 px-4 py-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-widest text-white">Patient in emergency</p>
                <p className="text-xs text-red-100">
                  {patient.emergencyReason ? `${patient.emergencyReason} · ` : ''}
                  {patient.emergencyBy ? `flagged by ${patient.emergencyBy}` : 'flagged'}
                  {patient.emergencyAt ? ` · ${fmtDate(patient.emergencyAt)}` : ''}
                </p>
              </div>
            </div>
            {canClearEmergency && (
              <button
                onClick={clearEmergency}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Remove emergency
              </button>
            )}
          </div>
        )}

        {/* tabs — pills that wrap so nothing is ever cut off */}
        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {typeof t.count === 'number' && t.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[1.25rem] px-1.5 py-px rounded-full text-[11px] font-semibold ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="mx-4 mt-3 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700">
            {notice}
          </div>
        )}

        {/* assignment banner — always visible, whatever tab is open */}
        {!loading && data && (
          <div
            className={`mx-4 mt-3 flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm ${
              assignedToMe
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : data.assignment || ctx.assignedDoctor || ctx.assignedNurse
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            {assignedToMe ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            ) : data.assignment || ctx.assignedDoctor || ctx.assignedNurse ? (
              <UserCheck className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <User className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <p className="min-w-0">
              {assignedToMe ? (
                <>
                  <span className="font-semibold">This patient is assigned to you.</span>{' '}
                  Everything you record here is saved with your name and staff ID ({user?.fullName || role}
                  {user?.staffId ? `, ${user.staffId}` : ''}).
                </>
              ) : ctx.assignedDoctor || ctx.assignedNurse || data.assignment ? (
                <>
                  <span className="font-semibold">
                    Assigned to{' '}
                    {[
                      ctx.assignedDoctor?.name || data.assignment?.assignedToName || data.assignment?.assignedTo?.fullName,
                      ctx.assignedNurse?.name,
                    ]
                      .filter(Boolean)
                      .join(' & ')}
                    {ctx.assignedDoctor?.staffId || data.assignment?.assignedTo?.staffId
                      ? ` (${ctx.assignedDoctor?.staffId || data.assignment?.assignedTo?.staffId})`
                      : ''}
                    .
                  </span>{' '}
                  You can still attend this patient — any entry you save is recorded under your name and ID
                  ({user?.fullName || role}
                  {user?.staffId ? `, ${user.staffId}` : ''}) so the history always shows who did what.
                </>
              ) : (
                <>
                  <span className="font-semibold">No assignment yet.</span> This patient is available — attend as
                  needed; everything you save is recorded with your name and ID ({user?.fullName || role}
                  {user?.staffId ? `, ${user.staffId}` : ''}).
                </>
              )}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading the complete record...
            </div>
          ) : !data ? (
            <p className="py-16 text-center text-sm text-gray-500">No record found.</p>
          ) : (
            <>
              {renderForm()}

              {/* ------------------------------------------------ OVERVIEW */}
              {tab === 'overview' && (
                <div className="space-y-5">
                  {(canClin || canBill || canEditPt) && (
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick actions</h3>
                      <div className="flex flex-wrap gap-2">
                        {canEditPt && (
                          <ActionBtn icon={UserCog} label="Edit patient details" onClick={() => openForm('patient', patient)} />
                        )}
                        {canClin && (
                          <>
                            <ActionBtn icon={Stethoscope} label="New consultation" onClick={() => openForm('consultation')} />
                            <ActionBtn icon={Activity} label="Add diagnosis" onClick={() => openForm('diagnosis')} />
                            <ActionBtn icon={ClipboardList} label="Add record / note" onClick={() => openForm('record')} />
                            <ActionBtn icon={Pill} label="New prescription" onClick={() => openForm('prescription')} />
                            <ActionBtn
                              icon={FlaskConical}
                              label="Order tests"
                              onClick={() => {
                                setTab('tests');
                                setBuilderOpen(true);
                              }}
                            />
                            <ActionBtn icon={HeartPulse} label="Record vitals" onClick={() => openForm('vitals')} />
                            {canNote && <ActionBtn icon={FileText} label="Nursing note" onClick={() => openForm('note')} />}
                            <ActionBtn icon={CalendarClock} label="Schedule follow-up" onClick={() => openForm('followUp')} />
                          </>
                        )}
                        {canBill && <ActionBtn icon={Receipt} label="Raise a bill" onClick={() => openForm('invoice')} />}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Age', value: patient?.age ?? '—' },
                      { label: 'Gender', value: patient?.gender || '—' },
                      { label: 'Blood group', value: patient?.bloodGroup || '—' },
                      { label: 'Genotype', value: patient?.genotype || '—' },
                      { label: 'Phone', value: patient?.phone || '—' },
                      { label: 'Email', value: patient?.email || '—' },
                      { label: 'Card type', value: patient?.cardType || '—' },
                      { label: 'Card number', value: patient?.cardNumber || '—' },
                      { label: 'Occupation', value: patient?.occupation || '—' },
                      { label: 'Marital status', value: patient?.maritalStatus || '—' },
                      { label: 'State / LGA', value: [patient?.state, patient?.lga].filter(Boolean).join(' / ') || '—' },
                      { label: 'Address', value: patient?.address || '—' },
                      { label: 'Next of kin', value: patient?.nextOfKin || '—' },
                      { label: 'Next of kin phone', value: patient?.nextOfKinPhone || '—' },
                      { label: 'Relationship', value: patient?.relationship || '—' },
                      { label: 'Status', value: patient?.status || '—' },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">{f.label}</p>
                        <p className="text-sm text-gray-800 break-words">{String(f.value)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Care team & location
                      </h3>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        <span className="text-gray-500">Assigned doctor</span>
                        <span className="text-gray-900 text-right font-medium">
                          {ctx.assignedDoctor ? (
                            <>
                              {ctx.assignedDoctor.name}
                              <span className="block text-[11px] font-normal text-gray-400">
                                {[ctx.assignedDoctor.staffId, ctx.assignedDoctor.role, ctx.assignedDoctor.department]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </span>
                            </>
                          ) : data.assignment?.assignedTo ? (
                            <>
                              {data.assignment.assignedToName || data.assignment.assignedTo.fullName}
                              <span className="block text-[11px] font-normal text-gray-400">
                                {data.assignment.assignedTo.staffId || data.assignment.assignedTo.role}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 font-normal">None — you may attend</span>
                          )}
                        </span>
                        <span className="text-gray-500">Assigned nurse</span>
                        <span className="text-gray-900 text-right font-medium">
                          {ctx.assignedNurse ? (
                            <>
                              {ctx.assignedNurse.name}
                              <span className="block text-[11px] font-normal text-gray-400">
                                {[ctx.assignedNurse.staffId, ctx.assignedNurse.role].filter(Boolean).join(' · ')}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 font-normal">—</span>
                          )}
                        </span>
                        <span className="text-gray-500">Ward / room / bed</span>
                        <span className="text-gray-900 text-right font-medium">
                          {ctx.ward || ctx.room || ctx.bed ? (
                            <>
                              {[ctx.ward, ctx.room && `Room ${ctx.room}`, ctx.bed && `Bed ${ctx.bed}`].filter(Boolean).join(' · ')}
                              {ctx.admittedFor && (
                                <span className="block text-[11px] font-normal text-gray-400">{ctx.admittedFor}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 font-normal">Not admitted</span>
                          )}
                        </span>
                        <span className="text-gray-500">Date of last visit</span>
                        <span className="text-gray-900 text-right font-medium">{fmtDate(ctx.lastVisit)}</span>
                        <span className="text-gray-500">Outstanding bill</span>
                        <span className="text-gray-900 text-right font-medium">
                          ₦{Number(data.counts?.outstanding || 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] text-gray-400">
                        Every entry in this chart is stamped with the name, role and staff ID of whoever made it —
                        admissions and bed moves follow the ward allocation shown above.
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        Record summary
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Consultations</span>
                        <span className="font-medium text-gray-900 text-right">{data.counts?.consultations}</span>
                        <span className="text-gray-500">Diagnoses</span>
                        <span className="font-medium text-gray-900 text-right">{data.counts?.diagnoses}</span>
                        <span className="text-gray-500">Tests (pending / done)</span>
                        <span className="font-medium text-gray-900 text-right">
                          {data.counts?.pendingTests} / {data.counts?.completedTests}
                        </span>
                        <span className="text-gray-500">Prescriptions</span>
                        <span className="font-medium text-gray-900 text-right">{data.counts?.prescriptions}</span>
                        <span className="text-gray-500">Visits / admissions</span>
                        <span className="font-medium text-gray-900 text-right">
                          {data.counts?.visits} / {data.counts?.admissions}
                        </span>
                        <span className="text-gray-500">Outstanding bill</span>
                        <span className="font-medium text-gray-900 text-right">₦{Number(data.counts?.outstanding || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {lastAppointment && (
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                        <CalendarClock className="w-4 h-4 text-teal-600" />
                        Last appointment
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2 text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900 font-medium">
                          {fmtDateTime(lastAppointment.date)}
                          {lastAppointment.time ? ` · ${lastAppointment.time}` : ''}
                        </span>
                        <span className="text-gray-500">Attended by</span>
                        <span className="text-gray-900 font-medium">
                          {lastAppointment.assignedTo?.fullName ||
                            lastAppointment.assignedToName ||
                            lastAppointment.doctor?.fullName ||
                            lastAppointment.doctorName ||
                            '—'}
                          {(lastAppointment.assignedTo?.role || lastAppointment.doctor?.role) && (
                            <span className="block text-[11px] font-normal text-gray-400">
                              {lastAppointment.assignedTo?.role || lastAppointment.doctor?.role}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500">Type</span>
                        <span className="text-gray-900">{lastAppointment.type || '—'}</span>
                        <span className="text-gray-500">Status</span>
                        <span className="text-gray-900">{lastAppointment.status || '—'}</span>
                      </div>
                      {(lastAppointment.complaint || lastAppointment.notes) && (
                        <p className="mt-3 text-xs text-gray-500">
                          {lastAppointment.complaint || lastAppointment.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------ FULL HISTORY */}
              {tab === 'history' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Everything recorded for {patient?.name} from registration ({fmtDate(patient?.createdAt)}) to now —
                    newest first.
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={histQuery}
                      onChange={(e) => setHistQuery(e.target.value)}
                      placeholder="Search entries, staff, codes..."
                      className="w-full sm:w-64 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setHistKind('all')}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          histKind === 'all'
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
                        }`}
                      >
                        All ({timeline.length})
                      </button>
                      {histKinds.map((k) => {
                        const meta = kindMeta[k] || { label: k, className: 'bg-gray-100 text-gray-600' };
                        const n = timeline.filter((e) => e.kind === k).length;
                        return (
                          <button
                            key={k}
                            onClick={() => setHistKind(k)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                              histKind === k
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : `bg-white border-gray-300 text-gray-600 hover:border-blue-400`
                            }`}
                            title={meta.label}
                          >
                            {meta.label} ({n})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {shownTimeline.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500">
                      {timeline.length === 0 ? 'Nothing recorded yet.' : 'No entries match your filter.'}
                    </p>
                  ) : (
                    shownTimeline.map((e, i) => {
                      const meta = kindMeta[e.kind] || { label: e.kind, className: 'bg-gray-100 text-gray-600' };
                      const lockable = ['consultation', 'diagnosis', 'record', 'prescription'].includes(e.kind);
                      return (
                        <div
                          key={`${e.kind}-${e.ref}-${i}`}
                          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 hover:bg-gray-50"
                        >
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${meta.className} shrink-0`}>
                            {meta.label}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-900 font-medium">
                              {e.title}
                              {e.code ? <span className="ml-2 text-xs font-normal text-gray-400">{e.code}</span> : ''}
                            </p>
                            {e.detail && (
                              <p className="text-xs text-gray-500 whitespace-pre-wrap line-clamp-2">{e.detail}</p>
                            )}
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {e.by ? `${e.by}${e.byId ? ` (${e.byId})` : ''} · ` : ''}
                              {fmtDateTime(e.date)}
                              {e.createdAt && e.updatedAt && new Date(e.updatedAt) > new Date(e.createdAt)
                                ? ` · updated ${fmtDateTime(e.updatedAt)}`
                                : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lockable && e.editable === false && (
                              <span title="Locked — edits closed after 11:59pm on the day of entry" className="text-gray-400">
                                <Lock className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {e.status && (
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(e.status)}`}>
                                {e.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ---------------------------------------------- TESTS & IMAGING */}
              {tab === 'tests' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      Every request is tracked{' '}
                      <span className="font-semibold text-gray-700">
                        Ordered → Accepted → Processing → Success
                      </span>
                      . Click a finished one to open its result.
                    </p>
                    {canClin && (
                      <button
                        onClick={() => setBuilderOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        New request
                      </button>
                    )}
                  </div>

                  {builderOpen && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase">Request type</span>
                        <div className="inline-flex rounded-lg border border-blue-200 bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setOrderKind('lab');
                              setDraftTests([]);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              orderKind === 'lab' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <FlaskConical className="w-3.5 h-3.5" /> Laboratory
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOrderKind('imaging');
                              setDraftTests([]);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              orderKind === 'imaging' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <Scan className="w-3.5 h-3.5" /> Imaging
                          </button>
                        </div>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="ml-auto text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
                        >
                          <option>Normal</option>
                          <option>Urgent</option>
                          <option>STAT</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(orderKind === 'lab' ? COMMON_TESTS : IMAGING_TESTS).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleDraft(t)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                              draftTests.includes(t)
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={customTest}
                          onChange={(e) => setCustomTest(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && customTest.trim()) {
                              e.preventDefault();
                              toggleDraft(customTest.trim());
                              setCustomTest('');
                            }
                          }}
                          placeholder="Type a custom test and press Enter"
                          className={`${field} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customTest.trim()) {
                              toggleDraft(customTest.trim());
                              setCustomTest('');
                            }
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-white"
                        >
                          Add
                        </button>
                      </div>
                      {draftTests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {draftTests.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium"
                            >
                              {t}
                              <button onClick={() => toggleDraft(t)} aria-label={`Remove ${t}`} className="hover:text-blue-600">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setBuilderOpen(false);
                            setDraftTests([]);
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveTests}
                          disabled={busy || !draftTests.length}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save ({draftTests.length})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------ laboratory */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-emerald-600" />
                      Laboratory requests
                      <span className="text-xs font-normal text-gray-400">({labTests.length})</span>
                    </h3>
                    {labTests.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500 rounded-lg border border-dashed border-gray-200">
                        No laboratory requests yet — use <span className="font-medium">New request</span> above.
                      </p>
                    ) : (
                      <div className="space-y-3">{labTests.map(renderTest)}</div>
                    )}
                  </div>

                  {/* ------------------------------------------------ imaging */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <Scan className="w-4 h-4 text-cyan-600" />
                      Imaging requests
                      <span className="text-xs font-normal text-gray-400">({imgTests.length})</span>
                    </h3>
                    {imgTests.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500 rounded-lg border border-dashed border-gray-200">
                        No imaging requests yet — switch the request type to <span className="font-medium">Imaging</span>{' '}
                        above to order X-Ray, Ultrasound, CT, MRI or ECG.
                      </p>
                    ) : (
                      <div className="space-y-3">{imgTests.map(renderTest)}</div>
                    )}
                  </div>

                  {/* result entry — only while one is being filled in */}
                  {canResult && resulting && (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-900">
                        <TestTube className="w-4 h-4 inline text-emerald-600 mr-1" />
                        Enter result — {resulting.testType}{' '}
                        <span className="text-xs font-normal text-gray-400">{resulting.testId}</span>
                      </p>
                      <textarea
                        value={resultText}
                        onChange={(e) => setResultText(e.target.value)}
                        rows={4}
                        className={field}
                        placeholder="Result value / findings"
                      />
                      <input
                        value={resultNotes}
                        onChange={(e) => setResultNotes(e.target.value)}
                        className={field}
                        placeholder="Interpretation notes (optional)"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setResulting(null)}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveResult}
                          disabled={busy || !resultText.trim()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Release result
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------ CONSULTATIONS */}
              {tab === 'consultations' && (
                <div className="space-y-3">
                  <TabHead
                    title="Consultation notes"
                    hint="Editable until 11:59pm on the day they were written — after that they lock."
                  >
                    {canClin && (
                      <button
                        onClick={() => openForm('consultation')}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" /> New consultation
                      </button>
                    )}
                  </TabHead>
                  {consultations.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500">No consultations recorded yet.</p>
                  ) : (
                    consultations.map((c) => (
                      <div key={c._id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              {c.consultationType || 'General'} consultation
                              <span className="text-xs font-normal text-gray-400">{c.consultationId}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {c.doctorName || '—'} · {fmtDateTime(c.date || c.createdAt)}
                              {c.updatedAt && new Date(c.updatedAt) > new Date(c.createdAt)
                                ? ` · updated ${fmtDateTime(c.updatedAt)}`
                                : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(c.status)}`}>
                              {c.status}
                            </span>
                            {c.editable === false ? (
                              <span
                                className="inline-flex items-center gap-1 text-xs text-gray-400"
                                title="Locked — this note may only be edited until 11:59pm on the day it was created"
                              >
                                <Lock className="w-3.5 h-3.5" /> Locked
                              </span>
                            ) : (
                              <button
                                onClick={() => openForm('consultation', c)}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                        {c.chiefComplaint && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Complaint:</span> {c.chiefComplaint}
                          </p>
                        )}
                        <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1">{c.notes || '—'}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ------------------------------------------------ DIAGNOSES */}
              {tab === 'diagnoses' && (
                <div className="space-y-3">
                  <TabHead title="Diagnoses" hint="Problems and their status — locked after the day of entry.">
                    {canClin && (
                      <button
                        onClick={() => openForm('diagnosis')}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" /> Add diagnosis
                      </button>
                    )}
                  </TabHead>
                  {diagnoses.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500">No diagnoses recorded yet.</p>
                  ) : (
                    diagnoses.map((d) => (
                      <div key={d._id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{d.diagnosis}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {d.diagnosisId} · {d.doctorName || '—'} · {fmtDateTime(d.date || d.createdAt)}
                              {d.updatedAt && new Date(d.updatedAt) > new Date(d.createdAt)
                                ? ` · updated ${fmtDateTime(d.updatedAt)}`
                                : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(d.status)}`}>
                              {d.status}
                            </span>
                            {d.editable === false ? (
                              <span
                                className="inline-flex items-center gap-1 text-xs text-gray-400"
                                title="Locked — editable only until 11:59pm on the day of entry"
                              >
                                <Lock className="w-3.5 h-3.5" /> Locked
                              </span>
                            ) : (
                              <button
                                onClick={() => openForm('diagnosis', d)}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                        {d.treatment && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Treatment:</span> {d.treatment}
                          </p>
                        )}
                        {d.notes && <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1">{d.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ------------------------------------------------ RECORDS */}
              {tab === 'records' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <TabHead title="Medical records & notes" hint="Everything charted for this patient outside the consultation note.">
                      {canClin && (
                        <>
                          <button
                            onClick={() => openForm('followUp')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <CalendarClock className="w-4 h-4" /> Schedule follow-up
                          </button>
                          <button
                            onClick={() => openForm('record')}
                            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" /> Add record
                          </button>
                        </>
                      )}
                    </TabHead>
                    {records.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500">No medical records yet.</p>
                    ) : (
                      records.map((r) => (
                        <div key={r._id} className="rounded-xl border border-gray-200 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {r.type || 'Consultation'} record
                                <span className="ml-2 text-xs font-normal text-gray-400">{r.recordId}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {r.doctorName || '—'} · {fmtDateTime(r.date || r.createdAt)}
                                {r.updatedAt && new Date(r.updatedAt) > new Date(r.createdAt)
                                  ? ` · updated ${fmtDateTime(r.updatedAt)}`
                                  : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {r.editable === false ? (
                                <span
                                  className="inline-flex items-center gap-1 text-xs text-gray-400"
                                  title="Locked — editable only until 11:59pm on the day of entry"
                                >
                                  <Lock className="w-3.5 h-3.5" /> Locked
                                </span>
                              ) : (
                                <button
                                  onClick={() => openForm('record', r)}
                                  className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                          {r.diagnosis && (
                            <p className="text-sm text-gray-700 mt-2">
                              <span className="font-medium">Finding:</span> {r.diagnosis}
                            </p>
                          )}
                          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1">{r.notes || '—'}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-teal-600" /> Follow-ups
                    </h3>
                    {followUps.length === 0 ? (
                      <p className="text-sm text-gray-500">No follow-ups scheduled.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {followUps.map((f) => (
                          <div key={f._id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                            <span className="min-w-0 text-gray-700">
                              <span className="font-medium">{fmtDate(f.scheduledDate)}</span>
                              {f.reason ? ` · ${f.reason}` : ''}
                              <span className="block text-xs text-gray-400">{f.followUpId}</span>
                            </span>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(f.status)}`}>
                              {f.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------ VITALS & NOTES */}
              {tab === 'vitals' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <TabHead title="Vital signs" hint="Newest first — recording vitals also moves the patient to the bottom of the list.">
                      {canClin && (
                        <button
                          onClick={() => openForm('vitals')}
                          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          <HeartPulse className="w-4 h-4" /> Record vitals
                        </button>
                      )}
                    </TabHead>
                    {vitals.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500">No vitals recorded yet.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              {['When', 'Temp', 'BP', 'Pulse', 'Resp', 'SpO₂', 'Pain', 'By'].map((h) => (
                                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {vitals.slice(0, 25).map((v) => (
                              <tr key={v._id} className="hover:bg-gray-50 text-sm">
                                <td className="px-3 py-2 text-gray-600">{fmtDateTime(v.recordedAt || v.createdAt)}</td>
                                <td className="px-3 py-2 text-gray-800">{v.temperature ?? '—'}</td>
                                <td className="px-3 py-2 text-gray-800">{v.bp || '—'}</td>
                                <td className="px-3 py-2 text-gray-800">{v.pulse ?? '—'}</td>
                                <td className="px-3 py-2 text-gray-800">{v.respRate ?? '—'}</td>
                                <td className="px-3 py-2 text-gray-800">{v.o2Sat ?? '—'}</td>
                                <td className="px-3 py-2 text-gray-800">{v.painLevel ?? '—'}</td>
                                <td className="px-3 py-2 text-gray-600">{v.recordedByName || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <TabHead title="Nursing notes" hint="Progress, critical, discharge, assessment and handover notes.">
                      {canNote && (
                        <button
                          onClick={() => openForm('note')}
                          className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700"
                        >
                          <Plus className="w-4 h-4" /> Add nursing note
                        </button>
                      )}
                    </TabHead>
                    {nursingNotes.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500">No nursing notes yet.</p>
                    ) : (
                      nursingNotes.map((n) => (
                        <div key={n._id} className="rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-gray-900">{n.noteType}</p>
                            <span className="text-xs text-gray-400">{fmtDateTime(n.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1">{n.notes}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.nurseName || ''}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------ PRESCRIPTIONS */}
              {tab === 'prescriptions' && (
                <div className="space-y-3">
                  <TabHead
                    title="Drug prescriptions"
                    hint="Exactly what the pharmacy sees — diagnostics never leave the clinical tabs."
                  >
                    {canClin && (
                      <button
                        onClick={() => openForm('prescription')}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" /> New prescription
                      </button>
                    )}
                  </TabHead>
                  {prescriptions.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500">No prescriptions written yet.</p>
                  ) : (
                    prescriptions.map((p) => (
                      <div key={p._id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-amber-600" />
                            {p.prescriptionId}
                            <span className="text-xs font-normal text-gray-400">
                              {p.doctorName} · {fmtDateTime(p.date || p.createdAt)}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(p.status)}`}>
                              {p.status}
                            </span>
                            {canDispense && p.status === 'Pending' && (p.medications || []).some((m: any) => (m.status || 'Pending') === 'Paid') && (
                              <button
                                onClick={() => dispense(p)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
                                title="Hand out paid medicines and decrement pharmacy stock"
                              >
                                <PackageCheck className="w-3.5 h-3.5" /> Dispense
                              </button>
                            )}
                            {p.editable === false ? (
                              <span
                                className="inline-flex items-center gap-1 text-xs text-gray-400"
                                title="Locked — editable only until 11:59pm on the day of entry"
                              >
                                <Lock className="w-3.5 h-3.5" /> Locked
                              </span>
                            ) : ownsPrescription(p) ? (
                              <button
                                onClick={() => openForm('prescription', p)}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {(p.medications || []).map((m: any, i: number) => (
                            <li key={i} className="flex items-start justify-between gap-2 text-sm text-gray-800">
                              <span className="min-w-0">
                              <span className="font-medium">{m.name}</span>
                              <span className="text-gray-500">
                                {' '}
                                {[m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ')}
                              </span>
                              {m.instructions && <p className="text-xs text-gray-500">{m.instructions}</p>}
                              </span>
                              <span className="flex items-center gap-2 shrink-0 pt-0.5">
                                {m.price !== null && m.price !== undefined && (
                                  <span className="text-xs text-gray-600">₦{Number(m.price).toLocaleString()}</span>
                                )}
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(m.status || 'Pending')}`}>
                                  {m.status || 'Pending'}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <DrugTotals rx={p} />
                        {p.notes && <p className="text-xs text-gray-500 mt-1">Note: {p.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ------------------------------------------------ BILLING */}
              {tab === 'billing' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Outstanding:{' '}
                      <span className="font-semibold text-gray-900">
                        ₦{Number(data.counts?.outstanding || 0).toLocaleString()}
                      </span>
                      {!canPay && <span className="ml-3 text-xs text-gray-400">Payment recording: Accounts / Reception only.</span>}
                    </p>
                    {canBill && (
                      <button
                        onClick={() => openForm('invoice')}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" /> Raise a bill
                      </button>
                    )}
                  </div>

                  {invoices.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-500">No invoices raised yet.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            {['Invoice', 'Type', 'Date', 'Amount', 'Status', 'Payment'].map((h) => (
                              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {invoices.map((inv) => (
                            <tr key={inv._id} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{inv.invoiceId}</td>
                              <td className="px-4 py-2.5 text-sm text-gray-700">{inv.type}</td>
                              <td className="px-4 py-2.5 text-sm text-gray-600">{fmtDate(inv.date || inv.createdAt)}</td>
                              <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                                ₦{Number(inv.totalAmount || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-2.5">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(inv.status)}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                {inv.status === 'Paid' ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-700">
                                    <CreditCard className="w-3.5 h-3.5" /> {inv.paymentMethod || 'Settled'}{' '}
                                    {inv.paidAt ? fmtDate(inv.paidAt) : ''}
                                  </span>
                                ) : canPay ? (
                                  <button
                                    onClick={() => {
                                      setPaying(inv);
                                      setPayMethod('Cash');
                                      setPayReference(inv.invoiceId);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700"
                                  >
                                    <Plus className="w-3 h-3" /> Update payment
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400">Awaiting payment</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-green-600" /> Payments on record
                    </h3>
                    {payments.length === 0 ? (
                      <p className="text-sm text-gray-500">No payments recorded.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {payments.map((p) => (
                          <div
                            key={p._id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          >
                            <span className="text-gray-700">
                              {p.paymentId} · ₦{Number(p.amount || 0).toLocaleString()} · {p.method}
                            </span>
                            <span className="text-xs text-gray-500">{fmtDateTime(p.date || p.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400 hidden sm:block">
            Press <span className="font-medium text-gray-500">Esc</span> to close · every entry is stamped with your
            name and staff ID
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* ---------------------------------------------- result viewer */}
      {viewTest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setViewTest(null)}>
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  {viewTest.testId} — {viewTest.testType}
                </h3>
                <p className="text-sm text-gray-500">
                  {viewTest.patientName} · ordered {fmtDate(viewTest.date)} ·{' '}
                  <span className="text-green-700 font-medium">{viewTest.status}</span>
                </p>
              </div>
              <button onClick={() => setViewTest(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {dlError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {dlError}
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Result</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{viewTest.result || 'No result released yet.'}</p>
              {viewTest.notes && (
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium text-gray-600">Notes:</span> {viewTest.notes}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Released {fmtDateTime(viewTest.resultedAt)}
                {viewTest.resultedByName ? ` by ${viewTest.resultedByName}` : ''}
              </p>
            </div>

            {canDownloadDocs && (
              <div className="border-t border-gray-100 mt-4 pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => grab(() => downloadLabResultPdf(viewTest._id, `${viewTest.testId || 'lab'}-result.pdf`))}
                    disabled={dlBusy}
                    className="w-full flex items-center justify-between gap-2 text-sm bg-green-50 border border-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">Download result (PDF)</span>
                    </span>
                    <Download className="w-4 h-4" />
                  </button>
                  {(viewTest.attachments || []).map((a: any, i: number) => (
                    <button
                      key={`${a.path || a.name}-${i}`}
                      onClick={() => grab(() => downloadLabAttachment(viewTest._id, i, a.name))}
                      disabled={dlBusy}
                      className="w-full flex items-center justify-between gap-2 text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                        <span className="truncate">{a.name}</span>
                      </span>
                      <Download className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewTest(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------- payment dialog */}
      {paying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setPaying(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-green-600" />
              Payment update
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {paying.invoiceId} · ₦{Number(paying.totalAmount || 0).toLocaleString()}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className={`${field} mb-3`}>
              {PAY_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input value={payReference} onChange={(e) => setPayReference(e.target.value)} className={`${field} mb-4`} />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPaying(null)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={recordPayment}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Confirm payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}