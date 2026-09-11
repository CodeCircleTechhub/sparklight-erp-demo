import { Thermometer, Activity, Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const recentRecordings = [
  { id: 1, patient: 'John Smith', temp: '98.6', bp: '120/80', pulse: '72', respRate: '16', o2Sat: '98%', painLevel: 2, date: '2026-09-10 09:30' },
  { id: 2, patient: 'Sarah Johnson', temp: '101.2', bp: '140/90', pulse: '88', respRate: '20', o2Sat: '95%', painLevel: 6, date: '2026-09-10 08:45' },
  { id: 3, patient: 'Mike Williams', temp: '98.4', bp: '130/85', pulse: '76', respRate: '18', o2Sat: '97%', painLevel: 1, date: '2026-09-10 08:00' },
  { id: 4, patient: 'Emily Brown', temp: '99.1', bp: '118/76', pulse: '70', respRate: '14', o2Sat: '99%', painLevel: 3, date: '2026-09-10 07:30' },
  { id: 5, patient: 'David Lee', temp: '102.4', bp: '150/95', pulse: '95', respRate: '24', o2Sat: '92%', painLevel: 8, date: '2026-09-10 07:00' },
  { id: 6, patient: 'Lisa Anderson', temp: '98.8', bp: '125/82', pulse: '74', respRate: '16', o2Sat: '98%', painLevel: 2, date: '2026-09-09 22:00' },
  { id: 7, patient: 'James Wilson', temp: '100.8', bp: '145/88', pulse: '85', respRate: '22', o2Sat: '94%', painLevel: 7, date: '2026-09-09 21:30' },
  { id: 8, patient: 'Maria Garcia', temp: '98.2', bp: '115/75', pulse: '68', respRate: '14', o2Sat: '99%', painLevel: 0, date: '2026-09-09 21:00' },
];

const painLevelColor = (level: number) => {
  if (level <= 3) return 'bg-green-100 text-green-800';
  if (level <= 6) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export default function VitalSigns() {
  return (
    <div className="space-y-6">
      <PageHeader title="Vital Signs Recording" description="Record and track patient vital signs" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            New Vital Signs Recording
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Patient</option>
                <option>John Smith (PAT001)</option>
                <option>Sarah Johnson (PAT002)</option>
                <option>Mike Williams (PAT003)</option>
                <option>Emily Brown (PAT004)</option>
                <option>David Lee (PAT005)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                <input type="number" step="0.1" placeholder="98.6" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Rate (bpm)</label>
                <input type="number" placeholder="72" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
                <input type="number" placeholder="120" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
                <input type="number" placeholder="80" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (/min)</label>
                <input type="number" placeholder="16" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                <input type="number" placeholder="98" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" step="0.1" placeholder="70" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" placeholder="170" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (1-10)</label>
              <input type="number" min="1" max="10" placeholder="5" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Vital Signs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Recent Recordings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Temp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">BP</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pulse</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">O2 Sat</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pain</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRecordings.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{rec.patient}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rec.temp}°</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rec.bp}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rec.pulse}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rec.o2Sat}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${painLevelColor(rec.painLevel)}`}>
                        {rec.painLevel}/10
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{rec.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}