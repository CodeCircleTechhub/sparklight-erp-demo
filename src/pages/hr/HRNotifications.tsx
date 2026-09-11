import { Bell, UserPlus, CheckCircle, CalendarOff, Clock, FileText, AlertTriangle, MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { id: 1, title: 'New employee onboarded', message: 'Dr. James Wilson has been added to the Cardiology department', time: '10 min ago', icon: UserPlus, color: 'bg-emerald-500', read: false },
  { id: 2, title: 'Leave request approved', message: 'Nurse Sarah Miller leave request for Jan 18-19 has been approved', time: '1 hour ago', icon: CheckCircle, color: 'bg-[#3b82f6]', read: false },
  { id: 3, title: 'Leave request pending', message: 'Dr. Robert Taylor has requested annual leave from Jan 20-25', time: '2 hours ago', icon: CalendarOff, color: 'bg-amber-500', read: false },
  { id: 4, title: 'Payroll processing due', message: 'Monthly payroll for January 2024 needs to be processed', time: '3 hours ago', icon: Clock, color: 'bg-red-500', read: true },
  { id: 5, title: 'Document expiring soon', message: 'Tom Davis pharmacy license expires in 30 days', time: '4 hours ago', icon: AlertTriangle, color: 'bg-amber-500', read: true },
  { id: 6, title: 'Training completed', message: 'Dr. Emily Chen has completed CPR certification training', time: '5 hours ago', icon: FileText, color: 'bg-purple-500', read: true },
  { id: 7, title: 'New application received', message: '8 new applications received for Lab Technician position', time: '6 hours ago', icon: UserPlus, color: 'bg-emerald-500', read: true },
  { id: 8, title: 'Manager comment', message: 'HR Manager left a note on attendance report', time: '1 day ago', icon: MessageSquare, color: 'bg-cyan-500', read: true },
];

export default function HRNotifications() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Notifications" icon={Bell} />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
                  <div className={`${n.color} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#3b82f6] flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
