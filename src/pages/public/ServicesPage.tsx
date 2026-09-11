import {
  Siren,
  Scissors,
  Heart,
  Brain,
  Bone,
  Baby,
  Radiation,
  ScanLine,
  Sparkles,
  Eye,
  Smile,
  Dumbbell,
} from 'lucide-react';

const services = [
  {
    icon: Siren,
    title: 'Emergency Care',
    description: '24/7 emergency department with rapid response teams and advanced life-saving equipment.',
    gradient: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
  },
  {
    icon: Scissors,
    title: 'General Surgery',
    description: 'State-of-the-art surgical suites with minimally invasive technology.',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
  },
  {
    icon: Heart,
    title: 'Cardiology',
    description: 'Comprehensive cardiac care including ECG, echocardiography, and angioplasty.',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50',
  },
  {
    icon: Brain,
    title: 'Neurology',
    description: 'Expert diagnosis and treatment of neurological disorders using advanced neuroimaging.',
    gradient: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    description: 'Specialized care for bone, joint, and muscle conditions including joint replacement.',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
  },
  {
    icon: Baby,
    title: 'Pediatrics',
    description: 'Comprehensive healthcare for infants, children, and adolescents.',
    gradient: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50',
  },
  {
    icon: Radiation,
    title: 'Oncology',
    description: 'Complete cancer care with early detection, chemotherapy, and palliative care.',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: ScanLine,
    title: 'Radiology',
    description: 'Advanced diagnostic imaging including X-ray, MRI, CT scan, and ultrasound.',
    gradient: 'from-indigo-500 to-blue-600',
    bgLight: 'bg-indigo-50',
  },
  {
    icon: Sparkles,
    title: 'Dermatology',
    description: 'Expert skin care services including laser treatments and skin rejuvenation.',
    gradient: 'from-fuchsia-500 to-pink-600',
    bgLight: 'bg-fuchsia-50',
  },
  {
    icon: Eye,
    title: 'Ophthalmology',
    description: 'Complete eye care from routine tests to advanced eye surgeries.',
    gradient: 'from-teal-500 to-cyan-600',
    bgLight: 'bg-teal-50',
  },
  {
    icon: Smile,
    title: 'Dental',
    description: 'Full-service dental care including implants, orthodontics, and cosmetic dentistry.',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
  },
  {
    icon: Dumbbell,
    title: 'Physiotherapy',
    description: 'Professional physiotherapy for pain management and rehabilitation.',
    gradient: 'from-lime-500 to-green-600',
    bgLight: 'bg-lime-50',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-20 left-[10%] w-4 h-4 bg-white/20 rounded-full animate-bounce" />
          <div className="absolute bottom-20 right-[15%] w-5 h-5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
            Our Services
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Comprehensive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
              Healthcare Services
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Delivered with compassion, precision, and the highest standards of medical excellence.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-16 h-16 ${service.bgLight} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
