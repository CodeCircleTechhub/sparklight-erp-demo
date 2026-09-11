import { FileText, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const records = [
  { id: 'MR-3001', patient: 'Sarah Johnson', type: 'Lab Report', date: 'Sep 10, 2026', doctor: 'Dr. Ahmed', notes: 'Blood pressure elevated' },
  { id: 'MR-3002', patient: 'Michael Brown', type: 'Imaging', date: 'Sep 09, 2026', doctor: 'Dr. Ahmed', notes: 'Chest X-ray normal' },
  { id: 'MR-3003', patient: 'Emma Wilson', type: 'Consultation', date: 'Sep 08, 2026', doctor: 'Dr. Fatima', notes: 'Migraine follow-up' },
  { id: 'MR-3004', patient: 'James Davis', type: 'Lab Report', date: 'Sep 07, 2026', doctor: 'Dr. Ahmed', notes: 'Glucose levels normal' },
  { id: 'MR-3005', patient: 'Olivia Martinez', type: 'Prescription', date: 'Sep 06, 2026', doctor: 'Dr. Fatima', notes: 'Pain medication prescribed' },
  { id: 'MR-3006', patient: 'William Garcia', type: 'Lab Report', date: 'Sep 05, 2026', doctor: 'Dr. Ahmed', notes: 'Spirometry results' },
  { id: 'MR-3007', patient: 'Sophia Rodriguez', type: 'Imaging', date: 'Sep 04, 2026', doctor: 'Dr. Fatima', notes: 'Thyroid ultrasound' },
  { id: 'MR-3008', patient: 'Daniel Lee', type: 'Consultation', date: 'Sep 03, 2026', doctor: 'Dr. Ahmed', notes: 'COPD management review' },
  { id: 'MR-3009', patient: 'Isabella Thomas', type: 'Lab Report', date: 'Sep 02, 2026', doctor: 'Dr. Fatima', notes: 'Prenatal blood work' },
  { id: 'MR-3010', patient: 'Benjamin Harris', type: 'Discharge Summary', date: 'Sep 01, 2026', doctor: 'Dr. Ahmed', notes: 'Discharged with medications' },
];

const typeColors: Record<string, string> = {
  'Lab Report': 'bg-blue-100 text-blue-800',
  Imaging: 'bg-purple-100 text-purple-800',
  Consultation: 'bg-green-100 text-green-800',
  Prescription: 'bg-orange-100 text-orange-800',
  'Discharge Summary': 'bg-gray-100 text-gray-800',
};

export default function MedicalRecords() {
  return (
    <div className="space-y-6">
      <PageHeader title="Medical Records" icon={FileText} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records by patient name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Record ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.patient}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.doctor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
