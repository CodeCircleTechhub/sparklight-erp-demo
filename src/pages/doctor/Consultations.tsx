import { Stethoscope, Calendar, CheckCircle, Clock, CalendarCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Today', value: '8', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'This Week', value: '45', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Completed', value: '38', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Follow-up', value: '7', icon: CalendarCheck, color: 'text-yellow-600', bg: 'bg-yellow-100' },
];

const consultations = [
  { id: 'CON-2001', patient: 'Sarah Johnson', date: 'Sep 11, 2026', diagnosis: 'Hypertension', prescription: 'Amlodipine 5mg', status: 'Completed' },
  { id: 'CON-2002', patient: 'Michael Brown', date: 'Sep 11, 2026', diagnosis: 'Type 2 Diabetes', prescription: 'Metformin 1000mg', status: 'Completed' },
  { id: 'CON-2003', patient: 'Emma Wilson', date: 'Sep 11, 2026', diagnosis: 'Migraine', prescription: 'Sumatriptan 50mg', status: 'In Progress' },
  { id: 'CON-2004', patient: 'James Davis', date: 'Sep 10, 2026', diagnosis: 'Lower Back Pain', prescription: 'Ibuprofen 400mg', status: 'Completed' },
  { id: 'CON-2005', patient: 'Olivia Martinez', date: 'Sep 10, 2026', diagnosis: 'Osteoarthritis', prescription: 'Naproxen 250mg', status: 'Completed' },
  { id: 'CON-2006', patient: 'William Garcia', date: 'Sep 10, 2026', diagnosis: 'Asthma', prescription: 'Salbutamol Inhaler', status: 'Follow-up' },
  { id: 'CON-2007', patient: 'Sophia Rodriguez', date: 'Sep 09, 2026', diagnosis: 'Hypothyroidism', prescription: 'Levothyroxine 50mcg', status: 'Completed' },
  { id: 'CON-2008', patient: 'Daniel Lee', date: 'Sep 09, 2026', diagnosis: 'COPD', prescription: 'Tiotropium 18mcg', status: 'Completed' },
  { id: 'CON-2009', patient: 'Isabella Thomas', date: 'Sep 08, 2026', diagnosis: 'Gastroesophageal Reflux', prescription: 'Omeprazole 20mg', status: 'Follow-up' },
  { id: 'CON-2010', patient: 'Benjamin Harris', date: 'Sep 08, 2026', diagnosis: 'Chest Infection', prescription: 'Amoxicillin 500mg', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Follow-up': 'bg-yellow-100 text-yellow-800',
};

export default function Consultations() {
  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" icon={Stethoscope} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Consultation ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {consultations.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{c.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.diagnosis}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.prescription}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
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
