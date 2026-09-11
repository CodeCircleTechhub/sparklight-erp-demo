import { Stethoscope } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const consultations = [
  { id: 'CON-2026-001', patient: 'John Doe', doctor: 'Dr. Smith', date: '2026-09-11', diagnosis: 'Hypertension', status: 'Completed' },
  { id: 'CON-2026-002', patient: 'Sarah Connor', doctor: 'Dr. Patel', date: '2026-09-11', diagnosis: 'Fractured Radius', status: 'Completed' },
  { id: 'CON-2026-003', patient: 'Mike Johnson', doctor: 'Dr. Lee', date: '2026-09-11', diagnosis: 'Type 2 Diabetes', status: 'In Progress' },
  { id: 'CON-2026-004', patient: 'Emma Wilson', doctor: 'Dr. Adams', date: '2026-09-10', diagnosis: 'Common Cold', status: 'Completed' },
  { id: 'CON-2026-005', patient: 'David Brown', doctor: 'Dr. Chen', date: '2026-09-10', diagnosis: 'Migraine', status: 'Completed' },
  { id: 'CON-2026-006', patient: 'Lisa Anderson', doctor: 'Dr. Kim', date: '2026-09-10', diagnosis: 'Eczema', status: 'Completed' },
  { id: 'CON-2026-007', patient: 'James Taylor', doctor: 'Dr. Garcia', date: '2026-09-09', diagnosis: 'Sinusitis', status: 'Completed' },
  { id: 'CON-2026-008', patient: 'Rachel White', doctor: 'Dr. Nguyen', date: '2026-09-09', diagnosis: 'Conjunctivitis', status: 'Completed' },
  { id: 'CON-2026-009', patient: 'Tom Harris', doctor: 'Dr. Patel', date: '2026-09-09', diagnosis: 'Kidney Stones', status: 'Scheduled' },
  { id: 'CON-2026-010', patient: 'Grace Lee', doctor: 'Dr. Smith', date: '2026-09-08', diagnosis: 'Anxiety Disorder', status: 'Completed' },
];

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (s === 'Scheduled') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

export default function Consultations() {
  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" icon={Stethoscope} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Consultation ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.diagnosis}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
