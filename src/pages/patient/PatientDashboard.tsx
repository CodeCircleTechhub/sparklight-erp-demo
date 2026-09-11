import {
  Stethoscope,
  Calendar,
  Pill,
  CreditCard,
  FileText,
  X,
  RotateCcw,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Visits', value: 12, icon: Stethoscope, color: 'blue' as const },
  { title: 'Appointments', value: 2, icon: Calendar, color: 'green' as const },
  { title: 'Prescriptions', value: 3, icon: Pill, color: 'purple' as const },
  { title: 'Outstanding Bill', value: '₦25,000', icon: CreditCard, color: 'yellow' as const },
];

const recentVisits = [
  { date: 'September 8, 2026', type: 'Consultation', doctor: 'Dr. Ahmed Hassan' },
  { date: 'September 2, 2026', type: 'Laboratory', doctor: 'Lab Services' },
  { date: 'August 20, 2026', type: 'Follow-up', doctor: 'Dr. Sarah Wilson' },
];

const recentRecords = [
  { type: 'Diagnosis', title: 'Type 2 Diabetes', date: 'September 8, 2026' },
  { type: 'Prescription', title: 'Metformin 500mg', date: 'September 8, 2026' },
  { type: 'Lab Result', title: 'Blood Sugar Test', date: 'September 2, 2026' },
];

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John Doe</h1>
          <p className="text-gray-500 mt-1">Patient ID: PT-000123</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointment</h2>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Dr. Ahmed Hassan</p>
                  <p className="text-sm text-gray-500">General Medicine</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>September 15, 2026 — 10:30 AM</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-1.5">
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4" />
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits</h2>
            <div className="space-y-3">
              {recentVisits.map((visit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{visit.type}</p>
                    <p className="text-xs text-gray-500">{visit.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentRecords.map((record, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{record.type}</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{record.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{record.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
