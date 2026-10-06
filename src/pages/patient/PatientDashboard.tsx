import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Stethoscope,
  Calendar,
  CreditCard,
  FileText,
  KeyRound,
  X,
  AlertCircle,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface DashboardData {
  stats: { totalVisits: number; appointments: number; outstandingBill: number; openCases?: number };
  upcomingAppointment: any | null;
  recentVisits: any[];
  recentDiagnoses: any[];
}

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

const complaintBadge: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Investigating: 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

const requestBadge: Record<string, string> = {
  Requested: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const requestLabel: Record<string, string> = {
  Requested: 'Awaiting approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

const caseBadge = (status: string, level = 0) => {
  if (status === 'Escalated' || level > 0) return 'bg-red-100 text-red-700';
  if (status === 'Resolved' || status === 'Closed') return 'bg-green-100 text-green-700';
  if (status === 'In Progress' || status === 'Assigned') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [saving, setSaving] = useState<'complaint' | 'request' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [requestsError, setRequestsError] = useState('');
  const [complaintForm, setComplaintForm] = useState({
    issue: '',
    description: '',
    priority: 'Medium',
    category: 'Service',
  });
  const [requestForm, setRequestForm] = useState({
    date: '',
    time: '',
    type: 'Consultation',
    complaint: '',
  });

  const loadPatientRequests = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.get('/patient/complaints'),
        api.get('/patient/appointments'),
        api.get('/patient/cases'),
      ]);
      const [c, a, k] = results;
      if (c.status === 'fulfilled') setComplaints(c.value.data.complaints || []);
      if (a.status === 'fulfilled') {
        setRequests((a.value.data.appointments || []).filter((x: any) =>
          ['Requested', 'Approved', 'Rejected'].includes(x.status)));
      }
      if (k.status === 'fulfilled') setCases(k.value.data.cases || []);
      if (results.some((r) => r.status === 'rejected')) {
        setRequestsError('Some items could not be loaded. Refresh to try again.');
      } else {
        setRequestsError('');
      }
    } catch {
      // non-fatal: cards simply stay empty
    }
  }, []);

  useEffect(() => {
    loadPatientRequests();
  }, [loadPatientRequests]);

  const submitComplaint = async (e: FormEvent) => {
    e.preventDefault();
    if (!complaintForm.issue.trim()) {
      setNotice({ kind: 'err', text: 'Please describe your complaint.' });
      return;
    }
    setSaving('complaint');
    setNotice(null);
    try {
      const { data } = await api.post('/patient/complaints', complaintForm);
      setComplaintForm({ issue: '', description: '', priority: 'Medium', category: 'Service' });
      setShowComplaintForm(false);
      setNotice({ kind: 'ok', text: data.message || 'Complaint sent to customer care' });
      await loadPatientRequests();
    } catch (err: any) {
      setNotice({ kind: 'err', text: err.response?.data?.message || 'Could not send complaint' });
    } finally {
      setSaving(null);
    }
  };

  const submitRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestForm.date || !requestForm.complaint.trim()) {
      setNotice({ kind: 'err', text: 'Pick a date and tell us what you need seen for.' });
      return;
    }
    setSaving('request');
    setNotice(null);
    try {
      const { data } = await api.post('/patient/appointments', requestForm);
      setRequestForm({ date: '', time: '', type: 'Consultation', complaint: '' });
      setShowRequestForm(false);
      setNotice({ kind: 'ok', text: data.message || 'Appointment request sent' });
      await loadPatientRequests();
    } catch (err: any) {
      setNotice({ kind: 'err', text: err.response?.data?.message || 'Could not send request' });
    } finally {
      setSaving(null);
    }
  };

  useEffect(() => {
    setShowPasswordPrompt(localStorage.getItem('pwPromptDismissed') !== '1');
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/dashboard');
        if (!cancelled) setData(res.data);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Visits', value: data?.stats.totalVisits ?? 0, icon: Stethoscope, color: 'blue' as const },
    { title: 'Appointments', value: data?.stats.appointments ?? 0, icon: Calendar, color: 'green' as const },
          { title: 'Open Cases', value: data?.stats.openCases ?? 0, icon: FileText, color: 'yellow' as const },
    { title: 'Outstanding Bill', value: `₦${(data?.stats.outstandingBill ?? 0).toLocaleString()}`, icon: CreditCard, color: 'yellow' as const },
  ];

  const upcoming = data?.upcomingAppointment;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName || 'Patient'}</h1>
            <p className="text-gray-500 mt-1">Patient ID: {user?.patientId || '—'}</p>
          </div>
        </div>

        {showPasswordPrompt && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Security reminder</p>
                <p className="text-sm text-amber-800 mt-0.5">
                  You're still using the password from registration. Please change it to keep your account safe.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/patient/change-password"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Change Password
              </Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('pwPromptDismissed', '1');
                  setShowPasswordPrompt(false);
                }}
                className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {notice && (
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              notice.kind === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {notice.text}
          </div>
        )}

        {requestsError && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            {requestsError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">File a Complaint</h2>
              <button
                type="button"
                onClick={() => setShowComplaintForm((v) => !v)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {showComplaintForm ? 'Close' : 'New complaint'}
              </button>
            </div>

            {showComplaintForm && (
              <form onSubmit={submitComplaint} className="space-y-3 mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What went wrong?</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Long wait time at reception"
                    value={complaintForm.issue}
                    onChange={(e) => setComplaintForm({ ...complaintForm, issue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell customer care what happened"
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={complaintForm.priority}
                      onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                    >
                      {['Low', 'Medium', 'High'].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={complaintForm.category}
                      onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    >
                      {['Service', 'Medical', 'Staff', 'Billing', 'Facilities', 'Wait Time', 'Other'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving !== null}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-60"
                >
                  {saving === 'complaint' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                  Send to customer care
                </button>
              </form>
            )}

            {complaints.length === 0 ? (
              <p className="text-sm text-gray-500">No complaints filed yet.</p>
            ) : (
              <ul className="space-y-2">
                {complaints.slice(0, 4).map((c) => (
                  <li key={c._id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-gray-900">{c.issue}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${complaintBadge[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {c.id} · {c.category} · {c.priority} priority · {fmtDate(c.createdAt)}
                    </p>
                    {c.assignedTo && (
                      <p className="text-xs text-blue-600 mt-1">Being handled by {c.assignedTo.fullName}</p>
                    )}
                    {c.resolution && <p className="text-xs text-green-700 mt-1">{c.resolution}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Request an Appointment</h2>
              <button
                type="button"
                onClick={() => setShowRequestForm((v) => !v)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {showRequestForm ? 'Close' : 'New request'}
              </button>
            </div>

            {showRequestForm && (
              <form onSubmit={submitRequest} className="space-y-3 mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred date</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={requestForm.date}
                      onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred time</label>
                    <input
                      type="time"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={requestForm.time}
                      onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={requestForm.type}
                    onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  >
                    {['Consultation', 'Checkup', 'Follow-up', 'Vaccination', 'Emergency', 'Surgery'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason / complaint *</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what you'd like to be seen for"
                    value={requestForm.complaint}
                    onChange={(e) => setRequestForm({ ...requestForm, complaint: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Customer care reviews first, then the manager assigns a doctor or nurse.
                </p>
                <button
                  type="submit"
                  disabled={saving !== null}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-60"
                >
                  {saving === 'request' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  Send request
                </button>
              </form>
            )}

            {requests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending requests.</p>
            ) : (
              <ul className="space-y-2">
                {requests.slice(0, 4).map((r) => (
                  <li key={r._id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-gray-900">{fmtDate(r.date)} {r.time}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${requestBadge[r.status] || 'bg-gray-100 text-gray-600'}`}>
                        {requestLabel[r.status] || r.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{r.type} · {r.appointmentId}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{r.complaint}</p>
                    {r.status === 'Approved' && (
                      <p className="text-xs text-green-700 mt-1">
                        Assigned to {r.assignedToName || r.doctor?.fullName || 'a clinician'}
                        {r.approvalNote ? ` — ${r.approvalNote}` : ''}
                      </p>
                    )}
                    {r.status === 'Rejected' && r.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">{r.rejectionReason}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/patient/appointments"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <MessageSquare className="w-4 h-4" />
              See all appointments
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointment</h2>
            {upcoming ? (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{upcoming.doctor?.fullName || 'Doctor TBA'}</p>
                    <p className="text-sm text-gray-500">{upcoming.department || upcoming.type || 'Consultation'}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {fmtDate(upcoming.date)} — {upcoming.time}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white text-blue-700 border border-blue-200">
                        {upcoming.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-500 border border-gray-100">
                No upcoming appointments.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits</h2>
            <div className="space-y-3">
              {data?.recentVisits?.length ? (
                data.recentVisits.map((visit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{visit.reason || visit.status}</p>
                      <p className="text-xs text-gray-500">{fmtDate(visit.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No visits yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Cases &amp; Escalations</h2>
            <Link to="/patient/cases" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          {cases.length === 0 ? (
            <p className="text-sm text-gray-500">No open cases.</p>
          ) : (
            <ul className="space-y-2">
              {cases.slice(0, 4).map((c) => (
                <li key={c._id} className="p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-gray-900">{c.subject}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${caseBadge(c.status, c.escalationLevel)}`}>
                      {c.escalationLevel > 0 && c.status !== 'Resolved' && c.status !== 'Closed'
                        ? `Escalated · ${c.status}`
                        : c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.caseId} · {c.priority || 'Normal'} priority · updated {fmtDate(c.updatedAt)}
                  </p>
                  {c.escalationLevel > 0 && c.status !== 'Resolved' && c.status !== 'Closed' && (
                    <p className="text-xs text-red-600 mt-1">
                      Escalated to hospital management (level {c.escalationLevel}). HR, the manager, doctor and nurse have been notified.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data?.recentDiagnoses?.length ? (
              data.recentDiagnoses.map((record, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Diagnosis</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{record.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{fmtDate(record.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full">No medical records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
