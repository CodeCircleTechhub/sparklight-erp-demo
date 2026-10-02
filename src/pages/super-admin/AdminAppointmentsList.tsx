import { useEffect, useState, useCallback } from 'react';
import { Search, Calendar, CheckCircle, Clock, Timer, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';
import AppointmentFormModal from '../../components/shared/AppointmentFormModal';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';

interface Appointment {
  _id: string;
  appointmentId: string;
  patient: { _id?: string; firstName: string; surname: string } | null;
  doctor: { _id?: string; fullName: string } | null;
  department: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

const statusColor: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminAppointmentsList() {
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editRow, setEditRow] = useState<Appointment | null>(null);
  const [deleteRow, setDeleteRow] = useState<Appointment | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [stats, setStats] = useState([
    { title: 'Total Appointments', value: '0', icon: Calendar, color: 'blue' as const },
    { title: 'Today', value: '0', icon: Clock, color: 'green' as const },
    { title: 'Upcoming', value: '0', icon: Timer, color: 'yellow' as const },
    { title: 'Completed', value: '0', icon: CheckCircle, color: 'purple' as const },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments', { params: { search } });
      setAppointments(data.appointments || []);
      setStats([
        { title: 'Total Appointments', value: (data.total ?? 0).toLocaleString(), icon: Calendar, color: 'blue' as const },
        { title: 'Today', value: (data.todayCount ?? 0).toLocaleString(), icon: Clock, color: 'green' as const },
        { title: 'Upcoming', value: (data.upcoming ?? 0).toLocaleString(), icon: Timer, color: 'yellow' as const },
        { title: 'Completed', value: (data.completed ?? 0).toLocaleString(), icon: CheckCircle, color: 'purple' as const },
      ]);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const removeAppointment = async () => {
    if (!deleteRow) return;
    setDeleteBusy(true);
    setActionError('');
    try {
      await api.delete(`/appointments/${deleteRow._id}`);
      setDeleteRow(null);
      await fetchData();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="All Appointments" icon={Calendar} description="Manage all hospital appointments" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
              />
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>
        </div>

        {actionError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.appointmentId}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      {row.patient ? `${row.patient.firstName} ${row.patient.surname}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {row.doctor ? row.doctor.fullName : row.department || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department || '-'}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.type}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] || 'bg-gray-100 text-gray-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditRow(row)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteRow(row)}
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

      <AppointmentFormModal
        open={showCreate || !!editRow}
        appointment={editRow || undefined}
        onClose={() => {
          setShowCreate(false);
          setEditRow(null);
        }}
        onCreated={fetchData}
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
