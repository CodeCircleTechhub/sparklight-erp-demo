import { useState, useEffect } from 'react';
import { Briefcase, FileText, Users, CheckCircle, MoreVertical, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface Position {
  id?: string;
  position: string;
  department: string;
  applications: number;
  interviews: number;
  offered: number;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'green';
    case 'Closed': return 'gray';
    default: return 'gray';
  }
};

export default function Recruitment() {
  const [stats, setStats] = useState({ openPositions: 0, totalPositions: 0, totalApplications: 0, hiredThisMonth: 0 });
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({ position: '', department: '', status: 'Open' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/recruitment');
      setPositions(data.positions || []);
      setStats(data.stats || { openPositions: 0, totalPositions: 0, totalApplications: 0, hiredThisMonth: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load recruitment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = async () => {
    if (!newPosition.position || !newPosition.department) return;
    try {
      await api.post('/recruitment', newPosition);
      setShowAddModal(false);
      setNewPosition({ position: '', department: '', status: 'Open' });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add position');
    }
  };

  const statCards = [
    { label: 'Open Positions', value: stats.openPositions, icon: Briefcase, color: 'bg-[#3b82f6]' },
    { label: 'Total Positions', value: stats.totalPositions, icon: FileText, color: 'bg-emerald-500' },
    { label: 'Applications', value: stats.totalApplications, icon: Users, color: 'bg-purple-500' },
    { label: 'Hired This Month', value: stats.hiredThisMonth, icon: CheckCircle, color: 'bg-amber-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader
          title="Recruitment"
          icon={Briefcase}
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add Position
            </button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Position', 'Department', 'Applications', 'Interviews', 'Offered', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      No open positions yet. Click "Add Position" to get started.
                    </td>
                  </tr>
                ) : (
                  positions.map((p, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.position}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{p.department}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{p.applications || 0}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{p.interviews || 0}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{p.offered || 0}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} color={getStatusColor(p.status) as any} /></td>
                      <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Position</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
                <input
                  type="text"
                  value={newPosition.position}
                  onChange={(e) => setNewPosition({ ...newPosition, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  placeholder="e.g. Senior Nurse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newPosition.department}
                  onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  placeholder="e.g. Cardiology"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleAddPosition}
                disabled={!newPosition.position || !newPosition.department}
                className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Add Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
