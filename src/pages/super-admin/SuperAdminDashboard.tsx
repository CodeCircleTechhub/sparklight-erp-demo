import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  UserCog,
  ClipboardList,
  DollarSign,
  Calendar,
  BedDouble,
  FlaskConical,
  CreditCard,
  UserPlus,
  CalendarPlus,
  UserCheck,
  FileText,
  Loader2,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import EmergencyPanel from '../../components/shared/EmergencyPanel';
import { BarChart, GroupedBarChart, DonutChart, formatNaira, formatNairaCompact } from '../../components/charts/Charts';

function registrationSeries(patients: any[]): { label: string; value: number }[] {
  const now = new Date();
  const times = patients
    .map((p) => new Date(p.createdAt).getTime())
    .filter((t) => !Number.isNaN(t));
  const earliest = times.length ? Math.min(...times) : now.getTime();
  const spanDays = (now.getTime() - earliest) / 86_400_000;

  if (spanDays > 62) {
    return Array.from({ length: 6 }, (_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
      const value = patients.filter((p) => {
        const t = new Date(p.createdAt).getTime();
        return t >= start.getTime() && t < end.getTime();
      }).length;
      return { label: start.toLocaleDateString('en-US', { month: 'short' }), value };
    });
  }

  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (6 - i));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const value = patients.filter((p) => {
      const t = new Date(p.createdAt).getTime();
      return t >= start.getTime() && t < end.getTime();
    }).length;
    return { label: start.toLocaleDateString('en-US', { weekday: 'short' }), value };
  });
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<{ title: string; value: string; icon: typeof Users; color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'; trend?: { value: string; isPositive: boolean } }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ time: string; user: string; action: string; details: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertEmailSaved, setAlertEmailSaved] = useState('');
  const [alertEmailError, setAlertEmailError] = useState('');
  const [savingAlertEmail, setSavingAlertEmail] = useState(false);
  const [summary, setSummary] = useState<any>({});
  const [admStats, setAdmStats] = useState<any>({});
  const [discharges, setDischarges] = useState<any[]>([]);
  const [regChart, setRegChart] = useState<{ label: string; value: number }[]>([]);

  const quickActions = [
    { label: 'Register Patient', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600', path: '/admin/patients/register' },
    { label: 'Schedule Appointment', icon: CalendarPlus, color: 'bg-green-500 hover:bg-green-600', path: '/admin/appointments' },
    { label: 'Create Staff', icon: UserCheck, color: 'bg-purple-500 hover:bg-purple-600', path: '/admin/staff/add' },
    { label: 'Generate Report', icon: FileText, color: 'bg-amber-500 hover:bg-amber-600', path: '/admin/reports' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [patientsRes, usersRes, visitsRes, appointmentsRes, outstandingRes, auditRes, billingRes, admissionsRes, dischargesRes, labRes] = await Promise.all([
          api.get('/patients').catch(() => ({ data: {} })),
          api.get('/users').catch(() => ({ data: {} })),
          api.get('/visits').catch(() => ({ data: {} })),
          api.get('/appointments').catch(() => ({ data: {} })),
          api.get('/billing/outstanding').catch(() => ({ data: {} })),
          api.get('/system/audit-logs').catch(() => ({ data: {} })),
          api.get('/billing/summary').catch(() => ({ data: {} })),
          api.get('/admissions/stats').catch(() => ({ data: {} })),
          api.get('/admissions', { params: { status: 'Discharged', limit: 5 } }).catch(() => ({ data: {} })),
          api.get('/laboratory').catch(() => ({ data: {} })),
        ]);

        const patientList = patientsRes.data.patients || [];
        setRegChart(registrationSeries(patientList));
        setSummary(billingRes.data || {});
        setAdmStats(admissionsRes.data || {});
        setDischarges((dischargesRes.data.items || []).slice(0, 5));

        const totalPatients = patientsRes.data.total ?? 0;
        const activeStaff = (usersRes.data.users || [])
          .filter((u: any) => u.isActive !== false && u.role !== 'patient' && u.role !== 'super-admin').length;
        const pendingLab = labRes.data.pending ?? 0;
        const todayVisits = visitsRes.data.todayVisits ?? 0;
        const todayRevenue = billingRes.data.todayCollected ?? 0;
        const todayBilled = billingRes.data.todayBilled ?? 0;
        const appointments = appointmentsRes.data.upcoming ?? 0;
        const admitted = admissionsRes.data.admitted ?? 0;
        const dischargedToday = admissionsRes.data.dischargedToday ?? 0;
        const outstandingBills = billingRes.data.outstanding ?? outstandingRes.data.totalAmount ?? 0;

        setStats([
          { title: 'Total Patients', value: totalPatients.toLocaleString(), icon: Users, color: 'blue', trend: { value: `+${patientsRes.data.newThisMonth ?? 0}`, isPositive: true } },
          { title: 'Active Staff', value: activeStaff.toLocaleString(), icon: UserCog, color: 'green' },
          { title: "Today's Visits", value: todayVisits.toLocaleString(), icon: ClipboardList, color: 'purple' },
          { title: "Today's Revenue", value: formatNaira(todayRevenue), icon: DollarSign, color: 'green', trend: { value: `${formatNaira(todayBilled)} billed`, isPositive: true } },
          { title: 'Appointments', value: appointments.toLocaleString(), icon: Calendar, color: 'blue' },
          { title: 'Admitted Patients', value: admitted.toLocaleString(), icon: BedDouble, color: 'yellow', trend: dischargedToday ? { value: `+${dischargedToday} out today`, isPositive: true } : undefined },
          { title: 'Pending Lab Requests', value: pendingLab.toLocaleString(), icon: FlaskConical, color: 'red' },
          { title: 'Outstanding Bills', value: formatNaira(outstandingBills), icon: CreditCard, color: 'red', trend: { value: `${(billingRes.data.counts?.pending ?? 0) + (billingRes.data.counts?.overdue ?? 0)} invoices`, isPositive: false } },
        ]);

        const logs = auditRes.data.logs ?? [];
        setRecentActivity(
          logs.slice(0, 8).map((log: any) => ({
            time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            user: log.user ?? 'System',
            action: log.action ?? '',
            details: log.record ?? '',
          }))
        );
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    api
      .get('/system/settings/alert-email')
      .then(({ data }) => setAlertEmail(data.email || ''))
      .catch(() => setAlertEmail(''));
  }, []);

  const saveAlertEmail = async () => {
    const value = alertEmail.trim();
    if (!value) {
      setAlertEmailError('Enter an email address');
      return;
    }
    setSavingAlertEmail(true);
    setAlertEmailError('');
    setAlertEmailSaved('');
    try {
      const { data } = await api.put('/system/settings/alert-email', { email: value });
      setAlertEmail(value);
      setAlertEmailSaved(data.message || 'Alert inbox updated');
    } catch (err: any) {
      setAlertEmailError(err.response?.data?.message || 'Failed to update alert inbox');
    } finally {
      setSavingAlertEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName || 'Super Admin'}</h1>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <ApplyLeaveButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <EmergencyPanel canRemove />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-red-100 flex-shrink-0">
              <Mail className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Issue alert inbox</h2>
              <p className="text-sm text-gray-500">
                Urgent alerts and management notifications are copied to this address. You can change it any time.
              </p>
            </div>
          </div>
          <Link
            to="/admin/notifications"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 flex-shrink-0"
          >
            Manage notifications <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="alerts@yourhospital.com"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={saveAlertEmail}
            disabled={savingAlertEmail}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {savingAlertEmail ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Save inbox
          </button>
        </div>

        {alertEmailError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {alertEmailError}
          </p>
        )}
        {alertEmailSaved && (
          <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> {alertEmailSaved}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Registration</h2>
            <span className="text-xs font-medium text-gray-400">Last {regChart.length > 7 ? '6 months' : '7 days'}</span>
          </div>
          <div className="h-64">
            {regChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No data yet</div>
            ) : (
              <BarChart data={regChart} color="#3b82f6" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Billed
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Collected
              </span>
            </div>
          </div>
          <div className="h-64">
            {Array.isArray(summary.week) && summary.week.length ? (
              <GroupedBarChart
                data={summary.week.map((d: any) => ({
                  label: d.label,
                  values: [d.billed || 0, d.collected || 0],
                }))}
                series={[
                  { name: 'Billed', color: '#3b82f6' },
                  { name: 'Collected', color: '#10b981' },
                ]}
                formatValue={formatNairaCompact}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No billing data yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Billing Status</h2>
            <span className="text-xs font-medium text-gray-400">All invoices</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <DonutChart
              segments={[
                { label: 'Paid', value: summary.totalPaid || 0, color: '#10b981' },
                { label: 'Pending', value: summary.totalPending || 0, color: '#f59e0b' },
                { label: 'Overdue', value: summary.totalOverdue || 0, color: '#ef4444' },
              ]}
              totalLabel="Billed"
              formatValue={formatNaira}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Discharges</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Today <span className="font-semibold text-gray-900">{admStats.dischargedToday ?? 0}</span>
            </span>
            <span>
              This week <span className="font-semibold text-gray-900">{admStats.dischargedThisWeek ?? 0}</span>
            </span>
            <span>
              Total <span className="font-semibold text-gray-900">{admStats.discharged ?? 0}</span>
            </span>
          </div>
        </div>
        {discharges.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">No patients discharged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Admission</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Ward</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Discharged</th>
                </tr>
              </thead>
              <tbody>
                {discharges.map((d: any) => (
                  <tr key={d._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{d.patientName}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{d.admissionId}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{d.ward || '—'}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{d.doctorName || '—'}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                      {d.dischargeDate
                        ? new Date(d.dischargeDate).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">No recent activity</td>
                </tr>
              ) : (
                recentActivity.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.user}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.action}</td>
                    <td className="py-3 px-4 text-gray-500">{row.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white rounded-xl p-6 flex flex-col items-center gap-3 transition-colors cursor-pointer active:scale-95`}
            >
              <action.icon className="w-7 h-7" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}