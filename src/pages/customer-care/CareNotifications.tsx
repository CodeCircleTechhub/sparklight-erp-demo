import { Bell, MessageSquare, AlertTriangle, Calendar, Clock, CheckCircle, Info } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { id: 1, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100', title: 'New enquiry received', message: 'John Smith submitted a new enquiry about appointment rescheduling.', time: '5 minutes ago', read: false },
  { id: 2, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', title: 'Complaint escalated', message: 'Complaint CMP002 has been escalated to management.', time: '15 minutes ago', read: false },
  { id: 3, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', title: 'Complaint resolved', message: 'Complaint CMP005 regarding food quality has been resolved.', time: '1 hour ago', read: true },
  { id: 4, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100', title: 'Appointment reminder sent', message: 'Reminders sent to 18 patients for tomorrow appointments.', time: '2 hours ago', read: true },
  { id: 5, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100', title: 'Feedback received', message: 'New 5-star feedback from Sarah Johnson for Cardiology department.', time: '3 hours ago', read: true },
  { id: 6, icon: Info, color: 'text-gray-600', bg: 'bg-gray-100', title: 'System update', message: 'Customer care module has been updated to version 2.1.', time: '5 hours ago', read: true },
  { id: 7, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', title: 'High priority complaint', message: 'New high priority complaint from James Wilson regarding staff behavior.', time: '6 hours ago', read: true },
  { id: 8, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', title: 'Daily summary ready', message: 'Yesterday\'s summary: 24 enquiries, 5 complaints, 32 feedback received.', time: '1 day ago', read: true },
];

export default function CareNotifications() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Stay updated with latest activities" />
      
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">All Notifications</h3>
          </div>
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">Mark all as read</span>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${notif.bg} flex-shrink-0`}>
                  <notif.icon className={`w-5 h-5 ${notif.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                    {!notif.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}