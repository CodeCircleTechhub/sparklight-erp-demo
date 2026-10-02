import { useState, useEffect } from 'react';
import { FileText, Search, MoreVertical, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface Document {
  id: string;
  staffName: string;
  staffId?: string;
  type: string;
  uploadDate: string;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Verified': return 'green';
    case 'Pending': return 'yellow';
    case 'Expired': return 'red';
    default: return 'gray';
  }
};

export default function StaffDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ staffName: '', type: '', status: 'Pending' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/documents');
      setDocuments(data.documents || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async () => {
    if (!newDoc.staffName || !newDoc.type) return;
    try {
      await api.post('/documents', {
        ...newDoc,
        uploadDate: new Date().toISOString().split('T')[0],
      });
      setShowAddModal(false);
      setNewDoc({ staffName: '', type: '', status: 'Pending' });
      fetchDocuments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add document');
    }
  };

  const filtered = documents.filter(
    (d) =>
      (d.staffName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.type || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.id || '').toLowerCase().includes(search.toLowerCase())
  );

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
          title="Staff Documents"
          icon={FileText}
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          }
        />
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Document ID', 'Staff Name', 'Type', 'Upload Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                      No documents found. Click "Add Document" to upload one.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{d.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                            {(d.staffName || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{d.staffName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{d.type}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{d.uploadDate}</td>
                      <td className="px-5 py-4"><StatusBadge status={d.status} color={getStatusColor(d.status) as any} /></td>
                      <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Document</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
                <input
                  type="text"
                  value={newDoc.staffName}
                  onChange={(e) => setNewDoc({ ...newDoc, staffName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  placeholder="e.g. Dr. James Wilson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <input
                  type="text"
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  placeholder="e.g. Employment Contract"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleAddDocument}
                disabled={!newDoc.staffName || !newDoc.type}
                className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
