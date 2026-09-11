import { Bell, TestTube, Clock, AlertTriangle, FileText, CheckCircle, UserPlus, Cog } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { icon: TestTube, title: 'New Test Request', message: 'Dr. Ahmed has requested a Complete Blood Count for Sarah Johnson.', time: '5 minutes ago', color: 'bg-blue-500' },
  { icon: AlertTriangle, title: 'Urgent Sample', message: 'Emergency sample received from Emma Wilson requires immediate processing.', time: '15 minutes ago', color: 'bg-red-500' },
  { icon: Clock, title: 'Test Due', message: 'Lipid Profile for Michael Brown is due for completion.', time: '30 minutes ago', color: 'bg-yellow-500' },
  { icon: FileText, title: 'Results Ready', message: 'Results for James Davis Chest X-Ray are ready for verification.', time: '1 hour ago', color: 'bg-purple-500' },
  { icon: CheckCircle, title: 'Sample Collected', message: 'Blood sample for Olivia Martinez has been collected successfully.', time: '2 hours ago', color: 'bg-green-500' },
  { icon: UserPlus, title: 'New Staff Member', message: 'Lab technician Dr. Khan has joined the team.', time: '3 hours ago', color: 'bg-indigo-500' },
  { icon: Cog, title: 'Equipment Maintenance', message: 'MRI machine scheduled for maintenance tonight at 8:00 PM.', time: '4 hours ago', color: 'bg-orange-500' },
  { icon: Bell, title: 'System Update', message: 'Lab information system will be updated tonight at 11:00 PM.', time: '5 hours ago', color: 'bg-gray-500' },
];

export default function LabNotifications() {
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
