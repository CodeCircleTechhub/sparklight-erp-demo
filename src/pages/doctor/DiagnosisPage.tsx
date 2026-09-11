import { useState } from 'react';
import { ClipboardList, Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const recentDiagnoses = [
  { id: 'DG-4001', patient: 'Sarah Johnson', date: 'Sep 11, 2026', diagnosis: 'Hypertension', doctor: 'Dr. Ahmed' },
  { id: 'DG-4002', patient: 'Michael Brown', date: 'Sep 11, 2026', diagnosis: 'Type 2 Diabetes', doctor: 'Dr. Ahmed' },
  { id: 'DG-4003', patient: 'Emma Wilson', date: 'Sep 10, 2026', diagnosis: 'Migraine', doctor: 'Dr. Fatima' },
  { id: 'DG-4004', patient: 'James Davis', date: 'Sep 10, 2026', diagnosis: 'Lower Back Pain', doctor: 'Dr. Ahmed' },
  { id: 'DG-4005', patient: 'Olivia Martinez', date: 'Sep 09, 2026', diagnosis: 'Osteoarthritis', doctor: 'Dr. Fatima' },
  { id: 'DG-4006', patient: 'William Garcia', date: 'Sep 09, 2026', diagnosis: 'Asthma', doctor: 'Dr. Ahmed' },
  { id: 'DG-4007', patient: 'Sophia Rodriguez', date: 'Sep 08, 2026', diagnosis: 'Hypothyroidism', doctor: 'Dr. Fatima' },
  { id: 'DG-4008', patient: 'Daniel Lee', date: 'Sep 08, 2026', diagnosis: 'COPD', doctor: 'Dr. Ahmed' },
];

const patients = [
  'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'James Davis',
  'Olivia Martinez', 'William Garcia', 'Sophia Rodriguez', 'Daniel Lee',
];

export default function DiagnosisPage() {
  const [form, setForm] = useState({
    patient: '', symptoms: '', findings: '', diagnosis: '', treatment: '', followUp: '',
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnosis" icon={ClipboardList} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Diagnosis</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <textarea
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                rows={3}
                placeholder="Describe patient symptoms..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Findings</label>
              <textarea
                value={form.findings}
                onChange={(e) => setForm({ ...form, findings: e.target.value })}
                rows={2}
                placeholder="Physical examination findings..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
              <textarea
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                rows={2}
                placeholder="Describe treatment plan..."
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
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Diagnosis
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Diagnoses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDiagnoses.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{d.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{d.patient}</td>
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
