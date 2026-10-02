import { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, Users, CheckCircle, Clock, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

const getStatus = (rec: any) => (rec ? rec.status : 'Not Generated');
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Processed':
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function AccountantPayroll() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState('');
  const [busyRow, setBusyRow] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [empRes, payRes] = await Promise.all([
        api.get('/hr/employees', { params: { isActive: 'true' } }),
        api.get('/hr/payroll', { params: { month, year } }),
      ]);
      setEmployees(empRes.data.employees || []);
      setRecords(payRes.data.payroll || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const list: { emp: any; rec: any }[] = employees.map((emp) => ({
      emp,
      rec: records.find((r) => String(r.employee?._id || r.employee) === String(emp._id)) || null,
    }));
    const empIds = new Set(employees.map((e) => String(e._id)));
    records.forEach((r) => {
      const id = String(r.employee?._id || r.employee || '');
      if (id && !empIds.has(id)) list.push({ emp: r.employee || {}, rec: r });
    });
    return list;
  }, [employees, records]);

  const netOf = (row: { emp: any; rec: any }) =>
    row.rec ? row.rec.netSalary || 0 : row.emp?.salary || 0;

  const paidRows = rows.filter((r) => r.rec?.status === 'Paid');
  const totalPayroll = rows.reduce((s, r) => s + netOf(r), 0);
  const paidAmount = paidRows.reduce((s, r) => s + (r.rec?.netSalary || 0), 0);
  const pendingAmount = totalPayroll - paidAmount;

  const stats = [
    { label: 'Active Staff', value: String(rows.length), icon: Users, color: 'bg-[#3b82f6]' },
    { label: `${month} Payroll`, value: money(totalPayroll), icon: Wallet, color: 'bg-emerald-500' },
    { label: `Paid (${paidRows.length})`, value: money(paidAmount), icon: CheckCircle, color: 'bg-purple-500' },
    { label: 'Pending', value: money(pendingAmount), icon: Clock, color: 'bg-amber-500' },
  ];

  const buildPayload = (emp: any) => ({
    employee: emp._id,
    employeeName: emp.fullName || '',
    month,
    year,
    baseSalary: emp.salary || 0,
    allowances: 0,
    deductions: 0,
    netSalary: emp.salary || 0,
    status: 'Pending',
  });

  const upsertRecord = (rec: any) => {
    setRecords((prev) =>
      prev.some((r) => r._id === rec._id) ? prev.map((r) => (r._id === rec._id ? rec : r)) : [...prev, rec]
    );
  };

  const generate = async () => {
    if (busy) return;
    setBusy('generate');
    setNotice(null);
    try {
      let created = 0;
      for (const row of rows) {
        if (row.rec || !row.emp?._id) continue;
        await api.post('/hr/payroll', buildPayload(row.emp));
        created += 1;
      }
      await load();
      setNotice({
        type: 'ok',
        text: created
          ? `${created} payroll record(s) generated for ${month} ${year}.`
          : `All staff already have payroll records for ${month} ${year}.`,
      });
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to generate payroll' });
    } finally {
      setBusy('');
    }
  };

  const markPaid = async (row: { emp: any; rec: any }) => {
    if (busy || busyRow) return;
    const key = String(row.emp?._id || row.rec?._id || '');
    setBusyRow(key);
    setNotice(null);
    try {
      let current = row.rec;
      if (!current) {
        if (!row.emp?._id) throw new Error('No staff record for this row');
        const { data } = await api.post('/hr/payroll', buildPayload(row.emp));
        current = data.record;
      }
      const { data } = await api.post(`/hr/payroll/${current._id}/pay`);
      upsertRecord(data.record);
      setNotice({
        type: 'ok',
        text: `${row.emp?.fullName || data.record.employeeName || 'Staff'} paid for ${month} ${year}. Notification and email sent.`,
      });
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || err.message || 'Failed to mark paid' });
    } finally {
      setBusyRow('');
    }
  };

  const payAll = async () => {
    if (busy) return;
    setBusy('pay-all');
    setNotice(null);
    let paid = 0;
    let failed = 0;
    for (const row of rows) {
      if (row.rec?.status === 'Paid') continue;
      try {
        let current = row.rec;
        if (!current) {
          if (!row.emp?._id) continue;
          const { data } = await api.post('/hr/payroll', buildPayload(row.emp));
          current = data.record;
        }
        await api.post(`/hr/payroll/${current._id}/pay`);
        paid += 1;
      } catch {
        failed += 1;
      }
    }
    await load();
    setNotice({
      type: failed ? 'err' : 'ok',
      text: failed
        ? `Paid ${paid} record(s), ${failed} failed for ${month} ${year}.`
        : `${paid} record(s) paid for ${month} ${year}. Notifications and emails sent to staff.`,
    });
    setBusy('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Payroll" icon={Wallet} description={`Process staff salaries for ${month} ${year}`} />
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {notice.text}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={generate}
              disabled={!!busy || loading}
              className="px-5 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {busy === 'generate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              Generate Payroll
            </button>
            <button
              onClick={payAll}
              disabled={!!busy || loading}
              className="px-5 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {busy === 'pay-all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Pay All Unpaid
            </button>
          </div>
        </div>

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
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading payroll...
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Staff ID', 'Name', 'Basic Salary', 'Allowances', 'Deductions', 'Net Pay', 'Status', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const rec = row.rec;
                    const status = getStatus(rec);
                    const rowKey = String(row.emp?._id || rec?._id || '');
                    return (
                      <tr key={rowKey} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{row.emp?.staffId || rec?.employeeName || '—'}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{row.emp?.fullName || rec?.employeeName || '—'}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{money(rec ? rec.baseSalary || 0 : row.emp?.salary || 0)}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{money(rec ? rec.allowances || 0 : 0)}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{money(rec ? rec.deductions || 0 : 0)}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{money(netOf(row))}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={status} color={getStatusColor(status) as any} />
                          {rec?.status === 'Paid' && rec.paidDate && (
                            <p className="text-xs text-gray-400 mt-1">{fmtDate(rec.paidDate)}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {status === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => markPaid(row)}
                              disabled={!!busy || !!busyRow}
                              className="px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1.5 disabled:opacity-60"
                            >
                              {busyRow === rowKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                        No active staff found — generate payroll to begin
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
