import { useState, useEffect, useCallback } from 'react';
import {
  BedDouble, Search, Plus, Loader2, Pencil, Trash2, X, AlertCircle,
  Stethoscope, UserCog, Building2, LogOut, Filter,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const roomStatusColors: Record<string, string> = {
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

const roomTypes = ['General', 'Private', 'ICU', 'Maternity', 'Isolation', 'Pediatric'];

export default function Allocation() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'admissions' | 'wards' | 'rooms'>('admissions');
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [roomStats, setRoomStats] = useState<any>({ total: 0, available: 0, occupied: 0, beds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [showAdmit, setShowAdmit] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showAllocate, setShowAllocate] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionId, setActionId] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);

  const role = user?.role || '';
  const canAllocate = ['super-admin', 'manager', 'receptionist', 'nurse'].includes(role);
  const canManageRooms = ['super-admin', 'manager'].includes(role);
  const wardOptions = wards.length > 0 ? wards.map((w) => w.name) : ['General', 'Maternity', 'Pediatric', 'ICU', 'Isolation', 'Surgical'];

  const [admitForm, setAdmitForm] = useState({
    patient: '', room: '', doctor: '', nurse: '', department: '', reason: '', bed: '',
  });
  const [roomForm, setRoomForm] = useState({
    roomNumber: '', ward: 'General', floor: '', type: 'General', bedCount: 1, notes: '',
  });
  const [allocForm, setAllocForm] = useState({ doctor: '', nurse: '', room: '', department: '' });

  const fetchData = useCallback(async (q?: string, st?: string, wd?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 200 };
      if (q) params.search = q;
      if (st) params.status = st;
      if (wd) params.ward = wd;
      const [admRes, roomRes, statsRes, wardRes] = await Promise.all([
        api.get('/admissions', { params }),
        api.get('/admissions/rooms', { params: q || wd ? { search: q, ward: wd } : {} }),
        api.get('/admissions/stats'),
        api.get('/admissions/wards').catch(() => ({ data: { items: [] } })),
      ]);
      setAdmissions(admRes.data.items || []);
      setRooms(roomRes.data.rooms || []);
      setWards(wardRes.data.items || []);
      setRoomStats({
        total: roomRes.data.total || 0,
        available: roomRes.data.available || 0,
        occupied: roomRes.data.occupied || 0,
        beds: roomRes.data.beds || 0,
      });
      setStats(statsRes.data || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load allocation data');
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
    const t = setTimeout(() => fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined), 350);
    return () => clearTimeout(t);
  }, [search, statusFilter, wardFilter, fetchData]);

  const openAdmit = () => {
    setFormError('');
    setAdmitForm({ patient: '', room: '', doctor: '', nurse: '', department: '', reason: '', bed: '' });
    setShowAdmit(true);
  };

  const submitAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitForm.patient) {
      setFormError('Select a patient');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/admissions', admitForm);
      setShowAdmit(false);
      await fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to admit patient');
    } finally {
      setSubmitting(false);
    }
  };

  const openAllocate = (row: any) => {
    setFormError('');
    setShowAllocate(row);
    setAllocForm({
      doctor: row.doctor?._id || row.doctor || '',
      nurse: row.nurse?._id || row.nurse || '',
      room: row.room?._id || row.room || '',
      department: row.department || '',
    });
  };

  const submitAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAllocate) return;
    setSubmitting(true);
    setFormError('');
    try {
      await api.put(`/admissions/${showAllocate._id}`, allocForm);
      setShowAllocate(null);
      await fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to update allocation');
    } finally {
      setSubmitting(false);
    }
  };

  const discharge = async (id: string) => {
    if (!window.confirm('Discharge this patient?')) return;
    setActionId(id);
    try {
      await api.post(`/admissions/${id}/discharge`, {});
      await fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to discharge');
    } finally {
      setActionId('');
    }
  };

  const openRoomForm = (room?: any) => {
    setFormError('');
    setEditingRoom(room || null);
    setRoomForm(
      room
        ? {
            roomNumber: room.roomNumber || '',
            ward: room.ward || 'General',
            floor: room.floor || '',
            type: room.type || 'General',
            bedCount: room.bedCount || 1,
            notes: room.notes || '',
          }
        : { roomNumber: '', ward: 'General', floor: '', type: 'General', bedCount: 1, notes: '' }
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
      await fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined);
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
      await fetchData(search.trim() || undefined, statusFilter || undefined, wardFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete room');
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

  const patientName = (p: any) =>
    [p?.firstName, p?.middleName, p?.surname].filter(Boolean).join(' ').trim() || p?.patientId || '—';

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room & Allocation"
        description="Admit patients, assign doctors/nurses, manage rooms and beds"
        action={
          canAllocate ? (
            <div className="flex gap-2">
          {canManageRooms && (
            <button
              onClick={() => openRoomForm()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" /> Add Room
            </button>
          )}
          {canAllocate && (
            <button
              onClick={openAdmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <BedDouble className="w-4 h-4" /> Admit Patient
            </button>
          )}
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Admitted', value: stats.admitted || 0, color: 'text-blue-600', bg: 'bg-blue-100', icon: BedDouble },
          { label: 'Discharged', value: stats.discharged || 0, color: 'text-gray-600', bg: 'bg-gray-100', icon: LogOut },
          { label: 'Rooms', value: stats.rooms || roomStats.total || 0, color: 'text-purple-600', bg: 'bg-purple-100', icon: Building2 },
          { label: 'Beds', value: stats.beds || roomStats.beds || 0, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: BedDouble },
          { label: 'Occupied', value: stats.occupied || roomStats.occupied || 0, color: 'text-amber-600', bg: 'bg-amber-100', icon: BedDouble },
          { label: 'With Doctor', value: stats.withDoctor || 0, color: 'text-green-600', bg: 'bg-green-100', icon: Stethoscope },
          { label: 'With Nurse', value: stats.withNurse || 0, color: 'text-teal-600', bg: 'bg-teal-100', icon: UserCog },
        ].map((s) => (
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
            <button
              onClick={() => setTab('admissions')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${tab === 'admissions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Allocations
            </button>
            <button
              onClick={() => setTab('wards')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${tab === 'wards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Wards
            </button>
            <button
              onClick={() => setTab('rooms')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${tab === 'rooms' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Rooms & Beds
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === 'rooms' ? 'Search rooms...' : 'Search admissions...'}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {tab === 'admissions' ? (
              <>
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
                <select
                  value={wardFilter}
                  onChange={(e) => setWardFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All wards</option>
                  {wardOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </>
            ) : (
              <Filter className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading...</span>
            </div>
          ) : tab === 'admissions' ? (
            admissions.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No admissions found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward / Room</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bed</th>
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
                        <td className="px-4 py-3 text-sm text-gray-900">{row.patientName || patientName(row.patient)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {row.roomNumber || row.ward ? `${row.roomNumber || '—'}${row.ward ? ` · ${row.ward}` : ''}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.bed || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.doctorName || row.doctor?.fullName || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.nurseName || row.nurse?.fullName || '—'}</td>
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
                            <button
                              onClick={() => openDetail(row)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View"
                            >
                              <Stethoscope className="w-4 h-4" />
                            </button>
                            {canAllocate && row.status !== 'Discharged' && (
                              <button
                                onClick={() => openAllocate(row)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                title="Allocate"
                              >
                                <UserCog className="w-4 h-4" />
                              </button>
                            )}
                            {canAllocate && row.status !== 'Discharged' && (
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
            )
          ) : tab === 'wards' ? (
            wards.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No wards found. Ask a manager to add wards.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wards.map((w) => (
                  <div key={w._id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-blue-100">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{w.name}</h3>
                        <p className="text-xs text-gray-500">
                          {w.wardId} {w.floor ? `· Floor ${w.floor}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
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
                    <p className="text-xs text-gray-500 mt-2">
                      {w.occupied} occupied · {w.reserved} reserved · {w.maintenance} maintenance
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : rooms.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No rooms yet. Add a room to start allocating.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Beds</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Occupied</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{room.roomNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{room.ward}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{room.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{room.bedCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{room.occupiedBeds}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roomStatusColors[room.status] || 'bg-gray-100 text-gray-700'}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {canManageRooms && (
                          <button
                            onClick={() => openRoomForm(room)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {['super-admin', 'manager'].includes(user?.role || '') && (
                          <button
                            onClick={() => deleteRoom(room._id)}
                            disabled={actionId === room._id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAdmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdmit(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Admit & Allocate Patient</h2>
              <button onClick={() => setShowAdmit(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitAdmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Patient *</label>
                <select value={admitForm.patient} onChange={(e) => setAdmitForm({ ...admitForm, patient: e.target.value })} className={inputClass} required>
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
                  <label className={labelClass}>Room</label>
                  <select value={admitForm.room} onChange={(e) => setAdmitForm({ ...admitForm, room: e.target.value })} className={inputClass}>
                    <option value="">No room / TBA</option>
                    {rooms
                      .filter((r) => r.status !== 'Full' && r.status !== 'Maintenance')
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.roomNumber} · {r.ward} ({r.occupiedBeds}/{r.bedCount})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bed label</label>
                  <input type="text" value={admitForm.bed} onChange={(e) => setAdmitForm({ ...admitForm, bed: e.target.value })} className={inputClass} placeholder="e.g. Bed 2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Doctor</label>
                  <select value={admitForm.doctor} onChange={(e) => setAdmitForm({ ...admitForm, doctor: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.fullName || d.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Nurse</label>
                  <select value={admitForm.nurse} onChange={(e) => setAdmitForm({ ...admitForm, nurse: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {nurses.map((n) => (
                      <option key={n._id} value={n._id}>{n.fullName || n.email}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input type="text" value={admitForm.department} onChange={(e) => setAdmitForm({ ...admitForm, department: e.target.value })} className={inputClass} placeholder="e.g. General Medicine" />
              </div>
              <div>
                <label className={labelClass}>Reason for admission</label>
                <textarea value={admitForm.reason} onChange={(e) => setAdmitForm({ ...admitForm, reason: e.target.value })} rows={3} className={inputClass} placeholder="Clinical reason…" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdmit(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Admit Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAllocate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAllocate(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Update Allocation</h2>
                <p className="text-sm text-gray-500">{showAllocate.patientName} · {showAllocate.admissionId}</p>
              </div>
              <button onClick={() => setShowAllocate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitAllocate} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
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
              <div>
                <label className={labelClass}>Room (transfer)</label>
                <select value={allocForm.room} onChange={(e) => setAllocForm({ ...allocForm, room: e.target.value })} className={inputClass}>
                  <option value="">No room</option>
                  {rooms
                    .filter((r) => r.status !== 'Maintenance' && r._id === allocForm.room || (r.status !== 'Full' && r.status !== 'Maintenance'))
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} · {r.ward} ({r.occupiedBeds}/{r.bedCount})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input type="text" value={allocForm.department} onChange={(e) => setAllocForm({ ...allocForm, department: e.target.value })} className={inputClass} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAllocate(null)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoomForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRoomForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
                  <input type="text" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })} className={inputClass} placeholder="e.g. 2nd" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ward</label>
                  <select value={roomForm.ward} onChange={(e) => setRoomForm({ ...roomForm, ward: e.target.value })} className={inputClass}>
                    {wardOptions.map((w) => (
                      <option key={w} value={w}>{w}</option>
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
              <div>
                <label className={labelClass}>Bed count</label>
                <input
                  type="number"
                  min={1}
                  value={roomForm.bedCount}
                  onChange={(e) => setRoomForm({ ...roomForm, bedCount: Math.max(1, Number(e.target.value) || 1) })}
                  className={inputClass}
                />
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

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{detail.admissionId}</h2>
                <p className="text-sm text-gray-500">{detail.patientName}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${admStatusColors[detail.status] || 'bg-gray-100 text-gray-700'}`}>
                  {detail.status}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${allocStatusColors[detail.allocationStatus] || 'bg-gray-100 text-gray-700'}`}>
                  {detail.allocationStatus || 'Approved'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-medium text-gray-900">{detail.roomNumber || '—'}{detail.ward ? ` · ${detail.ward}` : ''}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bed</p>
                  <p className="font-medium text-gray-900">{detail.bed || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{detail.doctorName || detail.doctor?.fullName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nurse</p>
                  <p className="font-medium text-gray-900">{detail.nurseName || detail.nurse?.fullName || '—'}</p>
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
              </div>
              {detail.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                  <p className="text-sm text-gray-600">{detail.reason}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
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
