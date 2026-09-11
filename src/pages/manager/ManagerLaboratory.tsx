import { FlaskConical, Clock, Loader, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Tests Today', value: '32', icon: FlaskConical, color: 'bg-blue-500' },
  { label: 'Pending', value: '8', icon: Clock, color: 'bg-amber-500' },
  { label: 'Processing', value: '5', icon: Loader, color: 'bg-violet-500' },
  { label: 'Completed', value: '19', icon: CheckCircle, color: 'bg-green-500' },
];

const tests = [
  { id: 'LAB-001', patient: 'Alice Johnson', testType: 'CBC', doctor: 'Dr. Smith', status: 'Completed' },
  { id: 'LAB-002', patient: 'Bob Williams', testType: 'Blood Sugar', doctor: 'Dr. Patel', status: 'Processing' },
  { id: 'LAB-003', patient: 'Carol Davis', testType: 'Lipid Profile', doctor: 'Dr. Lee', status: 'Pending' },
  { id: 'LAB-004', patient: 'David Brown', testType: 'Liver Function', doctor: 'Dr. Garcia', status: 'Completed' },
  { id: 'LAB-005', patient: 'Eva Martinez', testType: 'Urine Analysis', doctor: 'Dr. Kim', status: 'Processing' },
  { id: 'LAB-006', patient: 'Frank Wilson', testType: 'Thyroid Panel', doctor: 'Dr. Chen', status: 'Completed' },
  { id: 'LAB-007', patient: 'Grace Lee', testType: 'ECG', doctor: 'Dr. Adams', status: 'Pending' },
  { id: 'LAB-008', patient: 'Henry Garcia', testType: 'X-Ray', doctor: 'Dr. Brown', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
};

export default function ManagerLaboratory() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Laboratory Overview" icon={FlaskConical} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Test ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Test Type</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Doctor</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tests.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{t.id}</td>
                    <td className="py-3 text-gray-900">{t.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{t.testType}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{t.doctor}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
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
