import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, FileText, Loader2, AlertCircle, Phone, Edit, CheckCircle, FileDown, CalendarPlus, ListOrdered, AlertTriangle, ShieldCheck, BedDouble, ArrowRightLeft, LogOut } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import EditPatientModal from '../../components/shared/EditPatientModal';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { downloadPatientReport } from '../../utils/downloadPatientReport';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-yellow-100 text-yellow-700',
  Discharged: 'bg-blue-100 text-blue-700',
  Archived: 'bg-gray-100 text-gray-700',
};

const EMG_MARK_ROLES = ['super-admin', 'manager', 'receptionist', 'customer-care', 'senior-customer-care', 'doctor', 'nurse'];
const EMG_REMOVE_ROLES = ['super-admin', 'manager', 'receptionist', 'customer-care', 'senior-customer-care', 'doctor', 'nurse'];
const BED_ROLES = ['super-admin', 'manager', 'receptionist', 'nurse', 'doctor', 'customer-care', 'senior-customer-care'];
const DISCHARGE_ROLES = ['super-admin', 'manager', 'receptionist', 'nurse', 'doctor'];
const APPROVER_ROLES = ['super-admin', 'manager'];
const FORCE_DISCHARGE_ROLES = ['super-admin', 'manager', 'accountant'];

type PatientAction = 'visit' | 'queue' | 'emergency' | 'bed' | 'bedchange' | 'discharge';

