import api from '../services/api';

export async function downloadReport(
  type: string,
  opts: { from?: string; to?: string; fileName?: string } = {}
) {
  const params: Record<string, string> = {};
  if (opts.from) params.from = opts.from;
  if (opts.to) params.to = opts.to;

  const res = await api.get(`/reports/${type}.pdf`, {
    params,
    responseType: 'blob',
  });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.fileName || `${type}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
