import { Bell, Package, Clock, AlertTriangle, FileText, CheckCircle, Truck, ShoppingCart } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { icon: AlertTriangle, title: 'Low Stock Alert', message: 'Amoxicillin 500mg is below reorder level. Current stock: 5 units.', time: '5 minutes ago', color: 'bg-red-500' },
  { icon: Clock, title: 'Expiry Warning', message: 'Salbutamol Inhaler expires in 2 weeks. Please arrange disposal.', time: '15 minutes ago', color: 'bg-orange-500' },
  { icon: ShoppingCart, title: 'New Prescription', message: 'Dr. Ahmed has sent a new prescription for Sarah Johnson.', time: '30 minutes ago', color: 'bg-blue-500' },
  { icon: Package, title: 'Stock Received', message: 'Order PO-3001 from MediPharm Distributors has been received.', time: '1 hour ago', color: 'bg-green-500' },
  { icon: CheckCircle, title: 'Prescription Dispensed', message: 'Prescription RX-2002 for Michael Brown has been fully dispensed.', time: '2 hours ago', color: 'bg-green-500' },
  { icon: Truck, title: 'Order Shipped', message: 'Order PO-3002 from HealthLine Supplies is on the way.', time: '3 hours ago', color: 'bg-indigo-500' },
  { icon: FileText, title: 'Report Generated', message: 'Weekly sales report for Sep 01-07 has been generated.', time: '4 hours ago', color: 'bg-purple-500' },
  { icon: Bell, title: 'System Update', message: 'Pharmacy inventory system will be updated tonight at 11:00 PM.', time: '5 hours ago', color: 'bg-gray-500' },
];

export default function PharmacistNotifications() {
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
