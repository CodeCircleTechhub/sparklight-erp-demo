import { FlaskConical, Beaker, ScanLine, Activity, Clock, CheckCircle } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface TestType {
  id: string;
  name: string;
  icon: React.ReactNode;
  testsToday: number;
  color: string;
}

interface LabTest {
  id: string;
  patient: string;
  testType: string;
  orderedBy: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

const testTypes: TestType[] = [
  { id: 'TT01', name: 'Blood Test', icon: <FlaskConical className="w-6 h-6" />, testsToday: 12, color: 'bg-red-500' },
  { id: 'TT02', name: 'Urine Analysis', icon: <Beaker className="w-6 h-6" />, testsToday: 8, color: 'bg-yellow-500' },
  { id: 'TT03', name: 'X-Ray', icon: <ScanLine className="w-6 h-6" />, testsToday: 5, color: 'bg-blue-500' },
  { id: 'TT04', name: 'MRI', icon: <Activity className="w-6 h-6" />, testsToday: 3, color: 'bg-purple-500' },
  { id: 'TT05', name: 'CT Scan', icon: <ScanLine className="w-6 h-6" />, testsToday: 4, color: 'bg-indigo-500' },
  { id: 'TT06', name: 'Ultrasound', icon: <Activity className="w-6 h-6" />, testsToday: 6, color: 'bg-green-500' },
  { id: 'TT07', name: 'ECG', icon: <Activity className="w-6 h-6" />, testsToday: 7, color: 'bg-pink-500' },
  { id: 'TT08', name: 'Biopsy', icon: <FlaskConical className="w-6 h-6" />, testsToday: 2, color: 'bg-orange-500' },
];

const pendingTests: LabTest[] = [
  { id: 'LT001', patient: 'John Smith', testType: 'Blood Test', orderedBy: 'Dr. Sarah Wilson', date: '2026-09-11', status: 'Pending' },
  { id: 'LT002', patient: 'Emily Davis', testType: 'MRI', orderedBy: 'Dr. Michael Chen', date: '2026-09-11', status: 'In Progress' },
  { id: 'LT003', patient: 'Robert Johnson', testType: 'X-Ray', orderedBy: 'Dr. Emily Brown', date: '2026-09-11', status: 'Pending' },
  { id: 'LT004', patient: 'Maria Garcia', testType: 'Blood Test', orderedBy: 'Dr. David Kim', date: '2026-09-11', status: 'Pending' },
];

const completedTests: LabTest[] = [
  { id: 'LT005', patient: 'James Wilson', testType: 'ECG', orderedBy: 'Dr. Sarah Wilson', date: '2026-09-10', status: 'Completed' },
  { id: 'LT006', patient: 'Sarah Brown', testType: 'Blood Test', orderedBy: 'Dr. James Anderson', date: '2026-09-10', status: 'Completed' },
  { id: 'LT007', patient: 'Michael Lee', testType: 'CT Scan', orderedBy: 'Dr. Robert Johnson', date: '2026-09-09', status: 'Completed' },
  { id: 'LT008', patient: 'Jennifer Martinez', testType: 'Ultrasound', orderedBy: 'Dr. Lisa Taylor', date: '2026-09-09', status: 'Completed' },
  { id: 'LT009', patient: 'David Anderson', testType: 'Biopsy', orderedBy: 'Dr. Michael Chen', date: '2026-09-08', status: 'Completed' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

const pendingColumns: Column[] = [
  { key: 'id', label: 'Test ID', render: (row) => <span className="font-mono text-blue-600">{String(row.id ?? '')}</span> },
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'testType', label: 'Test Type' },
  { key: 'orderedBy', label: 'Ordered By' },
  { key: 'date', label: 'Date' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const completedColumns: Column[] = [
  { key: 'id', label: 'Test ID', render: (row) => <span className="font-mono text-blue-600">{String(row.id ?? '')}</span> },
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'testType', label: 'Test Type' },
  { key: 'orderedBy', label: 'Ordered By' },
  { key: 'date', label: 'Date' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const LaboratoryPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Management</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {testTypes.map((testType) => (
          <div
            key={testType.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${testType.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              {testType.icon}
            </div>
            <h3 className="font-medium text-gray-900">{testType.name}</h3>
            <p className="text-sm text-gray-500">{testType.testsToday} tests today</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">Pending Tests</h2>
        </div>
        <DataTable columns={pendingColumns} data={pendingTests as unknown as Record<string, unknown>[]} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">Completed Tests</h2>
        </div>
        <DataTable columns={completedColumns} data={completedTests as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default LaboratoryPage;
