import { useEffect, useState } from 'react';
import { Stethoscope, FlaskConical, Calendar, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

function visitMeta(status: string, _reason: string) {
  if (status === 'Completed') return { color: 'bg-green-500', icon: FlaskConical };
  if (status === 'Cancelled') return { color: 'bg-red-500', icon: AlertTriangle };
  if (status === 'In Progress') return { color: 'bg-purple-500', icon: Calendar };
  return { color: 'bg-blue-500', icon: Stethoscope };
}

export default function VisitHistory() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/visits');
        if (!cancelled) setVisits(res.data.visits || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load visit history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Visit History</h1>

        {loading && <p className="text-sm text-gray-500">Loading visits…</p>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {!loading && !error && visits.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            No visits recorded yet.
          </div>
        )}

        <div className="relative">
          {visits.length > 0 && <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />}

          <div className="space-y-6">
            {visits.map((visit, i) => {
              const meta = visitMeta(visit.status, visit.reason);
              const Icon = meta.icon;
              return (
                <div key={visit._id || i} className="relative flex gap-4">
                  <div className={`w-12 h-12 ${meta.color} rounded-full flex items-center justify-center shrink-0 z-10`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5 -mt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{visit.reason || visit.status}</p>
                        <p className="text-sm text-gray-500">
                          {visit.doctor?.fullName || visit.doctorName || 'Staff'} · {visit.department || 'General'}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{fmtDate(visit.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Status: {visit.status}
                      {visit.notes ? ` — ${visit.notes}` : ''}
                    </p>
                    {visit.visitId && <p className="text-xs text-gray-400 mt-1">{visit.visitId}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
