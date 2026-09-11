import { useState } from 'react';
import { LogOut, Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const recentDischarges = [
  { patient: 'Olivia Martinez', date: 'Sep 10, 2026', diagnosis: 'Post-surgery recovery', doctor: 'Dr. Ahmed' },
  { patient: 'Isabella Thomas', date: 'Sep 09, 2026', diagnosis: 'Normal delivery', doctor: 'Dr. Fatima' },
  { patient: 'Benjamin Harris', date: 'Sep 08, 2026', diagnosis: 'Chest infection', doctor: 'Dr. Ahmed' },
  { patient: 'Carol White', date: 'Sep 07, 2026', diagnosis: 'Gallstone removal', doctor: 'Dr. Fatima' },
  { patient: 'David King', date: 'Sep 06, 2026', diagnosis: 'Appendectomy', doctor: 'Dr. Ahmed' },
  { patient: 'Emily Scott', date: 'Sep 05, 2026', diagnosis: 'Tonsillectomy', doctor: 'Dr. Fatima' },
  { patient: 'Frank Miller', date: 'Sep 04, 2026', diagnosis: 'Hip replacement', doctor: 'Dr. Ahmed' },
  { patient: 'Grace Adams', date: 'Sep 03, 2026', diagnosis: 'Knee arthroscopy', doctor: 'Dr. Fatima' },
];

const patients = [
  'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'James Davis',
  'William Garcia', 'Sophia Rodriguez', 'Daniel Lee',
];

export default function Discharge() {
  const [form, setForm] = useState({
    patient: '', diagnosis: '', treatment: '', followUp: '', instructions: '',
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Discharge Management" icon={LogOut} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Discharge</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="Enter diagnosis..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Summary</label>
              <textarea
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                rows={3}
                placeholder="Summarize treatment provided..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                rows={2}
                placeholder="Discharge instructions..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Submit Discharge
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Discharges</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDischarges.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.patient}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.diagnosis}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.doctor}</td>
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
