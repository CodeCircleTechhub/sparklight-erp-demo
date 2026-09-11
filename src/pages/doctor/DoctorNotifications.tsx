import { Bell, Calendar, Clock, AlertTriangle, FileText, CheckCircle, UserPlus, Stethoscope } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { icon: Calendar, title: 'New Appointment', message: 'Patient Sarah Johnson has booked an appointment for tomorrow at 10:00 AM.', time: '5 minutes ago', color: 'bg-blue-500' },
  { icon: AlertTriangle, title: 'Emergency Case', message: 'Emma Wilson has been admitted to the ER with severe chest pain.', time: '15 minutes ago', color: 'bg-red-500' },
  { icon: Clock, title: 'Follow-up Reminder', message: 'Follow-up for Michael Brown is scheduled today at 2:00 PM.', time: '30 minutes ago', color: 'bg-yellow-500' },
  { icon: FileText, title: 'Lab Results Available', message: 'Lab results for James Davis are ready for review.', time: '1 hour ago', color: 'bg-purple-500' },
  { icon: CheckCircle, title: 'Prescription Dispensed', message: 'Pharmacy has dispensed prescription for Olivia Martinez.', time: '2 hours ago', color: 'bg-green-500' },
  { icon: UserPlus, title: 'New Patient Assigned', message: 'William Garcia has been assigned to your care.', time: '3 hours ago', color: 'bg-indigo-500' },
  { icon: Stethoscope, title: 'Consultation Request', message: 'Dr. Fatima requests a consultation for Sophia Rodriguez.', time: '4 hours ago', color: 'bg-teal-500' },
  { icon: Bell, title: 'System Update', message: 'Medical records system will be updated tonight at 11:00 PM.', time: '5 hours ago', color: 'bg-gray-500' },
];

export default function DoctorNotifications() {
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
