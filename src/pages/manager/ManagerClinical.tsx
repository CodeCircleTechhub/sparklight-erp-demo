import { useState, useEffect } from 'react';
import { Stethoscope, ClipboardList, BedDouble, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface Consultation {
  _id: string;
  patient?: { fullName?: string } | null;
  doctor?: { fullName?: string } | null;
  department?: string;
  status?: string;
  date?: string;
}

const statusColors: Record<string, string> = {
  'Under Observation': 'bg-blue-100 text-blue-700',
  Admitted: 'bg-green-100 text-green-700',
  Stable: 'bg-green-100 text-green-700',
  'Post-Surgery': 'bg-violet-100 text-violet-700',
  'Under Treatment': 'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
  Recovered: 'bg-emerald-100 text-emerald-700',
};

export default function ManagerClinical() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState([
    { label: "Today's Consultations", value: '0', icon: Stethoscope, color: 'bg-blue-500' },
    { label: 'Pending Results', value: '0', icon: ClipboardList, color: 'bg-amber-500' },
    { label: 'Admissions', value: '0', icon: BedDouble, color: 'bg-green-500' },
    { label: 'Discharges', value: '0', icon: ArrowUpRight, color: 'bg-violet-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [consultationsRes, visitsRes] = await Promise.all([
          api.get('/clinical/consultations'),
          api.get('/visits'),
        ]);

        const consultationsData = consultationsRes.data?.consultations || [];
        setConsultations(consultationsData);

        const visits = visitsRes.data || {};
        const todayConsultations = consultationsData.length;
        const pendingResults = consultationsData.filter(
          (c: Consultation) => c.status === 'Pending' || c.status === 'Under Observation'
        ).length;
        const admissions = consultationsData.filter(
          (c: Consultation) => c.status === 'Admitted'
        ).length;
        const discharges = visits.discharges || consultationsData.filter(
          (c: Consultation) => c.status === 'Recovered' || c.status === 'Discharged'
        ).length;

        setStats([
          { label: "Today's Consultations", value: String(todayConsultations), icon: Stethoscope, color: 'bg-blue-500' },
          { label: 'Pending Results', value: String(pendingResults), icon: ClipboardList, color: 'bg-amber-500' },
          { label: 'Admissions', value: String(admissions), icon: BedDouble, color: 'bg-green-500' },
          { label: 'Discharges', value: String(discharges), icon: ArrowUpRight, color: 'bg-violet-500' },
        ]);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load clinical data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Clinical Overview" icon={Stethoscope} />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '—' : s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Last Visit</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : consultations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No consultations found</td>
                  </tr>
                ) : (
                  consultations.map((c, i) => (
                    <tr key={c._id || i} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{c.patient?.fullName || 'N/A'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{c.doctor?.fullName || 'N/A'}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{c.department || 'N/A'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {c.date ? new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                          {c.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
