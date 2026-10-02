import { useEffect, useMemo, useState } from 'react';
import { FileText, FlaskConical, Pill, Activity } from 'lucide-react';
import api from '../../services/api';

const categories = ['All', 'Diagnoses', 'Lab Results', 'Prescriptions'] as const;

const typeColors: Record<string, string> = {
  Diagnoses: 'bg-blue-100 text-blue-700',
  'Lab Results': 'bg-green-100 text-green-700',
  Prescriptions: 'bg-purple-100 text-purple-700',
  Imaging: 'bg-amber-100 text-amber-700',
};

const typeIcon: Record<string, typeof FileText> = {
  Diagnoses: FileText,
  'Lab Results': FlaskConical,
  Prescriptions: Pill,
  Imaging: Activity,
};

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

export default function PatientRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/records');
        if (!cancelled) setRecords(res.data.records || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load records');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? records : records.filter((r) => r.type === activeCategory)),
    [records, activeCategory]
  );

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

        {loading && <p className="text-sm text-gray-500">Loading records…</p>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            No records in this category.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((record) => {
            const Icon = typeIcon[record.type] || FileText;
            return (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{record.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{record.doctor || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(record.date)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[record.type] || 'bg-gray-100 text-gray-700'}`}>
                    {record.type}
                  </span>
                  {record.result && <span className="text-xs text-gray-500 truncate max-w-[50%]">{record.result}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
