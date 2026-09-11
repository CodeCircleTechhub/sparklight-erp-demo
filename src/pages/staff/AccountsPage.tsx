import { useState } from 'react';
import {
  DollarSign,
  Clock,
  FileText,
  Save,
  Search,
  Download,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';

const stats = [
  { label: "Today's Collections", value: '₦12,450', icon: DollarSign, color: 'bg-emerald-500', change: '+12%' },
  { label: 'Pending Payments', value: '₦8,200', icon: Clock, color: 'bg-amber-500', change: '-5%' },
  { label: 'Insurance Claims', value: '₦15,600', icon: FileText, color: 'bg-blue-500', change: '+8%' },
];

const pendingPayments = [
  { patient: 'John Smith', amount: '₦450.00', type: 'Consultation + Lab', date: 'Sep 11, 2026', status: 'pending' },
  { patient: 'Emily Davis', amount: '₦1,200.00', type: 'Surgery', date: 'Sep 10, 2026', status: 'overdue' },
  { patient: 'Michael Brown', amount: '₦320.00', type: 'Prescription', date: 'Sep 11, 2026', status: 'pending' },
  { patient: 'Sarah Wilson', amount: '₦780.00', type: 'Imaging + Consultation', date: 'Sep 09, 2026', status: 'overdue' },
  { patient: 'David Lee', amount: '₦250.00', type: 'Lab Tests', date: 'Sep 11, 2026', status: 'pending' },
  { patient: 'Anna Martinez', amount: '₦950.00', type: 'Maternity Package', date: 'Sep 08, 2026', status: 'overdue' },
];

const revenueByDepartment = [
  { department: 'Cardiology', amount: 4200, percentage: 34 },
  { department: 'Orthopedics', amount: 2800, percentage: 22 },
  { department: 'General', amount: 2100, percentage: 17 },
  { department: 'Pediatrics', amount: 1800, percentage: 14 },
  { department: 'Emergency', amount: 1550, percentage: 13 },
];

export default function AccountsPage() {
  const [receiptForm, setReceiptForm] = useState({
    patient: '',
    amount: '',
    method: '',
    reference: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setReceiptForm({ ...receiptForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage payments, billing, and financial reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">{stat.change} from yesterday</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ₦{stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Payments Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending Payments</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingPayments.map((payment, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium text-gray-900 text-sm">{payment.patient}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-gray-900 text-sm">{payment.amount}</p>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-500">{payment.type}</p>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ₦{
                          payment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status === 'overdue' ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Receipt Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Payment</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                <input
                  type="text"
                  name="patient"
                  value={receiptForm.patient}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={receiptForm.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                <select
                  name="method"
                  value={receiptForm.method}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <input
                  type="text"
                  name="reference"
                  value={receiptForm.reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Transaction reference"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={receiptForm.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Additional notes..."
                />
              </div>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Record Payment
              </button>
            </div>
          </div>
        </div>

        {/* Revenue by Department */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue by Department</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {revenueByDepartment.map((dept) => (
              <div key={dept.department} className="flex items-center gap-4">
                <div className="w-32 shrink-0">
                  <p className="text-sm font-medium text-gray-700">{dept.department}</p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-3 transition-all"
                      style={{ width: `₦{dept.percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">₦{dept.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{dept.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
