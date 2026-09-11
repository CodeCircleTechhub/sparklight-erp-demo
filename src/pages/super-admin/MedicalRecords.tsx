import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const records = [
  { id: 'MR-001', patient: 'Abubakar Ibrahim', doctor: 'Dr. Fatima Usman', date: '2026-09-10', type: 'Consultation', diagnosis: 'Hypertension' },
  { id: 'MR-002', patient: 'Fatima Bello', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-09', type: 'Surgery', diagnosis: 'Appendicitis' },
  { id: 'MR-003', patient: 'Mohammed Usman', doctor: 'Dr. Abubakar Suleiman', date: '2026-09-08', type: 'Follow-up', diagnosis: 'Type 2 Diabetes' },
  { id: 'MR-004', patient: 'Aisha Abdullahi', doctor: 'Dr. Aisha Bello', date: '2026-09-07', type: 'Emergency', diagnosis: 'Fracture - Left Arm' },
  { id: 'MR-005', patient: 'Oluwaseun Adeyemi', doctor: 'Dr. Chukwuemeka Obi', date: '2026-09-06', type: 'Consultation', diagnosis: 'Migraine' },
  { id: 'MR-006', patient: 'Ngozi Okafor', doctor: 'Dr. Hauwa Danjuma', date: '2026-09-05', type: 'Lab Test', diagnosis: 'Malaria' },
  { id: 'MR-007', patient: 'Yusuf Danjuma', doctor: 'Dr. Ibrahim Musa', date: '2026-09-04', type: 'Surgery', diagnosis: 'Knee Replacement' },
  { id: 'MR-008', patient: 'Hauwa Mohammed', doctor: 'Dr. Fatima Usman', date: '2026-09-03', type: 'Consultation', diagnosis: 'Anemia' },
  { id: 'MR-009', patient: 'Tunde Akande', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-02', type: 'Follow-up', diagnosis: 'Stroke Recovery' },
  { id: 'MR-010', patient: 'Blessing Eze', doctor: 'Dr. Aisha Bello', date: '2026-09-01', type: 'Emergency', diagnosis: 'Severe Allergic Reaction' },
];

const typeColor: Record<string, string> = {
  Consultation: 'bg-blue-100 text-blue-700',
  Surgery: 'bg-red-100 text-red-700',
  'Follow-up': 'bg-green-100 text-green-700',
  Emergency: 'bg-orange-100 text-orange-700',
  'Lab Test': 'bg-purple-100 text-purple-700',
};

export default function MedicalRecords() {
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Medical Records" icon={FileText} description="View and manage all medical records" />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Records</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Record ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{row.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
