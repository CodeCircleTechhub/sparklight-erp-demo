import { useState } from 'react';
import {
  FileText,
  FlaskConical,
  Pill,
  Download,
  Activity,
} from 'lucide-react';

const records = [
  { id: 1, title: 'Type 2 Diabetes Diagnosis', date: 'September 8, 2026', doctor: 'Dr. Ahmed Hassan', type: 'Diagnoses', icon: FileText },
  { id: 2, title: 'Metformin Prescription', date: 'September 8, 2026', doctor: 'Dr. Ahmed Hassan', type: 'Prescriptions', icon: Pill },
  { id: 3, title: 'Blood Sugar Test Results', date: 'September 2, 2026', doctor: 'Lab Services', type: 'Lab Results', icon: FlaskConical },
  { id: 4, title: 'Complete Blood Count', date: 'September 2, 2026', doctor: 'Lab Services', type: 'Lab Results', icon: FlaskConical },
  { id: 5, title: 'Chest X-Ray Report', date: 'August 5, 2026', doctor: 'Dr. Mike Johnson', type: 'Imaging', icon: Activity },
  { id: 6, title: 'Amitriptyline Prescription', date: 'August 20, 2026', doctor: 'Dr. Sarah Wilson', type: 'Prescriptions', icon: Pill },
  { id: 7, title: 'Lipid Profile Results', date: 'July 10, 2026', doctor: 'Lab Services', type: 'Lab Results', icon: FlaskConical },
  { id: 8, title: 'Annual Physical Report', date: 'July 15, 2026', doctor: 'Dr. Ahmed Hassan', type: 'Diagnoses', icon: FileText },
  { id: 9, title: 'Vitamin D3 Prescription', date: 'July 15, 2026', doctor: 'Dr. Ahmed Hassan', type: 'Prescriptions', icon: Pill },
];

const categories = ['All', 'Diagnoses', 'Lab Results', 'Prescriptions', 'Imaging'] as const;

const typeColors: Record<string, string> = {
  Diagnoses: 'bg-blue-100 text-blue-700',
  'Lab Results': 'bg-green-100 text-green-700',
  Prescriptions: 'bg-purple-100 text-purple-700',
  Imaging: 'bg-amber-100 text-amber-700',
};

export default function PatientRecords() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');

  const filtered = activeCategory === 'All'
    ? records
    : records.filter((r) => r.type === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <record.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{record.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{record.doctor}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{record.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[record.type]}`}>
                  {record.type}
                </span>
                <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
