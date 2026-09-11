import { useState } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const records = [
  { id: 'CR-001', patient: 'Abubakar Ibrahim', doctor: 'Dr. Fatima Usman', date: '2026-09-10', diagnosis: 'Hypertension Stage 2', prescription: 'Amlodipine 5mg, Lisinopril 10mg' },
  { id: 'CR-002', patient: 'Fatima Bello', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-09', diagnosis: 'Acute Appendicitis', prescription: 'Surgery referral, IV antibiotics' },
  { id: 'CR-003', patient: 'Mohammed Usman', doctor: 'Dr. Abubakar Suleiman', date: '2026-09-08', diagnosis: 'Type 2 Diabetes Mellitus', prescription: 'Metformin 850mg, Diet modification' },
  { id: 'CR-004', patient: 'Aisha Abdullahi', doctor: 'Dr. Aisha Bello', date: '2026-09-07', diagnosis: 'Closed fracture left radius', prescription: 'Cast application, Pain relief' },
  { id: 'CR-005', patient: 'Oluwaseun Adeyemi', doctor: 'Dr. Chukwuemeka Obi', date: '2026-09-06', diagnosis: 'Chronic migraine', prescription: 'Sumatriptan 50mg, Prophylaxis' },
  { id: 'CR-006', patient: 'Ngozi Okafor', doctor: 'Dr. Hauwa Danjuma', date: '2026-09-05', diagnosis: 'Plasmodium falciparum malaria', prescription: 'ACT 3-day course, Paracetamol' },
  { id: 'CR-007', patient: 'Yusuf Danjuma', doctor: 'Dr. Ibrahim Musa', date: '2026-09-04', diagnosis: 'Osteoarthritis right knee', prescription: 'Total knee replacement surgery' },
  { id: 'CR-008', patient: 'Hauwa Mohammed', doctor: 'Dr. Fatima Usman', date: '2026-09-03', diagnosis: 'Iron deficiency anemia', prescription: 'Ferrous sulfate 200mg, Folic acid' },
  { id: 'CR-009', patient: 'Tunde Akande', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-02', diagnosis: 'Ischemic stroke recovery', prescription: 'Physiotherapy, Aspirin 75mg' },
  { id: 'CR-010', patient: 'Blessing Eze', doctor: 'Dr. Aisha Bello', date: '2026-09-01', diagnosis: 'Anaphylactic shock', prescription: 'Epinephrine, Antihistamines' },
];

export default function AdminClinicalRecords() {
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Clinical Records" icon={ClipboardList} description="View and manage clinical records" />

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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Prescription</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.diagnosis}</td>
                  <td className="py-3 px-4 text-gray-500">{row.prescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
