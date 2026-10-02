import { useState, useEffect } from 'react';
import {
  Stethoscope, HeartPulse, BedDouble, CalendarClock, Loader2, AlertCircle,
  ClipboardList, User,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Transferred: 'bg-purple-100 text-purple-800',
  Discharged: 'bg-gray-100 text-gray-700',
  'Not admitted': 'bg-gray-100 text-gray-700',
};

export default function MyCareTeam() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/patient/care-team');
        if (!cancelled) setData(data);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load care team');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const admission = data?.admission;
  const visits = data?.visits || [];
  const nextAppt = data?.nextAppointment;

  const cards = [
    {
      label: 'Doctor',
      value: data?.doctorName || 'Not assigned',
      icon: Stethoscope,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      sub: admission?.doctor?.department || nextAppt?.doctor?.department || '',
    },
    {
      label: 'Nurse',
      value: data?.nurseName || 'Not assigned',
      icon: HeartPulse,
      color: 'text-teal-600',
      bg: 'bg-teal-100',
      sub: admission?.nurse?.role ? 'Ward nurse' : '',
    },
    {
      label: 'Room / Ward',
      value: data?.roomNumber ? `${data.roomNumber}${data.ward ? ` · ${data.ward}` : ''}` : 'Not allocated',
      icon: BedDouble,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      sub: data?.bed || admission?.room?.type || '',
    },
    {
      label: 'Admission status',
      value: data?.status || 'Not admitted',
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      sub: admission?.admissionId || '',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Care Team"
        description="Your assigned doctor, nurse and room allocation"
      />

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500 text-sm">Loading care team...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg ${c.bg}`}>
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{c.label}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{c.value}</p>
                {c.sub && <p className="text-xs text-gray-500 mt-1">{c.sub}</p>}
              </div>
            ))}
          </div>

          {admission && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Current Admission</h2>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[admission.status] || 'bg-gray-100 text-gray-700'}`}>
                  {admission.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Admission ID</p>
                  <p className="font-medium text-gray-900">{admission.admissionId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admitted on</p>
                  <p className="font-medium text-gray-900">
                    {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-medium text-gray-900">
                    {admission.roomNumber || '—'}
                    {admission.ward ? ` · ${admission.ward}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Reason</p>
                  <p className="font-medium text-gray-900 truncate">{admission.reason || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {nextAppt && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-100">
                  <CalendarClock className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Next Appointment</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{nextAppt.doctor?.fullName || nextAppt.doctorName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {nextAppt.date ? new Date(nextAppt.date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{nextAppt.time || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{nextAppt.status || '—'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Recent Visits & Care Team</h2>
            </div>
            {visits.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No visits recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nurse</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visits.map((v: any) => (
                      <tr key={v._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {v.date ? new Date(v.date).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {v.doctorName || v.doctor?.fullName || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {v.nurseName || v.nurse?.fullName || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{v.reason || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.status || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
