import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Users, UserCheck, UserPlus, Archive, Loader2, Trash2, Edit, X, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import { downloadPatientReport } from '../../utils/downloadPatientReport';

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-yellow-100 text-yellow-700',
  Archived: 'bg-gray-100 text-gray-600',
  Discharged: 'bg-blue-100 text-blue-700',
};

const RANGES = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All' },
] as const;

type RangeKey = (typeof RANGES)[number]['key'];

function withinRange(value: string | null | undefined, range: RangeKey) {
  if (range === 'all') return true;
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === 'day') return date.toDateString() === now.toDateString();
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return date.getTime() >= start.getTime();
  }
  return date.getTime() >= new Date(now.getFullYear(), now.getMonth(), 1).getTime();
}

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypeOptions = ['AA', 'AS', 'SS', 'AC', 'SC'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
const stateOptions = ['Lagos', 'Abuja', 'Oyo', 'Kano', 'Rivers', 'Enugu', 'Delta', 'Ogun'];

function computeAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  middleName?: string;
  surname: string;
  gender: string;
  dob: string;
  phone: string;
  email?: string;
  address?: string;
  state?: string;
  lga?: string;
  bloodGroup?: string;
  genotype?: string;
  maritalStatus?: string;
  occupation?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  relationship?: string;
  emergencyContact?: string;
  cardType?: string;
  cardNumber?: string;
  familyName?: string;
  status: string;
  createdAt?: string;
}

export default function AdminPatientsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [range, setRange] = useState<RangeKey>('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<{ title: string; value: string; icon: typeof Users; color: 'blue' | 'green' | 'purple' | 'yellow' }[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadReport = async (patient: Patient) => {
    if (!patient?._id || downloadingId) return;
    setDownloadingId(patient._id);
    try {
      await downloadPatientReport(patient._id, `Patient_Registration_Report_${patient.patientId}.pdf`);
      setMessage({ type: 'success', text: `Report card downloaded for ${patient.patientId}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to download report card' });
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchPatients = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const params = query ? { search: query } : {};
      const res = await api.get('/patients', { params });
      const data = res.data;
      setStats([
        { title: 'Total Patients', value: (data.total ?? 0).toLocaleString(), icon: Users, color: 'blue' },
        { title: 'Active Patients', value: (data.active ?? 0).toLocaleString(), icon: UserCheck, color: 'green' },
        { title: 'New This Month', value: (data.newThisMonth ?? 0).toLocaleString(), icon: UserPlus, color: 'purple' },
        { title: 'Archived', value: (data.archived ?? 0).toLocaleString(), icon: Archive, color: 'yellow' },
      ]);
      setPatients(data.patients ?? []);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(''); }, [fetchPatients]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPatients(search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, fetchPatients]);

  useEffect(() => {
    if (message) { const t = setTimeout(() => setMessage(null), 4000); return () => clearTimeout(t); }
  }, [message]);

  const filtered = patients.filter((p) => withinRange(p.createdAt, range));

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
      setMessage({ type: 'success', text: 'Patient deleted successfully' });
      setDeleteConfirm(null);
      fetchPatients(search);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete patient' });
      setDeleteConfirm(null);
    }
  };

  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setEditForm({
      firstName: p.firstName || '',
      middleName: p.middleName || '',
      surname: p.surname || '',
      gender: p.gender || '',
      dob: p.dob ? p.dob.split('T')[0] : '',
      phone: p.phone || '',
      email: p.email || '',
      address: p.address || '',
      state: p.state || '',
      lga: p.lga || '',
      bloodGroup: p.bloodGroup || '',
      genotype: p.genotype || '',
      maritalStatus: p.maritalStatus || '',
      occupation: p.occupation || '',
      nextOfKin: p.nextOfKin || '',
      nextOfKinPhone: p.nextOfKinPhone || '',
      relationship: p.relationship || '',
      emergencyContact: p.emergencyContact || '',
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPatient) return;
    setEditLoading(true);
    try {
      await api.put(`/patients/${editPatient._id}`, editForm);
      setMessage({ type: 'success', text: 'Patient information updated successfully' });
      setEditPatient(null);
      fetchPatients(search);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update patient' });
    } finally {
      setEditLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        icon={Users}
        description="Manage all registered patients"
        action={
          <button onClick={() => navigate('/admin/patients/register')} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
            <UserPlus className="w-4 h-4" />
            New Patient
          </button>
        }
      />

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Patient List
            <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} shown)</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 self-start">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    range === r.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading patients...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {patients.length === 0 ? 'No patients found' : 'No patients in the selected period'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Card</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Gender</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Age</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.patientId}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.firstName} {row.surname}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          (row.cardType || 'Individual') === 'Family'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        title={`${row.cardType || 'Individual'} card`}
                      >
                        {(row.cardType || 'Individual') === 'Family' ? 'Family' : 'Individual'} ·{' '}
                        {row.cardNumber || row.patientId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.gender}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.dob ? computeAge(row.dob) : '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.phone || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(row)}
                          disabled={downloadingId === row._id}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                          title="Download report card (PDF)"
                        >
                          {downloadingId === row._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setDeleteConfirm(row._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this patient? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Patient</h3>
                <p className="text-sm text-gray-500">ID: {editPatient.patientId}</p>
              </div>
              <button onClick={() => setEditPatient(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={editForm.firstName || ''} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Middle Name (Optional)</label>
                    <input type="text" value={editForm.middleName || ''} onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })} className={inputClass} placeholder="Leave blank if none" />
                  </div>
                  <div>
                    <label className={labelClass}>Surname</label>
                    <input type="text" value={editForm.surname || ''} onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={editForm.dob || ''} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={editForm.gender || ''} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })} className={selectClass}>
                      <option value="">Select Gender</option>
                      {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Occupation</label>
                    <input type="text" value={editForm.occupation || ''} onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Marital Status</label>
                    <select value={editForm.maritalStatus || ''} onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })} className={selectClass}>
                      <option value="">Select Status</option>
                      {maritalStatusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <select value={editForm.state || ''} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} className={selectClass}>
                      <option value="">Select State</option>
                      {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>LGA</label>
                    <input type="text" value={editForm.lga || ''} onChange={(e) => setEditForm({ ...editForm, lga: e.target.value })} className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Medical Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select value={editForm.bloodGroup || ''} onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })} className={selectClass}>
                      <option value="">Select Blood Group</option>
                      {bloodGroupOptions.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Genotype</label>
                    <select value={editForm.genotype || ''} onChange={(e) => setEditForm({ ...editForm, genotype: e.target.value })} className={selectClass}>
                      <option value="">Select Genotype</option>
                      {genotypeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Next of Kin</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Next of Kin Name</label>
                    <input type="text" value={editForm.nextOfKin || ''} onChange={(e) => setEditForm({ ...editForm, nextOfKin: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Next of Kin Phone</label>
                    <input type="tel" value={editForm.nextOfKinPhone || ''} onChange={(e) => setEditForm({ ...editForm, nextOfKinPhone: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <input type="text" value={editForm.relationship || ''} onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Contact</label>
                    <input type="text" value={editForm.emergencyContact || ''} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setEditPatient(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={editLoading} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
