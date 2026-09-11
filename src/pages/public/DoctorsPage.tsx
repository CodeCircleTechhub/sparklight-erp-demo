import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

const departments = [
  'All',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Radiology',
  'Surgery',
];

const doctors = [
  {
    name: 'Dr. Sarah Mitchell',
    initials: 'SM',
    color: 'bg-primary-600',
    specialty: 'Interventional Cardiologist',
    department: 'Cardiology',
    bio: 'With over 15 years of experience, Dr. Mitchell specializes in complex cardiac interventions and has performed over 2,000 successful angioplasties.',
  },
  {
    name: 'Dr. James Anderson',
    initials: 'JA',
    color: 'bg-emerald-600',
    specialty: 'Neurologist',
    department: 'Neurology',
    bio: 'A renowned neurologist with expertise in stroke management and neurodegenerative disorders. Published over 40 research papers in leading medical journals.',
  },
  {
    name: 'Dr. Emily Rodriguez',
    initials: 'ER',
    color: 'bg-violet-600',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    bio: 'Specializing in joint replacement and minimally invasive spine surgery, Dr. Rodriguez has helped thousands of patients regain mobility.',
  },
  {
    name: 'Dr. Michael Chen',
    initials: 'MC',
    color: 'bg-rose-600',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    bio: 'A compassionate pediatrician dedicated to child health with 12 years of experience in neonatal care and childhood development.',
  },
  {
    name: 'Dr. Priya Sharma',
    initials: 'PS',
    color: 'bg-amber-600',
    specialty: 'Oncologist',
    department: 'Oncology',
    bio: 'Board-certified oncologist with specialized training in targeted therapy and immunotherapy for various types of cancer.',
  },
  {
    name: 'Dr. David Kim',
    initials: 'DK',
    color: 'bg-cyan-600',
    specialty: 'Radiologist',
    department: 'Radiology',
    bio: 'Expert in diagnostic imaging and interventional radiology with proficiency in advanced CT and MRI interpretation techniques.',
  },
  {
    name: 'Dr. Rachel Foster',
    initials: 'RF',
    color: 'bg-pink-600',
    specialty: 'General Surgeon',
    department: 'Surgery',
    bio: 'Highly skilled general surgeon specializing in laparoscopic procedures with a focus on gastrointestinal and bariatric surgery.',
  },
  {
    name: 'Dr. Robert Patel',
    initials: 'RP',
    color: 'bg-indigo-600',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    bio: 'Fellowship-trained cardiologist with expertise in heart failure management, echocardiography, and preventive cardiology.',
  },
];

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredDoctors =
    activeTab === 'All'
      ? doctors
      : doctors.filter((d) => d.department === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Meet Our Doctors
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Our team of highly qualified and experienced physicians is dedicated
            to providing exceptional healthcare with compassion and expertise.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === dept
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-20 h-20 ${doctor.color} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}
                >
                  {doctor.initials}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 text-sm text-center mt-1">
                  {doctor.specialty}
                </p>
                <span className="inline-block mx-auto mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                  {doctor.department}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed mt-4">
                  {doctor.bio}
                </p>
                <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredDoctors.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No doctors found in this department.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
