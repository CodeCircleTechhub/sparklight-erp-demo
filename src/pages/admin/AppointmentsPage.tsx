import { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

interface CalendarEvent {
  day: string;
  events: number;
  colors: string[];
}

const todayAppointments: Appointment[] = [
  { id: 'A001', patient: 'John Smith', doctor: 'Dr. Sarah Wilson', date: '2026-09-11', time: '09:00 AM', type: 'Checkup', status: 'Completed' },
  { id: 'A002', patient: 'Emily Davis', doctor: 'Dr. Michael Chen', date: '2026-09-11', time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 'A003', patient: 'Robert Johnson', doctor: 'Dr. Emily Brown', date: '2026-09-11', time: '11:00 AM', type: 'Consultation', status: 'Pending' },
  { id: 'A004', patient: 'Maria Garcia', doctor: 'Dr. David Kim', date: '2026-09-11', time: '02:00 PM', type: 'Surgery Prep', status: 'Confirmed' },
];

const upcomingAppointments: Appointment[] = [
  { id: 'A005', patient: 'James Wilson', doctor: 'Dr. Sarah Wilson', date: '2026-09-12', time: '09:00 AM', type: 'Checkup', status: 'Confirmed' },
  { id: 'A006', patient: 'Sarah Brown', doctor: 'Dr. James Anderson', date: '2026-09-12', time: '11:00 AM', type: 'X-Ray', status: 'Pending' },
  { id: 'A007', patient: 'Michael Lee', doctor: 'Dr. Robert Johnson', date: '2026-09-13', time: '10:00 AM', type: 'Consultation', status: 'Confirmed' },
  { id: 'A008', patient: 'Jennifer Martinez', doctor: 'Dr. Michael Chen', date: '2026-09-13', time: '02:30 PM', type: 'Follow-up', status: 'Pending' },
  { id: 'A009', patient: 'David Anderson', doctor: 'Dr. Emily Brown', date: '2026-09-14', time: '09:30 AM', type: 'Checkup', status: 'Confirmed' },
];

const calendarWeek: CalendarEvent[] = [
  { day: 'Mon', events: 12, colors: ['bg-blue-500', 'bg-green-500', 'bg-purple-500'] },
  { day: 'Tue', events: 8, colors: ['bg-blue-500', 'bg-yellow-500'] },
  { day: 'Wed', events: 15, colors: ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500'] },
  { day: 'Thu', events: 10, colors: ['bg-blue-500', 'bg-green-500'] },
  { day: 'Fri', events: 14, colors: ['bg-blue-500', 'bg-purple-500', 'bg-yellow-500'] },
  { day: 'Sat', events: 6, colors: ['bg-blue-500'] },
  { day: 'Sun', events: 3, colors: ['bg-green-500'] },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

const upcomingColumns: Column[] = [
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'doctor', label: 'Doctor' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time', render: (row) => (
    <div className="flex items-center gap-1">
      <Clock className="w-3 h-3 text-gray-400" />
      {String(row.time ?? '')}
    </div>
  )},
  { key: 'type', label: 'Type' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const AppointmentsPage = () => {
  const [currentWeekStart] = useState(new Date(2026, 8, 7));

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Calendar</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">Sep 7 - Sep 13, 2026</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarWeek.map((day, index) => (
            <div
              key={day.day}
              className={`p-3 rounded-lg border ${
                weekDates[index].toDateString() === today.toDateString()
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">{day.day}</p>
                <p className={`text-lg font-semibold ${
                  weekDates[index].toDateString() === today.toDateString() ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {weekDates[index].getDate()}
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {day.colors.slice(0, 4).map((color, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${color}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">{day.events} events</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h2>
        <div className="space-y-3">
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">{appointment.doctor} • {appointment.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-xs text-gray-500">{appointment.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        </div>
        <DataTable columns={upcomingColumns} data={upcomingAppointments as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default AppointmentsPage;
