import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Bed, ArrowRightLeft, LogOut, Search, Filter, Loader2, AlertCircle, X, Receipt,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import PatientBillingModal from '../../components/shared/PatientBillingModal';
import { billingBadge } from '../../utils/billingStatus';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Transferred: 'bg-purple-100 text-purple-800',
  Discharged: 'bg-gray-100 text-gray-700',
};

export default function NurseAdmissions() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [billing, setBilling] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchData = useCallback(async (q?: string, st?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 200 };
      if (q) params.search = q;
      if (st) params.status = st;
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search.trim() || undefined, statusFilter || undefined), 350);
    return () => clearTimeout(t);
  }, [search, statusFilter, fetchData]);

  const discharge = async (id: string, patientId?: string) => {
    if (patientId) {
      try {
        const { data } = await api.get('/billing/invoices', { params: { patient: patientId } });
        const unpaid = (data.invoices || []).filter(
          (i: any) => i.status === 'Pending' || i.status === 'Overdue'
        );
        if (unpaid.length) {
          const total = unpaid.reduce((s: number, i: any) => s + (i.totalAmount || 0), 0);
          const go = window.confirm(
            `${unpaid.length} unpaid bill(s) totalling ₦${total.toLocaleString()} for this patient.\n\n` +
              'Accounts must confirm payment before discharge. Press OK to attempt anyway — it will be blocked until settled.'
          );
          if (!go) return;
        } else if (!window.confirm('Discharge this patient?')) {
          return;
        }
      } catch {
        if (!window.confirm('Discharge this patient?')) return;
      }
    } else if (!window.confirm('Discharge this patient?')) {
      return;
    }
    setActionId(id);
    try {
      await api.post(`/admissions/${id}/discharge`, {});
      await fetchData(search.trim() || undefined, statusFilter || undefined);
      setDetail(null);
    } catch (err: any) {
      const data = err.response?.data;
      setError(
        data?.requiresSettlement
          ? data.message || 'Unpaid bills must be settled by Accounts before discharge.'
          : data?.message || 'Failed to discharge'
      );
    } finally {
      setActionId('');
    }
  };

  const openDetail = async (row: any) => {
    try {
      const { data } = await api.get(`/admissions/${row._id}`);
      setDetail(data.item);
    } catch {
      setDetail(row);
    }
  };

  const cardStats = [
    { label: 'Currently Admitted', value: stats.admitted || 0, icon: Bed, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Discharged Today', value: stats.dischargedToday || 0, icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'With Doctor', value: stats.withDoctor || 0, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'With Nurse', value: stats.withNurse || 0, icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Track patient admissions and discharges"
        action={
          <button
            type="button"
            onClick={() => setBilling(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Receipt className="w-4 h-4" /> Bill Patient
          </button>
        }
      />

      {billing && <PatientBillingModal onClose={() => setBilling(false)} />}

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
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admissions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Transferred">Transferred</option>
              <option value="Discharged">Discharged</option>
            </select>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Billing</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((adm) => (
                  <tr key={adm._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(adm)}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{adm.admissionId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{adm.patientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{adm.ward || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{adm.roomNumber || adm.bed || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{adm.doctorName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[adm.status] || 'bg-gray-100 text-gray-700'}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const badge = billingBadge(adm, invoices);
                        return (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">View</td>
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
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{detail.doctorName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nurse</p>
                  <p className="font-medium text-gray-900">{detail.nurseName || '—'}</p>
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
              {detail.status !== 'Discharged' && (
                <button
                  onClick={() => discharge(detail._id, detail.patient?._id)}
                  disabled={actionId === detail._id}
                  className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionId === detail._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Discharge Patient
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
