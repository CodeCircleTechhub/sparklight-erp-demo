import { useState } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  Star,
  CalendarCheck,
  CheckCircle,
  Search,
  Bell,
  Send,
  Plus,
  Eye,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

interface Enquiry {
  id: string;
  patientName: string;
  type: 'Enquiry' | 'Complaint' | 'Feedback';
  subject: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Urgent';
}

interface Complaint {
  id: string;
  patientName: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const statCards: StatCard[] = [
  {
    title: "Today's Enquiries",
    value: 24,
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    change: '+3',
    changeType: 'positive',
  },
  {
    title: 'Complaints',
    value: 5,
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    change: '-2',
    changeType: 'positive',
  },
  {
    title: 'Feedback',
    value: 12,
    icon: <Star className="w-6 h-6" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    change: '+4',
    changeType: 'positive',
  },
  {
    title: 'Appointments Scheduled',
    value: 18,
    icon: <CalendarCheck className="w-6 h-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    change: '+6',
    changeType: 'positive',
  },
  {
    title: 'Resolved Today',
    value: 15,
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    change: '+8',
    changeType: 'positive',
  },
];

const recentEnquiries: Enquiry[] = [
  { id: '1', patientName: 'John Smith', type: 'Enquiry', subject: 'Insurance coverage details', time: '10 min ago', status: 'Pending' },
  { id: '2', patientName: 'Maria Garcia', type: 'Complaint', subject: 'Long waiting time in lobby', time: '25 min ago', status: 'In Progress' },
  { id: '3', patientName: 'Robert Chen', type: 'Feedback', subject: 'Excellent surgery experience', time: '40 min ago', status: 'Resolved' },
  { id: '4', patientName: 'Emily Davis', type: 'Enquiry', subject: 'Lab results availability', time: '1 hr ago', status: 'Resolved' },
  { id: '5', patientName: 'Ahmed Khan', type: 'Complaint', subject: 'Billing discrepancy', time: '1.5 hr ago', status: 'Urgent' },
  { id: '6', patientName: 'Lisa Wilson', type: 'Feedback', subject: 'Nurse care appreciation', time: '2 hr ago', status: 'Resolved' },
];

const pendingComplaints: Complaint[] = [
  { id: '1', patientName: 'Ahmed Khan', issue: 'Billing discrepancy - Overcharged for lab tests', priority: 'High' },
  { id: '2', patientName: 'Maria Garcia', issue: 'Long waiting time in lobby', priority: 'Medium' },
  { id: '3', patientName: 'Thomas Brown', issue: 'Incorrect medication dosage dispensed', priority: 'High' },
];

const quickActions: QuickAction[] = [
  { title: 'New Enquiry', icon: <Plus className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Schedule Appointment', icon: <CalendarCheck className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'View Patient', icon: <Eye className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Send Message', icon: <Send className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
  Urgent: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  Enquiry: 'bg-blue-100 text-blue-700',
  Complaint: 'bg-red-100 text-red-700',
  Feedback: 'bg-green-100 text-green-700',
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export default function CustomerCareDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Customer Care</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening today</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
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
                {card.change && (
                  <span
                    className={`text-xs font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Enquiries */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {recentEnquiries.length}
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                      {enquiry.patientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{enquiry.patientName}</p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[enquiry.type]}`}>
                          {enquiry.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{enquiry.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColors[enquiry.status]}`}>
                        {enquiry.status}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">{enquiry.time}</p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Complaints */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Complaints</h2>
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {pendingComplaints.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {pendingComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border border-gray-100 rounded-lg p-3.5 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{complaint.patientName}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{complaint.issue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
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
