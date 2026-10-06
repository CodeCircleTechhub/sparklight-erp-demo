import { useState, useEffect, useCallback } from 'react';
import {
  Building2, BedDouble, Users, Search, Filter, Plus, Loader2, Pencil, Trash2, X,
  AlertCircle, CheckCircle, Clock, Wrench, ShieldCheck, ArrowRightLeft, LogOut, Eye,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'wards' | 'rooms' | 'admissions' | 'approvals';

const bedStatusColors: Record<string, string> = {
  Available: 'bg-green-100 text-green-800',
  'Partially Occupied': 'bg-amber-100 text-amber-800',
  Full: 'bg-red-100 text-red-800',
  Maintenance: 'bg-gray-200 text-gray-700',
};

const admStatusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Transferred: 'bg-purple-100 text-purple-800',
  Discharged: 'bg-gray-100 text-gray-700',
};

const allocStatusColors: Record<string, string> = {
  Approved: 'bg-green-100 text-green-800',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-800',
};

const reqStatusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const roomTypes = ['General', 'Private', 'ICU', 'Maternity', 'Isolation', 'Pediatric'];

function BedBar({ total, occupied, reserved, maintenance }: { total: number; occupied: number; reserved: number; maintenance: number }) {
  const available = Math.max(total - occupied - reserved - maintenance, 0);
  const seg = (n: number, cls: string) =>
    n > 0 ? Array.from({ length: Math.min(n, 30) }, (_, i) => <div key={`${cls}-${i}`} className={`h-3 w-3 rounded-sm ${cls}`} />) : null;
  return (
    <div className="flex flex-wrap gap-1">
      {seg(occupied, 'bg-red-400')}
      {seg(reserved, 'bg-amber-400')}
      {seg(maintenance, 'bg-gray-400')}
      {seg(available, 'bg-green-400')}
      {total > 30 && <span className="text-xs text-gray-400 self-center">+{total - 30}</span>}
    </div>
  );
}

