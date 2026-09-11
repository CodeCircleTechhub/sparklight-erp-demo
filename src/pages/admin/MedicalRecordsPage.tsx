import { useState } from 'react';
import { Search, FileText, Download } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface MedicalRecord {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  type: string;
  diagnosis: string;
}

const recordsData: MedicalRecord[] = [
  { id: 'MR001', patient: 'John Smith', doctor: 'Dr. Sarah Wilson', date: '2026-09-10', type: 'Consultation', diagnosis: 'Hypertension - Stage 1' },
  { id: 'MR002', patient: 'Emily Davis', doctor: 'Dr. Michael Chen', date: '2026-09-09', type: 'Follow-up', diagnosis: 'Migraine - Chronic' },
  { id: 'MR003', patient: 'Robert Johnson', doctor: 'Dr. Emily Brown', date: '2026-09-08', type: 'Checkup', diagnosis: 'Type 2 Diabetes' },
  { id: 'MR004', patient: 'Maria Garcia', doctor: 'Dr. David Kim', date: '2026-09-07', type: 'Surgery', diagnosis: 'Knee Replacement' },
  { id: 'MR005', patient: 'James Wilson', doctor: 'Dr. Sarah Wilson', date: '2026-09-06', type: 'Emergency', diagnosis: 'Chest Pain - Cardiac' },
  { id: 'MR006', patient: 'Sarah Brown', doctor: 'Dr. James Anderson', date: '2026-09-05', type: 'Lab Test', diagnosis: 'Anemia - Iron Deficiency' },
  { id: 'MR007', patient: 'Michael Lee', doctor: 'Dr. Robert Johnson', date: '2026-09-04', type: 'Consultation', diagnosis: 'Lung Cancer - Stage 2' },
  { id: 'MR008', patient: 'Jennifer Martinez', doctor: 'Dr. Lisa Taylor', date: '2026-09-03', type: 'Checkup', diagnosis: 'Prenatal - Normal' },
  { id: 'MR009', patient: 'David Anderson', doctor: 'Dr. Michael Chen', date: '2026-09-02', type: 'Follow-up', diagnosis: 'Epilepsy - Controlled' },
  { id: 'MR010', patient: 'Lisa Taylor', doctor: 'Dr. Emily Brown', date: '2026-09-01', type: 'Emergency', diagnosis: 'Fracture - Left Radius' },
];

const getTypeBadge = (type: string) => {
  const styles: Record<string, string> = {
    Consultation: 'bg-blue-100 text-blue-800',
    'Follow-up': 'bg-green-100 text-green-800',
    Checkup: 'bg-purple-100 text-purple-800',
    Surgery: 'bg-red-100 text-red-800',
    Emergency: 'bg-orange-100 text-orange-800',
    'Lab Test': 'bg-indigo-100 text-indigo-800',
  };
  return styles[type] || 'bg-gray-100 text-gray-800';
};

const columns: Column[] = [
  {
    key: 'id',
    label: 'Record ID',
    render: (row) => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        <span className="font-mono text-blue-600">{String(row.id ?? '')}</span>
      </div>
    ),
  },
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'doctor', label: 'Doctor' },
  { key: 'date', label: 'Date' },
  {
    key: 'type',
    label: 'Type',
    render: (row) => {
      const type = String(row.type ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(type)}`}>
          {type}
        </span>
      );
    },
  },
  { key: 'diagnosis', label: 'Diagnosis' },
];

const MedicalRecordsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = recordsData.filter(
    (record) =>
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          Export Records
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search records by patient, ID, or diagnosis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={filteredRecords as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
