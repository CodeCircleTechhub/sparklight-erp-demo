import api from '../services/api';

export async function downloadPatientReport(patientId: string, fileName?: string) {
  const res = await api.get(`/patients/${patientId}/report.pdf`, {
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `Patient_Registration_Report_${patientId}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
