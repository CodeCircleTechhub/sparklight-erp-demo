import { LogOut } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import DischargedPatients from '../../components/shared/DischargedPatients';

export default function AdminDischargedPatients() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discharged Patients"
        icon={LogOut}
        description="Every discharged admission and the doctor who signed the discharge"
      />
      <DischargedPatients />
    </div>
  );
}
