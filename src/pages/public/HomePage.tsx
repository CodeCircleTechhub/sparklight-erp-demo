import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  Calendar,
  Pill,
  FlaskConical,
  CreditCard,
  ArrowRight,
  Clock,
  HeartPulse,
  Activity,
  Building2,
  Zap,
  Star,
  Quote,
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react';

const stats = [
  { icon: Stethoscope, label: 'Doctors', value: '500+', color: 'from-blue-500 to-blue-600' },
  { icon: Users, label: 'Patients', value: '10,000+', color: 'from-emerald-500 to-emerald-600' },
  { icon: Building2, label: 'Departments', value: '50+', color: 'from-purple-500 to-purple-600' },
  { icon: Clock, label: 'Emergency', value: '24/7', color: 'from-rose-500 to-rose-600' },
];

const features = [
  {
    icon: Users,
    title: 'Patient Management',
    description: 'Complete patient lifecycle management from registration to discharge.',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Staff Management',
    description: 'Efficiently manage doctor schedules, nurse assignments, and staff.',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: Calendar,
    title: 'Appointments',
    description: 'Online appointment booking with real-time availability.',
    gradient: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'Complete pharmacy management with inventory tracking.',
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory',
    description: 'Streamlined lab workflows from sample collection to results.',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
  },
  {
    icon: CreditCard,
    title: 'Billing',
    description: 'Integrated billing with insurance claim processing.',
    gradient: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50',
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: 'Expert Medical Team',
    description: 'Highly qualified healthcare professionals committed to exceptional patient care.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Modern Technology',
    description: 'Cutting-edge medical technology for accurate diagnoses and efficient treatments.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: HeartPulse,
    title: '24/7 Emergency',
    description: 'Round-the-clock emergency services with rapid response teams.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Shield,
    title: 'Trusted & Secure',
    description: 'HIPAA compliant with bank-level security for all patient data.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Comprehensive dashboards and reports for better decision making.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: CheckCircle,
    title: 'Easy Integration',
    description: 'Seamless integration with existing hospital systems and workflows.',
    color: 'from-cyan-500 to-cyan-600',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    quote: 'SparkLight has transformed how our hospital operates. Patient wait times have decreased dramatically.',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Cardiologist',
    quote: 'The system is incredibly intuitive. Managing patient records has never been easier.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Hospital Administrator',
    quote: 'From billing to pharmacy, SparkLight covers every aspect. The analytics help us make better decisions.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          {/* Floating shapes */}
          <div className="absolute top-20 left-[10%] w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 left-[25%] w-3 h-3 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-32 right-[15%] w-5 h-5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-[30%] w-4 h-4 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-20 left-[20%] w-6 h-6 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Trusted by 10,000+ Healthcare Professionals
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
                  SparkLight
                </span>{' '}
                Hospital ERP
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 leading-relaxed">
                Comprehensive hospital management system designed to streamline
                operations, enhance patient care, and optimize healthcare delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-primary-100">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-primary-100">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-primary-100">Free Trial</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center animate-fade-in-right">
              <div className="relative w-96 h-96">
                {/* Outer ring */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                {/* Middle ring */}
                <div className="absolute inset-8 border-2 border-white/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                {/* Center */}
                <div className="absolute inset-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Activity className="w-24 h-24 text-white animate-pulse" />
                </div>
                {/* Floating icons */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '0s' }}>
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '1s' }}>
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '1.5s' }}>
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Modern Healthcare
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to streamline hospital operations in one unified platform
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${feature.bgLight} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                SparkLight
              </span>{' '}
              Advantage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              What makes SparkLight the preferred choice for healthcare institutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.title}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What People Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Trusted by healthcare professionals worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                <Quote className="w-10 h-10 text-primary-300 mb-4 relative z-10" />
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic relative z-10">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-primary-600 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of healthcare institutions that trust SparkLight to
            manage their operations efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/login"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
