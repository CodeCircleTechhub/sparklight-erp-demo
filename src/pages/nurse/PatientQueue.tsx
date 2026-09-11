import { ListOrdered, Clock, UserCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'In Queue', value: '5', icon: ListOrdered, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Waiting', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'With Nurse', value: '2', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Completed', value: '8', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const queue = [
  { position: 1, patientId: 'PAT001', name: 'John Smith', timeWaiting: '5 min', status: 'With Nurse' },
  { position: 2, patientId: 'PAT002', name: 'Sarah Johnson', timeWaiting: '12 min', status: 'With Nurse' },
  { position: 3, patientId: 'PAT003', name: 'Mike Williams', timeWaiting: '18 min', status: 'Waiting' },
  { position: 4, patientId: 'PAT004', name: 'Emily Brown', timeWaiting: '25 min', status: 'Waiting' },
  { position: 5, patientId: 'PAT005', name: 'David Lee', timeWaiting: '32 min', status: 'Waiting' },
  { position: 6, patientId: 'PAT006', name: 'Lisa Anderson', timeWaiting: '45 min', status: 'In Queue' },
  { position: 7, patientId: 'PAT007', name: 'James Wilson', timeWaiting: '1 hr 2 min', status: 'In Queue' },
  { position: 8, patientId: 'PAT008', name: 'Maria Garcia', timeWaiting: 'Completed', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  'With Nurse': 'bg-blue-100 text-blue-800',
  Waiting: 'bg-amber-100 text-amber-800',
  'In Queue': 'bg-gray-100 text-gray-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function PatientQueue() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Queue" description="Manage patient queue and waiting times" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Current Queue
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {queue.map((item) => (
            <div key={item.patientId} className={`p-4 hover:bg-gray-50 ${item.status === 'With Nurse' ? 'bg-blue-50/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                    {item.position}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">ID: {item.patientId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{item.timeWaiting}</p>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.status !== 'Completed' && item.status !== 'With Nurse' && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}