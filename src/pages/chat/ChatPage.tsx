import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Send, ArrowLeft, Search, Loader2, AlertCircle, MessageSquare, Plus, Users,
  Lock, LockOpen, X, UserPlus, Building2, ChevronLeft,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../utils/dashboardRoutes';
import { onSocketEvent } from '../../services/socket';

interface ThreadMsg {
  _id?: string;
  sender?: string;
  senderName: string;
  senderRole: string;
  body: string;
  system?: boolean;
  at: string;
}

interface Thread {
  _id: string;
  threadId?: string;
  type?: 'patient' | 'direct' | 'group';
  title?: string;
  subtitle?: string;
  patientName: string;
  staffName: string;
  staffRole: string;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  myUnread?: number;
  staffUnread?: number;
  patientUnread?: number;
  groupName?: string;
  isAllStaff?: boolean;
  locked?: boolean;
  lockedByName?: string;
  participants?: string[];
  patient?: any;
}

type StaffTab = 'all' | 'staff' | 'patients';

export default function ChatPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ThreadMsg[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<StaffTab>('all');

  // new-chat modal
  const [showNew, setShowNew] = useState(false);
  const [newTab, setNewTab] = useState<'staff' | 'patients' | 'group'>('staff');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [newSearch, setNewSearch] = useState('');
  const [newLoading, setNewLoading] = useState(false);
  const [creating, setCreating] = useState('');
  const [groupForm, setGroupForm] = useState({ name: '', allStaff: true });
  const [lockBusy, setLockBusy] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPatient = user?.role === 'patient';
  const isGroupAdmin = ['super-admin', 'manager', 'hr'].includes(user?.role || '');
  const backTo = getDashboardRoute(user?.role || 'super-admin');

  const fetchThreads = useCallback(async (q?: string) => {
    try {
      const params: any = {};
      if (q) params.search = q;
      const { data } = await api.get('/chat/threads', { params });
      setThreads(data.threads || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    const t = setTimeout(() => fetchThreads(searchQuery.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [searchQuery, fetchThreads]);

  // background refresh of the conversation list
  useEffect(() => {
    listPollRef.current = setInterval(() => fetchThreads(searchQuery.trim() || undefined), 15000);
    return () => {
      if (listPollRef.current) clearInterval(listPollRef.current);
    };
  }, [fetchThreads, searchQuery]);

  // realtime: new messages + group lock changes
  useEffect(() => {
    const offs = [
      onSocketEvent('chat:message', (payload: any) => {
        if (selected && payload?.threadId === selected._id) {
          api
            .get(`/chat/threads/${selected._id}`)
            .then(({ data }) => setMessages(data.thread?.messages || []))
            .catch(() => undefined);
        }
        fetchThreads(searchQuery.trim() || undefined);
      }),
      onSocketEvent('chat:lock', (payload: any) => {
        if (selected && payload?.threadId === selected._id) {
          setSelected((prev) => (prev ? { ...prev, locked: payload.locked, lockedByName: payload.by } : prev));
          api
            .get(`/chat/threads/${selected._id}`)
            .then(({ data }) => setMessages(data.thread?.messages || []))
            .catch(() => undefined);
        }
        fetchThreads(searchQuery.trim() || undefined);
      }),
    ];
    return () => offs.forEach((off) => off());
  }, [selected, fetchThreads, searchQuery]);

  const openThread = async (thread: Thread) => {
    setSelected(thread);
    setMsgLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/chat/threads/${thread._id}`);
      setMessages(data.thread?.messages || []);
      setSelected({ ...thread, ...data.thread, myUnread: 0, locked: data.thread?.locked ?? thread.locked });
      setThreads((prev) => prev.map((t) => (t._id === thread._id ? { ...t, myUnread: 0 } : t)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setMsgLoading(false);
    }
  };

  // polling fallback for the open conversation
  useEffect(() => {
    if (!selected) return;
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/chat/threads/${selected._id}`);
        setMessages(data.thread?.messages || []);
        if (typeof data.thread?.locked === 'boolean') {
          setSelected((prev) => (prev ? { ...prev, locked: data.thread.locked, lockedByName: data.thread.lockedByName } : prev));
        }
      } catch {
        // ignore poll errors
      }
    }, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selected?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selected || sending) return;
    if (selected.type === 'group' && selected.locked) return;
    setSending(true);
    setError('');
    try {
      const { data } = await api.post(`/chat/threads/${selected._id}/messages`, { body: newMessage.trim() });
      setNewMessage('');
      setMessages((prev) => [...prev, data.message]);
      setThreads((prev) =>
        prev.map((t) =>
          t._id === selected._id
            ? { ...t, lastMessage: data.thread?.lastMessage, lastMessageAt: data.thread?.lastMessageAt, myUnread: 0 }
            : t
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const toggleLock = async () => {
    if (!selected || selected.type !== 'group' || lockBusy) return;
    setLockBusy(true);
    try {
      const url = selected.locked
        ? `/chat/threads/${selected._id}/unlock`
        : `/chat/threads/${selected._id}/lock`;
      const { data } = await api.post(url, {});
      if (data.thread) {
        setSelected((prev) => (prev ? { ...prev, locked: data.thread.locked, lockedByName: data.thread.lockedByName } : prev));
        setThreads((prev) => prev.map((t) => (t._id === data.thread._id ? { ...t, locked: data.thread.locked } : t)));
        const detail = await api.get(`/chat/threads/${selected._id}`);
        setMessages(detail.data.thread?.messages || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update lock');
    } finally {
      setLockBusy(false);
    }
  };

  // ---------------- new conversation ----------------
  const openNew = async () => {
    setShowNew(true);
    setNewSearch('');
    setNewLoading(true);
    setError('');
    try {
      if (isPatient) {
        const { data } = await api.get('/chat/agents');
        setAgentList(data.agents || []);
        setNewTab('staff');
      } else {
        const [staffRes, patientRes] = await Promise.all([
          api.get('/chat/staff'),
          api.get('/chat/contacts'),
        ]);
        setStaffList(staffRes.data.staff || []);
        setPatientList(patientRes.data.patients || []);
        setNewTab('staff');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setNewLoading(false);
    }
  };

  const startThread = async (payload: any, key: string) => {
    setCreating(key);
    setError('');
    try {
      const { data } = await api.post('/chat/threads', payload);
      setShowNew(false);
      await fetchThreads();
      if (data.thread) openThread(data.thread);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start conversation');
    } finally {
      setCreating('');
    }
  };

  // deep link: /chat?patient=<patientDocId> (used by customer care "Chat" buttons)
  const [searchParams, setSearchParams] = useSearchParams();
  const deepPatient = searchParams.get('patient');
  const deepHandled = useRef(false);

  useEffect(() => {
    if (!deepPatient || isPatient || deepHandled.current) return;
    deepHandled.current = true;
    setSearchParams({}, { replace: true });
    (async () => {
      setCreating(deepPatient);
      try {
        const { data } = await api.post('/chat/threads', { patientId: deepPatient });
        await fetchThreads();
        if (data.thread) await openThread(data.thread);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to open conversation');
      } finally {
        setCreating('');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepPatient, isPatient]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name.trim()) return;
    await startThread(
      { type: 'group', groupName: groupForm.name.trim(), allStaff: groupForm.allStaff },
      'group'
    );
    setGroupForm({ name: '', allStaff: true });
  };

  // ---------------- labels ----------------
  const displayName = (t: Thread) => {
    if (t.type === 'group') return t.groupName || t.title || 'Group chat';
    if (t.type === 'direct') return t.title || 'Staff chat';
    if (isPatient) return t.staffName || 'Hospital Support';
    return t.patientName || t.title || 'Patient';
  };
  const displayRole = (t: Thread) => {
    if (t.type === 'group') return t.subtitle || 'Group';
    if (t.type === 'direct') return t.subtitle || 'Staff';
    if (isPatient) return t.staffRole || 'Customer Care';
    return 'Patient';
  };
  const unreadOf = (t: Thread) => {
    if (typeof t.myUnread === 'number') return t.myUnread;
    return isPatient ? t.patientUnread || 0 : t.staffUnread || 0;
  };
  const initials = (name: string) =>
    (name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const visibleThreads = threads.filter((t) => {
    if (isPatient) return true;
    if (tab === 'all') return true;
    if (tab === 'staff') return t.type === 'direct' || t.type === 'group';
    return t.type !== 'direct' && t.type !== 'group';
  });

  const patientNameOf = (p: any) =>
    [p.firstName, p.middleName, p.surname].filter(Boolean).join(' ').trim() || p.patientId || 'Patient';

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ---------------- sidebar ---------------- */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link to={backTo} className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-dark-900">Messages</h1>
            <button
              onClick={openNew}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
              title={isPatient ? 'Chat with customer care' : 'Start a conversation'}
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>

          {!isPatient && (
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-3">
              {([['all', 'All'], ['staff', 'Staff'], ['patients', 'Patients']] as [StaffTab, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 px-2 py-1 rounded-md text-xs font-medium ${
                      tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
            </div>
          ) : visibleThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No conversations yet</p>
              <button onClick={openNew} className="text-xs text-blue-600 mt-2 hover:underline">
                {isPatient ? 'Chat with customer care' : 'Start a conversation'}
              </button>
            </div>
          ) : (
            visibleThreads.map((convo) => (
              <button
                key={convo._id}
                onClick={() => openThread(convo)}
                className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selected?._id === convo._id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                    convo.type === 'group'
                      ? 'bg-indigo-100 text-indigo-600'
                      : convo.type === 'direct'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-primary-100 text-primary-600'
                  }`}
                >
                  {convo.type === 'group' ? <Users className="w-5 h-5" /> : initials(displayName(convo))}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-medium text-sm text-dark-900 truncate flex items-center gap-1">
                      {displayName(convo)}
                      {convo.locked && <Lock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {convo.lastMessageAt
                        ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {convo.type === 'direct' || convo.type === 'group'
                      ? displayRole(convo)
                      : convo.subject || 'Patient support'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{convo.lastMessage || 'No messages yet'}</p>
                </div>
                {unreadOf(convo) > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {unreadOf(convo)}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ---------------- conversation ---------------- */}
      {selected ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                  selected.type === 'group'
                    ? 'bg-indigo-100 text-indigo-600'
                    : selected.type === 'direct'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-primary-100 text-primary-600'
                }`}
              >
                {selected.type === 'group' ? <Users className="w-5 h-5" /> : initials(displayName(selected))}
              </div>
              <div className="min-w-0">
                <h2 className="font-medium text-dark-900 truncate flex items-center gap-1.5">
                  {displayName(selected)}
                  {selected.locked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-red-700">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {displayRole(selected)} · {selected.subject || selected.threadId || ''}
                </p>
              </div>
            </div>
            {selected.type === 'group' && isGroupAdmin && (
              <button
                onClick={toggleLock}
                disabled={lockBusy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                title={selected.locked ? 'Unlock the group' : 'Lock the group'}
              >
                {lockBusy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : selected.locked ? (
                  <LockOpen className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                )}
                {selected.locked ? 'Unlock' : 'Lock'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {error && (
              <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {msgLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No messages yet</p>
            ) : (
              messages.map((msg, i) => {
                if (msg.system) {
                  return (
                    <div key={msg._id || i} className="flex justify-center">
                      <span className="text-xs text-gray-500 bg-gray-200/70 px-3 py-1 rounded-full">
                        {msg.senderName} · {msg.body}
                      </span>
                    </div>
                  );
                }
                const own = String(msg.sender || '') === String(user?.id || '');
                return (
                  <div key={msg._id || i} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-lg px-4 py-2 ${own ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'}`}>
                      {!own && <p className="text-xs font-medium text-primary-600 mb-1">{msg.senderName}</p>}
                      <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                      <p className={`text-xs mt-1 ${own ? 'text-primary-200' : 'text-gray-400'}`}>
                        {msg.at ? new Date(msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="bg-white border-t border-gray-200 p-4">
            {selected.type === 'group' && selected.locked ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <Lock className="w-4 h-4" />
                This group is locked{selected.lockedByName ? ` by ${selected.lockedByName}` : ''}.
                {isGroupAdmin ? ' Unlock it to resume the conversation.' : ' Only super admin, manager or HR can unlock it.'}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-3">
          <MessageSquare className="w-10 h-10 text-gray-300" />
          <p className="text-gray-400">Select a conversation to start messaging</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            <UserPlus className="w-4 h-4" />
            {isPatient ? 'Chat with customer care' : 'New conversation'}
          </button>
        </div>
      )}

      {/* ---------------- new conversation modal ---------------- */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNew(false)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {isPatient ? 'Chat with Customer Care' : 'New Conversation'}
              </h2>
              <button onClick={() => setShowNew(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              {!isPatient && (
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setNewTab('staff')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium ${newTab === 'staff' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  >
                    <span className="flex items-center justify-center gap-1.5"><Users className="w-4 h-4" /> Staff</span>
                  </button>
                  <button
                    onClick={() => setNewTab('patients')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium ${newTab === 'patients' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  >
                    <span className="flex items-center justify-center gap-1.5"><Building2 className="w-4 h-4" /> Patient</span>
                  </button>
                  {user?.role === 'super-admin' && (
                    <button
                      onClick={() => setNewTab('group')}
                      className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium ${newTab === 'group' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                    >
                      <span className="flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Group</span>
                    </button>
                  )}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    isPatient ? 'Search customer care agents...'
                      : newTab === 'patients' ? 'Search patients...'
                        : 'Search staff...'
                  }
                  value={newSearch}
                  onChange={(e) => setNewSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {newLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              ) : isPatient ? (
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {agentList.length > 1 && (
                    <p className="text-xs text-gray-500 mb-2">
                      Choose which customer care agent you would like to talk to ({agentList.length} available).
                    </p>
                  )}
                  {agentList.length === 0 && (
                    <p className="text-sm text-gray-400 py-4 text-center">No customer care agents available yet.</p>
                  )}
                  {agentList
                    .filter((a) => (a.fullName || '').toLowerCase().includes(newSearch.toLowerCase()))
                    .map((a) => (
                      <button
                        key={a._id}
                        onClick={() => startThread({ type: 'patient', staffId: a._id }, a._id)}
                        disabled={creating === a._id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left disabled:opacity-60"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {initials(a.fullName || 'CC')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{a.fullName}</p>
                          <p className="text-xs text-gray-500 capitalize">{String(a.role || '').replace(/-/g, ' ')}</p>
                        </div>
                        {creating === a._id && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      </button>
                    ))}
                </div>
              ) : newTab === 'group' ? (
                <form onSubmit={createGroup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group name *</label>
                    <input
                      type="text"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Morning Shift, Management, All Staff Group"
                      required
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={groupForm.allStaff}
                      onChange={(e) => setGroupForm({ ...groupForm, allStaff: e.target.checked })}
                      className="mt-0.5"
                    />
                    <span>
                      Include <strong>all staff</strong> (everyone in the hospital joins this group)
                      <br />
                      <span className="text-xs text-gray-500">
                        Super admin, manager and HR are group admins and can lock / unlock it.
                      </span>
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={creating === 'group'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {creating === 'group' && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Group Chat
                  </button>
                </form>
              ) : newTab === 'staff' ? (
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {staffList
                    .filter((s) =>
                      `${s.fullName} ${s.email} ${s.role} ${s.department || ''}`
                        .toLowerCase()
                        .includes(newSearch.toLowerCase())
                    )
                    .map((s) => (
                      <button
                        key={s._id}
                        onClick={() => startThread({ type: 'direct', staffId: s._id }, s._id)}
                        disabled={creating === s._id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left disabled:opacity-60"
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                          {initials(s.fullName || 'S')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                          <p className="text-xs text-gray-500 capitalize truncate">
                            {String(s.role || '').replace(/-/g, ' ')}
                            {s.department ? ` · ${s.department}` : ''}
                          </p>
                        </div>
                        {creating === s._id && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {patientList
                    .filter((p) =>
                      `${p.firstName} ${p.surname} ${p.patientId}`.toLowerCase().includes(newSearch.toLowerCase())
                    )
                    .map((p) => (
                      <button
                        key={p._id}
                        onClick={() => startThread({ patientId: p._id }, p._id)}
                        disabled={creating === p._id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left disabled:opacity-60"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {initials(patientNameOf(p))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{patientNameOf(p)}</p>
                          <p className="text-xs text-gray-500">{p.patientId}</p>
                        </div>
                        {creating === p._id && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
