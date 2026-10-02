import { useState, useEffect } from 'react';
import { Stethoscope, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (s === 'Scheduled') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

export default function Consultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/clinical/consultations');
        setConsultations(res.data.consultations || []);
      } catch (err) {
        console.error('Failed to fetch consultations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" icon={Stethoscope} />

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
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Consultation ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((row) => (
                  <tr key={row.consultationId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.consultationId}</td>
                    <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patientName}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctorName}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.type}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
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
