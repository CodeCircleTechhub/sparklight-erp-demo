import { useState, useEffect, useCallback } from 'react';
import { LogOut, Search, Loader2, AlertCircle, Eye, CalendarClock } from 'lucide-react';
import { PageHeader, EmptyState } from '../../components/ui/PageComponents';
import CategoryTag from '../../components/shared/CategoryTag';
import PatientHistoryModal from '../../components/shared/PatientHistoryModal';
import api from '../../services/api';

// Out patients: registered people who walk in for a check-up / service and go
// home the same day — no admission, no ward/bed, they keep their patient number.
export default function OutPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);

  const fetchPatients = useCallback(async (q: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/nurse/patients', {
        params: { care: 'out', ...(q ? { search: q } : {}) },
      });
      setPatients(data.patients || []);
      setStats(data.stats || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load out patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPatients(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search, fetchPatients]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Out Patients"
        description="Patients not under admission — they come in for check-ups or services and go home. No admission number needed, their patient number covers every visit."
        icon={LogOut}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-100">
              <LogOut className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-500">Out Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <CalendarClock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inPatient ?? 0}</p>
              <p className="text-sm text-gray-500">Currently Admitted (In Patient)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-100">
              <CalendarClock className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.antenatal ?? 0}</p>
              <p className="text-sm text-gray-500">Antenatal</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone no. or patient ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <EmptyState icon={LogOut} title="No out patients" description="Every registered patient is currently admitted." />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Age / Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Vitals</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.patientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                    <td className="px-4 py-3">
                      <CategoryTag categoryKey={p.categoryKey} category={p.category} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.age ?? '—'} {p.gender ? `· ${p.gender}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{p.condition || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.lastVitals ? `${p.lastVitals.temperature ?? '—'}°C` : 'No vitals yet'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewing(p._id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                        title="View full chart"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewing && (
        <PatientHistoryModal
          patientId={viewing}
          onClose={() => setViewing(null)}
          onRefresh={() => fetchPatients(search.trim())}
        />
      )}
    </div>
  );
}
