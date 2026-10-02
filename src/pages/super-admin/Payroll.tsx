import { useState, useEffect } from 'react';
import { Banknote, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

interface PayrollRecord {
  employeeName: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
}

const formatCurrency = (n: number) => `\u20A6${n.toLocaleString()}`;

export default function Payroll() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [stats, setStats] = useState([
    { title: 'Total Payroll', value: '\u20A60', icon: Banknote, color: 'blue' as const },
    { title: 'Processed', value: '0', icon: Banknote, color: 'green' as const },
    { title: 'Paid', value: '0', icon: Banknote, color: 'purple' as const },
    { title: 'Pending', value: '0', icon: Banknote, color: 'yellow' as const },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const { data } = await api.get('/hr/payroll');
        setPayroll(data.payroll ?? []);
        const totalNet = (data.payroll ?? []).reduce((sum: number, r: PayrollRecord) => sum + (r.netSalary ?? 0), 0);
        setStats([
          { title: 'Total Payroll', value: formatCurrency(totalNet), icon: Banknote, color: 'blue' as const },
          { title: 'Processed', value: String(data.processed ?? 0), icon: Banknote, color: 'green' as const },
          { title: 'Paid', value: String(data.paid ?? 0), icon: Banknote, color: 'purple' as const },
          { title: 'Pending', value: String(data.pending ?? 0), icon: Banknote, color: 'yellow' as const },
        ]);
      } catch {
        console.error('Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading payroll...</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Month/Year</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Base Salary</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Allowances</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Deductions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Net Pay</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {payroll.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">No payroll records found</td>
                  </tr>
                ) : (
                  payroll.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.employeeName}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.month} {row.year}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatCurrency(row.baseSalary)}</td>
                      <td className="py-3 px-4 text-green-600 whitespace-nowrap">{formatCurrency(row.allowances)}</td>
                      <td className="py-3 px-4 text-red-600 whitespace-nowrap">{formatCurrency(row.deductions)}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{formatCurrency(row.netSalary)}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : row.status === 'Processed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
