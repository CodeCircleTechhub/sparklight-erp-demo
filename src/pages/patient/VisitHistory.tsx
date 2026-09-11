import {
  Stethoscope,
  FlaskConical,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

const visits = [
  {
    date: 'September 8, 2026',
    type: 'Consultation',
    doctor: 'Dr. Ahmed Hassan',
    department: 'General Medicine',
    details: 'Diagnosis: Routine Check-up',
    icon: Stethoscope,
    color: 'bg-blue-500',
  },
  {
    date: 'September 2, 2026',
    type: 'Laboratory',
    doctor: 'Lab Services',
    department: 'Pathology',
    details: 'Results: Normal',
    icon: FlaskConical,
    color: 'bg-green-500',
  },
  {
    date: 'August 20, 2026',
    type: 'Follow-up',
    doctor: 'Dr. Sarah Wilson',
    department: 'Neurology',
    details: 'Post-treatment review',
    icon: Calendar,
    color: 'bg-purple-500',
  },
  {
    date: 'August 5, 2026',
    type: 'Emergency Visit',
    doctor: 'Dr. Mike Johnson',
    department: 'Emergency Medicine',
    details: 'Diagnosis: Mild Infection',
    icon: AlertTriangle,
    color: 'bg-red-500',
  },
  {
    date: 'July 15, 2026',
    type: 'Consultation',
    doctor: 'Dr. Ahmed Hassan',
    department: 'General Medicine',
    details: 'Annual Physical Examination',
    icon: Stethoscope,
    color: 'bg-blue-500',
  },
  {
    date: 'June 20, 2026',
    type: 'Laboratory',
    doctor: 'Lab Services',
    department: 'Pathology',
    details: 'Full Blood Count Test',
    icon: FlaskConical,
    color: 'bg-green-500',
  },
];

export default function VisitHistory() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Visit History</h1>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {visits.map((visit, i) => (
              <div key={i} className="relative flex gap-4">
                <div className={`w-12 h-12 ${visit.color} rounded-full flex items-center justify-center shrink-0 z-10`}>
                  <visit.icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5 -mt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{visit.type}</p>
                      <p className="text-sm text-gray-500">{visit.doctor} · {visit.department}</p>
                    </div>
                    <span className="text-sm text-gray-500">{visit.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{visit.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
