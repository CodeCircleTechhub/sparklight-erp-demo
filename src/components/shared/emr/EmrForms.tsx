import { useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import api from '../../../services/api';

export const CONSULTATION_TYPES = [
  'General',
  'Pediatric',
  'Obstetric and Gynecological',
  'Surgical',
  'Cardiological',
  'Dermatological',
  'Orthopedic',
  'Psychiatric',
  'Ophthalmological',
];

const FIELD = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1';
const SMALL = 'text-xs text-gray-500';

export type FormProps = {
  patientId: string;
  initial?: any | null;
  onSaved: (msg: string) => void;
  onFail?: (status?: number) => void;
  onCancel: () => void;
};

function Panel({
  title,
  hint,
  children,
  footer,
  onCancel,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {hint && <p className={`${SMALL} mt-0.5`}>{hint}</p>}
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 shrink-0" aria-label="Cancel">
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
      <div className="flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
        <div className="min-w-0">{footer}</div>
      </div>
    </div>
  );
}

function SaveBtn({ busy, onClick, label = 'Save' }: { busy: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {label}
    </button>
  );
}

function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-white">
      Cancel
    </button>
  );
}

const errLine = (msg: string) =>
  msg ? <p className="text-xs text-red-600">{msg}</p> : null;

function useSubmit(onSaved: (m: string) => void, onFail?: (s?: number) => void) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const run = async (fn: () => Promise<string>) => {
    setBusy(true);
    setErr('');
    try {
      const msg = await fn();
      onSaved(msg);
    } catch (e: any) {
      const status = e.response?.status;
      setErr(e.response?.data?.message || 'Could not save — please try again');
      if (status === 403 || status === 409) onFail?.(status);
    } finally {
      setBusy(false);
    }
  };
  return { busy, err, setErr, run };
}

