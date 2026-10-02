import { useState, useEffect, useCallback } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';

interface AuditLog {
  timestamp: string;
  user: string;
  role: string;
  action: string;
  record: string;
  ip: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/system/audit-logs', { params: { search: searchTerm } });
      setLogs(data.logs ?? []);
    } catch {
      console.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchLogs]);

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" icon={FileText} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading audit logs...</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Record</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">No audit logs found</td>
                  </tr>
                ) : (
                  logs.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap font-mono text-xs">{formatTimestamp(row.timestamp)}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.user}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                          {row.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.action}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.record}</td>
                      <td className="py-3 px-4 text-gray-400 whitespace-nowrap font-mono text-xs">{row.ip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