export default function WardAllocation() {
  const { user } = useAuth();
  const role = user?.role || '';
  const canManage = ['super-admin', 'manager'].includes(role);
  const canRequest = ['nurse', 'doctor'].includes(role);
  const canDischarge = ['super-admin', 'manager', 'receptionist', 'nurse', 'doctor'].includes(role);

  const [tab, setTab] = useState<Tab>(canManage ? 'approvals' : 'wards');
  const [wards, setWards] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [bedRequests, setBedRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [, setWardTotals] = useState<any>({});
  const [roomTotals, setRoomTotals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);

  const [showWardForm, setShowWardForm] = useState(false);
  const [editingWard, setEditingWard] = useState<any>(null);
  const [wardForm, setWardForm] = useState({ name: '', floor: '', description: '' });

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', ward: '', floor: '', type: 'General', bedCount: 1, reservedBeds: 0, maintenanceBeds: 0, notes: '' });

  const [showAllocate, setShowAllocate] = useState(false);
  const [allocForm, setAllocForm] = useState({ patient: '', room: '', bed: '', doctor: '', nurse: '', department: '', reason: '' });

  const [showTransfer, setShowTransfer] = useState<any>(null);
  const [transferRoom, setTransferRoom] = useState('');

  const [showDetail, setShowDetail] = useState<any>(null);

  const fetchData = useCallback(async (q?: string, st?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 200 };
      if (q) params.search = q;
      if (st) params.status = st;
      const [wardRes, roomRes, admRes, statsRes, bedReqRes] = await Promise.all([
        api.get('/admissions/wards'),
        api.get('/admissions/rooms'),
        api.get('/admissions', { params }),
        api.get('/admissions/stats'),
        api.get('/admissions/requests').catch(() => ({ data: { items: [] } })),
      ]);
      setWards(wardRes.data.items || []);
      setWardTotals(wardRes.data.totals || {});
      setRooms(roomRes.data.rooms || []);
      setRoomTotals({
        beds: roomRes.data.beds || 0,
        occupied: roomRes.data.occupied || 0,
        reserved: roomRes.data.reserved || 0,
        maintenance: roomRes.data.maintenance || 0,
        availableBeds: roomRes.data.availableBeds || 0,
        total: roomRes.data.total || 0,
      });
      setAdmissions(admRes.data.items || []);
      setBedRequests(bedReqRes.data.items || []);
      setStats(statsRes.data || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load ward data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    api.get('/patients').then(({ data }) => setPatients(data.patients || [])).catch(() => setPatients([]));
    api.get('/cases/assignable-staff', { params: { role: 'doctor', all: 'true' } })
      .then(({ data }) => setDoctors(data.items || []))
      .catch(() => setDoctors([]));
    api.get('/cases/assignable-staff', { params: { role: 'nurse', all: 'true' } })
      .then(({ data }) => setNurses(data.items || []))
      .catch(() => setNurses([]));
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search.trim() || undefined, statusFilter || undefined), 350);
    return () => clearTimeout(t);
  }, [search, statusFilter, fetchData]);

  // ---------- Ward form ----------
  const openWardForm = (ward?: any) => {
    setFormError('');
    setEditingWard(ward || null);
    setWardForm(ward ? { name: ward.name || '', floor: ward.floor || '', description: ward.description || '' } : { name: '', floor: '', description: '' });
    setShowWardForm(true);
  };

  const submitWard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardForm.name.trim()) {
      setFormError('Ward name is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingWard) {
        await api.put(`/admissions/wards/${editingWard._id}`, wardForm);
      } else {
        await api.post('/admissions/wards', wardForm);
      }
      setShowWardForm(false);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save ward');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteWard = async (id: string) => {
    if (!window.confirm('Delete this ward?')) return;
    setActionId(id);
    try {
      await api.delete(`/admissions/wards/${id}`);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete ward');
    } finally {
      setActionId('');
    }
  };

  // ---------- Room form ----------
  const openRoomForm = (room?: any, wardName?: string) => {
    setFormError('');
    setEditingRoom(room || null);
    setRoomForm(
      room
        ? {
            roomNumber: room.roomNumber || '',
            ward: room.ward || '',
            floor: room.floor || '',
            type: room.type || 'General',
            bedCount: room.bedCount || 1,
            reservedBeds: room.reservedBeds || 0,
            maintenanceBeds: room.maintenanceBeds || 0,
            notes: room.notes || '',
          }
        : { roomNumber: '', ward: wardName || wards[0]?.name || '', floor: '', type: 'General', bedCount: 1, reservedBeds: 0, maintenanceBeds: 0, notes: '' }
    );
    setShowRoomForm(true);
  };

  const submitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.roomNumber.trim()) {
      setFormError('Room number is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingRoom) {
        await api.put(`/admissions/rooms/${editingRoom._id}`, roomForm);
      } else {
        await api.post('/admissions/rooms', roomForm);
      }
      setShowRoomForm(false);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!window.confirm('Delete this room?')) return;
    setActionId(id);
    try {
      await api.delete(`/admissions/rooms/${id}`);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setActionId('');
    }
  };

  // ---------- Allocate (request or admit) ----------
  const openAllocate = () => {
    setFormError('');
    setAllocForm({ patient: '', room: '', bed: '', doctor: '', nurse: '', department: '', reason: '' });
    setShowAllocate(true);
  };

  const submitAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocForm.patient) {
      setFormError('Select a patient');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const { data } = await api.post('/admissions', allocForm);
      setShowAllocate(false);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
      if (data.allocationStatus === 'Pending Approval') {
        window.alert('Bed allocation requested. A manager will review and approve it.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to allocate');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Approve / Reject ----------
  const approve = async (id: string) => {
    setActionId(id);
    setError('');
    try {
      await api.post(`/admissions/${id}/approve`, {});
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionId('');
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt('Reason for rejecting this allocation?');
    if (reason === null) return;
    setActionId(id);
    setError('');
    try {
      await api.post(`/admissions/${id}/reject`, { reason: reason || 'Rejected by manager' });
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionId('');
    }
  };

  // ---------- Bed change requests ----------
  const approveBedRequest = async (id: string) => {
    setActionId(id);
    setError('');
    try {
      await api.post(`/admissions/requests/${id}/approve`, {});
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve bed request');
    } finally {
      setActionId('');
    }
  };

  const rejectBedRequest = async (id: string) => {
    const reason = window.prompt('Reason for rejecting this bed change request?');
    if (reason === null) return;
    setActionId(id);
    setError('');
    try {
      await api.post(`/admissions/requests/${id}/reject`, { reason: reason || 'Rejected by manager' });
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject bed request');
    } finally {
      setActionId('');
    }
  };

  // ---------- Transfer ----------
  const openTransfer = (row: any) => {
    setFormError('');
    setShowTransfer(row);
    setTransferRoom('');
  };

  const submitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTransfer) return;
    if (!transferRoom) {
      setFormError('Select a room');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.put(`/admissions/${showTransfer._id}`, { transferRoom });
      setShowTransfer(null);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const discharge = async (id: string) => {
    if (!window.confirm('Discharge this patient?')) return;
    setActionId(id);
    try {
      await api.post(`/admissions/${id}/discharge`, {});
      setShowDetail(null);
      await fetchData(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to discharge');
    } finally {
      setActionId('');
    }
  };

  const openDetail = async (row: any) => {
    try {
      const { data } = await api.get(`/admissions/${row._id}`);
      setShowDetail(data.item);
    } catch {
      setShowDetail(row);
    }
  };

  const pending = admissions.filter((a) => a.allocationStatus === 'Pending Approval' && a.status !== 'Discharged');
  const pendingBedReqs = bedRequests.filter((r) => r.status === 'Pending');
  const visibleBedRequests = canManage
    ? bedRequests
    : bedRequests.filter((r) => String(r.requestedBy || '') === String((user as any)?._id || ''));

  const bedRequestsTable = (items: any[], withActions: boolean) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">To</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested By</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            {withActions && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((row) => {
            const busy = actionId === row._id;
            const patientName = row.patient
              ? [row.patient.firstName, row.patient.surname].filter(Boolean).join(' ')
              : row.patientName;
            const from = `${row.fromWard || '-'}${row.fromRoomNumber ? ` / ${row.fromRoomNumber}` : ''}${row.fromBed ? ` / ${row.fromBed}` : ''}`;
            const to = `${row.toWard || row.toRoom?.ward || '-'}${
              row.toRoomNumber ? ` / ${row.toRoomNumber}` : row.toRoom ? ` / ${row.toRoom.roomNumber}` : ''
            }${row.toBed ? ` / ${row.toBed}` : ''}`;
            return (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.requestId}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{patientName || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{from}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{to}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.reason || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.requestedByName || '-'}
                  {row.createdAt ? (
                    <div className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleString()}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${reqStatusColors[row.status] || 'bg-gray-100 text-gray-700'}`}>
                    {row.status}
                  </span>
                </td>
                {withActions && (
                  <td className="px-4 py-3">
                    {row.status === 'Pending' ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approveBedRequest(row._id)}
                          disabled={busy}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => rejectBedRequest(row._id)}
                          disabled={busy}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">{row.decidedByName || '-'}</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const statCards = [
    { label: 'Wards', value: stats.wards ?? wards.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Rooms', value: stats.rooms ?? roomTotals.total ?? 0, icon: BedDouble, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Beds', value: stats.beds ?? roomTotals.beds ?? 0, icon: BedDouble, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Available', value: stats.availableBeds ?? roomTotals.availableBeds ?? 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Occupied', value: stats.occupied ?? roomTotals.occupied ?? 0, icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Reserved', value: stats.reserved ?? roomTotals.reserved ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Maintenance', value: stats.maintenance ?? roomTotals.maintenance ?? 0, icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Admitted', value: stats.admitted || 0, icon: BedDouble, color: 'text-teal-600', bg: 'bg-teal-100' },
    ...(canManage
      ? [{ label: 'Pending Approvals', value: (stats.pendingApprovals ?? pending.length) + pendingBedReqs.length, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-100' }]
      : []),
  ];

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'wards', label: 'Wards' },
    { key: 'rooms', label: 'Rooms & Beds' },
    { key: 'admissions', label: 'Admissions' },
    ...(canManage ? [{ key: 'approvals' as Tab, label: 'Approvals', badge: pending.length + pendingBedReqs.length }] : []),
  ];

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward & Bed Allocation"
        description={
          canManage
            ? 'Add wards and beds, approve allocations, transfer beds and track admissions'
            : canRequest
              ? 'View available wards and beds — allocation requests need manager approval'
              : 'View wards, beds, allocations and admissions'
        }
        action={
          canManage || canRequest ? (
            <div className="flex gap-2">
              {canManage && (
                <button
                  onClick={() => openRoomForm()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" /> Add Room
                </button>
              )}
              {canManage && (
                <button
                  onClick={() => openWardForm()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" /> Add Ward
                </button>
              )}
              <button
                onClick={openAllocate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                <BedDouble className="w-4 h-4" /> {canRequest ? 'Request Allocation' : 'Admit & Allocate'}
              </button>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
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
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >
                {t.label}
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] px-1.5 h-5 text-xs font-bold rounded-full bg-orange-500 text-white">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          {(tab === 'admissions' || tab === 'approvals') && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search admissions..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading...</span>
            </div>
          ) : tab === 'wards' ? (
            wards.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">
                No wards yet{canManage ? '. Click "Add Ward" to create one.' : '. Ask a manager to add wards.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wards.map((w) => (
                  <div key={w._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-100">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{w.name}</h3>
                          <p className="text-xs text-gray-500">
                            {w.wardId} {w.floor ? `· Floor ${w.floor}` : ''}
                            {w.status === 'Inactive' && ' · Inactive'}
                          </p>
                        </div>
                      </div>
                      {canManage && (
                        <div className="flex gap-1">
                          <button onClick={() => openWardForm(w)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteWard(w._id)}
                            disabled={actionId === w._id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-gray-900">{w.rooms}</p>
                        <p className="text-xs text-gray-500">Rooms</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-gray-900">{w.bedCount}</p>
                        <p className="text-xs text-gray-500">Beds</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-green-700">{w.availableBeds}</p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{w.occupied} occupied · {w.reserved} reserved · {w.maintenance} maintenance</span>
                    </div>
                    <BedBar total={w.bedCount} occupied={w.occupied} reserved={w.reserved} maintenance={w.maintenance} />
                    {canManage && (
                      <button
                        onClick={() => openRoomForm(undefined, w.name)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add room to this ward
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : tab === 'rooms' ? (
            rooms.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No rooms found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Beds</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Occupied</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reserved</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Maintenance</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Available</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      {canManage && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rooms.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.roomNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.ward}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.bedCount}</td>
                        <td className="px-4 py-3 text-sm text-red-600">{r.occupiedBeds}</td>
                        <td className="px-4 py-3 text-sm text-amber-600">{r.reservedBeds}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.maintenanceBeds}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">{r.availableBeds}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${bedStatusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                            {r.status}
                          </span>
                        </td>
                        {canManage && (
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => openRoomForm(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteRoom(r._id)}
                                disabled={actionId === r._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : tab === 'approvals' ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Bed allocation requests</h3>
                {pending.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No pending allocation requests</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested By</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward / Room</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pending.map((row) => {
                          const busy = actionId === row._id;
                          return (
                            <tr key={row._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.admissionId}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{row.patientName}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{row.requestedByName || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {row.ward || '-'} {row.roomNumber ? ` / ${row.roomNumber}` : ''}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{row.doctorName || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => approve(row._id)}
                                    disabled={busy}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => reject(row._id)}
                                    disabled={busy}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                  <button
                                    onClick={() => openDetail(row)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Bed change requests</h3>
                {bedRequests.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No bed change requests</p>
                ) : (
                  bedRequestsTable(bedRequests, true)
                )}
              </div>
            </div>
          ) : (
            <>
              {visibleBedRequests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">My bed change requests</h3>
                  {bedRequestsTable(visibleBedRequests, false)}
                </div>
              )}
              {admissions.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No admissions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward / Room / Bed</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nurse</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Allocation</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admissions.map((row) => {
                    const busy = actionId === row._id;
                    return (
                      <tr key={row._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.admissionId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.patientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {row.ward || '—'}
                          {row.roomNumber ? ` · ${row.roomNumber}` : ''}
                          {row.bed ? ` · ${row.bed}` : ''}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.doctorName || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.nurseName || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${allocStatusColors[row.allocationStatus] || 'bg-gray-100 text-gray-700'}`}>
                            {row.allocationStatus || 'Approved'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${admStatusColors[row.status] || 'bg-gray-100 text-gray-700'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <button onClick={() => openDetail(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            {canManage && row.status !== 'Discharged' && row.allocationStatus === 'Approved' && (
                              <button onClick={() => openTransfer(row)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg" title="Transfer bed">
                                <ArrowRightLeft className="w-4 h-4" />
                              </button>
                            )}
                            {canManage && row.allocationStatus === 'Pending Approval' && (
                              <button
                                onClick={() => approve(row._id)}
                                disabled={busy}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {canDischarge && row.status !== 'Discharged' && (
                              <button
                                onClick={() => discharge(row._id)}
                                disabled={busy}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                                title="Discharge"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Ward form */}
      {showWardForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWardForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingWard ? 'Edit Ward' : 'Add Ward'}</h2>
              <button onClick={() => setShowWardForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitWard} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Ward name *</label>
                <input type="text" value={wardForm.name} onChange={(e) => setWardForm({ ...wardForm, name: e.target.value })} className={inputClass} required placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className={labelClass}>Floor</label>
                <input type="text" value={wardForm.floor} onChange={(e) => setWardForm({ ...wardForm, floor: e.target.value })} className={inputClass} placeholder="e.g. 2nd" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={wardForm.description} onChange={(e) => setWardForm({ ...wardForm, description: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowWardForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingWard ? 'Save Ward' : 'Add Ward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room form */}
      {showRoomForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRoomForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setShowRoomForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitRoom} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Room number *</label>
                  <input type="text" value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Floor</label>
                  <input type="text" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ward</label>
                  <select value={roomForm.ward} onChange={(e) => setRoomForm({ ...roomForm, ward: e.target.value })} className={inputClass}>
                    <option value="">Select ward…</option>
                    {wards.map((w) => (
                      <option key={w._id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })} className={inputClass}>
                    {roomTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Total beds</label>
                  <input
                    type="number"
                    min={1}
                    value={roomForm.bedCount}
                    onChange={(e) => setRoomForm({ ...roomForm, bedCount: Math.max(1, Number(e.target.value) || 1) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Reserved</label>
                  <input
                    type="number"
                    min={0}
                    value={roomForm.reservedBeds}
                    onChange={(e) => setRoomForm({ ...roomForm, reservedBeds: Math.max(0, Number(e.target.value) || 0) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Maintenance</label>
                  <input
                    type="number"
                    min={0}
                    value={roomForm.maintenanceBeds}
                    onChange={(e) => setRoomForm({ ...roomForm, maintenanceBeds: Math.max(0, Number(e.target.value) || 0) })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea value={roomForm.notes} onChange={(e) => setRoomForm({ ...roomForm, notes: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowRoomForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRoom ? 'Save Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate / request */}
      {showAllocate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAllocate(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{canRequest ? 'Request Bed Allocation' : 'Admit & Allocate Patient'}</h2>
                {canRequest && <p className="text-sm text-amber-600">Requires manager approval</p>}
              </div>
              <button onClick={() => setShowAllocate(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitAllocate} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Patient *</label>
                <select value={allocForm.patient} onChange={(e) => setAllocForm({ ...allocForm, patient: e.target.value })} className={inputClass} required>
                  <option value="">Select patient…</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {[p.firstName, p.surname].filter(Boolean).join(' ')} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ward & room (with free beds)</label>
                  <select
                    value={allocForm.room}
                    onChange={(e) => {
                      const room = rooms.find((r) => r._id === e.target.value);
                      setAllocForm({ ...allocForm, room: e.target.value, bed: '' });
                      void room;
                    }}
                    className={inputClass}
                  >
                    <option value="">No room / TBA</option>
                    {rooms
                      .filter((r) => r.availableBeds > 0 && r.status !== 'Maintenance')
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.ward} · {r.roomNumber} ({r.availableBeds} free)
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bed label</label>
                  <input type="text" value={allocForm.bed} onChange={(e) => setAllocForm({ ...allocForm, bed: e.target.value })} className={inputClass} placeholder="e.g. Bed 2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Doctor</label>
                  <select value={allocForm.doctor} onChange={(e) => setAllocForm({ ...allocForm, doctor: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.fullName || d.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Nurse</label>
                  <select value={allocForm.nurse} onChange={(e) => setAllocForm({ ...allocForm, nurse: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {nurses.map((n) => (
                      <option key={n._id} value={n._id}>{n.fullName || n.email}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input type="text" value={allocForm.department} onChange={(e) => setAllocForm({ ...allocForm, department: e.target.value })} className={inputClass} placeholder="e.g. General Medicine" />
              </div>
              <div>
                <label className={labelClass}>Reason</label>
                <textarea value={allocForm.reason} onChange={(e) => setAllocForm({ ...allocForm, reason: e.target.value })} rows={3} className={inputClass} placeholder="Reason for admission…" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAllocate(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {canRequest ? 'Request Allocation' : 'Admit Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTransfer(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Transfer Bed</h2>
                <p className="text-sm text-gray-500">{showTransfer.patientName} · {showTransfer.admissionId}</p>
              </div>
              <button onClick={() => setShowTransfer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitTransfer} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="text-sm text-gray-600">
                Currently:{' '}
                <span className="font-medium text-gray-900">
                  {showTransfer.ward || '—'} {showTransfer.roomNumber ? `· ${showTransfer.roomNumber}` : ''}
                </span>
              </div>
              <div>
                <label className={labelClass}>Move to room *</label>
                <select value={transferRoom} onChange={(e) => setTransferRoom(e.target.value)} className={inputClass} required>
                  <option value="">Select room with free beds…</option>
                  {rooms
                    .filter((r) => r._id !== (showTransfer.room?._id || showTransfer.room) && r.availableBeds > 0 && r.status !== 'Maintenance')
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.ward} · {r.roomNumber} ({r.availableBeds} free)
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTransfer(null)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{showDetail.admissionId}</h2>
                <p className="text-sm text-gray-500">{showDetail.patientName}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${admStatusColors[showDetail.status] || 'bg-gray-100 text-gray-700'}`}>
                  {showDetail.status}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${allocStatusColors[showDetail.allocationStatus] || 'bg-gray-100 text-gray-700'}`}>
                  {showDetail.allocationStatus || 'Approved'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ward</p>
                  <p className="font-medium text-gray-900">{showDetail.ward || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-medium text-gray-900">{showDetail.roomNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bed</p>
                  <p className="font-medium text-gray-900">{showDetail.bed || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{showDetail.department || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{showDetail.doctorName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nurse</p>
                  <p className="font-medium text-gray-900">{showDetail.nurseName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admitted</p>
                  <p className="font-medium text-gray-900">
                    {showDetail.admissionDate ? new Date(showDetail.admissionDate).toLocaleString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Requested by</p>
                  <p className="font-medium text-gray-900">{showDetail.requestedByName || showDetail.admittedByName || '—'}</p>
                </div>
              </div>
              {showDetail.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                  <p className="text-sm text-gray-600">{showDetail.reason}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(showDetail.timeline || []).slice().reverse().map((t: any, i: number) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-3 py-1">
                      <p className="text-sm font-medium text-gray-800">{t.action}</p>
                      <p className="text-xs text-gray-500">
                        {t.byName || 'System'}
                        {t.at ? ` · ${new Date(t.at).toLocaleString()}` : ''}
                      </p>
                      {t.note && <p className="text-xs text-gray-600 mt-0.5">{t.note}</p>}
                    </div>
                  ))}
                  {(!showDetail.timeline || showDetail.timeline.length === 0) && (
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
