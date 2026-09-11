import { Bed, Building, Users } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const wards = [
  { name: 'Cardiology', totalBeds: 20, occupied: 15, available: 5, status: 'Active' },
  { name: 'ICU', totalBeds: 10, occupied: 8, available: 2, status: 'Active' },
  { name: 'General', totalBeds: 30, occupied: 22, available: 8, status: 'Active' },
  { name: 'Orthopedics', totalBeds: 18, occupied: 12, available: 6, status: 'Active' },
  { name: 'Neurology', totalBeds: 15, occupied: 10, available: 5, status: 'Active' },
  { name: 'Oncology', totalBeds: 16, occupied: 14, available: 2, status: 'Active' },
];

function BedDots({ occupied, total }: { occupied: number; total: number }) {
  const dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(
      <div
        key={i}
        className={`w-3 h-3 rounded-full ${i < occupied ? 'bg-red-400' : 'bg-green-400'}`}
        title={i < occupied ? 'Occupied' : 'Available'}
      />
    );
  }
  return <div className="flex flex-wrap gap-1.5">{dots}</div>;
}

export default function WardManagement() {
  return (
    <div className="space-y-6">
      <PageHeader title="Ward Management" description="Monitor ward occupancy and bed status" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wards.map((ward) => {
          const occupancyRate = Math.round((ward.occupied / ward.totalBeds) * 100);
          return (
            <div key={ward.name} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-100">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {ward.status}
                    </span>
                  </div>
                </div>
                <span className={`text-lg font-bold ${occupancyRate > 80 ? 'text-red-600' : 'text-gray-900'}`}>
                  {occupancyRate}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span>Total Beds</span>
                  </div>
                  <span className="font-medium text-gray-900">{ward.totalBeds}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Occupied</span>
                  </div>
                  <span className="font-medium text-red-600">{ward.occupied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span>Available</span>
                  </div>
                  <span className="font-medium text-green-600">{ward.available}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Bed Status</p>
                <BedDots occupied={ward.occupied} total={ward.totalBeds} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}