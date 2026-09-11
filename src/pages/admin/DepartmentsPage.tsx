import { Building2, Users, UserCog, DollarSign } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  headDoctor: string;
  staffCount: number;
  patientCount: number;
  monthlyRevenue: string;
  color: string;
}

const departmentsData: Department[] = [
  { id: 'DEPT01', name: 'Cardiology', headDoctor: 'Dr. Sarah Wilson', staffCount: 24, patientCount: 342, monthlyRevenue: '₦45,230', color: 'bg-red-500' },
  { id: 'DEPT02', name: 'Neurology', headDoctor: 'Dr. Michael Chen', staffCount: 18, patientCount: 198, monthlyRevenue: '₦38,120', color: 'bg-purple-500' },
  { id: 'DEPT03', name: 'Emergency', headDoctor: 'Dr. Emily Brown', staffCount: 32, patientCount: 456, monthlyRevenue: '₦52,340', color: 'bg-orange-500' },
  { id: 'DEPT04', name: 'Orthopedics', headDoctor: 'Dr. David Kim', staffCount: 16, patientCount: 167, monthlyRevenue: '₦28,900', color: 'bg-blue-500' },
  { id: 'DEPT05', name: 'Pediatrics', headDoctor: 'Dr. Lisa Taylor', staffCount: 20, patientCount: 289, monthlyRevenue: '₦32,450', color: 'bg-green-500' },
  { id: 'DEPT06', name: 'Radiology', headDoctor: 'Dr. James Anderson', staffCount: 14, patientCount: 234, monthlyRevenue: '₦41,780', color: 'bg-indigo-500' },
  { id: 'DEPT07', name: 'ICU', headDoctor: 'Dr. Maria Garcia', staffCount: 28, patientCount: 45, monthlyRevenue: '₦67,890', color: 'bg-pink-500' },
  { id: 'DEPT08', name: 'Oncology', headDoctor: 'Dr. Robert Johnson', staffCount: 22, patientCount: 123, monthlyRevenue: '₦55,670', color: 'bg-teal-500' },
];

const DepartmentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departmentsData.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ₦{department.color} rounded-lg flex items-center justify-center`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{department.name}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserCog className="w-4 h-4 text-gray-400" />
                <span>Head: {department.headDoctor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{department.staffCount} Staff Members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{department.patientCount} Patients</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>{department.monthlyRevenue}/month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;
