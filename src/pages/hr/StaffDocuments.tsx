import { FileText, Search, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const documents = [
  { id: 'DOC-001', staffName: 'Dr. James Wilson', type: 'Employment Contract', uploadDate: '2024-01-15', status: 'Verified' },
  { id: 'DOC-002', staffName: 'Nurse Sarah Miller', type: 'Nursing License', uploadDate: '2024-01-14', status: 'Verified' },
  { id: 'DOC-003', staffName: 'Dr. Emily Chen', type: 'Medical Degree', uploadDate: '2024-01-13', status: 'Pending' },
  { id: 'DOC-004', staffName: 'Mike Brown', type: 'Lab Certification', uploadDate: '2024-01-12', status: 'Verified' },
  { id: 'DOC-005', staffName: 'Dr. Anna Lee', type: 'Board Certification', uploadDate: '2024-01-11', status: 'Verified' },
  { id: 'DOC-006', staffName: 'Tom Davis', type: 'Pharmacy License', uploadDate: '2024-01-10', status: 'Expired' },
  { id: 'DOC-007', staffName: 'Lisa Johnson', type: 'Employment Contract', uploadDate: '2024-01-09', status: 'Verified' },
  { id: 'DOC-008', staffName: 'Robert Taylor', type: 'ID Document', uploadDate: '2024-01-08', status: 'Pending' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Verified': return 'green';
    case 'Pending': return 'yellow';
    case 'Expired': return 'red';
    default: return 'gray';
  }
};

export default function StaffDocuments() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Staff Documents" icon={FileText} />
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" />
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
                {documents.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{d.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                          {d.staffName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{d.staffName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.type}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.uploadDate}</td>
                    <td className="px-5 py-4"><StatusBadge status={d.status} color={getStatusColor(d.status) as any} /></td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
