import { Building2, Stethoscope, HeartPulse, Brain, Bone, Baby, Radiation, Pill, UserCog } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const departments = [
  { name: 'Emergency', head: 'Dr. Ibrahim Musa', staffCount: 18, todayPatients: 32, revenue: 2450000, icon: Stethoscope, color: 'red' },
  { name: 'Cardiology', head: 'Dr. Fatima Usman', staffCount: 12, todayPatients: 15, revenue: 3200000, icon: HeartPulse, color: 'blue' },
  { name: 'Neurology', head: 'Dr. Oluwaseun Adeleye', staffCount: 10, todayPatients: 8, revenue: 1800000, icon: Brain, color: 'purple' },
  { name: 'Orthopedics', head: 'Dr. Abubakar Suleiman', staffCount: 14, todayPatients: 12, revenue: 2100000, icon: Bone, color: 'yellow' },
  { name: 'Pediatrics', head: 'Dr. Aisha Bello', staffCount: 11, todayPatients: 22, revenue: 1600000, icon: Baby, color: 'green' },
  { name: 'Oncology', head: 'Dr. Chukwuemeka Obi', staffCount: 9, todayPatients: 6, revenue: 4500000, icon: UserCog, color: 'red' },
  { name: 'Radiology', head: 'Dr. Hauwa Danjuma', staffCount: 8, todayPatients: 18, revenue: 1900000, icon: Radiation, color: 'blue' },
  { name: 'Pharmacy', head: 'Pharm. Tunde Adesanya', staffCount: 15, todayPatients: 45, revenue: 850000, icon: Pill, color: 'green' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
};

function formatNaira(amount: number) {
  return '₦' + amount.toLocaleString('en-NG');
}

export default function AdminDepartments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Departments" icon={Building2} description="Overview of all hospital departments" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const colors = colorMap[dept.color];
          return (
            <div key={dept.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${colors.bg} ${colors.text} rounded-lg p-2.5`}>
                  <dept.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{dept.name}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Head</span>
                  <span className="font-medium text-gray-900">{dept.head}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Staff</span>
                  <span className="font-medium text-gray-900">{dept.staffCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Today's Patients</span>
                  <span className="font-medium text-gray-900">{dept.todayPatients}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Revenue</span>
                  <span className="font-semibold text-green-600">{formatNaira(dept.revenue)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
