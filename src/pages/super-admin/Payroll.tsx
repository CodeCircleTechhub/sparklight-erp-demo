import { Banknote } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Payroll', value: '₦125,000', icon: Banknote, color: 'blue' as const },
  { title: 'Processed', value: '142', icon: Banknote, color: 'green' as const },
  { title: 'Pending', value: '14', icon: Banknote, color: 'yellow' as const },
  { title: 'This Month', value: '₦125,000', icon: Banknote, color: 'purple' as const },
];

const payroll = [
  { id: 'EMP-001', name: 'Dr. Alan Smith', department: 'Cardiology', basic: 8000, allowances: 2400, deductions: 1200, net: 9200, status: 'Processed' },
  { id: 'EMP-002', name: 'Dr. Priya Patel', department: 'Orthopedics', basic: 7500, allowances: 2250, deductions: 1100, net: 8650, status: 'Processed' },
  { id: 'EMP-003', name: 'Dr. Wei Lee', department: 'General', basic: 6500, allowances: 1950, deductions: 950, net: 7500, status: 'Processed' },
  { id: 'EMP-004', name: 'Nurse Grace Adams', department: 'Pediatrics', basic: 3500, allowances: 1050, deductions: 500, net: 4050, status: 'Processed' },
  { id: 'EMP-005', name: 'Dr. Lin Chen', department: 'Neurology', basic: 8200, allowances: 2460, deductions: 1230, net: 9430, status: 'Pending' },
  { id: 'EMP-006', name: 'Dr. Soo Kim', department: 'Dermatology', basic: 7000, allowances: 2100, deductions: 1050, net: 8050, status: 'Processed' },
  { id: 'EMP-007', name: 'Carlos Garcia', department: 'Laboratory', basic: 4000, allowances: 1200, deductions: 600, net: 4600, status: 'Processed' },
  { id: 'EMP-008', name: 'Dr. Anna Nguyen', department: 'Ophthalmology', basic: 7800, allowances: 2340, deductions: 1170, net: 8970, status: 'Pending' },
  { id: 'EMP-009', name: 'Fatima Hassan', department: 'Pharmacy', basic: 4500, allowances: 1350, deductions: 675, net: 5175, status: 'Processed' },
  { id: 'EMP-010', name: 'James Wilson', department: 'Accounting', basic: 4200, allowances: 1260, deductions: 630, net: 4830, status: 'Processed' },
];

const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;

export default function Payroll() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payroll" icon={Banknote} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Basic Salary</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Allowances</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Deductions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Net Pay</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatCurrency(row.basic)}</td>
                  <td className="py-3 px-4 text-green-600 whitespace-nowrap">{formatCurrency(row.allowances)}</td>
                  <td className="py-3 px-4 text-red-600 whitespace-nowrap">{formatCurrency(row.deductions)}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{formatCurrency(row.net)}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
