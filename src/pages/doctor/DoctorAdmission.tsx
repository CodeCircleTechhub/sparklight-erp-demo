import { useState, useEffect, useCallback } from 'react';
import {
  Bed, Users, Calendar, LogOut, Search, Loader2, AlertCircle, X,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { billingBadge } from '../../utils/billingStatus';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const statusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Discharged: 'bg-gray-100 text-gray-800',
  Transferred: 'bg-purple-100 text-purple-800',
};

export default function DoctorAdmission() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchData = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 200 };
      if (q) params.search = q;
      if (user?.id) params.doctor = user.id;
      const [listRes, statsRes, billRes] = await Promise.all([
        api.get('/admissions', { params }),
        api.get('/admissions/stats'),
        api.get('/billing/invoices').catch(() => ({ data: { invoices: [] } })),
      ]);
      setItems(listRes.data.items || []);
      setStats(statsRes.data || {});
      setInvoices(billRes.data.invoices || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admissions');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const openDetail = async (row: any) => {
    try {
      const { data } = await api.get(`/admissions/${row._id}`);
      setDetail(data.item);
    } catch {
      setDetail(row);
    }
  };

  const cardStats = [
    { label: 'Admitted', value: stats.admitted || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Available Beds', value: stats.availableBeds || 0, icon: Bed, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'With Doctor', value: stats.withDoctor || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Discharged', value: stats.discharged || 0, icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admission" icon={Bed} description="Patients under admission care" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardStats.map((stat) => (
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
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admissions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading admissions...</span>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No admissions found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(a)}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{a.admissionId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{a.patientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.ward || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.roomNumber || a.bed || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {a.admissionDate ? new Date(a.admissionDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{a.reason || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const badge = billingBadge(a, invoices);
                        return (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{detail.admissionId}</h2>
                <p className="text-sm text-gray-500">{detail.patientName}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[detail.status] || 'bg-gray-100 text-gray-700'}`}>
                    {detail.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-medium text-gray-900">{detail.roomNumber || '—'}{detail.ward ? ` · ${detail.ward}` : ''}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nurse</p>
                  <p className="font-medium text-gray-900">{detail.nurseName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{detail.department || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admitted</p>
                  <p className="font-medium text-gray-900">
                    {detail.admissionDate ? new Date(detail.admissionDate).toLocaleString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Reason</p>
                  <p className="font-medium text-gray-900 truncate">{detail.reason || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(detail.timeline || []).slice().reverse().map((t: any, i: number) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-3 py-1">
                      <p className="text-sm font-medium text-gray-800">{t.action}</p>
                      <p className="text-xs text-gray-500">
                        {t.byName || 'System'}
                        {t.at ? ` · ${new Date(t.at).toLocaleString()}` : ''}
                      </p>
                      {t.note && <p className="text-xs text-gray-600 mt-0.5">{t.note}</p>}
                    </div>
                  ))}
                  {(!detail.timeline || detail.timeline.length === 0) && (
                    <p className="text-sm text-gray-400">No activity yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
