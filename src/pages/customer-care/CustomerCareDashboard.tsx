import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import EmergencyPanel from '../../components/shared/EmergencyPanel';
import {
  MessageSquare,
  AlertTriangle,
  Star,
  CheckCircle,
  Search,
  Bell,
  Send,
  Plus,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
}

const statusColors: Record<string, string> = {
  Open: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Investigating: 'bg-orange-100 text-orange-700',
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};


export default function CustomerCareDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>({});
  const [, setRecentEnquiries] = useState<any[]>([]);
  const [openComplaints, setOpenComplaints] = useState<any[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [caseStats, setCaseStats] = useState<any>({});
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [escalationStats, setEscalationStats] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ccRes, caseRes] = await Promise.all([
          api.get('/customer-care/dashboard'),
          api.get('/cases/dashboard'),
        ]);
        setStats(ccRes.data.stats || {});
        setRecentEnquiries(ccRes.data.recentEnquiries || []);
        setOpenComplaints(ccRes.data.openComplaints || []);
        setRecentFeedback(ccRes.data.recentFeedback || []);
        setCaseStats(caseRes.data.cases || {});
        setRecentCases(caseRes.data.recentCases || []);
        setEscalationStats(caseRes.data.escalations || {});
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Open Cases',
      value: caseStats.open ?? 0,
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'High Priority',
      value: caseStats.highPriorityOpen ?? 0,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Pending Escalations',
      value: escalationStats.pending ?? 0,
      icon: <Send className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Open Enquiries',
      value: stats.openEnquiries ?? 0,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Resolved Complaints',
      value: stats.resolvedComplaints ?? 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const quickActions: QuickAction[] = [
    { title: 'New Case', icon: <Plus className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100', path: '/customer-care/cases' },
    { title: 'Escalations', icon: <Send className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100', path: '/customer-care/escalations' },
    { title: 'Dept Requests', icon: <ClipboardList className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100', path: '/customer-care/internal-requests' },
    { title: 'Send Message', icon: <Send className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100', path: '/customer-care/communication' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName || 'Customer Care'}</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening today</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ApplyLeaveButton />
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigate('/customer-care/notifications')}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5" />
              {(stats.unreadNotifications ?? 0) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.bgColor} ${card.color} p-2.5 rounded-lg`}>{card.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <EmergencyPanel canRemove className="mb-8" />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Enquiries */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {recentCases.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/customer-care/cases')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCases.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No cases yet</p>
              ) : (
                recentCases.map((cse) => (
                  <div
                    key={cse._id || cse.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/customer-care/cases')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-600 shrink-0">
                        {(cse.caseId || 'C').replace('CASE-', '')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{cse.subject}</p>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priorityColors[cse.priority] || 'bg-gray-100 text-gray-700'}`}>
                            {cse.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{cse.patientName || cse.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColors[cse.status] || 'bg-gray-100 text-gray-700'}`}>
                        {cse.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Complaints */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Issues</h2>
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {openComplaints.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {openComplaints.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No pending issues</p>
                ) : (
                  openComplaints.map((complaint) => (
                    <div
                      key={complaint._id || complaint.id}
                      onClick={() => navigate('/customer-care/complaints')}
                      className="border border-gray-100 rounded-lg p-3.5 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{complaint.patientName}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[complaint.priority] || 'bg-gray-100 text-gray-700'}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{complaint.issue}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {recentFeedback.length}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/customer-care/feedback')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {recentFeedback.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No feedback yet</p>
                ) : (
                  recentFeedback.map((fb) => (
                    <div
                      key={fb._id || fb.id}
                      onClick={() => navigate('/customer-care/feedback')}
                      className="border border-gray-100 rounded-lg p-3.5 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{fb.patientName}</p>
                        <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {fb.rating}/5
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {fb.category}
                        {fb.comment ? ` — ${fb.comment}` : ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className={`${action.bgColor} ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}