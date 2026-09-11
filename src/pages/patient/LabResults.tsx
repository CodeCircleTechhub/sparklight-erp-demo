import { useState } from 'react';
import {
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const labTests = [
  {
    id: 1,
    name: 'Complete Blood Count',
    date: 'September 2, 2026',
    status: 'Normal',
    parameters: [
      { test: 'White Blood Cells', value: '7.5', unit: 'K/μL', range: '4.5-11.0', status: 'Normal' },
      { test: 'Red Blood Cells', value: '5.2', unit: 'M/μL', range: '4.5-5.9', status: 'Normal' },
      { test: 'Hemoglobin', value: '14.8', unit: 'g/dL', range: '13.5-17.5', status: 'Normal' },
      { test: 'Platelets', value: '250', unit: 'K/μL', range: '150-400', status: 'Normal' },
    ],
  },
  {
    id: 2,
    name: 'Blood Sugar Fasting',
    date: 'August 15, 2026',
    status: 'Abnormal',
    parameters: [
      { test: 'Fasting Glucose', value: '142', unit: 'mg/dL', range: '70-100', status: 'High' },
      { test: 'HbA1c', value: '7.2', unit: '%', range: '4.0-5.6', status: 'High' },
      { test: 'Insulin', value: '18', unit: 'μU/mL', range: '2.6-24.9', status: 'Normal' },
    ],
  },
  {
    id: 3,
    name: 'Lipid Profile',
    date: 'July 10, 2026',
    status: 'Normal',
    parameters: [
      { test: 'Total Cholesterol', value: '195', unit: 'mg/dL', range: '<200', status: 'Normal' },
      { test: 'LDL', value: '110', unit: 'mg/dL', range: '<130', status: 'Normal' },
      { test: 'HDL', value: '55', unit: 'mg/dL', range: '>40', status: 'Normal' },
      { test: 'Triglycerides', value: '150', unit: 'mg/dL', range: '<150', status: 'Normal' },
    ],
  },
];

export default function LabResults() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Results</h1>

        <div className="space-y-4">
          {labTests.map((test) => (
            <div
              key={test.id}
              className={`bg-white rounded-xl shadow-sm border p-6 ${
                test.status === 'Abnormal' ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === test.id ? null : test.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    test.status === 'Abnormal' ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    <FlaskConical className={`w-5 h-5 ${
                      test.status === 'Abnormal' ? 'text-amber-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{test.name}</p>
                    <p className="text-sm text-gray-500">{test.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                    test.status === 'Abnormal'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {test.status === 'Abnormal' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {test.status}
                  </span>
                  {expandedId === test.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedId === test.id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                          <th className="pb-2 font-medium">Test</th>
                          <th className="pb-2 font-medium">Value</th>
                          <th className="pb-2 font-medium">Reference Range</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {test.parameters.map((param, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="py-2 text-gray-900">{param.test}</td>
                            <td className="py-2 font-medium text-gray-900">{param.value} {param.unit}</td>
                            <td className="py-2 text-gray-500">{param.range}</td>
                            <td className="py-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                param.status === 'Normal'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {param.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
