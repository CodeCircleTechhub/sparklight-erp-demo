import { useState } from 'react';
import {
  Users,
  Clock,
  Stethoscope,
  BedDouble,
  Activity,
  ClipboardList,
  Search,
  Bell,
  LayoutGrid,
  PenLine,
  ChevronRight,
  Pill,
  Timer,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface Patient {
  id: string;
  name: string;
  waitingTime: string;
  status: 'Waiting' | 'Vitals Taken' | 'With Doctor';
}

interface Medication {
  id: string;
  patientName: string;
  medicine: string;
  time: string;
  status: 'Pending' | 'Completed';
}

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const statCards: StatCard[] = [
  { title: 'Assigned Patients', value: 12, icon: <Users className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Waiting Patients', value: 5, icon: <Clock className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { title: 'Patients to Check', value: 8, icon: <Stethoscope className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { title: 'Patients in Ward', value: 15, icon: <BedDouble className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: "Today's Vital Signs", value: 22, icon: <Activity className="w-6 h-6" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Pending Tasks', value: 6, icon: <ClipboardList className="w-6 h-6" />, color: 'text-red-600', bgColor: 'bg-red-100' },
];

const patientQueue: Patient[] = [
  { id: '1', name: 'Alice Johnson', waitingTime: '5 min', status: 'Waiting' },
  { id: '2', name: 'Bob Williams', waitingTime: '12 min', status: 'Vitals Taken' },
  { id: '3', name: 'Clara Martinez', waitingTime: '3 min', status: 'Waiting' },
  { id: '4', name: 'David Lee', waitingTime: '8 min', status: 'With Doctor' },
  { id: '5', name: 'Eva Thompson', waitingTime: '15 min', status: 'Vitals Taken' },
  { id: '6', name: 'Frank Wilson', waitingTime: '2 min', status: 'Waiting' },
];

const medicationSchedule: Medication[] = [
  { id: '1', patientName: 'Alice Johnson', medicine: 'Amoxicillin 500mg', time: '08:00 AM', status: 'Completed' },
  { id: '2', patientName: 'Bob Williams', medicine: 'Metformin 850mg', time: '09:00 AM', status: 'Completed' },
  { id: '3', patientName: 'Clara Martinez', medicine: 'Lisinopril 10mg', time: '10:00 AM', status: 'Pending' },
  { id: '4', patientName: 'David Lee', medicine: 'Omeprazole 20mg', time: '11:00 AM', status: 'Pending' },
  { id: '5', patientName: 'Eva Thompson', medicine: 'Atorvastatin 40mg', time: '12:00 PM', status: 'Pending' },
  { id: '6', patientName: 'Frank Wilson', medicine: 'Metoprolol 50mg', time: '01:00 PM', status: 'Pending' },
];

const quickActions: QuickAction[] = [
  { title: 'Record Vital Signs', icon: <Activity className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'View Patient Queue', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Nursing Notes', icon: <PenLine className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Ward Overview', icon: <LayoutGrid className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const queueStatusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  'Vitals Taken': 'bg-blue-100 text-blue-700',
  'With Doctor': 'bg-green-100 text-green-700',
};

const medStatusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
};

export default function NurseDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Nurse Sarah</h1>
            <p className="text-sm text-gray-500 mt-1">Here's your patient overview for today</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                4
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`${card.bgColor} ${card.color} p-2.5 rounded-lg w-fit mb-3`}>{card.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient Queue */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Patient Queue</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {patientQueue.length}
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Patient
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Waiting Time
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patientQueue.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                            {patient.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="w-3.5 h-3.5" />
                          {patient.waitingTime}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${queueStatusColors[patient.status]}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Medication Schedule */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Medication Schedule</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {medicationSchedule.map((med) => (
                  <div key={med.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{med.patientName}</p>
                      <p className="text-xs text-gray-500">{med.medicine}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {med.time}
                        </p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${medStatusColors[med.status]}`}>
                        {med.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className={`${action.bgColor} ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