export default function PatientSearch() {
  const { user } = useAuth();
  const role = user?.role || '';
  const canMarkEmergency = EMG_MARK_ROLES.includes(role);
  const canRemoveEmergency = EMG_REMOVE_ROLES.includes(role);
  const canBed = BED_ROLES.includes(role);
  const canDischarge = DISCHARGE_ROLES.includes(role);
  const isApprover = APPROVER_ROLES.includes(role);
  const needsBedApproval = ['nurse', 'doctor'].includes(role);
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [editPatient, setEditPatient] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [action, setAction] = useState<PatientAction | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [admission, setAdmission] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [bedRoom, setBedRoom] = useState('');
  const [bedLabel, setBedLabel] = useState('');

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
  const YEARS = (() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1];
  })();

  const openAction = (kind: PatientAction) => {
    const d = new Date();
    setDay(String(d.getDate()));
    setMonth(String(d.getMonth()));
    setYear(String(d.getFullYear()));
    setReason('');
    setBedRoom('');
    setBedLabel(kind === 'bedchange' ? admission?.bed || '' : '');
    setError('');
    if (kind === 'bed' || kind === 'bedchange') loadRooms();
    setAction(kind);
  };

  const chosenDate = () => {
    const d = new Date(Number(year), Number(month), Number(day), 12, 0, 0);
    if (d.getFullYear() !== Number(year) || d.getMonth() !== Number(month) || d.getDate() !== Number(day)) return null;
    return d;
  };

  const fmtDate = (d: Date) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  const submitAction = async () => {
    if (!selected || !action) return;
    if (action === 'emergency') {
      setSaving(true);
      setError('');
      try {
        const { data } = await api.post(`/patients/${selected._id}/emergency`, { reason: reason.trim() });
        setSelected(data.patient);
        setSuccess(`${name(selected)} flagged as EMERGENCY`);
        setAction(null);
        fetchPatients(query.trim() || undefined);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Could not flag emergency');
      } finally {
        setSaving(false);
      }
      return;
    }
    if (action === 'bed' || action === 'bedchange' || action === 'discharge') {
      await submitBedAction();
      return;
    }
    const d = chosenDate();
    if (!d) {
      setError('Please select a valid day, month and year');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (action === 'visit') {
        await api.post('/visits', { patient: selected._id, date: d.toISOString(), reason: reason.trim() });
        setSuccess(`Visit added for ${name(selected)} on ${fmtDate(d)}`);
      } else {
        await api.post('/receptionist/queue', { patient: selected._id, date: d.toISOString(), reason: reason.trim() });
        setSuccess(`${name(selected)} added to the queue for ${fmtDate(d)}`);
      }
      setAction(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const submitBedAction = async () => {
    if (!selected || !action) return;
    setSaving(true);
    setError('');
    try {
      if (action === 'bed') {
        if (!bedRoom && !bedLabel.trim()) {
          setError('Choose a room or enter a bed');
          setSaving(false);
          return;
        }
        const payload: any = { patient: selected._id, reason: reason.trim() };
        if (bedRoom) payload.room = bedRoom;
        if (bedLabel.trim()) payload.bed = bedLabel.trim();
        const { data } = await api.post('/admissions', payload);
        const pending = data.allocationStatus === 'Pending Approval';
        setSuccess(
          pending
            ? `Bed allocation requested for ${name(selected)} - pending manager approval`
            : `${name(selected)} admitted and allocated${data.item?.roomNumber ? ` to Room ${data.item.roomNumber}` : ''}`
        );
        setAction(null);
        if (selected?._id) loadAdmission(selected._id);
        fetchPatients(query.trim() || undefined);
        return;
      }
      if (action === 'bedchange') {
        if (!admission) {
          setError('Patient has no active admission');
          setSaving(false);
          return;
        }
        if (!bedRoom && !bedLabel.trim()) {
          setError('Choose a room or enter a bed');
          setSaving(false);
          return;
        }
        if (isApprover) {
          const payload: any = { reason: reason.trim() };
          if (bedRoom) payload.transferRoom = bedRoom;
          if (bedLabel.trim()) payload.bed = bedLabel.trim();
          await api.put(`/admissions/${admission._id}`, payload);
          setSuccess(`Bed changed for ${name(selected)}`);
        } else {
          const payload: any = {
            type: 'Bed Change',
            patient: selected._id,
            admission: admission._id,
            reason: reason.trim(),
          };
          if (bedRoom) payload.room = bedRoom;
          if (bedLabel.trim()) payload.bed = bedLabel.trim();
          await api.post('/admissions/requests', payload);
          setSuccess(`Bed change requested for ${name(selected)} - pending manager approval`);
        }
        setAction(null);
        if (selected?._id) loadAdmission(selected._id);
        return;
      }
      // discharge
      if (!admission) {
        setError('Patient has no active admission to discharge');
        setSaving(false);
        return;
      }
      try {
        await api.post(`/admissions/${admission._id}/discharge`, { notes: reason.trim() });
        setSuccess(`${name(selected)} discharged`);
        setAction(null);
        if (selected?._id) loadAdmission(selected._id);
        fetchPatients(query.trim() || undefined);
      } catch (err: any) {
        const data = err.response?.data;
        if (data?.requiresSettlement && FORCE_DISCHARGE_ROLES.includes(role) && window.confirm(`${data.message}\n\nDischarge anyway?`)) {
          await api.post(`/admissions/${admission._id}/discharge`, { notes: reason.trim(), force: true });
          setSuccess(`${name(selected)} discharged with management override`);
          setAction(null);
          if (selected?._id) loadAdmission(selected._id);
          fetchPatients(query.trim() || undefined);
        } else {
          setError(data?.message || 'Could not discharge patient');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeEmergency = async () => {
    if (!selected) return;
    if (!window.confirm(`Remove ${name(selected)} from emergency?`)) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await api.delete(`/patients/${selected._id}/emergency`);
      setSelected(data.patient);
      setSuccess(`${name(selected)} removed from emergency`);
      fetchPatients(query.trim() || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not remove emergency');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = async (patient: any) => {
    if (!patient?._id || downloadingId) return;
    setDownloadingId(patient._id);
    try {
      await downloadPatientReport(patient._id, `Patient_Registration_Report_${patient.patientId}.pdf`);
      setSuccess(`Report card downloaded for ${patient.patientId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download report card');
    } finally {
      setDownloadingId(null);
    }
  };

  const loadAdmission = useCallback(async (id: string) => {
    try {
      const { data } = await api.get('/admissions', { params: { patientId: id } });
      setAdmission((data.items || []).find((a: any) => a.status !== 'Discharged') || null);
    } catch {
      setAdmission(null);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    try {
      const { data } = await api.get('/admissions/rooms');
      setRooms(data.rooms || []);
    } catch {
      setRooms([]);
    }
  }, []);

  const fetchPatients = useCallback(async (search?: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/patients', {
        params: search ? { search } : {},
      });
      setPatients(data.patients ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchPatients(query.trim() || undefined);
    }, 350);
    return () => clearTimeout(t);
  }, [query, fetchPatients]);

  useEffect(() => {
    if (!selected && !editPatient) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setEditPatient(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected, editPatient]);

  useEffect(() => {
    if (!selected) {
      setAction(null);
      setAdmission(null);
      return;
    }
    loadAdmission(selected._id);
  }, [selected, loadAdmission]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const name = (p: any) => [p.firstName, p.surname].filter(Boolean).join(' ');

  const lastVisit = (p: any) => {
    const d = p.updatedAt || p.createdAt;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Search" icon={Search} />

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, patient ID, phone, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Searching patients...</span>
              </div>
            ) : patients.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No patients found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient ID</th>
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium hidden lg:table-cell">Card</th>
            <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Gender</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Last Seen</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map((p) => (
                    <tr
                      key={p._id}
                      className={p.emergency ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                    >
                      <td className="py-3 font-medium text-blue-600">{p.patientId}</td>
              <td className="py-3 text-gray-900">{name(p)}</td>
              <td className="py-3 hidden lg:table-cell">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    (p.cardType || 'Individual') === 'Family'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {(p.cardType || 'Individual') === 'Family' ? 'Family' : 'Individual'} ·{' '}
                  {p.cardNumber || p.patientId}
                </span>
              </td>
              <td className="py-3 text-gray-600 hidden md:table-cell">
                        {p.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {p.phone}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{p.gender || '-'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{lastVisit(p)}</td>
                      <td className="py-3">
                        <div className="flex flex-col items-start gap-1">
                          {p.emergency && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-600 text-white">
                              <AlertTriangle className="w-3 h-3" />
                              Emergency
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                            {p.status || 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelected(p)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View patient"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelected(null);
                              setEditPatient(p);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit patient"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(p)}
                            disabled={downloadingId === p._id}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Download report card (PDF)"
                          >
                            {downloadingId === p._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {selected.emergency && (
                <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="relative flex h-3 w-3 mt-1 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-wide text-red-700">Patient in emergency</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        {selected.emergencyReason ? `${selected.emergencyReason} · ` : ''}
                        {selected.emergencyBy ? `flagged by ${selected.emergencyBy}` : 'flagged'}
                        {selected.emergencyAt
                          ? ` · ${new Date(selected.emergencyAt).toLocaleString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  {canRemoveEmergency && (
                    <button
                      onClick={removeEmergency}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-red-300 text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      Remove emergency
                    </button>
                  )}
                </div>
              )}
              {action && (
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    action === 'emergency'
                      ? 'border-red-200 bg-red-50/60'
                      : action === 'discharge'
                        ? 'border-rose-200 bg-rose-50/60'
                        : action === 'bed' || action === 'bedchange'
                          ? 'border-sky-200 bg-sky-50/60'
                          : 'border-blue-100 bg-blue-50/60'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    {action === 'visit' ? (
                      <CalendarPlus className="w-4 h-4 text-blue-600" />
                    ) : action === 'queue' ? (
                      <ListOrdered className="w-4 h-4 text-indigo-600" />
                    ) : action === 'discharge' ? (
                      <LogOut className="w-4 h-4 text-rose-600" />
                    ) : action === 'bedchange' ? (
                      <ArrowRightLeft className="w-4 h-4 text-sky-600" />
                    ) : action === 'bed' ? (
                      <BedDouble className="w-4 h-4 text-sky-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    {action === 'visit'
                      ? 'Add visit'
                      : action === 'queue'
                        ? 'Add to queue'
                        : action === 'emergency'
                          ? 'Flag emergency for'
                          : action === 'bed'
                            ? needsBedApproval
                              ? 'Request bed for'
                              : 'Allocate bed for'
                            : action === 'bedchange'
                              ? isApprover
                                ? 'Change bed for'
                                : 'Request bed change for'
                              : 'Discharge'}{' '}
                    {name(selected)}
                  </p>
                  {(action === 'visit' || action === 'queue') && (
                    <div className="grid grid-cols-3 gap-2">
                    <label className="block text-xs text-gray-500">
                      Day
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-gray-500">
                      Month
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                      >
                        {MONTHS.map((m, i) => (
                          <option key={m} value={i}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-gray-500">
                      Year
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </label>
                    </div>
                  )}
                  {(action === 'bed' || action === 'bedchange') && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block text-xs text-gray-500">
                        Room
                        <select
                          value={bedRoom}
                          onChange={(e) => setBedRoom(e.target.value)}
                          className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                        >
                          <option value="">No room (assign later)</option>
                          {rooms
                            .filter(
                              (r) =>
                                (r.availableBeds || 0) > 0 &&
                                (action !== 'bedchange' || String(r._id) !== String(admission?.room || ''))
                            )
                            .map((r) => (
                              <option key={r._id} value={r._id}>
                                {r.roomNumber} - {r.ward} ({r.availableBeds} free)
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className="block text-xs text-gray-500">
                        Bed (optional)
                        <input
                          type="text"
                          value={bedLabel}
                          onChange={(e) => setBedLabel(e.target.value)}
                          placeholder="e.g. Bed 3"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                        />
                      </label>
                    </div>
                  )}
                  <label className="block text-xs text-gray-500">
                    {action === 'discharge'
                      ? 'Discharge notes (optional)'
                      : action === 'bedchange'
                        ? 'Reason for change (optional)'
                        : 'Reason (optional)'}
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={
                        action === 'visit'
                          ? 'e.g. fever, follow-up, check-up'
                          : action === 'queue'
                            ? 'e.g. consultation, lab test'
                            : action === 'bed'
                              ? 'e.g. admission, observation'
                              : action === 'bedchange'
                                ? 'e.g. isolation, private room, nearer nursing station'
                                : action === 'discharge'
                                  ? 'e.g. recovered, home care advised'
                                  : 'e.g. accident, cardiac, severe bleeding'
                      }
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white"
                    />
                  </label>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAction(null)}
                      className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAction}
                      disabled={saving}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white disabled:opacity-50 ${
                        action === 'emergency'
                          ? 'bg-red-600 hover:bg-red-700'
                          : action === 'discharge'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : action === 'bed' || action === 'bedchange'
                              ? 'bg-sky-600 hover:bg-sky-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : action === 'visit' ? (
                        <CalendarPlus className="w-4 h-4" />
                      ) : action === 'queue' ? (
                        <ListOrdered className="w-4 h-4" />
                      ) : action === 'discharge' ? (
                        <LogOut className="w-4 h-4" />
                      ) : action === 'bedchange' ? (
                        <ArrowRightLeft className="w-4 h-4" />
                      ) : action === 'bed' ? (
                        <BedDouble className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      {action === 'visit'
                        ? 'Save visit'
                        : action === 'queue'
                          ? 'Add to queue'
                          : action === 'emergency'
                            ? 'Flag emergency'
                            : action === 'bed'
                              ? needsBedApproval
                                ? 'Request bed'
                                : 'Allocate bed'
                              : action === 'bedchange'
                                ? isApprover
                                  ? 'Change bed'
                                  : 'Request change'
                                : 'Discharge patient'}
                    </button>
                  </div>
                </div>
              )}
              {[
                ['Patient ID', selected.patientId],
                ['Name', name(selected)],
                ['Middle Name', selected.middleName],
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Gender', selected.gender],
                ['Date of Birth', selected.dob ? new Date(selected.dob).toLocaleDateString() : ''],
                ['Address', selected.address],
                ['State', selected.state],
                ['LGA', selected.lga],
                ['Blood Group', selected.bloodGroup],
                ['Genotype', selected.genotype],
                ['Marital Status', selected.maritalStatus],
                ['Occupation', selected.occupation],
                ['Next of Kin', selected.nextOfKin],
                ['Next of Kin Phone', selected.nextOfKinPhone],
                ['Relationship', selected.relationship],
                ['Emergency Contact', selected.emergencyContact],
                ...(admission
                  ? [
                      [
                        'Admission',
                        `${admission.admissionId || '-'} - Room ${admission.roomNumber || '-'} (${admission.ward || '-'})${
                          admission.bed ? ` - ${admission.bed}` : ''
                        }${admission.allocationStatus === 'Pending Approval' ? ' - PENDING APPROVAL' : ''}`,
                      ],
                    ]
                  : []),
                ['Status', selected.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium text-right">{value || '-'}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {canMarkEmergency && !selected.emergency && (
                  <button
                    onClick={() => (action === 'emergency' ? setAction(null) : openAction('emergency'))}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
                      action === 'emergency'
                        ? 'bg-red-700 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Emergency
                  </button>
                )}
                <button
                  onClick={() => (action === 'visit' ? setAction(null) : openAction('visit'))}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    action === 'visit' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <CalendarPlus className="w-4 h-4" />
                  Add visit
                </button>
                <button
                  onClick={() => (action === 'queue' ? setAction(null) : openAction('queue'))}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    action === 'queue' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  Add to queue
                </button>
                {canBed && !admission && (
                  <button
                    onClick={() => (action === 'bed' ? setAction(null) : openAction('bed'))}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      action === 'bed' ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <BedDouble className="w-4 h-4" />
                    Request bed
                  </button>
                )}
                {canBed && admission && admission.allocationStatus !== 'Pending Approval' && (
                  <button
                    onClick={() => (action === 'bedchange' ? setAction(null) : openAction('bedchange'))}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      action === 'bedchange' ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Change bed
                  </button>
                )}
                {canDischarge && admission && (
                  <button
                    onClick={() => (action === 'discharge' ? setAction(null) : openAction('discharge'))}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      action === 'discharge' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Discharge
                  </button>
                )}
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => handleDownloadReport(selected)}
                  disabled={downloadingId === selected._id}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadingId === selected._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  Download Report (PDF)
                </button>
                <button
                  onClick={() => {
                    setEditPatient(selected);
                    setSelected(null);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSaved={() => {
            setSuccess('Patient information updated successfully');
            fetchPatients(query.trim() || undefined);
          }}
        />
      )}
    </div>
  );
}
