import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, Link, Navigate } from 'react-router-dom';
import { Menu, Bell, LogOut, MessageSquare, ChevronDown, Loader2, CheckCheck } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../utils/dashboardRoutes';
import api from '../../services/api';
import { onSocketEvent, connectSocket } from '../../services/socket';

type UserRole = 'super-admin' | 'manager' | 'receptionist' | 'customer-care' | 'senior-customer-care' | 'nurse' | 'doctor' | 'laboratory' | 'pharmacist' | 'accountant' | 'hr' | 'patient';

interface DashboardLayoutProps {
  role: UserRole;
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRole = (user?.role || '').toLowerCase();
  const routeRole = role.toLowerCase();
  // receptionist and customer care are handled by one person: either portal opens either role
  const FRONT_DESK = ['receptionist', 'customer-care', 'senior-customer-care'];
  const isFrontDeskPair =
    FRONT_DESK.includes(userRole) &&
    (routeRole === 'receptionist' || routeRole === 'customer-care');
  // senior-customer-care shares the customer-care portal routes
  const effectiveRole =
    userRole === 'senior-customer-care' && routeRole === 'customer-care'
      ? 'customer-care'
      : userRole;
  const isRoleMismatch = !!user && !!userRole && !isFrontDeskPair && effectiveRole !== routeRole;

  const notifPath = userRole === 'patient' ? '/patient/notifications' : '/system/notifications';

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get(notifPath);
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // keep whatever we had
    }
  }, [notifPath]);

  // notifications: load when the dashboard opens ("when they come online"),
  // refresh periodically, and push instantly over the realtime socket
  useEffect(() => {
    if (!user) return;
    connectSocket();
    setNotifLoading(true);
    fetchNotifications().finally(() => setNotifLoading(false));
    const timer = setInterval(fetchNotifications, 20000);
    const onFocus = () => fetchNotifications();
    window.addEventListener('focus', onFocus);
    const off = onSocketEvent('notification', () => fetchNotifications());
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      off();
    };
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!showDropdown && !showNotifications) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown, showNotifications]);

  const openNotification = async (n: any) => {
    setShowNotifications(false);
    if (!n.read && n._id) {
      try {
        await api.put(`/system/notifications/${n._id}/read`);
        setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
        setUnread((prev) => Math.max(0, prev - 1));
      } catch { /* ignore */ }
    }
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    try {
      await api.put(`${notifPath}/read-all`);
      setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
      setUnread(0);
    } catch { /* ignore */ }
  };

  const formatNotifTime = (ts: string) => {
    try {
      const diff = Date.now() - new Date(ts).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return ts;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isRoleMismatch) {
    const target = getDashboardRoute(userRole);
    return <Navigate to={target} replace />;
  }

  const displayName = user.fullName || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        key={`${routeRole}-${userRole}`}
        role={(userRole === 'senior-customer-care' ? 'senior-customer-care' : role) as UserRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            {userRole !== 'patient' && (
              <Link
                to="/chat"
                className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                title="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
            )}

            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 max-w-[92vw] bg-white rounded-xl shadow-lg ring-1 ring-black/10 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Notifications
                      {unread > 0 && (
                        <span className="ml-2 inline-flex items-center px-1.5 h-4 text-[10px] font-bold rounded-full bg-red-100 text-red-600">
                          {unread} new
                        </span>
                      )}
                    </p>
                    <button
                      onClick={markAllRead}
                      disabled={unread === 0}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {notifLoading && notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n._id}
                          onClick={() => openNotification(n)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${!n.read ? 'bg-blue-50/60' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
                            <div className={!n.read ? '' : 'pl-4'}>
                              <p className="text-sm font-medium text-gray-900">{n.title}</p>
                              {n.message && (
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                              )}
                              <p className="text-[11px] text-gray-400 mt-1">{formatNotifTime(n.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <Link
                    to={userRole === 'patient' ? '/patient/notifications' : getDashboardRoute(userRole as UserRole).replace('/dashboard', '/notifications')}
                    onClick={() => setShowNotifications(false)}
                    className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-2.5 border-t border-gray-100"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            <div ref={dropdownRef} className="relative border-l border-gray-200 pl-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {displayName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 capitalize">{(user.role || '').replace(/-/g, ' ')}</p>
                    {user.email && (
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    )}
                  </div>
                  {userRole !== 'patient' && (
                    <Link
                      to="/chat"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Messages
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
