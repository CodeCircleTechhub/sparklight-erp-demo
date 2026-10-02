import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Stethoscope,
  HeartPulse,
  Building2,
  CalendarOff,
  UserPlus,
  Search,
  Download,
  Clock,
  FileText,
  ClipboardList,
  Activity,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Printer,
  Mail,
  Banknote,
  Wallet,
} from 'lucide-react';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';

export default function HRDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [empRes, leaveRes, deptRes, payrollRes, attRes] = await Promise.all([
        api.get('/hr/employees'),
        api.get('/hr/leave'),
        api.get('/departments'),
        api.get('/hr/payroll'),
        api.get('/hr/attendance'),
      ]);
      setEmployees(empRes.data.employees ?? []);
      setLeaveRequests((leaveRes.data.leaves ?? []).slice(0, 5));
      setDepartments(deptRes.data.departments ?? deptRes.data ?? []);
      setPayroll(payrollRes.data.payroll ?? []);
      setAttendance(attRes.data.attendance ?? []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.isActive).length;
  const doctors = employees.filter((e) => e.role === 'doctor').length;
  const nurses = employees.filter((e) => e.role === 'nurse').length;

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const totalPayroll = payroll.reduce((sum, p) => sum + (p.netPay || p.basicSalary || 0), 0);
  const paidPayroll = payroll.filter((p) => p.status === 'Paid').length;
  const pendingPayroll = payroll.filter((p) => p.status === 'Pending' || p.status === 'Processed').length;

  const todayAttendance = attendance.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  });
  const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
  const absentToday = todayAttendance.filter((a) => a.status === 'Absent').length;

  const departmentCounts = departments.map((dept: any) => {
    const name = dept.name || dept.department || dept;
    const count = employees.filter((e) => e.department === name).length;
    const icons = [HeartPulse, Activity, Briefcase, ClipboardList, Shield, Building2];
    const colors = ['bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
    const idx = departments.indexOf(dept);
    return { department: name, count, icon: icons[idx % icons.length], color: colors[idx % colors.length] };
  });

  const statCards = [
    { title: 'Total Staff', value: totalEmployees, icon: Users, color: 'bg-[#3b82f6]', subtext: `${activeEmployees} active` },
    { title: 'Doctors', value: doctors, icon: Stethoscope, color: 'bg-emerald-500', subtext: 'Medical staff' },
    { title: 'Nurses', value: nurses, icon: HeartPulse, color: 'bg-purple-500', subtext: 'Nursing staff' },
    { title: 'Pending Leaves', value: pendingLeaves, icon: CalendarOff, color: 'bg-amber-500', subtext: 'Awaiting review' },
    { title: 'Payroll Total', value: `₦${(totalPayroll / 1000).toFixed(0)}k`, icon: Wallet, color: 'bg-cyan-500', subtext: `${payroll.length} records` },
    { title: 'Present Today', value: presentToday, icon: Clock, color: 'bg-emerald-500', subtext: `${absentToday} absent` },
  ];

  const quickActions = [
    { title: 'Apply for Leave', icon: CalendarOff, color: 'bg-purple-500', action: 'applyLeave' },
    { title: 'Add Employee', icon: UserPlus, color: 'bg-[#3b82f6]', path: '/hr/add-employee' },
    { title: 'Attendance', icon: Clock, color: 'bg-emerald-500', path: '/hr/attendance' },
    { title: 'Leave Management', icon: CalendarOff, color: 'bg-amber-500', path: '/hr/leave' },
    { title: 'Payroll', icon: Banknote, color: 'bg-cyan-500', path: '/hr/payroll' },
    { title: 'Staff Reports', icon: FileText, color: 'bg-red-500', path: '/hr/reports' },
    { title: 'Generate Letters', icon: Printer, color: 'bg-pink-500', path: '/hr/employees' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return CheckCircle;
      case 'Pending':
        return AlertCircle;
      case 'Rejected':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName || 'HR Manager'}</h1>
            <p className="text-gray-500 text-sm mt-1">Human Resources Management Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <ApplyLeaveButton
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
              onSubmitted={() => fetchDashboard()}
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-gray-500 text-xs mt-1">{card.title}</p>
                {card.subtext && <p className="text-gray-400 text-xs mt-0.5">{card.subtext}</p>}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => {
                    if ('path' in action && action.path) {
                      navigate(action.path);
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#3b82f6] hover:bg-blue-50 transition-all group bg-white"
                >
                  <div className={`${action.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#3b82f6] transition-colors text-center">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Staff by Department + Payroll Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Department Staff */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Staff by Department</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {departmentCounts.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <div
                      key={dept.department}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#3b82f6] hover:bg-blue-50 transition-all cursor-pointer group"
                    >
                      <div className={`${dept.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{dept.count}</p>
                        <p className="text-gray-500 text-xs">{dept.department}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payroll Overview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Payroll Overview</h2>
                <button onClick={() => navigate('/hr/payroll')} className="text-[#3b82f6] text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">₦{(totalPayroll / 1000).toFixed(0)}k</p>
                  <p className="text-gray-500 text-xs mt-1">Total Payroll</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{paidPayroll}</p>
                  <p className="text-gray-500 text-xs mt-1">Paid</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">{pendingPayroll}</p>
                  <p className="text-gray-500 text-xs mt-1">Pending</p>
                </div>
              </div>
              <div className="space-y-2">
                {payroll.slice(0, 4).map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                        {(p.employee?.fullName || 'N/A').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.employee?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{p.month} {p.year}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₦{(p.netPay || p.basicSalary || 0).toLocaleString()}</p>
                      <span className={`text-xs ${p.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests + Recent Attendance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Leave Requests */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
                <button onClick={() => navigate('/hr/leave')} className="text-[#3b82f6] text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Staff</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request: any, index: number) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                              {(request.employee?.fullName || request.employeeName || 'N/A').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{request.employee?.fullName || request.employeeName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{request.leaveType || request.type || 'N/A'}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{request.startDate || 'N/A'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
                <button onClick={() => navigate('/hr/attendance')} className="text-[#3b82f6] text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-emerald-600">{presentToday}</p>
                  <p className="text-gray-500 text-xs">Present</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-red-600">{absentToday}</p>
                  <p className="text-gray-500 text-xs">Absent</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-amber-600">{todayAttendance.filter((a) => a.status === 'Late').length}</p>
                  <p className="text-gray-500 text-xs">Late</p>
                </div>
              </div>
              <div className="space-y-2">
                {todayAttendance.slice(0, 5).map((a: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                        {(a.employee?.fullName || 'N/A').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{a.employee?.fullName || 'N/A'}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                      a.status === 'Absent' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Letter Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appointment Letters</h2>
                <p className="text-sm text-gray-500 mt-1">Generate and manage staff appointment letters</p>
              </div>
              <button onClick={() => navigate('/hr/employees')} className="text-[#3b82f6] text-sm font-medium hover:underline">
                View Staff
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/hr/employees')}
                className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Generate Appointment Letter
              </button>
              <button
                onClick={() => navigate('/hr/reports')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Staff Reports
              </button>
              <button
                onClick={() => navigate('/hr/documents')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Staff Documents
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Apply for Leave is handled by the shared ApplyLeaveButton in the header */}
    </div>
  );
}
