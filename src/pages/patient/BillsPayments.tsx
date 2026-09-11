import {
  CreditCard,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

const bills = [
  { id: 'BL-2026-001', date: 'September 8, 2026', description: 'Consultation - Dr. Ahmed', amount: 5000, status: 'Pending' },
  { id: 'BL-2026-002', date: 'September 2, 2026', description: 'Laboratory Services', amount: 5000, status: 'Pending' },
  { id: 'BL-2026-003', date: 'August 20, 2026', description: 'Follow-up Visit', amount: 3000, status: 'Pending' },
  { id: 'BL-2026-004', date: 'August 5, 2026', description: 'Emergency Visit', amount: 8000, status: 'Paid' },
  { id: 'BL-2026-005', date: 'July 15, 2026', description: 'Annual Physical', amount: 12000, status: 'Paid' },
  { id: 'BL-2026-006', date: 'July 10, 2026', description: 'Lab Tests', amount: 12000, status: 'Paid' },
];

const paymentHistory = [
  { id: 'PAY-001', date: 'August 10, 2026', billId: 'BL-2026-004', amount: 8000, method: 'Credit Card' },
  { id: 'PAY-002', date: 'July 20, 2026', billId: 'BL-2026-005', amount: 12000, method: 'Bank Transfer' },
  { id: 'PAY-003', date: 'July 15, 2026', billId: 'BL-2026-006', amount: 12000, method: 'Credit Card' },
];

const totalBill = 45000;
const paidAmount = 32000;
const outstanding = totalBill - paidAmount;
const progress = (paidAmount / totalBill) * 100;

export default function BillsPayments() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Outstanding Balance</p>
              <p className="text-3xl font-bold">${outstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <span>Total Billed: ${totalBill.toLocaleString()}</span>
            <span>·</span>
            <span>Paid: ${paidAmount.toLocaleString()}</span>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2.5">
            <div
              className="bg-white rounded-full h-2.5 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-1">{Math.round(progress)}% paid</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Bills</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Bill ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{bill.id}</td>
                    <td className="px-6 py-4 text-gray-500">{bill.date}</td>
                    <td className="px-6 py-4 text-gray-700">{bill.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">${bill.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                        bill.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {bill.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {bill.status === 'Pending' && (
                        <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          Pay Now
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Payment ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Bill ID</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 text-gray-500">{payment.date}</td>
                    <td className="px-6 py-4 text-gray-700">{payment.billId}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">${payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{payment.method}</td>
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
