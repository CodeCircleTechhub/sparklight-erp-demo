import { Activity } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const diagnoses = [
  { id: 'DIA-2026-001', patient: 'John Doe', doctor: 'Dr. Smith', date: '2026-09-11', diagnosis: 'Hypertension Stage 2', treatment: 'Amlodipine 5mg daily, lifestyle changes' },
  { id: 'DIA-2026-002', patient: 'Sarah Connor', doctor: 'Dr. Patel', date: '2026-09-11', diagnosis: 'Distal Radius Fracture', treatment: 'Cast immobilization, pain management' },
  { id: 'DIA-2026-003', patient: 'Mike Johnson', doctor: 'Dr. Lee', date: '2026-09-11', diagnosis: 'Type 2 Diabetes Mellitus', treatment: 'Metformin 500mg twice daily' },
  { id: 'DIA-2026-004', patient: 'Emma Wilson', doctor: 'Dr. Adams', date: '2026-09-10', diagnosis: 'Upper Respiratory Infection', treatment: 'Rest, fluids, symptomatic treatment' },
  { id: 'DIA-2026-005', patient: 'David Brown', doctor: 'Dr. Chen', date: '2026-09-10', diagnosis: 'Chronic Migraine', treatment: 'Sumatriptan 50mg as needed' },
  { id: 'DIA-2026-006', patient: 'Lisa Anderson', doctor: 'Dr. Kim', date: '2026-09-10', diagnosis: 'Atopic Dermatitis', treatment: 'Hydrocortisone cream, moisturizer' },
  { id: 'DIA-2026-007', patient: 'James Taylor', doctor: 'Dr. Garcia', date: '2026-09-09', diagnosis: 'Chronic Sinusitis', treatment: 'Amoxicillin 500mg, nasal spray' },
  { id: 'DIA-2026-008', patient: 'Rachel White', doctor: 'Dr. Nguyen', date: '2026-09-09', diagnosis: 'Bacterial Conjunctivitis', treatment: 'Chloramphenicol eye drops' },
  { id: 'DIA-2026-009', patient: 'Tom Harris', doctor: 'Dr. Patel', date: '2026-09-08', diagnosis: 'Nephrolithiasis', treatment: 'Hydration, pain relief, lithotripsy' },
  { id: 'DIA-2026-010', patient: 'Grace Lee', doctor: 'Dr. Smith', date: '2026-09-08', diagnosis: 'Generalized Anxiety Disorder', treatment: 'Sertraline 50mg daily, therapy' },
];

export default function Diagnoses() {
  return (
    <div className="space-y-6">
      <PageHeader title="Diagnoses" icon={Activity} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Treatment Plan</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.diagnosis}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
