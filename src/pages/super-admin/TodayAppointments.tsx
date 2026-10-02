import { useEffect, useState, useCallback } from 'react';
import { Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react';
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

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'Confirmed') return 'bg-blue-100 text-blue-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (s === 'Scheduled') return 'bg-yellow-100 text-yellow-700';
  if (s === 'Waiting') return 'bg-yellow-100 text-yellow-700';
  if (s === 'Cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState([
    { title: 'Total', value: '0', icon: Calendar, color: 'blue' as const },
    { title: 'Confirmed', value: '0', icon: Calendar, color: 'green' as const },
    { title: 'Waiting', value: '0', icon: Calendar, color: 'yellow' as const },
    { title: 'Completed', value: '0', icon: Calendar, color: 'purple' as const },
  ]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<Appointment | null>(null);
  const [deleteRow, setDeleteRow] = useState<Appointment | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(() => {
    api.get('/appointments/today').then(({ data }) => {
      setAppointments(data.appointments || []);
      setStats([
        { title: 'Total', value: (data.total ?? 0).toLocaleString(), icon: Calendar, color: 'blue' as const },
        { title: 'Confirmed', value: (data.confirmed ?? 0).toLocaleString(), icon: Calendar, color: 'green' as const },
        { title: 'Waiting', value: (data.waiting ?? 0).toLocaleString(), icon: Calendar, color: 'yellow' as const },
        { title: 'Completed', value: (data.completed ?? 0).toLocaleString(), icon: Calendar, color: 'purple' as const },
      ]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeAppointment = async () => {
    if (!deleteRow) return;
    setDeleteBusy(true);
    setActionError('');
    try {
      await api.delete(`/appointments/${deleteRow._id}`);
      setDeleteRow(null);
      load();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Today's Appointments" icon={Calendar} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {actionError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 m-4 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {actionError}
          </div>
        )}
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No appointments today</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      {row.patient ? `${row.patient.firstName} ${row.patient.surname}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {row.doctor ? row.doctor.fullName : row.department || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department || '-'}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.type}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
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
        open={!!editRow}
        appointment={editRow || undefined}
        onClose={() => setEditRow(null)}
        onCreated={load}
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
