import { useState } from 'react';
import { Plus, Phone, Mail, Filter } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  initials: string;
}

const staffData: Staff[] = [
  { id: 'S001', name: 'Dr. Sarah Wilson', role: 'Doctor', department: 'Cardiology', phone: '(555) 111-2222', email: 'sarah.wilson@hospital.com', status: 'Active', initials: 'SW' },
  { id: 'S002', name: 'Dr. Michael Chen', role: 'Doctor', department: 'Neurology', phone: '(555) 222-3333', email: 'michael.chen@hospital.com', status: 'Active', initials: 'MC' },
  { id: 'S003', name: 'Nurse Emily Brown', role: 'Nurse', department: 'Emergency', phone: '(555) 333-4444', email: 'emily.brown@hospital.com', status: 'Active', initials: 'EB' },
  { id: 'S004', name: 'Dr. David Kim', role: 'Doctor', department: 'Orthopedics', phone: '(555) 444-5555', email: 'david.kim@hospital.com', status: 'On Leave', initials: 'DK' },
  { id: 'S005', name: 'Nurse Lisa Taylor', role: 'Nurse', department: 'Pediatrics', phone: '(555) 555-6666', email: 'lisa.taylor@hospital.com', status: 'Active', initials: 'LT' },
  { id: 'S006', name: 'Dr. James Anderson', role: 'Doctor', department: 'Radiology', phone: '(555) 666-7777', email: 'james.anderson@hospital.com', status: 'Active', initials: 'JA' },
  { id: 'S007', name: 'Nurse Maria Garcia', role: 'Nurse', department: 'ICU', phone: '(555) 777-8888', email: 'maria.garcia@hospital.com', status: 'Inactive', initials: 'MG' },
  { id: 'S008', name: 'Dr. Robert Johnson', role: 'Doctor', department: 'Oncology', phone: '(555) 888-9999', email: 'robert.johnson@hospital.com', status: 'Active', initials: 'RJ' },
];

const departments = ['All', 'Cardiology', 'Neurology', 'Emergency', 'Orthopedics', 'Pediatrics', 'Radiology', 'ICU', 'Oncology'];
const roles = ['All', 'Doctor', 'Nurse', 'Technician', 'Admin'];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-gray-100 text-gray-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

const StaffPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredStaff = staffData.filter((staff) => {
    const deptMatch = selectedDepartment === 'All' || staff.department === selectedDepartment;
    const roleMatch = selectedRole === 'All' || staff.role === selectedRole;
    return deptMatch && roleMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === 'All' ? 'All Roles' : role}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {staff.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(staff.status)}`}>
                {staff.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Department:</span> {staff.department}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Phone className="w-3 h-3" />
                {staff.phone}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Mail className="w-3 h-3" />
                {staff.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPage;
