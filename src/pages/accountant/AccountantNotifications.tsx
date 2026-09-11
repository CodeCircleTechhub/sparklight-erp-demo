import { Bell, DollarSign, CreditCard, AlertTriangle, CheckCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { id: 1, title: 'Payment received from John Smith', message: 'Payment of ₦2,500 has been received for Invoice INV-001', time: '5 min ago', icon: DollarSign, color: 'bg-emerald-500', read: false },
  { id: 2, title: 'Invoice INV-045 is overdue', message: 'Payment of ₦1,800 is 15 days overdue from Maria Garcia', time: '1 hour ago', icon: AlertTriangle, color: 'bg-red-500', read: false },
  { id: 3, title: 'Monthly report generated', message: 'January 2024 financial report is ready for review', time: '2 hours ago', icon: FileText, color: 'bg-[#3b82f6]', read: false },
  { id: 4, title: 'Refund processed', message: 'Refund of ₦250 has been processed for Emily Davis', time: '3 hours ago', icon: CheckCircle, color: 'bg-emerald-500', read: true },
  { id: 5, title: 'Pending expense approval', message: 'Maintenance expense of ₦1,800 requires your approval', time: '4 hours ago', icon: Clock, color: 'bg-amber-500', read: true },
  { id: 6, title: 'Insurance payment received', message: 'Insurance payment of ₦8,500 received for Robert Johnson', time: '5 hours ago', icon: CreditCard, color: 'bg-purple-500', read: true },
  { id: 7, title: 'New invoice created', message: 'Invoice INV-052 has been created for Sarah Brown', time: '6 hours ago', icon: FileText, color: 'bg-[#3b82f6]', read: true },
  { id: 8, title: 'Comment on payment record', message: 'Manager left a note on PAY-012 payment record', time: '1 day ago', icon: MessageSquare, color: 'bg-cyan-500', read: true },
];

export default function AccountantNotifications() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Notifications" icon={Bell} />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ₦{!n.read ? 'bg-blue-50/30' : ''}`}>
                  <div className={`₦{n.color} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm ₦{!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h3>
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
