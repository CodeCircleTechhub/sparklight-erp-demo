import { Building2, Users, UserCheck, Stethoscope, DollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const departments = [
  { name: 'Cardiology', head: 'Dr. Smith', staffCount: 18, todayPatients: 24, revenue: '₦18,500' },
  { name: 'Neurology', head: 'Dr. Patel', staffCount: 14, todayPatients: 18, revenue: '₦14,200' },
  { name: 'Orthopedics', head: 'Dr. Garcia', staffCount: 12, todayPatients: 22, revenue: '₦12,800' },
  { name: 'Pediatrics', head: 'Dr. Lee', staffCount: 16, todayPatients: 30, revenue: '₦10,500' },
  { name: 'Oncology', head: 'Dr. Kim', staffCount: 10, todayPatients: 12, revenue: '₦22,300' },
  { name: 'Emergency', head: 'Dr. Adams', staffCount: 22, todayPatients: 38, revenue: '₦15,700' },
  { name: 'Dermatology', head: 'Dr. Chen', staffCount: 8, todayPatients: 15, revenue: '₦8,400' },
  { name: 'Radiology', head: 'Dr. Brown', staffCount: 10, todayPatients: 20, revenue: '₦11,200' },
];

export default function ManagerDepartments() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Departments" icon={Building2} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div key={dept.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{dept.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <span>Head: <span className="font-medium text-gray-900">{dept.head}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>Staff: <span className="font-medium text-gray-900">{dept.staffCount}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck className="w-4 h-4 text-violet-500" />
                  <span>Today's Patients: <span className="font-medium text-gray-900">{dept.todayPatients}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <span>Revenue: <span className="font-medium text-green-600">{dept.revenue}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
