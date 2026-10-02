import { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Eye, Upload, Loader2, AlertCircle, Plus, X, Download } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const docTypes = [
  'Lab Report',
  'Prescription',
  'Discharge Summary',
  'X-Ray Report',
  'Insurance Claim',
  'Blood Test',
  'Referral Letter',
  'Medical Certificate',
  'Other',
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Verified: 'bg-green-100 text-green-700',
  Active: 'bg-blue-100 text-blue-700',
  Expired: 'bg-red-100 text-red-700',
};

export default function PatientDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [form, setForm] = useState({
    patientName: '',
    type: 'Lab Report',
    notes: '',
    fileUrl: '',
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [patientQuery, setPatientQuery] = useState('');

  const fetchDocuments = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/documents', {
        params: q ? { search: q } : {},
      });
      setDocuments(data.documents ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const t = setTimeout(() => fetchDocuments(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchDocuments]);

  useEffect(() => {
    if (!showUpload && !selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShowUpload(false);
      setUploadError('');
      setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showUpload, selected]);

  useEffect(() => {
    if (!showUpload) return;
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/patients', {
          params: patientQuery ? { search: patientQuery } : {},
        });
        setPatients(data.patients || []);
      } catch {
        setPatients([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [patientQuery, showUpload]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!form.patientName.trim() || !form.type) {
      setUploadError('Patient name and document type are required');
      return;
    }
    setUploading(true);
    try {
      await api.post('/documents', form);
      setShowUpload(false);
      setForm({ patientName: '', type: 'Lab Report', notes: '', fileUrl: '' });
      setPatientQuery('');
      await fetchDocuments(search.trim() || undefined);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const uploadDate = (d: any) => {
    const raw = d.uploadDate || d.createdAt;
    if (!raw) return '-';
    return new Date(raw).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Documents" icon={FileText} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, type, or document ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No documents found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Document ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Type</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Upload Date</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Uploaded By</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {documents.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{d.documentId || d.id}</td>
                      <td className="py-3 text-gray-900">{d.patientName || '-'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{d.type}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{uploadDate(d)}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{d.uploadedBy || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>
                          {d.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelected(d)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {d.fileUrl && (
                            <a
                              href={d.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
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
      </div>

      {showUpload && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowUpload(false);
            setUploadError('');
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
              </div>
              <button
                onClick={() => { setShowUpload(false); setUploadError(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.patientName || patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setForm({ ...form, patientName: e.target.value });
                    }}
                    placeholder="Search patient name..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {patients.length > 0 && patientQuery && !form.patientName && (
                  <div className="mt-1 max-h-32 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                    {patients.slice(0, 6).map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, patientName: [p.firstName, p.surname].filter(Boolean).join(' ') });
                          setPatientQuery('');
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                      >
                        {[p.firstName, p.surname].filter(Boolean).join(' ')}
                        <span className="text-gray-400 ml-2">{p.patientId}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {docTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL (optional)</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUpload(false); setUploadError(''); }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Document Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['Document ID', selected.documentId || selected.id],
                ['Patient', selected.patientName],
                ['Type', selected.type],
                ['Upload Date', uploadDate(selected)],
                ['Uploaded By', selected.uploadedBy],
                ['Status', selected.status],
                ['Notes', selected.notes],
                ['File URL', selected.fileUrl],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium text-right break-all">{value || '-'}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
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
    </div>
  );
}
