import { FileText, Search, Eye, Download } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const documents = [
  { id: 'DOC-001', patient: 'Alice Johnson', type: 'Lab Report', uploadDate: 'Sep 10, 2026', uploadedBy: 'Dr. Smith' },
  { id: 'DOC-002', patient: 'Bob Williams', type: 'Prescription', uploadDate: 'Sep 09, 2026', uploadedBy: 'Dr. Patel' },
  { id: 'DOC-003', patient: 'Carol Davis', type: 'Discharge Summary', uploadDate: 'Sep 11, 2026', uploadedBy: 'Dr. Lee' },
  { id: 'DOC-004', patient: 'David Brown', type: 'X-Ray Report', uploadDate: 'Sep 08, 2026', uploadedBy: 'Dr. Garcia' },
  { id: 'DOC-005', patient: 'Eva Martinez', type: 'Insurance Claim', uploadDate: 'Sep 07, 2026', uploadedBy: 'Admin Rachel' },
  { id: 'DOC-006', patient: 'Frank Wilson', type: 'Lab Report', uploadDate: 'Sep 11, 2026', uploadedBy: 'Dr. Chen' },
  { id: 'DOC-007', patient: 'Grace Lee', type: 'Blood Test', uploadDate: 'Sep 06, 2026', uploadedBy: 'Dr. Adams' },
  { id: 'DOC-008', patient: 'Henry Garcia', type: 'Referral Letter', uploadDate: 'Sep 10, 2026', uploadedBy: 'Dr. Brown' },
];

export default function PatientDocuments() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Documents" icon={FileText} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by patient name or type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Document ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Type</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Upload Date</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Uploaded By</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{d.id}</td>
                    <td className="py-3 text-gray-900">{d.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{d.type}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{d.uploadDate}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{d.uploadedBy}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
