import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Clock, CheckCircle, XCircle, Loader2, Plus, UserCheck, Send, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import AppointmentFormModal from '../../components/shared/AppointmentFormModal';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';

interface PatientRef {
  _id: string;
  firstName: string;
  surname: string;
  patientId: string;
}

interface DoctorRef {
  _id: string;
  fullName: string;
  role?: string;
}

interface Appointment {
  _id: string;
  appointmentId: string;
  patient: PatientRef;
  doctor: DoctorRef;
  assignedTo?: DoctorRef | null;
  assignedToName?: string;
  date: string;
  time: string;
  status: string;
  type: string;
  department: string;
  complaint?: string;
  approvalNote?: string;
  rejectionReason?: string;
}

interface RequestRow extends Appointment {
  requestedByName?: string;
}

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Requested: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Confirmed: 'bg-emerald-100 text-emerald-700',
};

export default function ManagerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editRow, setEditRow] = useState<Appointment | null>(null);
  const [deleteRow, setDeleteRow] = useState<Appointment | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [stats, setStats] = useState([
    { label: "Today's Appointments", value: '0', icon: CalendarCheck, color: 'bg-blue-500' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: '0', icon: Clock, color: 'bg-violet-500' },
    { label: 'Total', value: '0', icon: XCircle, color: 'bg-red-500' },
  ]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/appointments');
      setAppointments(data.appointments ?? []);
      setStats([
        { label: "Today's Appointments", value: (data.todayAppointments ?? data.todayCount ?? 0).toLocaleString(), icon: CalendarCheck, color: 'bg-blue-500' },
        { label: 'Completed', value: (data.completed ?? 0).toLocaleString(), icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: (data.pending ?? 0).toLocaleString(), icon: Clock, color: 'bg-violet-500' },
        { label: 'Total', value: (data.total ?? 0).toLocaleString(), icon: XCircle, color: 'bg-red-500' },
      ]);
    } catch (err: any) {
      console.error('Failed to fetch appointments', err);
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [clinicians, setClinicians] = useState<DoctorRef[]>([]);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [assignForm, setAssignForm] = useState({ assignedTo: '', date: '', time: '', note: '' });
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [panelOk, setPanelOk] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const [reqRes, staffRes] = await Promise.all([
        api.get('/appointments/requests'),
        api.get('/chat/staff'),
      ]);
      setRequests(reqRes.data.requests || []);
      setClinicians(
        (staffRes.data.staff || [])
          .filter((u: any) => (u.role === 'doctor' || u.role === 'nurse') && u.isActive !== false)
          .map((u: any) => ({ _id: u._id, fullName: u.fullName, role: u.role })),
      );
    } catch (err: any) {
      setPanelError(err.response?.data?.message || 'Failed to load patient requests');
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approve = async (id: string) => {
    if (!assignForm.assignedTo) {
      setPanelError('Choose an active doctor or nurse to assign');
      return;
    }
    if (!assignForm.date) {
      setPanelError('Pick the appointment date');
      return;
    }
    if (!assignForm.time) {
      setPanelError('Pick the appointment time');
      return;
    }
    setActionBusy(true);
    setPanelError(null);
    setPanelOk('');
    try {
      const { data } = await api.put(`/appointments/${id}/approve`, assignForm);
      setPanelOk(data.message || 'Request approved');
      setDecidingId(null);
      setAssignForm({ assignedTo: '', date: '', time: '', note: '' });
      await Promise.all([fetchRequests(), fetchAppointments()]);
    } catch (err: any) {
      setPanelError(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionBusy(false);
    }
  };

  const reject = async (id: string) => {
    setActionBusy(true);
    setPanelError(null);
    setPanelOk('');
    try {
      const { data } = await api.put(`/appointments/${id}/reject`, { reason: rejectReason });
      setPanelOk(data.message || 'Request declined');
      setRejectingId(null);
      setRejectReason('');
      await Promise.all([fetchRequests(), fetchAppointments()]);
    } catch (err: any) {
      setPanelError(err.response?.data?.message || 'Failed to decline request');
    } finally {
      setActionBusy(false);
    }
  };

  const removeAppointment = async () => {
    if (!deleteRow) return;
    setDeleteBusy(true);
    setError(null);
    try {
      await api.delete(`/appointments/${deleteRow._id}`);
      setDeleteRow(null);
      await fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleteBusy(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Appointments" icon={CalendarCheck} />

        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient appointment requests</h2>
              <p className="text-sm text-gray-500 mt-0.5">Review the complaint, pick the date &amp; time, assign a nurse or doctor, then approve.</p>
            </div>
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full w-fit shrink-0">
              {requests.length} waiting
            </span>
          </div>

          {panelOk && (
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-green-50 text-green-700 border border-green-200 mb-4">{panelOk}</div>
          )}
          {panelError && (
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-red-50 text-red-700 border border-red-200 mb-4">{panelError}</div>
          )}

          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-500">Loading requests…</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No pending requests from patients.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {r.patient ? `${r.patient.firstName} ${r.patient.surname}` : r.requestedByName || 'Patient'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {r.appointmentId} · {r.date ? new Date(r.date).toLocaleDateString() : '-'} {r.time || ''} · {r.type}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium text-gray-800">Complaint:</span> {r.complaint || '—'}
                      </p>
                      {r.status === 'Approved' && (
                        <p className="text-xs text-green-700 mt-1">
                          Assigned to {r.assignedToName || r.assignedTo?.fullName || r.doctor?.fullName || '—'}
                          {r.approvalNote ? ` — ${r.approvalNote}` : ''}
                        </p>
                      )}
                      {r.status === 'Rejected' && (
                        <p className="text-xs text-red-600 mt-1">Declined{r.rejectionReason ? `: ${r.rejectionReason}` : ''}</p>
                      )}
                    </div>
                    {r.status === 'Requested' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setPanelError(null);
                            setDecidingId(decidingId === r._id ? null : r._id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDecidingId(null);
                            setPanelError(null);
                            setRejectingId(rejectingId === r._id ? null : r._id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>

                  {decidingId === r._id && r.status === 'Requested' && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                      {clinicians.length === 0 ? (
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          No active doctor or nurse accounts yet. Add one under Users before approving.
                        </p>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Assign doctor or nurse</label>
                            <select
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={assignForm.assignedTo}
                              onChange={(e) => setAssignForm({ ...assignForm, assignedTo: e.target.value })}
                            >
                              <option value="">Select a clinician…</option>
                              {clinicians.map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.fullName} — {c.role === 'nurse' ? 'Nurse' : 'Doctor'}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Appointment date *</label>
                              <input
                                type="date"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={assignForm.date}
                                onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Appointment time *</label>
                              <input
                                type="time"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={assignForm.time}
                                onChange={(e) => setAssignForm({ ...assignForm, time: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Note for the patient (optional)</label>
                            <input
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. Come with your previous test results"
                              value={assignForm.note}
                              onChange={(e) => setAssignForm({ ...assignForm, note: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() => approve(r._id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-60"
                            >
                              {actionBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              Confirm approval
                            </button>
                            <button
                              type="button"
                              onClick={() => setDecidingId(null)}
                              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {rejectingId === r._id && r.status === 'Requested' && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-red-100 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reason for declining (shown to the patient)</label>
                        <input
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                          placeholder="e.g. Please book through reception for routine checks"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() => reject(r._id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60"
                        >
                          {actionBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          Confirm decline
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingId(null)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No appointments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{a.appointmentId}</td>
                      <td className="py-3 text-gray-900">
                        {a.patient ? `${a.patient.firstName} ${a.patient.surname}` : 'N/A'}
                      </td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {a.assignedToName || a.assignedTo?.fullName || a.doctor?.fullName || 'N/A'}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">
                        {a.date ? new Date(a.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{a.time || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditRow(a)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteRow(a)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <AppointmentFormModal
        open={showCreate || !!editRow}
        appointment={editRow || undefined}
        onClose={() => {
          setShowCreate(false);
          setEditRow(null);
        }}
        onCreated={fetchAppointments}
      />

      <ConfirmDeleteModal
        open={!!deleteRow}
        title="Delete appointment"
        message={
          deleteRow
            ? `${deleteRow.appointmentId || 'This appointment'} will be permanently deleted. This action cannot be undone.`
            : ''
        }
        busy={deleteBusy}
        onCancel={() => setDeleteRow(null)}
        onConfirm={removeAppointment}
      />
    </div>
  );
}
