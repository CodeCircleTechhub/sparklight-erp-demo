import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, FileText, Loader2, AlertCircle, Phone, Edit, CheckCircle, FileDown } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import EditPatientModal from '../../components/shared/EditPatientModal';
import api from '../../services/api';
import { downloadPatientReport } from '../../utils/downloadPatientReport';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-yellow-100 text-yellow-700',
  Discharged: 'bg-blue-100 text-blue-700',
  Archived: 'bg-gray-100 text-gray-700',
};

export default function PatientSearch() {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [editPatient, setEditPatient] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadReport = async (patient: any) => {
    if (!patient?._id || downloadingId) return;
    setDownloadingId(patient._id);
    try {
      await downloadPatientReport(patient._id, `Patient_Registration_Report_${patient.patientId}.pdf`);
      setSuccess(`Report card downloaded for ${patient.patientId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download report card');
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchPatients = useCallback(async (search?: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/patients', {
        params: search ? { search } : {},
      });
      setPatients(data.patients ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchPatients(query.trim() || undefined);
    }, 350);
    return () => clearTimeout(t);
  }, [query, fetchPatients]);

  useEffect(() => {
    if (!selected && !editPatient) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setEditPatient(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected, editPatient]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const name = (p: any) => [p.firstName, p.surname].filter(Boolean).join(' ');

  const lastVisit = (p: any) => {
    const d = p.updatedAt || p.createdAt;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Search" icon={Search} />

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, patient ID, phone, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Searching patients...</span>
              </div>
            ) : patients.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No patients found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient ID</th>
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium hidden lg:table-cell">Card</th>
            <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Gender</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Last Seen</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{p.patientId}</td>
              <td className="py-3 text-gray-900">{name(p)}</td>
              <td className="py-3 hidden lg:table-cell">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    (p.cardType || 'Individual') === 'Family'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {(p.cardType || 'Individual') === 'Family' ? 'Family' : 'Individual'} ·{' '}
                  {p.cardNumber || p.patientId}
                </span>
              </td>
              <td className="py-3 text-gray-600 hidden md:table-cell">
                        {p.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {p.phone}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{p.gender || '-'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{lastVisit(p)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                          {p.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelected(p)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View patient"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelected(null);
                              setEditPatient(p);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit patient"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(p)}
                            disabled={downloadingId === p._id}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Download report card (PDF)"
                          >
                            {downloadingId === p._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['Patient ID', selected.patientId],
                ['Name', name(selected)],
                ['Middle Name', selected.middleName],
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Gender', selected.gender],
                ['Date of Birth', selected.dob ? new Date(selected.dob).toLocaleDateString() : ''],
                ['Address', selected.address],
                ['State', selected.state],
                ['LGA', selected.lga],
                ['Blood Group', selected.bloodGroup],
                ['Genotype', selected.genotype],
                ['Marital Status', selected.maritalStatus],
                ['Occupation', selected.occupation],
                ['Next of Kin', selected.nextOfKin],
                ['Next of Kin Phone', selected.nextOfKinPhone],
                ['Relationship', selected.relationship],
                ['Emergency Contact', selected.emergencyContact],
                ['Status', selected.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium text-right">{value || '-'}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => handleDownloadReport(selected)}
                disabled={downloadingId === selected._id}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
              >
                {downloadingId === selected._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                Download Report (PDF)
              </button>
              <button
                onClick={() => {
                  setEditPatient(selected);
                  setSelected(null);
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSaved={() => {
            setSuccess('Patient information updated successfully');
            fetchPatients(query.trim() || undefined);
          }}
        />
      )}
    </div>
  );
}
