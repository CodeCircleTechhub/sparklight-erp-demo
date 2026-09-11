import { DollarSign, Users, Clock, TrendingUp, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Payroll', value: '₦125,000', icon: DollarSign, color: 'bg-[#3b82f6]' },
  { label: 'Processed', value: '142', icon: Users, color: 'bg-emerald-500' },
  { label: 'Pending', value: '14', icon: Clock, color: 'bg-amber-500' },
  { label: 'Average', value: '₦835', icon: TrendingUp, color: 'bg-purple-500' },
];

const payroll = [
  { id: 'STF-001', name: 'Dr. James Wilson', department: 'Cardiology', basic: 12000, allowances: 2500, deductions: 1800, net: 12700, status: 'Paid' },
  { id: 'STF-002', name: 'Nurse Sarah Miller', department: 'Pediatrics', basic: 6500, allowances: 1200, deductions: 900, net: 6800, status: 'Paid' },
  { id: 'STF-003', name: 'Dr. Emily Chen', department: 'Neurology', basic: 11000, allowances: 2200, deductions: 1650, net: 11550, status: 'Paid' },
  { id: 'STF-004', name: 'Mike Brown', department: 'Laboratory', basic: 4500, allowances: 800, deductions: 600, net: 4700, status: 'Pending' },
  { id: 'STF-005', name: 'Dr. Anna Lee', department: 'Orthopedics', basic: 13000, allowances: 2800, deductions: 1950, net: 13850, status: 'Paid' },
  { id: 'STF-006', name: 'Tom Davis', department: 'Pharmacy', basic: 5500, allowances: 1000, deductions: 750, net: 5750, status: 'Paid' },
  { id: 'STF-007', name: 'Lisa Johnson', department: 'Administration', basic: 5000, allowances: 900, deductions: 675, net: 5225, status: 'Paid' },
  { id: 'STF-008', name: 'Robert Taylor', department: 'Cardiology', basic: 6000, allowances: 1100, deductions: 825, net: 6275, status: 'Pending' },
  { id: 'STF-009', name: 'Maria Santos', department: 'Radiology', basic: 9000, allowances: 1800, deductions: 1350, net: 9450, status: 'Paid' },
  { id: 'STF-010', name: 'Kevin White', department: 'Finance', basic: 5200, allowances: 950, deductions: 700, net: 5450, status: 'Paid' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Payroll() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Payroll" icon={DollarSign} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`₦{s.color} p-2 rounded-lg`}>
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
                  {['Staff ID', 'Name', 'Department', 'Basic', 'Allowances', 'Deductions', 'Net', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payroll.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{p.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                          {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.department}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">₦{p.basic.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-emerald-600">₦{p.allowances.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-red-600">₦{p.deductions.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{p.net.toLocaleString()}</td>
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
