import { useState } from 'react';
import {
  TestTube,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Save,
  Beaker,
  Activity,
  Microscope,
  Heart,
  Eye,
} from 'lucide-react';

const testRequestQueue = [
  { id: 1, patient: 'John Smith', testType: 'Complete Blood Count', priority: 'urgent', status: 'pending', time: '08:30 AM' },
  { id: 2, patient: 'Emily Davis', testType: 'Lipid Profile', priority: 'normal', status: 'in-progress', time: '09:00 AM' },
  { id: 3, patient: 'Michael Brown', testType: 'Thyroid Function', priority: 'normal', status: 'pending', time: '09:45 AM' },
  { id: 4, patient: 'Sarah Wilson', testType: 'Urinalysis', priority: 'stat', status: 'in-progress', time: '10:15 AM' },
  { id: 5, patient: 'David Lee', testType: 'Liver Function Tests', priority: 'normal', status: 'completed', time: '11:00 AM' },
];

const completedTests = [
  { patient: 'David Lee', testType: 'Liver Function Tests', result: 'Normal', time: '10:45 AM' },
  { patient: 'Anna Martinez', testType: 'Hemoglobin A1C', result: 'Abnormal', time: '09:30 AM' },
  { patient: 'Robert Johnson', testType: 'Chest X-Ray', result: 'Normal', time: '08:15 AM' },
  { patient: 'Jennifer White', testType: 'ECG', result: 'Normal', time: '08:00 AM' },
];

const testTypes = [
  { name: 'Blood Tests', icon: Beaker, price: '₦45', tests: ['CBC', 'Lipid Profile', 'Glucose'] },
  { name: 'Urine Analysis', icon: TestTube, price: '₦30', tests: ['Urinalysis', 'Urine Culture'] },
  { name: 'Imaging', icon: Eye, price: '₦150', tests: ['X-Ray', 'Ultrasound', 'CT Scan'] },
  { name: 'Cardiac', icon: Heart, price: '₦120', tests: ['ECG', 'Echocardiogram'] },
  { name: 'Hormone Panel', icon: Activity, price: '₦85', tests: ['Thyroid', 'Testosterone', 'Estrogen'] },
  { name: 'Microbiology', icon: Microscope, price: '₦65', tests: ['Blood Culture', 'Stool Test'] },
];

export default function LabStaffPage() {
  const [resultForm, setResultForm] = useState({
    testType: '',
    patient: '',
    results: '',
    normalRange: '',
    status: 'Normal',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setResultForm({ ...resultForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratory Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage test requests and results</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search tests..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Request Queue */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Test Request Queue</h2>
              <span className="text-sm text-gray-500">{testRequestQueue.filter(t => t.status !== 'completed').length} pending</span>
            </div>
            <div className="space-y-3">
              {testRequestQueue.map((test) => (
                <div key={test.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{test.patient}</p>
                      <p className="text-sm text-gray-500">{test.testType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ₦{
                        test.priority === 'stat' ? 'bg-red-100 text-red-700' :
                        test.priority === 'urgent' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {test.priority.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ₦{
                        test.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        test.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {test.status === 'in-progress' ? 'In Progress' :
                         test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {test.time}
                    </div>
                    {test.status === 'pending' && (
                      <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 font-medium">
                        Start Test
                      </button>
                    )}
                    {test.status === 'in-progress' && (
                      <button className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 font-medium">
                        Enter Results
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Result Entry Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Results</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
                  <select
                    name="testType"
                    value={resultForm.testType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Test</option>
                    <option value="cbc">Complete Blood Count</option>
                    <option value="lipid">Lipid Profile</option>
                    <option value="thyroid">Thyroid Function</option>
                    <option value="urinalysis">Urinalysis</option>
                    <option value="lft">Liver Function Tests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                  <input
                    type="text"
                    name="patient"
                    value={resultForm.patient}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Results *</label>
                  <textarea
                    name="results"
                    value={resultForm.results}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter test results..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Normal Range</label>
                  <input
                    type="text"
                    name="normalRange"
                    value={resultForm.normalRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 4.5-5.5 x10^6/μL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={resultForm.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                  </select>
                </div>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Submit Results
                </button>
              </div>
            </div>

            {/* Completed Tests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Today</h2>
              <div className="space-y-3">
                {completedTests.map((test, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ₦{
                      test.result === 'Normal' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {test.result === 'Normal' ?
                        <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{test.patient}</p>
                      <p className="text-xs text-gray-500">{test.testType}</p>
                    </div>
                    <span className={`text-xs font-medium ₦{
                      test.result === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {test.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Available Test Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Test Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testTypes.map((type) => (
              <div key={type.name} className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{type.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">{type.price}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {type.tests.map((test) => (
                    <span key={test} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
