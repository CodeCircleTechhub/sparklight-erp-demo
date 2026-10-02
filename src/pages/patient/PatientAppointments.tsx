import { useEffect, useState } from 'react';
import { Calendar, Clock, Stethoscope, FileText } from 'lucide-react';
import api from '../../services/api';

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

type Tab = 'Upcoming' | 'Requests' | 'Past' | 'Cancelled';

const tabs: Tab[] = ['Upcoming', 'Requests', 'Past', 'Cancelled'];

const REQUEST_STATUSES = ['Requested', 'Approved', 'Rejected'];

const statusLabel = (status: string) => {
  if (status === 'Requested') return 'Awaiting approval';
  if (status === 'In Progress') return 'In progress';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const statusColor = (status: string) => {
  if (status === 'Requested') return 'bg-amber-100 text-amber-700';
  if (status === 'Approved') return 'bg-green-100 text-green-700';
  if (status === 'Rejected') return 'bg-red-100 text-red-700';
  if (status === 'Cancelled') return 'bg-red-100 text-red-700';
  if (status === 'Completed') return 'bg-gray-100 text-gray-600';
  return 'bg-green-100 text-green-700';
};

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/appointments');
        if (!cancelled) setAppointments(res.data.appointments || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load appointments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const now = Date.now();
  const filtered = appointments.filter((a) => {
    const date = a.date ? new Date(a.date).getTime() : 0;
    const status = a.status || '';
    const isRequest = REQUEST_STATUSES.includes(status);
    if (activeTab === 'Requests') return isRequest;
    if (isRequest) return false;
    if (activeTab === 'Cancelled') return status === 'Cancelled';
    if (activeTab === 'Past') return date < now || status === 'Completed';
    if (status === 'Completed') return false;
    return date >= now;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        </div>

        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-gray-500">Loading appointments…</p>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            No {activeTab.toLowerCase()} appointments.
          </div>
        )}

        <div className="space-y-4">
          {!loading &&
            filtered.map((appt) => {
              const cancelled = appt.status === 'Cancelled';
              return (
                <div
                  key={appt._id || appt.appointmentId}
                  className={`bg-white rounded-xl shadow-sm border p-6 ${
                    cancelled ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {appt.status === 'Rejected'
                          ? 'Request declined'
                          : appt.assignedToName || appt.doctor?.fullName || (REQUEST_STATUSES.includes(appt.status) ? 'Clinician not assigned yet' : 'Doctor TBA')}
                      </p>
                      <p className="text-sm text-gray-500">{appt.department || appt.type || 'Consultation'}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {fmtDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {appt.time}
                        </span>
                        {appt.appointmentId && (
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <FileText className="w-4 h-4" />
                            {appt.appointmentId}
                          </span>
                        )}
                      </div>
                      {appt.complaint && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium text-gray-700">Reason:</span> {appt.complaint}
                        </p>
                      )}
                      {appt.status === 'Approved' && (
                        <p className="text-sm text-green-700 mt-1">
                          Assigned to {appt.assignedToName || appt.doctor?.fullName || 'your clinician'}
                          {appt.approvalNote ? ` — ${appt.approvalNote}` : ''}
                        </p>
                      )}
                      {appt.status === 'Rejected' && (
                        <p className="text-sm text-red-600 mt-1">
                          {appt.rejectionReason || 'No reason provided.'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(appt.status || 'Scheduled')}`}>
                        {statusLabel(appt.status || 'Scheduled')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
