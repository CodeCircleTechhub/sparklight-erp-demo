import { useState } from 'react';
import {
  Calendar,
  Clock,
  Stethoscope,
  Plus,
  FileText,
} from 'lucide-react';

const upcomingAppointments = [
  {
    id: 1,
    doctor: 'Dr. Ahmed Hassan',
    specialty: 'General Medicine',
    date: 'September 15, 2026',
    time: '10:30 AM',
    status: 'confirmed',
  },
  {
    id: 2,
    doctor: 'Dr. Sarah Wilson',
    specialty: 'Neurology',
    date: 'October 2, 2026',
    time: '2:00 PM',
    status: 'confirmed',
  },
];

const pastAppointments = [
  {
    id: 3,
    doctor: 'Dr. Ahmed Hassan',
    specialty: 'General Medicine',
    date: 'September 8, 2026',
    time: '11:00 AM',
    status: 'completed',
  },
  {
    id: 4,
    doctor: 'Dr. Mike Johnson',
    specialty: 'Emergency Medicine',
    date: 'August 5, 2026',
    time: '3:45 PM',
    status: 'completed',
  },
  {
    id: 5,
    doctor: 'Dr. Ahmed Hassan',
    specialty: 'General Medicine',
    date: 'July 15, 2026',
    time: '9:00 AM',
    status: 'completed',
  },
];

const cancelledAppointments = [
  {
    id: 6,
    doctor: 'Dr. Sarah Wilson',
    specialty: 'Neurology',
    date: 'August 20, 2026',
    time: '1:00 PM',
    status: 'cancelled',
  },
];

const tabs = ['Upcoming', 'Past', 'Cancelled'] as const;

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Upcoming');

  const appointments = activeTab === 'Upcoming'
    ? upcomingAppointments
    : activeTab === 'Past'
    ? pastAppointments
    : cancelledAppointments;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium">
            <Plus className="w-4 h-4" />
            Book New Appointment
          </button>
        </div>

        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className={`bg-white rounded-xl shadow-sm border p-6 ${
                appt.status === 'cancelled'
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{appt.doctor}</p>
                  <p className="text-sm text-gray-500">{appt.specialty}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {appt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {appt.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      appt.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : appt.status === 'completed'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                  {appt.status === 'completed' && (
                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Visit Summary
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
