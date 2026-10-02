import { useState, useEffect, useCallback } from 'react';
import { Bed, Building, Users, Loader2, AlertCircle, Plus, X, Trash2, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function BedDots({ occupied, total }: { occupied: number; total: number }) {
  const dots = [];
  const shown = Math.min(total, 40);
  for (let i = 0; i < shown; i++) {
    dots.push(
      <div
        key={i}
        className={`w-3 h-3 rounded-full ${i < occupied ? 'bg-red-400' : 'bg-green-400'}`}
        title={i < occupied ? 'Occupied' : 'Available'}
      />
    );
  }
  if (total > shown) dots.push(<span key="more" className="text-xs text-gray-400">+{total - shown}</span>);
  return <div className="flex flex-wrap gap-1.5">{dots}</div>;
}

export default function WardManagement() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [wardList, setWardList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, available: 0, occupied: 0, beds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ roomNumber: '', ward: 'General', floor: '', type: 'General', bedCount: 1, notes: '' });

  const [showWardForm, setShowWardForm] = useState(false);
  const [wardSubmitting, setWardSubmitting] = useState(false);
  const [wardError, setWardError] = useState('');
  const [wardForm, setWardForm] = useState({ name: '', floor: '', description: '' });
  const [deletingWard, setDeletingWard] = useState('');

  const canWrite = ['super-admin', 'manager', 'receptionist', 'nurse'].includes(user?.role || '');

  const fetchWards = useCallback(async () => {
    try {
      const { data } = await api.get('/admissions/wards');
      setWardList(data.items || data.wards || []);
    } catch {
      setWardList([]);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admissions/rooms');
      setRooms(data.rooms || []);
      setStats({
        total: data.total || 0,
        available: data.available || 0,
        occupied: data.occupied || 0,
        beds: data.beds || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchWards();
  }, [fetchRooms, fetchWards]);

  const wardOccupancy = Object.values(
    rooms.reduce((acc: Record<string, any>, r) => {
      const key = r.ward || 'General';
      if (!acc[key]) acc[key] = { name: key, totalBeds: 0, occupied: 0, rooms: 0 };
      acc[key].totalBeds += r.bedCount || 0;
      acc[key].occupied += r.occupiedBeds || 0;
      acc[key].rooms += 1;
      return acc;
    }, {})
  ) as any[];

  const wardNames = wardList.length
    ? wardList.map((w) => w.name)
    : ['General', 'Maternity', 'Pediatric', 'ICU', 'Isolation', 'Surgical'];

  const submitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomNumber.trim()) {
      setFormError('Room number is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/admissions/rooms', form);
      setShowForm(false);
      setForm({ roomNumber: '', ward: wardNames[0] || 'General', floor: '', type: 'General', bedCount: 1, notes: '' });
      await fetchRooms();
      await fetchWards();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to add room');
    } finally {
      setSubmitting(false);
    }
  };

  const submitWard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardForm.name.trim()) {
      setWardError('Ward name is required');
      return;
    }
    setWardSubmitting(true);
    setWardError('');
    try {
      await api.post('/admissions/wards', wardForm);
      setShowWardForm(false);
      setWardForm({ name: '', floor: '', description: '' });
      await fetchWards();
    } catch (err: any) {
      setWardError(err.response?.data?.message || 'Failed to add ward');
    } finally {
      setWardSubmitting(false);
    }
  };

  const deleteWard = async (ward: any) => {
    const hasRooms = (ward.rooms || 0) > 0;
    const msg = hasRooms
      ? `"${ward.name}" still has ${ward.rooms} room(s) and cannot be deleted. Move or delete its rooms first.`
      : `Delete ward "${ward.name}"? This cannot be undone.`;
    if (!window.confirm(msg)) return;
    setDeletingWard(ward._id);
    try {
      await api.delete(`/admissions/wards/${ward._id}`);
      await fetchWards();
    } catch (err: any) {
      window.alert(err.response?.data?.message || 'Failed to delete ward');
    } finally {
      setDeletingWard('');
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Management"
        description="Monitor ward occupancy and bed status"
        action={
          canWrite ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setWardError(''); setShowWardForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" /> Add Ward
              </button>
              <button
                onClick={() => { setFormError(''); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" /> Add Room
              </button>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Rooms', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-100', icon: Building },
          { label: 'Beds', value: stats.beds, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Bed },
          { label: 'Occupied', value: stats.occupied, color: 'text-red-600', bg: 'bg-red-100', icon: Users },
          { label: 'Available', value: Math.max(stats.beds - stats.occupied, 0), color: 'text-green-600', bg: 'bg-green-100', icon: Bed },
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
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Wards</h2>
            <p className="text-sm text-gray-500">{wardList.length} ward(s) configured</p>
          </div>
          {canWrite && (
            <button
              onClick={() => { setWardError(''); setShowWardForm(true); }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" /> Add Ward
            </button>
          )}
        </div>

        {wardList.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No wards yet. Add the first ward to start allocating rooms.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {wardList.map((ward) => {
              const full = (ward.occupied || 0) >= (ward.bedCount || 0) && (ward.bedCount || 0) > 0;
              return (
                <div key={ward._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-indigo-100 shrink-0">
                        <Building className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{ward.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {ward.floor || 'Floor not set'} · {ward.wardId}
                        </p>
                      </div>
                    </div>
                    {canWrite && (
                      <button
                        onClick={() => deleteWard(ward)}
                        disabled={deletingWard === ward._id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete ward"
                      >
                        {deletingWard === ward._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {ward.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{ward.description}</p>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg py-2">
                      <p className="text-sm font-semibold text-gray-900">{ward.rooms ?? 0}</p>
                      <p className="text-[11px] text-gray-500">Rooms</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg py-2">
                      <p className="text-sm font-semibold text-gray-900">{ward.bedCount ?? 0}</p>
                      <p className="text-[11px] text-gray-500">Beds</p>
                    </div>
                    <div className={`rounded-lg py-2 ${full ? 'bg-red-50' : 'bg-green-50'}`}>
                      <p className={`text-sm font-semibold ${full ? 'text-red-600' : 'text-green-600'}`}>
                        {ward.availableBeds ?? 0}
                      </p>
                      <p className={`text-[11px] ${full ? 'text-red-500' : 'text-green-600'}`}>Free</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        ward.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ward.status || 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500 text-sm">Loading wards...</span>
        </div>
      ) : wardOccupancy.length === 0 ? (
        <p className="text-center text-gray-400 py-10 text-sm">No rooms configured yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wardOccupancy.map((ward) => {
            const occupancyRate = ward.totalBeds ? Math.round((ward.occupied / ward.totalBeds) * 100) : 0;
            return (
              <div key={ward.name} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-100">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                      <span className="text-xs text-gray-500">{ward.rooms} rooms</span>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${occupancyRate > 80 ? 'text-red-600' : 'text-gray-900'}`}>
                    {occupancyRate}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span>Total Beds</span>
                    </div>
                    <span className="font-medium text-gray-900">{ward.totalBeds}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Occupied</span>
                    </div>
                    <span className="font-medium text-red-600">{ward.occupied}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                    <span className="font-medium text-green-600">{Math.max(ward.totalBeds - ward.occupied, 0)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Bed Status</p>
                  <BedDots occupied={ward.occupied} total={ward.totalBeds} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Room</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitRoom} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Room number *</label>
                  <input type="text" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Floor</label>
                  <input type="text" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ward</label>
                  <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} className={inputClass}>
                    {wardNames.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                    {['General', 'Private', 'ICU', 'Maternity', 'Isolation', 'Pediatric'].map((t) => (
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
                  value={form.bedCount}
                  onChange={(e) => setForm({ ...form, bedCount: Math.max(1, Number(e.target.value) || 1) })}
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWardForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWardForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Ward</h2>
              <button onClick={() => setShowWardForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitWard} className="p-6 space-y-4">
              {wardError && <p className="text-sm text-red-600">{wardError}</p>}
              <div>
                <label className={labelClass}>Ward name *</label>
                <input
                  type="text"
                  value={wardForm.name}
                  onChange={(e) => setWardForm({ ...wardForm, name: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Surgical Ward"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Floor</label>
                <input
                  type="text"
                  value={wardForm.floor}
                  onChange={(e) => setWardForm({ ...wardForm, floor: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. First Floor"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={wardForm.description}
                  onChange={(e) => setWardForm({ ...wardForm, description: e.target.value })}
                  rows={3}
                  className={inputClass}
                  placeholder="What this ward is used for"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowWardForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={wardSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {wardSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
