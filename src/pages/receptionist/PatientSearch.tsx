import { Search, Eye, FileText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useState } from 'react';

const patients = [
  { id: 'PT-2041', name: 'Alice Johnson', phone: '(555) 123-4567', gender: 'Female', lastVisit: 'Sep 10, 2026' },
  { id: 'PT-2042', name: 'Bob Williams', phone: '(555) 234-5678', gender: 'Male', lastVisit: 'Sep 09, 2026' },
  { id: 'PT-2043', name: 'Carol Davis', phone: '(555) 345-6789', gender: 'Female', lastVisit: 'Sep 11, 2026' },
  { id: 'PT-2044', name: 'David Brown', phone: '(555) 456-7890', gender: 'Male', lastVisit: 'Sep 08, 2026' },
  { id: 'PT-2045', name: 'Eva Martinez', phone: '(555) 567-8901', gender: 'Female', lastVisit: 'Sep 07, 2026' },
  { id: 'PT-2046', name: 'Frank Wilson', phone: '(555) 678-9012', gender: 'Male', lastVisit: 'Sep 11, 2026' },
  { id: 'PT-2047', name: 'Grace Lee', phone: '(555) 789-0123', gender: 'Female', lastVisit: 'Sep 06, 2026' },
  { id: 'PT-2048', name: 'Henry Garcia', phone: '(555) 890-1234', gender: 'Male', lastVisit: 'Sep 10, 2026' },
];

const filterOptions = ['By ID', 'By Name', 'By Phone', 'By Email'];

export default function PatientSearch() {
  const [activeFilter, setActiveFilter] = useState('By Name');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Search" icon={Search} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search patients ${activeFilter.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Gender</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Last Visit</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{p.id}</td>
                    <td className="py-3 text-gray-900">{p.name}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{p.phone}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{p.gender}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{p.lastVisit}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
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
