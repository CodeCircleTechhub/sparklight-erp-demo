import { Bell, UserPlus, Calendar, Clock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { icon: UserPlus, title: 'New Patient Registration', message: 'Jack Thompson has been registered as a new patient.', time: '5 minutes ago', color: 'bg-blue-500' },
  { icon: Calendar, title: 'Appointment Scheduled', message: 'Dr. Smith has a new appointment at 2:00 PM.', time: '15 minutes ago', color: 'bg-green-500' },
  { icon: Clock, title: 'Queue Update', message: 'Alice Johnson has been called to Room 3.', time: '20 minutes ago', color: 'bg-violet-500' },
  { icon: AlertTriangle, title: 'Urgent: Room Assignment', message: 'Emergency patient requires immediate room assignment.', time: '30 minutes ago', color: 'bg-red-500' },
  { icon: FileText, title: 'Document Uploaded', message: 'Lab report for Bob Williams has been uploaded.', time: '1 hour ago', color: 'bg-amber-500' },
  { icon: CheckCircle, title: 'Visit Completed', message: 'Carol Davis visit has been marked as completed.', time: '2 hours ago', color: 'bg-emerald-500' },
];

export default function ReceptionistNotifications() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Notifications" icon={Bell} />

        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${n.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <n.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
