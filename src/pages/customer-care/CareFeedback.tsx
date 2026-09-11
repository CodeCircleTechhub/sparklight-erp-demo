import { Star, ThumbsUp, Minus, ThumbsDown, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Feedback', value: '320', icon: Star, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Positive', value: '280', icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Neutral', value: '25', icon: Minus, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Negative', value: '15', icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-100' },
];

const feedback = [
  { id: 'FB001', patient: 'John Smith', category: 'Service', rating: 5, date: '2026-09-10', status: 'Published' },
  { id: 'FB002', patient: 'Sarah Johnson', category: 'Cleanliness', rating: 4, date: '2026-09-10', status: 'Published' },
  { id: 'FB003', patient: 'Mike Williams', category: 'Staff', rating: 5, date: '2026-09-09', status: 'Published' },
  { id: 'FB004', patient: 'Emily Brown', category: 'Wait Time', rating: 3, date: '2026-09-09', status: 'Pending Review' },
  { id: 'FB005', patient: 'David Lee', category: 'Food', rating: 2, date: '2026-09-08', status: 'Published' },
  { id: 'FB006', patient: 'Lisa Anderson', category: 'Service', rating: 5, date: '2026-09-08', status: 'Published' },
  { id: 'FB007', patient: 'James Wilson', category: 'Communication', rating: 4, date: '2026-09-07', status: 'Pending Review' },
  { id: 'FB008', patient: 'Maria Garcia', category: 'Overall', rating: 5, date: '2026-09-07', status: 'Published' },
  { id: 'FB009', patient: 'Robert Taylor', category: 'Facilities', rating: 1, date: '2026-09-06', status: 'Published' },
  { id: 'FB010', patient: 'Jennifer Martinez', category: 'Service', rating: 4, date: '2026-09-06', status: 'Published' },
];

const statusColors: Record<string, string> = {
  Published: 'bg-green-100 text-green-800',
  'Pending Review': 'bg-amber-100 text-amber-800',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function CareFeedback() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Feedback" description="View and manage patient feedback" />
      
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
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Feedback ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feedback.map((fb) => (
                <tr key={fb.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{fb.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{fb.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fb.category}</td>
                  <td className="px-4 py-3"><StarRating rating={fb.rating} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fb.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[fb.status]}`}>
                      {fb.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}