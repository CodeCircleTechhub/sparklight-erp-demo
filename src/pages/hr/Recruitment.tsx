import { Briefcase, FileText, Users, CheckCircle, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Open Positions', value: '5', icon: Briefcase, color: 'bg-[#3b82f6]' },
  { label: 'Applications', value: '45', icon: FileText, color: 'bg-emerald-500' },
  { label: 'Interviews', value: '12', icon: Users, color: 'bg-purple-500' },
  { label: 'Hired', value: '3', icon: CheckCircle, color: 'bg-amber-500' },
];

const positions = [
  { position: 'Senior Nurse', department: 'Cardiology', applications: 12, interviews: 4, offered: 1, status: 'Open' },
  { position: 'Lab Technician', department: 'Laboratory', applications: 8, interviews: 3, offered: 1, status: 'Open' },
  { position: 'Radiologist', department: 'Radiology', applications: 6, interviews: 2, offered: 0, status: 'Open' },
  { position: 'Pharmacist', department: 'Pharmacy', applications: 10, interviews: 2, offered: 1, status: 'Open' },
  { position: 'Admin Assistant', department: 'Administration', applications: 9, interviews: 1, offered: 0, status: 'Closed' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'green';
    case 'Closed': return 'gray';
    default: return 'gray';
  }
};

export default function Recruitment() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Recruitment" icon={Briefcase} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Position', 'Department', 'Applications', 'Interviews', 'Offered', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.position}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.department}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{p.applications}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{p.interviews}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{p.offered}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} color={getStatusColor(p.status) as any} /></td>
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
