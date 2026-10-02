import { useEffect, useState } from 'react';
import {
  Activity, Droplets, Radiation, Scan, Eye, Waves, Heart, Microscope,
  FlaskConical, AlertCircle, Loader2, Bug, TestTube, Baby, Microscope as ScopeIcon,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const styleFor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('malaria')) return { icon: Bug, color: 'bg-lime-50 text-lime-600' };
  if (n.includes('typhoid')) return { icon: TestTube, color: 'bg-amber-50 text-amber-600' };
  if (n.includes('pregnancy')) return { icon: Baby, color: 'bg-pink-50 text-pink-600' };
  if (n.includes('gonorrhea') || n.includes('hiv')) return { icon: AlertCircle, color: 'bg-rose-50 text-rose-600' };
  if (n.includes('blood') || n.includes('haemoglobin') || n.includes('hemoglobin')) return { icon: Droplets, color: 'bg-red-50 text-red-600' };
  if (n.includes('urine') || n.includes('stool')) return { icon: Activity, color: 'bg-yellow-50 text-yellow-600' };
  if (n.includes('x-ray')) return { icon: Radiation, color: 'bg-blue-50 text-blue-600' };
  if (n.includes('mri')) return { icon: Scan, color: 'bg-purple-50 text-purple-600' };
  if (n.includes('ct')) return { icon: Eye, color: 'bg-indigo-50 text-indigo-600' };
  if (n.includes('ultrasound')) return { icon: Waves, color: 'bg-teal-50 text-teal-600' };
  if (n.includes('ecg')) return { icon: Heart, color: 'bg-pink-50 text-pink-600' };
  if (n.includes('biopsy')) return { icon: Microscope, color: 'bg-orange-50 text-orange-600' };
  if (n.includes('screening') || n.includes('lab')) return { icon: FlaskConical, color: 'bg-cyan-50 text-cyan-600' };
  return { icon: ScopeIcon, color: 'bg-gray-100 text-gray-600' };
};

export default function TestCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/laboratory/categories');
        if (!cancelled) setCategories(data.categories || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load test categories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalTests = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Categories"
        icon={Activity}
        description={`${categories.length} categories · ${totalTests} tests on record`}
      />

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const { icon: Icon, color } = styleFor(cat.name);
            return (
              <div
                key={cat.name}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.count || 0} tests on record</p>
                <p className="text-sm text-gray-500">Price: {cat.priceRange || '—'}</p>
                <div className="mt-3">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {cat.active === false ? 'Inactive' : 'Active'}
                  </span>
                </div>
              </div>
            );
          })}
          {!categories.length && (
            <p className="text-sm text-gray-500 col-span-full">No categories returned by the server.</p>
          )}
        </div>
      )}
    </div>
  );
}
