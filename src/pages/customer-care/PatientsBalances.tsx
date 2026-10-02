import { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Filter, Loader2, X, AlertCircle, Wallet, MessageSquare,
  Stethoscope, AlertTriangle, ClipboardList, Send, BedDouble,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const money = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0);

export default function PatientsBalances() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({ billed: 0, paid: 0, outstanding: 0, withBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);
  const [allocating, setAllocating] = useState(false);
  const [allocForm, setAllocForm] = useState({ doctorId: '', nurseId: '', department: '' });
  const [allocError, setAllocError] = useState('');
  const [allocSubmitting, setAllocSubmitting] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [threadId, setThreadId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const canWrite = ['customer-care', 'senior-customer-care', 'receptionist', 'super-admin', 'manager'].includes(user?.role || '');

  const fetchPatients = useCallback(async (q?: string, bal?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 100 };
      if (q) params.search = q;
      if (bal) params.hasOutstanding = bal;
      const { data } = await api.get('/customer-care/patients-balances', { params });
      setItems(data.items || []);
      setTotals(data.totals || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    api.get('/cases/assignable-staff', { params: { role: 'doctor', all: 'true' } })
      .then(({ data }) => setDoctors(data.items || []))
      .catch(() => setDoctors([]));
    api.get('/cases/assignable-staff', { params: { role: 'nurse', all: 'true' } })
      .then(({ data }) => setNurses(data.items || []))
      .catch(() => setNurses([]));
  }, [fetchPatients]);

  useEffect(() => {
    const t = setTimeout(() => fetchPatients(search.trim() || undefined, balanceFilter || undefined), 350);
    return () => clearTimeout(t);
  }, [search, balanceFilter, fetchPatients]);

  const openDetail = async (row: any) => {
    setDetail(row);
    setAllocating(false);
    setAllocError('');
    setAllocForm({ doctorId: row.admission?.doctor?._id || row.admission?.doctor || '', nurseId: row.admission?.nurse?._id || row.admission?.nurse || '', department: row.admission?.department || '' });
    setMessages([]);
    setThreadId('');
    setChatMsg('');
    try {
      const [complRes, thrRes] = await Promise.all([
        api.get('/customer-care/complaints', { params: { patientId: row._id, limit: 20 } }),
        api.get('/chat/threads', { params: { patientId: row._id } }),
      ]);
      setComplaints(complRes.data.complaints || []);
      const thr = (thrRes.data.threads || [])[0];
      if (thr) {
        setThreadId(thr._id);
        const { data } = await api.get(`/chat/threads/${thr._id}`);
        setMessages(data.thread?.messages || []);
      }
    } catch {
      setComplaints([]);
    }
  };

  const submitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    setAllocSubmitting(true);
    setAllocError('');
    try {
      await api.post('/customer-care/assign-doctor', {
        patientId: detail._id,
        admissionId: detail.admission?._id || undefined,
        doctorId: allocForm.doctorId || undefined,
        nurseId: allocForm.nurseId || undefined,
        department: allocForm.department || undefined,
      });
      setAllocating(false);
      await fetchPatients(search.trim() || undefined, balanceFilter || undefined);
      const { data } = await api.get('/customer-care/patients-balances', { params: { search: detail.patientId || detail._id, limit: 5 } });
      const updated = (data.items || []).find((p: any) => p._id === detail._id);
      if (updated) setDetail(updated);
    } catch (err: any) {
      setAllocError(err.response?.data?.message || 'Failed to assign');
    } finally {
      setAllocSubmitting(false);
    }
  };

  const sendChat = async () => {
    if (!chatMsg.trim() || !detail) return;
    setChatBusy(true);
    try {
      let tid = threadId;
      if (!tid) {
        const { data } = await api.post('/chat/threads', {
          patientId: detail._id,
          subject: `Support for ${detail.name || detail.patientId}`,
          body: chatMsg.trim(),
        });
        tid = data.thread?._id;
        setThreadId(tid);
        setMessages(data.thread?.messages || []);
        setChatMsg('');
        return;
      }
      await api.post(`/chat/threads/${tid}/messages`, { body: chatMsg.trim() });
      setChatMsg('');
      const { data } = await api.get(`/chat/threads/${tid}`);
      setMessages(data.thread?.messages || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setChatBusy(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients & Balances"
        description="Patient list with outstanding balances, complaints and chat"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Patients', value: items.length, color: 'text-blue-600', bg: 'bg-blue-100', icon: Users },
          { label: 'With balance', value: totals.withBalance || 0, color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle },
          { label: 'Outstanding', value: money(totals.outstanding), color: 'text-amber-600', bg: 'bg-amber-100', icon: Wallet },
          { label: 'Total paid', value: money(totals.paid), color: 'text-green-600', bg: 'bg-green-100', icon: Wallet },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All balances</option>
              <option value="true">Has outstanding</option>
              <option value="false">Fully paid</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading patients...</span>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No patients found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Billed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Paid</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Outstanding</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cases</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.patientId}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <p>{row.phone || '—'}</p>
                      <p className="text-xs text-gray-400">{row.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{money(row.totalBilled)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{money(row.totalPaid)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${row.hasOutstanding ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {money(row.outstanding)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.openCases || 0} open
                      {row.openComplaints ? ` · ${row.openComplaints} cmp` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.admission ? (
                        <>
                          <p>
                            {row.admission.ward || row.admission.roomNumber || row.admission.admissionId}
                            {row.admission.ward && row.admission.roomNumber ? ` · ${row.admission.roomNumber}` : ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            {row.admission.bed ? `Bed ${row.admission.bed}` : ''}
                          </p>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => openDetail(row)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Open detail"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {canWrite && (
                          <button
                            onClick={() => openDetail(row)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Assign doctor"
                          >
                            <Stethoscope className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{detail.name}</h2>
                <p className="text-sm text-gray-500">{detail.patientId} · {detail.phone || 'no phone'}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Billed</p>
                  <p className="font-semibold text-gray-900">{money(detail.totalBilled)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="font-semibold text-gray-900">{money(detail.totalPaid)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Outstanding</p>
                  <p className={`font-semibold ${detail.hasOutstanding ? 'text-red-600' : 'text-green-600'}`}>
                    {money(detail.outstanding)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Ward / Bed</p>
                  <p className="font-semibold text-gray-900">
                    {detail.admission
                      ? [detail.admission.ward, detail.admission.roomNumber, detail.admission.bed]
                          .filter(Boolean)
                          .join(' · ') || detail.admission.admissionId
                      : 'Not admitted'}
                  </p>
                  {detail.admission?.allocationStatus && (
                    <span
                      className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        detail.admission.allocationStatus === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : detail.admission.allocationStatus === 'Pending Approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {detail.admission.allocationStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Open Complaints
                  </h3>
                  <span className="text-xs text-gray-500">{complaints.length}</span>
                </div>
                {complaints.length === 0 ? (
                  <p className="text-sm text-gray-400">No open complaints</p>
                ) : (
                  <ul className="space-y-2">
                    {complaints.map((c: any) => (
                      <li key={c._id} className="flex items-start justify-between gap-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                        <div>
                          <p className="font-medium text-gray-800">{c.complaintId}: {c.issue}</p>
                          <p className="text-xs text-gray-500">{c.category} · {c.priority}</p>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {c.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {canWrite && (
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-indigo-600" /> Assign Care Team
                    </h3>
                    {!allocating && (
                      <button
                        onClick={() => setAllocating(true)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {!allocating ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-900">
                          {detail.admission?.doctorName || detail.admission?.doctor?.fullName || 'Not assigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Nurse</p>
                        <p className="font-medium text-gray-900">
                          {detail.admission?.nurseName || detail.admission?.nurse?.fullName || 'Not assigned'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={submitAssign} className="space-y-3">
                      {allocError && <p className="text-sm text-red-600">{allocError}</p>}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className={labelClass}>Doctor</label>
                          <select value={allocForm.doctorId} onChange={(e) => setAllocForm({ ...allocForm, doctorId: e.target.value })} className={inputClass}>
                            <option value="">Unassigned</option>
                            {doctors.map((d) => (
                              <option key={d._id} value={d._id}>{d.fullName || d.email}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Nurse</label>
                          <select value={allocForm.nurseId} onChange={(e) => setAllocForm({ ...allocForm, nurseId: e.target.value })} className={inputClass}>
                            <option value="">Unassigned</option>
                            {nurses.map((n) => (
                              <option key={n._id} value={n._id}>{n.fullName || n.email}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Department</label>
                          <input type="text" value={allocForm.department} onChange={(e) => setAllocForm({ ...allocForm, department: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setAllocating(false)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                          Cancel
                        </button>
                        <button type="submit" disabled={allocSubmitting} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1">
                          {allocSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                          Save
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Chat with Patient
                </h3>
                <div className="h-48 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3 mb-3">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No messages yet. Start the conversation.</p>
                  ) : (
                    messages.map((m: any, i: number) => {
                      const isOwn = m.senderRole !== 'patient';
                      return (
                        <div key={m._id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isOwn ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                            {!isOwn && <p className="text-xs font-medium text-blue-600 mb-0.5">{m.senderName}</p>}
                            <p>{m.body}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                              {m.at ? new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="Type a message to the patient..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendChat}
                    disabled={chatBusy || !chatMsg.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                  >
                    {chatBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <ClipboardList className="w-4 h-4" />
                {detail.openCases || 0} open cases · {detail.openComplaints || 0} open complaints
                {detail.admission && (detail.admission.ward || detail.admission.roomNumber) && (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    {[detail.admission.ward, detail.admission.roomNumber, detail.admission.bed]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
