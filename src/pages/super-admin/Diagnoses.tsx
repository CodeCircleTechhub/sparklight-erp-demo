import { useState, useEffect } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

export default function Diagnoses() {
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/clinical/diagnoses');
        setDiagnoses(res.data.diagnoses || []);
      } catch (err) {
        console.error('Failed to fetch diagnoses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnoses" icon={Activity} />

      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnosis</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Treatment Plan</th>
                </tr>
              </thead>
              <tbody>
                {diagnoses.map((row) => (
                  <tr key={row.diagnosisId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.diagnosisId}</td>
                    <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patientName}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctorName}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.diagnosis}</td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.treatment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
