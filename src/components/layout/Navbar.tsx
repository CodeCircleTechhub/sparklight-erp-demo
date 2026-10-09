import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '../logo/Logo';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Departments', to: '/departments' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Contact', to: '/contact' },
];

const loginOptions = [
  { label: 'Admin Login', to: '/login' },
  { label: 'Staff Login', to: '/login' },
  // { label: 'Patient Login', to: '/login' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen && !loginOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setLoginOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen, loginOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow ${
          scrolled ? 'shadow-md' : 'shadow-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>

            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="relative ml-2">
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  onBlur={() => setTimeout(() => setLoginOpen(false), 150)}
                  className="flex items-center gap-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  Login
                  <ChevronDown className={`h-4 w-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                </button>
                {loginOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                    {loginOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.to}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setLoginOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    {option.label}
                  </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl transition-transform">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col overflow-y-auto px-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
                  Login
                </p>
                {loginOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.to}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
