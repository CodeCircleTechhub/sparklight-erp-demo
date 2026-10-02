import { useState, useEffect, useCallback } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';

const today = new Date().toISOString().split('T')[0];

interface AttendanceRecord {
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
  hoursWorked: number;
}

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async (selectedDate: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/hr/attendance', { params: { date: selectedDate } });
      setAttendance(data.attendance ?? []);
    } catch {
      console.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(date);
  }, [date, fetchAttendance]);

  const statusColor = (s: string) => {
    if (s === 'Present') return 'bg-green-100 text-green-700';
    if (s === 'Late') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" icon={Clock} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading attendance...</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Clock In</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Clock Out</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">No attendance records found</td>
                  </tr>
                ) : (
                  attendance.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.employeeName}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.clockIn || '--'}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.clockOut || '--'}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.hoursWorked}h</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
