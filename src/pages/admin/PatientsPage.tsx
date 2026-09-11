import { useState } from 'react';
import { Search, Plus, Phone } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  status: 'Active' | 'Inactive' | 'Discharged';
}

const patientsData: Patient[] = [
  { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', phone: '(555) 123-4567', lastVisit: '2026-09-10', status: 'Active' },
  { id: 'P002', name: 'Emily Davis', age: 32, gender: 'Female', phone: '(555) 234-5678', lastVisit: '2026-09-08', status: 'Active' },
  { id: 'P003', name: 'Robert Johnson', age: 58, gender: 'Male', phone: '(555) 345-6789', lastVisit: '2026-09-05', status: 'Active' },
  { id: 'P004', name: 'Maria Garcia', age: 28, gender: 'Female', phone: '(555) 456-7890', lastVisit: '2026-08-20', status: 'Inactive' },
  { id: 'P005', name: 'James Wilson', age: 67, gender: 'Male', phone: '(555) 567-8901', lastVisit: '2026-09-01', status: 'Active' },
  { id: 'P006', name: 'Sarah Brown', age: 41, gender: 'Female', phone: '(555) 678-9012', lastVisit: '2026-07-15', status: 'Discharged' },
  { id: 'P007', name: 'Michael Lee', age: 55, gender: 'Male', phone: '(555) 789-0123', lastVisit: '2026-09-11', status: 'Active' },
  { id: 'P008', name: 'Jennifer Martinez', age: 36, gender: 'Female', phone: '(555) 890-1234', lastVisit: '2026-08-28', status: 'Active' },
  { id: 'P009', name: 'David Anderson', age: 72, gender: 'Male', phone: '(555) 901-2345', lastVisit: '2026-06-30', status: 'Discharged' },
  { id: 'P010', name: 'Lisa Taylor', age: 29, gender: 'Female', phone: '(555) 012-3456', lastVisit: '2026-09-09', status: 'Active' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-yellow-100 text-yellow-800',
    Discharged: 'bg-gray-100 text-gray-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

const columns: Column[] = [
  {
    key: 'id',
    label: 'Patient ID',
    render: (row) => <span className="font-mono text-blue-600">{String(row.id ?? '')}</span>,
  },
  {
    key: 'name',
    label: 'Name',
    render: (row) => <span className="font-medium">{String(row.name ?? '')}</span>,
  },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  {
    key: 'phone',
    label: 'Phone',
    render: (row) => (
      <div className="flex items-center gap-1">
        <Phone className="w-3 h-3 text-gray-400" />
        {String(row.phone ?? '')}
      </div>
    ),
  },
  { key: 'lastVisit', label: 'Last Visit' },
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

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name, ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={filteredPatients as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default PatientsPage;
