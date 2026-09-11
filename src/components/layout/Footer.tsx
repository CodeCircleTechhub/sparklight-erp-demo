import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Briefcase, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from '../logo/Logo';

const quickLinks = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Departments', to: '/departments' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Contact', to: '/contact' },
];

const departments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Emergency',
];

const contactInfo = [
  { icon: MapPin, text: '123 Healthcare Avenue, Medical District, Abuja, Nigeria' },
  { icon: Phone, text: '+2348086142293' },
  { icon: Mail, text: 'info@sparklight.com' },
  { icon: Clock, text: '24/7 Emergency Services' },
];

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Briefcase, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="mb-6 text-sm text-gray-400">
              Providing world-class healthcare services with compassion,
              excellence, and innovation.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary-600"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Departments
            </h3>
            <ul className="space-y-2">
              {departments.map((dept) => (
                <li key={dept}>
                  <Link
                    to="/departments"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Info
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <info.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" />
                  <span className="text-sm text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SparkLight. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
