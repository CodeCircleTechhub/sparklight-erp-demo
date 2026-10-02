import { useState } from 'react';
import { FileText, Users, CalendarOff, DollarSign, Download, Loader2, Printer, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { downloadReport } from '../../utils/downloadReport';

export default function StaffReports() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [downloading, setDownloading] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const downloadPdf = async (type: string, title: string) => {
    if (downloading || loading) return;
    if (fromDate && toDate && fromDate > toDate) {
      setNotice({ type: 'err', text: 'From date must be on or before To date.' });
      return;
    }
    setDownloading(type);
    setNotice(null);
    try {
      await downloadReport(`hr-${type}`, {
        from: fromDate || undefined,
        to: toDate || undefined,
        fileName: `HR_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setNotice({ type: 'ok', text: `${title} downloaded as PDF.` });
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to generate the report' });
    } finally {
      setDownloading('');
    }
  };

  const generateReport = async (type: string) => {
    try {
      setLoading(true);
      setReportType(type);
      setShowReport(true);
      const params: Record<string, string> = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      let res;
      switch (type) {
        case 'staff':
          res = await api.get('/hr/reports/staff-summary');
          setReportData(res.data);
          break;
        case 'attendance':
          res = await api.get('/hr/reports/attendance-summary', { params });
          setReportData(res.data);
          break;
        case 'leave':
          res = await api.get('/hr/reports/leave-summary');
          setReportData(res.data);
          break;
        case 'payroll':
          res = await api.get('/hr/reports/payroll-summary', { params });
          setReportData(res.data);
          break;
      }
    } catch (err: any) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    { title: 'Staff Count Report', description: 'Overview of staff distribution by department, role, and status', icon: Users, color: 'bg-[#3b82f6]', type: 'staff' },
    { title: 'Attendance Report', description: 'Daily, weekly, and monthly attendance analytics', icon: CalendarOff, color: 'bg-emerald-500', type: 'attendance' },
    { title: 'Leave Report', description: 'Leave requests, approvals, and balance summary', icon: FileText, color: 'bg-purple-500', type: 'leave' },
    { title: 'Payroll Report', description: 'Salary disbursements, deductions, and tax summaries', icon: DollarSign, color: 'bg-amber-500', type: 'payroll' },
  ];

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
        </div>
      );
    }

    if (!reportData) return null;

    switch (reportType) {
      case 'staff':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{reportData.total}</p>
                <p className="text-gray-500 text-sm">Total Staff</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{reportData.active}</p>
                <p className="text-gray-500 text-sm">Active</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <p className="text-3xl font-bold text-red-600">{reportData.inactive}</p>
                <p className="text-gray-500 text-sm">Inactive</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">By Role</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(reportData.byRole || {}).map(([role, count]: [string, any]) => (
                  <div key={role} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                    <p className="text-gray-500 text-sm capitalize">{role.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">By Department</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(reportData.byDepartment || {}).map(([dept, count]: [string, any]) => (
                  <div key={dept} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                    <p className="text-gray-500 text-sm">{dept}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{reportData.total}</p>
                <p className="text-gray-500 text-sm">Total Records</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{reportData.present}</p>
                <p className="text-gray-500 text-sm">Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <p className="text-3xl font-bold text-red-600">{reportData.absent}</p>
                <p className="text-gray-500 text-sm">Absent</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-3xl font-bold text-amber-600">{reportData.late}</p>
                <p className="text-gray-500 text-sm">Late</p>
              </div>
            </div>
            {reportData.records?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Records</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Staff</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Date</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.records.slice(0, 10).map((r: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-sm">{r.employee?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              r.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                              r.status === 'Absent' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'leave':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{reportData.total}</p>
                <p className="text-gray-500 text-sm">Total Requests</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-3xl font-bold text-amber-600">{reportData.pending}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{reportData.approved}</p>
                <p className="text-gray-500 text-sm">Approved</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <p className="text-3xl font-bold text-red-600">{reportData.rejected}</p>
                <p className="text-gray-500 text-sm">Rejected</p>
              </div>
            </div>
            {reportData.records?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Leave Records</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Staff</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Type</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Start</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.records.slice(0, 10).map((r: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-sm">{r.employee?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">{r.leaveType || r.type || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">{r.startDate || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                              r.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'payroll':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{reportData.totalRecords}</p>
                <p className="text-gray-500 text-sm">Total Records</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">₦{(reportData.totalAmount / 1000).toFixed(0)}k</p>
                <p className="text-gray-500 text-sm">Total Amount</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{reportData.paid}</p>
                <p className="text-gray-500 text-sm">Paid</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-3xl font-bold text-amber-600">{reportData.pending}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
            {reportData.records?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Payroll Records</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Staff</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Month/Year</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Amount</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.records.slice(0, 10).map((r: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-sm">{r.employee?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">{r.month} {r.year}</td>
                          <td className="px-4 py-3 text-sm font-medium">₦{(r.netPay || r.basicSalary || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              r.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Staff Reports" icon={FileText} />
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => downloadPdf(reportType || 'staff', reports.find((r) => r.type === (reportType || 'staff'))?.title || 'Report')}
              disabled={!!downloading || loading}
              className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PDF
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-6 ${
              notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {notice.text}
          </div>
        )}

        {!showReport ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reports.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className={`${r.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{r.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateReport(r.type)}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Report
                    </button>
                    <button
                      onClick={() => downloadPdf(r.type, r.title)}
                      disabled={!!downloading || loading}
                      title="Download PDF"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {downloading === r.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {reports.find(r => r.type === reportType)?.title}
                </h2>
                <span className="text-sm text-gray-500">
                  {fromDate && toDate ? `${fromDate} to ${toDate}` : 'All dates'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadPdf(reportType, reports.find((r) => r.type === reportType)?.title || 'Report')}
                  disabled={!!downloading}
                  className="px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg text-sm hover:bg-emerald-50 flex items-center gap-2 disabled:opacity-60"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => { setShowReport(false); setReportData(null); }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Back to Reports
                </button>
              </div>
            </div>
            <div className="p-6">
              {renderReportContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
