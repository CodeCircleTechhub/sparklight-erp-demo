import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle, Loader2, AlertCircle,
  Plus, Search, PlayCircle, CheckCheck, Ban, CalendarCheck, Pencil, Trash2
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import AppointmentFormModal from '../../components/shared/AppointmentFormModal';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-cyan-100 text-cyan-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
  Requested: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
};

const REQUEST_STATUSES = ['Requested', 'Approved', 'Rejected'];
const filters = ['All', 'Requests', 'Scheduled', 'Completed'] as const;
type Filter = (typeof filters)[number];

export default function CareAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [apiStats, setApiStats] = useState({ todayCount: 0, total: 0, completed: 0, upcoming: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [actionId, setActionId] = useState('');
  const [editRow, setEditRow] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<any | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchAppointments = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments', {
        params: q ? { search: q } : {},
      });
      const list = data.appointments || [];
      setAppointments(list);
      setApiStats({
        todayCount: data.todayCount ?? 0,
        total: data.total ?? list.length,
        completed: data.completed ?? list.filter((a: any) => a.status === 'Completed').length,
        upcoming: data.upcoming ?? 0,
        cancelled: list.filter((a: any) => a.status === 'Cancelled').length,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const t = setTimeout(() => fetchAppointments(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/appointments/${id}`, { status });
      await fetchAppointments(search.trim() || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment');
    } finally {
      setActionId('');
    }
  };

  const removeAppointment = async () => {
    if (!deleteRow) return;
    setDeleteBusy(true);
    setError('');
    try {
      await api.delete(`/appointments/${deleteRow._id}`);
      setDeleteRow(null);
      await fetchAppointments(search.trim() || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleteBusy(false);
    }
  };

  const stats = [
    { label: "Today's Appointments", value: apiStats.todayCount, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Upcoming', value: apiStats.upcoming, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Completed', value: apiStats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Cancelled', value: apiStats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const patientName = (a: any) =>
    a.patient
      ? [a.patient.firstName, a.patient.surname].filter(Boolean).join(' ')
      : 'Unknown';

  const doctorName = (a: any) => a.assignedToName || a.assignedTo?.fullName || a.doctor?.fullName || 'Unassigned';

  // pending patient requests carry no date yet, so date-desc would bury them
  const visible = appointments.filter((a) =>
    filter === 'All'
      ? true
      : filter === 'Requests'
      ? REQUEST_STATUSES.includes(a.status)
      : a.status === filter,
  ).sort((a, b) => Number(b.status === 'Requested') - Number(a.status === 'Requested'));
  const requestCount = appointments.filter((a) => REQUEST_STATUSES.includes(a.status)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage patient appointments"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
              const count = f === 'Requests' ? requestCount : null;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f}
                  {count !== null && count > 0 && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading appointments...</span>
            </div>
          ) : visible.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No appointments found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visible.map((a) => {
                  const busy = actionId === a._id;
                  const isRequest = REQUEST_STATUSES.includes(a.status);
                  return (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{a.appointmentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{a.time || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {patientName(a)}
                        {isRequest && a.complaint && (
                          <p className="text-xs text-gray-500 mt-0.5 max-w-[18rem] line-clamp-2">{a.complaint}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{doctorName(a)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{a.department || 'General'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {a.date ? new Date(a.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {a.status === 'Scheduled' && (
                            <button
                              onClick={() => updateStatus(a._id, 'Confirmed')}
                              disabled={busy}
                              className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Confirm"
                            >
                              <CalendarCheck className="w-4 h-4" />
                            </button>
                          )}
                          {(a.status === 'Scheduled' || a.status === 'Confirmed') && (
                            <button
                              onClick={() => updateStatus(a._id, 'In Progress')}
                              disabled={busy}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Start"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          {a.status === 'In Progress' && (
                            <button
                              onClick={() => updateStatus(a._id, 'Completed')}
                              disabled={busy}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Complete"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                            {a.status !== 'Cancelled' && a.status !== 'Completed' && a.status !== 'Rejected' && (
                              <button
                                onClick={() => updateStatus(a._id, 'Cancelled')}
                                disabled={busy}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditRow(a)}
                              disabled={busy}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteRow(a)}
                              disabled={busy}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      <AppointmentFormModal
        open={showCreate || !!editRow}
        appointment={editRow || undefined}
        onClose={() => {
          setShowCreate(false);
          setEditRow(null);
        }}
        onCreated={() => fetchAppointments(search.trim() || undefined)}
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
