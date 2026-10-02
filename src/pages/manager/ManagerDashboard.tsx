import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users, Calendar, Stethoscope, Building2, BedDouble,
  ArrowUpRight, DollarSign, AlertCircle, Activity,
  UserPlus, BarChart3, UserCog, Settings, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import { GroupedBarChart, formatNaira, formatNairaCompact } from '../../components/charts/Charts';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<{ title: string; value: string; icon: typeof Users; color: string; change?: string; trend?: 'up' | 'down' }[]>([]);
  const [departments, setDepartments] = useState<{ name: string; staff: number; patients: number; revenue: string }[]>([]);
  const [recentVisits, setRecentVisits] = useState<{ id: string; patient: string; department: string; doctor: string; time: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<any>({});
  const [admStats, setAdmStats] = useState<any>({});
  const [discharges, setDischarges] = useState<any[]>([]);

  const quickActions = [
    { title: 'Patient Registration', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600', path: '/manager/patients' },
    { title: 'View Reports', icon: BarChart3, color: 'bg-emerald-500 hover:bg-emerald-600', path: '/manager/reports' },
    { title: 'Manage Staff', icon: UserCog, color: 'bg-violet-500 hover:bg-violet-600', path: '/manager/staff' },
    { title: 'Hospital Settings', icon: Settings, color: 'bg-amber-500 hover:bg-amber-600', path: '/manager/settings' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [patientsRes, visitsRes, usersRes, departmentsRes, billingRes, admissionsRes, dischargesRes] = await Promise.all([
          api.get('/patients').catch(() => ({ data: {} })),
          api.get('/visits').catch(() => ({ data: {} })),
          api.get('/users').catch(() => ({ data: {} })),
          api.get('/departments').catch(() => ({ data: {} })),
          api.get('/billing/summary').catch(() => ({ data: {} })),
          api.get('/admissions/stats').catch(() => ({ data: {} })),
          api.get('/admissions', { params: { status: 'Discharged', limit: 5 } }).catch(() => ({ data: {} })),
        ]);

        setBilling(billingRes.data || {});
        setAdmStats(admissionsRes.data || {});
        setDischarges((dischargesRes.data.items || []).slice(0, 5));

        const totalPatients = patientsRes.data.total ?? 0;
        const todayVisits = visitsRes.data.todayVisits ?? 0;
        const activeStaff = (usersRes.data.users || [])
          .filter((u: any) => u.isActive !== false && u.role !== 'patient' && u.role !== 'super-admin').length;
        const departmentList = departmentsRes.data.departments ?? departmentsRes.data ?? [];
        const deptCount = Array.isArray(departmentList) ? departmentList.length : 0;
        const admissions = admissionsRes.data.admitted ?? 0;
        const discharges = admissionsRes.data.discharged ?? 0;
        const dischargedToday = admissionsRes.data.dischargedToday ?? 0;
        const todayRevenue = billingRes.data.todayCollected ?? 0;
        const outstandingBills = billingRes.data.outstanding ?? 0;

        setStats([
          { title: 'Total Patients', value: totalPatients.toLocaleString(), icon: Users, color: 'bg-blue-500', change: `+${patientsRes.data.newThisMonth ?? 0} new`, trend: 'up' },
          { title: "Today's Visits", value: todayVisits.toLocaleString(), icon: Calendar, color: 'bg-emerald-500' },
          { title: 'Active Staff', value: activeStaff.toLocaleString(), icon: Stethoscope, color: 'bg-violet-500' },
          { title: 'Departments', value: deptCount.toLocaleString(), icon: Building2, color: 'bg-amber-500' },
          { title: 'Admissions', value: admissions.toLocaleString(), icon: BedDouble, color: 'bg-cyan-500' },
          { title: 'Discharges', value: discharges.toLocaleString(), icon: ArrowUpRight, color: 'bg-pink-500', change: `+${dischargedToday} today`, trend: dischargedToday > 0 ? 'up' : 'down' },
          { title: 'Revenue', value: formatNaira(todayRevenue), icon: DollarSign, color: 'bg-green-500', change: `${formatNaira(billingRes.data.todayBilled ?? 0)} billed`, trend: 'up' },
          { title: 'Outstanding Bills', value: formatNaira(outstandingBills), icon: AlertCircle, color: 'bg-red-500', change: `${billingRes.data.counts?.pending ?? 0} pending`, trend: 'down' },
        ]);

        if (Array.isArray(departmentList)) {
          setDepartments(departmentList.map((d: any) => ({
            name: d.name ?? d.departmentName ?? 'Unknown',
            staff: d.staff ?? d.staffCount ?? 0,
            patients: d.patients ?? d.patientCount ?? 0,
            revenue: `₦${(d.revenue ?? 0).toLocaleString()}`,
          })));
        }

        const visits = visitsRes.data.visits ?? visitsRes.data.recentVisits ?? [];
        if (Array.isArray(visits)) {
          setRecentVisits(visits.slice(0, 5).map((v: any) => ({
            id: v.id ?? v.visitId ?? v._id ?? '',
            patient: v.patient ?? `${v.patientFirstName ?? ''} ${v.patientSurname ?? ''}`.trim() ?? 'Unknown',
            department: v.department ?? v.departmentName ?? '',
            doctor: v.doctor ?? v.doctorName ?? '',
            time: v.time ?? v.createdAt ? new Date(v.time ?? v.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            status: v.status ?? 'Pending',
          })));
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.fullName || 'Hospital Manager'}</h1>
            <p className="text-blue-100 mt-1">Here's your hospital overview for today.</p>
          </div>
          <ApplyLeaveButton className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg text-sm font-medium transition-colors" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                {card.trend && card.change && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {card.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            {departments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No departments found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div key={dept.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Staff</span>
                        <span className="font-medium text-gray-900">{dept.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patients Today</span>
                        <span className="font-medium text-gray-900">{dept.patients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span className="font-medium text-green-600">{dept.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className={`w-full ${action.color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-all active:scale-95 cursor-pointer`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Billing & Discharges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Billed vs Collected (7 days)</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Billed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Collected
                </span>
                <span>
                  Total collected{' '}
                  <span className="font-semibold text-gray-900">{formatNaira(billing.totalPaid ?? 0)}</span>
                </span>
              </div>
            </div>
            <div className="h-56">
              {Array.isArray(billing.week) && billing.week.length ? (
                <GroupedBarChart
                  data={billing.week.map((d: any) => ({
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
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No billing data yet
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Discharges</h2>
              <span className="text-xs font-medium text-gray-400">
                {admStats.dischargedToday ?? 0} today
              </span>
            </div>
            {discharges.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No discharges yet</p>
            ) : (
              <ul className="space-y-3">
                {discharges.map((d: any) => (
                  <li key={d._id} className="flex items-start justify-between gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{d.patientName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {d.admissionId} {d.ward ? `· ${d.ward}` : ''} {d.doctorName ? `· ${d.doctorName}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {d.dischargeDate
                        ? new Date(d.dischargeDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Visits Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Visits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Visit ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Doctor</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVisits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">No recent visits</td>
                  </tr>
                ) : (
                  recentVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{visit.id}</td>
                      <td className="py-3 text-gray-900">{visit.patient}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{visit.department}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{visit.doctor}</td>
                      <td className="py-3 text-gray-600">{visit.time}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[visit.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