/* ------------------------------------------------------------------ consultation */
export function ConsultationForm({ patientId, initial, onSaved, onFail, onCancel }: FormProps) {
  const [type, setType] = useState(initial?.consultationType || 'General');
  const [complaint, setComplaint] = useState(initial?.chiefComplaint || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [status, setStatus] = useState(initial?.status || 'Completed');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!notes.trim() && !complaint.trim()) {
      setErr('Write the complaint or the note before saving.');
      return;
    }
    run(async () => {
      const body = { consultationType: type, chiefComplaint: complaint, notes, status };
      if (initial?._id) {
        await api.put(`/doctor/consultations/${initial._id}`, body);
        return 'Consultation note updated.';
      }
      await api.post('/doctor/consultations', { patient: patientId, ...body });
      return `Consultation saved for ${type}.`;
    });
  };

  return (
    <Panel
      title={initial?._id ? 'Edit consultation note' : 'New consultation note'}
      hint="Editable until 11:59pm on the day it is written — after that it locks."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label={initial?._id ? 'Update note' : 'Save note'} />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Note type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={FIELD}>
            {CONSULTATION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            {['Completed', 'In Progress', 'Scheduled', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL}>Chief complaint</label>
        <input value={complaint} onChange={(e) => setComplaint(e.target.value)} className={FIELD} placeholder="e.g. fever and headache for 3 days" />
      </div>
      <div>
        <label className={LABEL}>Consultation note</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className={FIELD} placeholder="History, examination findings, assessment, plan..." />
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------------------- diagnosis */
export function DiagnosisForm({ patientId, initial, onSaved, onFail, onCancel }: FormProps) {
  const [diagnosis, setDiagnosis] = useState(initial?.diagnosis || '');
  const [treatment, setTreatment] = useState(initial?.treatment || '');
  const [status, setStatus] = useState(initial?.status || 'Active');
  const [notes, setNotes] = useState(initial?.notes || '');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!diagnosis.trim()) {
      setErr('Diagnosis is required.');
      return;
    }
    run(async () => {
      const body = { diagnosis, treatment, status, notes };
      if (initial?._id) {
        await api.put(`/doctor/diagnoses/${initial._id}`, body);
        return 'Diagnosis updated.';
      }
      await api.post('/doctor/diagnoses', { patient: patientId, ...body });
      return 'Diagnosis added to the chart.';
    });
  };

  return (
    <Panel
      title={initial?._id ? 'Edit diagnosis' : 'Add diagnosis'}
      hint="Active / Resolved / Chronic / Under review — locked after the day of entry."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label={initial?._id ? 'Update' : 'Add diagnosis'} />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Diagnosis *</label>
          <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={FIELD} placeholder="e.g. Uncomplicated malaria" />
        </div>
        <div>
          <label className={LABEL}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            {['Active', 'Resolved', 'Chronic', 'Under Review'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL}>Treatment plan</label>
        <input value={treatment} onChange={(e) => setTreatment(e.target.value)} className={FIELD} placeholder="e.g. Artemether/Lumefantrine 4/3 days" />
      </div>
      <div>
        <label className={LABEL}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={FIELD} placeholder="Symptoms, findings, differentials..." />
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------------- record */
export function RecordForm({ patientId, initial, onSaved, onFail, onCancel }: FormProps) {
  const [type, setType] = useState(initial?.type || 'Consultation');
  const [diagnosis, setDiagnosis] = useState(initial?.diagnosis || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!notes.trim()) {
      setErr('Write the record note before saving.');
      return;
    }
    run(async () => {
      const body = { type, diagnosis, notes };
      if (initial?._id) {
        await api.put(`/doctor/records/${initial._id}`, body);
        return 'Medical record updated.';
      }
      await api.post('/doctor/records', { patient: patientId, ...body });
      return 'Medical record added.';
    });
  };

  return (
    <Panel
      title={initial?._id ? 'Edit medical record' : 'Add medical record / note'}
      hint="Kept in the patient chart and the full history timeline."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label={initial?._id ? 'Update' : 'Save record'} />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Record type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={FIELD}>
            {['Consultation', 'Follow-up', 'Checkup', 'Surgery', 'Emergency', 'Lab Test'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Diagnosis / finding</label>
          <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={FIELD} placeholder="Optional" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Record note *</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className={FIELD} placeholder="What was seen, done and advised..." />
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------------- vitals */
export function VitalsForm({ patientId, onSaved, onFail, onCancel }: FormProps) {
  const [form, setForm] = useState({ temperature: '', bp: '', pulse: '', respRate: '', o2Sat: '', painLevel: '', notes: '' });
  const { busy, err, run } = useSubmit(onSaved, onFail);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () =>
    run(async () => {
      await api.post('/nurse/vitals', { patient: patientId, ...form });
      return 'Vital signs recorded.';
    });

  const fields: { k: keyof typeof form; label: string; ph: string }[] = [
    { k: 'temperature', label: 'Temp (°C)', ph: '36.8' },
    { k: 'bp', label: 'BP (mmHg)', ph: '120/80' },
    { k: 'pulse', label: 'Pulse', ph: '78' },
    { k: 'respRate', label: 'Resp. rate', ph: '16' },
    { k: 'o2Sat', label: 'SpO₂ (%)', ph: '98' },
    { k: 'painLevel', label: 'Pain (0-10)', ph: '2' },
  ];

  return (
    <Panel
      title="Record vital signs"
      hint="Stored with your name and time — the patient table re-sorts to the bottom."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label="Save vitals" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fields.map((f) => (
          <div key={f.k}>
            <label className={LABEL}>{f.label}</label>
            <input value={form[f.k]} onChange={set(f.k)} className={FIELD} placeholder={f.ph} />
          </div>
        ))}
      </div>
      <div>
        <label className={LABEL}>Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2} className={FIELD} placeholder="Condition of the patient, observations..." />
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ nursing note */
const NOTE_TYPES = ['Progress Note', 'Critical Note', 'Discharge Note', 'Assessment Note', 'Handover Note'];

export function NursingNoteForm({ patientId, onSaved, onFail, onCancel }: FormProps) {
  const [noteType, setNoteType] = useState('Progress Note');
  const [notes, setNotes] = useState('');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!notes.trim()) {
      setErr('Note text is required.');
      return;
    }
    run(async () => {
      await api.post('/nurse/notes', { patient: patientId, noteType, notes });
      return 'Nursing note saved.';
    });
  };

  return (
    <Panel
      title="Add nursing note"
      hint="Progress, critical, discharge, assessment or handover note."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label="Save note" />
          </div>
        </>
      }
    >
      <div>
        <label className={LABEL}>Note type</label>
        <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className={FIELD}>
          {NOTE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={LABEL}>Note *</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className={FIELD} placeholder="Observation, care given, response..." />
      </div>
    </Panel>
  );
}

/* ----------------------------------------------------------------- prescription */
type Med = { name: string; dosage: string; frequency: string; duration: string; instructions: string };
const emptyMed = (): Med => ({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });

export function PrescriptionForm({ patientId, initial, onSaved, onFail, onCancel }: FormProps) {
  const [meds, setMeds] = useState<Med[]>(
    initial?.medications?.length ? initial.medications.map((m: any) => ({ ...emptyMed(), ...m })) : [emptyMed()],
  );
  const [notes, setNotes] = useState(initial?.notes || '');
  const [status, setStatus] = useState(initial?.status || 'Pending');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const setMed = (i: number, k: keyof Med) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setMeds((list) => list.map((m, idx) => (idx === i ? { ...m, [k]: e.target.value } : m)));

  const save = () => {
    const clean = meds.filter((m) => m.name.trim());
    if (!clean.length) {
      setErr('Add at least one medicine.');
      return;
    }
    run(async () => {
      const body = { medications: clean, notes, status };
      if (initial?._id) {
        await api.put(`/doctor/prescriptions/${initial._id}`, body);
        return 'Prescription updated.';
      }
      await api.post('/doctor/prescriptions', { patient: patientId, ...body });
      return `${clean.length} medicine(s) prescribed.`;
    });
  };

  return (
    <Panel
      title={initial?._id ? 'Edit prescription' : 'New prescription'}
      hint="This is exactly what the pharmacy sees — diagnostics never leave the clinical tabs."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label={initial?._id ? 'Update' : 'Prescribe'} />
          </div>
        </>
      }
    >
      <div className="space-y-3">
        {meds.map((m, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">Medicine {i + 1}</span>
              {meds.length > 1 && (
                <button
                  type="button"
                  onClick={() => setMeds((list) => list.filter((_, idx) => idx !== i))}
                  className="text-gray-400 hover:text-red-600"
                  aria-label="Remove medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="col-span-2 sm:col-span-1">
                <input value={m.name} onChange={setMed(i, 'name')} className={FIELD} placeholder="Drug name *" />
              </div>
              <input value={m.dosage} onChange={setMed(i, 'dosage')} className={FIELD} placeholder="Dosage (500mg)" />
              <input value={m.frequency} onChange={setMed(i, 'frequency')} className={FIELD} placeholder="Frequency (8h)" />
              <input value={m.duration} onChange={setMed(i, 'duration')} className={FIELD} placeholder="Duration (5 days)" />
            </div>
            <input
              value={m.instructions}
              onChange={setMed(i, 'instructions')}
              className={FIELD}
              placeholder="Instructions (after meals)"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMeds((list) => [...list, emptyMed()])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" /> Add another medicine
        </button>
      </div>

      {initial?._id && (
        <div>
          <label className={LABEL}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            {['Pending', 'Filled', 'Dispensed', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={LABEL}>Note to pharmacy</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={FIELD} placeholder="Optional" />
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------------------- invoice */
type Line = { description: string; amount: string };
const emptyLine = (): Line => ({ description: '', amount: '' });
const INVOICE_TYPES = ['Consultation', 'Lab Tests', 'Surgery', 'Medication', 'Hospital Stay', 'Other'];

export function InvoiceForm({ patientId, onSaved, onFail, onCancel }: FormProps) {
  const [type, setType] = useState('Consultation');
  const [lines, setLines] = useState<Line[]>([{ ...emptyLine() }]);
  const [notes, setNotes] = useState('');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const setLine = (i: number, k: keyof Line) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setLines((list) => list.map((l, idx) => (idx === i ? { ...l, [k]: e.target.value } : l)));

  const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const save = () => {
    const clean = lines.filter((l) => l.description.trim() && Number(l.amount) > 0);
    if (!clean.length) {
      setErr('Add at least one bill item with an amount.');
      return;
    }
    run(async () => {
      await api.post('/billing/invoices', {
        patient: patientId,
        type,
        items: clean.map((l) => ({ description: l.description.trim(), amount: Number(l.amount) })),
        notes,
      });
      return `Invoice raised — ₦${total.toLocaleString()}.`;
    });
  };

  return (
    <Panel
      title="Raise a bill"
      hint="Sent to the patient portal immediately; payment can be recorded from this same screen."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label={`Raise ₦${total.toLocaleString()}`} />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Bill type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={FIELD}>
            {INVOICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <p className={`${SMALL} pb-2`}>
            Running total: <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={l.description}
              onChange={setLine(i, 'description')}
              className={`${FIELD} flex-1`}
              placeholder="Item (e.g. Malaria RDT)"
            />
            <input
              value={l.amount}
              onChange={setLine(i, 'amount')}
              type="number"
              min="0"
              className={`${FIELD} w-32`}
              placeholder="Amount"
            />
            {lines.length > 1 && (
              <button
                type="button"
                onClick={() => setLines((list) => list.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-600"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLines((list) => [...list, emptyLine()])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" /> Add bill item
        </button>
      </div>

      <div>
        <label className={LABEL}>Notes</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className={FIELD} placeholder="Optional" />
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------- follow-up */
export function FollowUpForm({ patientId, onSaved, onFail, onCancel }: FormProps) {
  const [reason, setReason] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!scheduledDate) {
      setErr('Pick the follow-up date.');
      return;
    }
    run(async () => {
      await api.post('/doctor/follow-ups', {
        patient: patientId,
        reason: reason || 'Follow-up',
        scheduledDate,
        notes,
      });
      return 'Follow-up scheduled.';
    });
  };

  return (
    <Panel
      title="Schedule follow-up"
      hint="Shows on the overview and in the full history timeline."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label="Schedule" />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Reason</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} className={FIELD} placeholder="e.g. Review after 2 weeks" />
        </div>
        <div>
          <label className={LABEL}>Date *</label>
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={FIELD} />
        </div>
      </div>
      <div>
        <label className={LABEL}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={FIELD} placeholder="Optional" />
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------- patient demographics */
export function PatientForm({ patientId, initial, onSaved, onFail, onCancel }: FormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName || '');
  const [middleName, setMiddleName] = useState(initial?.middleName || '');
  const [surname, setSurname] = useState(initial?.surname || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [gender, setGender] = useState(initial?.gender || '');
  const [dob, setDob] = useState(initial?.dob ? String(initial.dob).slice(0, 10) : '');
  const [bloodGroup, setBloodGroup] = useState(initial?.bloodGroup || '');
  const [genotype, setGenotype] = useState(initial?.genotype || '');
  const [maritalStatus, setMaritalStatus] = useState(initial?.maritalStatus || '');
  const [occupation, setOccupation] = useState(initial?.occupation || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [stateName, setStateName] = useState(initial?.state || '');
  const [lga, setLga] = useState(initial?.lga || '');
  const [nextOfKin, setNextOfKin] = useState(initial?.nextOfKin || '');
  const [nextOfKinPhone, setNextOfKinPhone] = useState(initial?.nextOfKinPhone || '');
  const [relationship, setRelationship] = useState(initial?.relationship || '');
  const [cardType, setCardType] = useState(initial?.cardType || '');
  const [cardNumber, setCardNumber] = useState(initial?.cardNumber || '');
  const [status, setStatus] = useState(initial?.status || 'Active');
  const { busy, err, setErr, run } = useSubmit(onSaved, onFail);

  const save = () => {
    if (!firstName.trim() || !surname.trim()) {
      setErr('First name and surname are required.');
      return;
    }
    run(async () => {
      await api.put(`/patients/${patientId}`, {
        firstName,
        middleName,
        surname,
        phone,
        email,
        gender,
        dob: dob || undefined,
        bloodGroup,
        genotype,
        maritalStatus,
        occupation,
        address,
        state: stateName,
        lga,
        nextOfKin,
        nextOfKinPhone,
        relationship,
        cardType,
        cardNumber,
        status,
      });
      return 'Patient details updated.';
    });
  };

  return (
    <Panel
      title={initial?._id ? 'Edit patient details' : 'Patient details'}
      hint="Registration data — every change is saved against your name and staff ID."
      onCancel={onCancel}
      footer={
        <>
          <div>{errLine(err)}</div>
          <div className="flex gap-2">
            <CancelBtn onClick={onCancel} />
            <SaveBtn busy={busy} onClick={save} label="Save details" />
          </div>
        </>
      }
    >
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className={LABEL}>First name *</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Middle name</label>
          <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Surname *</label>
          <input value={surname} onChange={(e) => setSurname(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Record status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            {['Active', 'Follow-up', 'Discharged', 'Inactive'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Date of birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={FIELD}>
            {['', 'Male', 'Female'].map((g) => (
              <option key={g} value={g}>
                {g || '—'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Blood group</label>
          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={FIELD}>
            {['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
              <option key={b} value={b}>
                {b || '—'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Genotype</label>
          <select value={genotype} onChange={(e) => setGenotype(e.target.value)} className={FIELD}>
            {['', 'AA', 'AS', 'SS', 'AC'].map((g) => (
              <option key={g} value={g}>
                {g || '—'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Marital status</label>
          <input value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Occupation</label>
          <input value={occupation} onChange={(e) => setOccupation(e.target.value)} className={FIELD} />
        </div>
        <div className="sm:col-span-3">
          <label className={LABEL}>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>State</label>
          <input value={stateName} onChange={(e) => setStateName(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>LGA</label>
          <input value={lga} onChange={(e) => setLga(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Card type</label>
          <input value={cardType} onChange={(e) => setCardType(e.target.value)} className={FIELD} placeholder="e.g. NHIS" />
        </div>
        <div>
          <label className={LABEL}>Card number</label>
          <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Next of kin</label>
          <input value={nextOfKin} onChange={(e) => setNextOfKin(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Next of kin phone</label>
          <input value={nextOfKinPhone} onChange={(e) => setNextOfKinPhone(e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Relationship</label>
          <input value={relationship} onChange={(e) => setRelationship(e.target.value)} className={FIELD} placeholder="e.g. Spouse" />
        </div>
      </div>
    </Panel>
  );
}
