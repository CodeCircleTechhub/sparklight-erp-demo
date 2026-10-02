import { LogOut } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import DischargedPatients from '../../components/shared/DischargedPatients';

export default function ManagerDischargedPatients() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discharged Patients"
        icon={LogOut}
        description="Discharged admissions, billing status and the discharging doctor"
      />
      <DischargedPatients />
    </div>
  );
}
