import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Award,
  TrendingUp,
  Stethoscope,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We treat every patient with empathy, kindness, and respect.',
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparency and honesty guide every decision we make.',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Continuous improvement is at our core.',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'Embracing cutting-edge technology to advance healthcare.',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
];

const leadership = [
  {
    name: 'Dr. Robert Williams',
    role: 'Chief Executive Officer',
    initials: 'RW',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Dr. Amanda Foster',
    role: 'Chief Medical Officer',
    initials: 'AF',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'James Mitchell',
    role: 'Chief Technology Officer',
    initials: 'JM',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Dr. Lisa Chen',
    role: 'Head of Operations',
    initials: 'LC',
    gradient: 'from-rose-500 to-rose-600',
  },
];

const stats = [
  { icon: Stethoscope, value: '500+', label: 'Expert Doctors', color: 'from-blue-500 to-blue-600' },
  { icon: Users, value: '10,000+', label: 'Patients Served', color: 'from-emerald-500 to-emerald-600' },
  { icon: Building2, value: '50+', label: 'Departments', color: 'from-purple-500 to-purple-600' },
  { icon: Clock, value: '24/7', label: 'Emergency Care', color: 'from-rose-500 to-rose-600' },
];

const milestones = [
  { year: '2010', title: 'Founded', description: 'SparkLight Hospital ERP was founded with a vision to transform healthcare management.' },
  { year: '2015', title: 'Growth', description: 'Expanded to serve 50+ hospitals across the region.' },
  { year: '2020', title: 'Innovation', description: 'Launched AI-powered analytics and cloud-based solutions.' },
  { year: '2024', title: 'Global Reach', description: 'Now serving 200+ hospitals worldwide with 10M+ patient records.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-20 left-[10%] w-4 h-4 bg-white/20 rounded-full animate-bounce" />
          <div className="absolute top-40 right-[15%] w-5 h-5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-[20%] w-6 h-6 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
              SparkLight
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Pioneering healthcare management solutions since 2010, empowering
            hospitals to deliver exceptional patient care through technology and
            innovation.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', description: 'To revolutionize hospital management by providing innovative, user-friendly, and comprehensive ERP solutions.' },
              { icon: Eye, title: 'Our Vision', description: 'To become the global leader in hospital management systems, setting new standards for healthcare technology.' },
              { icon: Heart, title: 'Our Values', description: 'Compassion, integrity, and excellence form the foundation of everything we do.' },
            ].map((item, index) => (
              <div
                key={item.title}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Story
              </span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in-${index % 2 === 0 ? 'left' : 'right'}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                    {milestone.year.slice(2)}
                  </div>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Core Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Principles That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Guide Us
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className="group text-center p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${value.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Leadership Team
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The experienced professionals driving our mission forward
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((person, index) => (
              <div
                key={person.name}
                className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${person.gradient} text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {person.initials}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                <p className="text-primary-600 text-sm mt-1 font-medium">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-100 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare institutions that trust SparkLight to manage their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
