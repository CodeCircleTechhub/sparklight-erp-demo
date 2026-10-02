import api from '../services/api';

// downloads a lab document (generated result PDF or an uploaded attachment) as a file
export async function downloadLabFile(url: string, fileName: string) {
  const res = await api.get(url, { responseType: 'blob' });
  const blob = new Blob([res.data]);
  const url2 = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url2;
  a.download = fileName || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url2);
}

export const downloadLabResultPdf = (testMongoId: string, fileName: string) =>
  downloadLabFile(`/laboratory/${testMongoId}/result.pdf`, fileName || 'lab-result.pdf');

export const downloadLabAttachment = (testMongoId: string, idx: number, fileName: string) =>
  downloadLabFile(`/laboratory/${testMongoId}/attachments/${idx}`, fileName || `attachment-${idx + 1}`);
