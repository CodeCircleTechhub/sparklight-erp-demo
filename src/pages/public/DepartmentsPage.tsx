import {
  Siren,
  Heart,
  Brain,
  Bone,
  Baby,
  Radiation,
  ScanLine,
  FlaskConical,
  Scissors,
  ShieldAlert,
  Pill,
  TestTubeDiagonal,
  Dumbbell,
} from 'lucide-react';

const departments = [
  {
    icon: Siren,
    title: 'Emergency',
    description:
      'Round-the-clock emergency department with rapid triage systems, trauma bays, and a dedicated team of emergency medicine specialists. Equipped to handle all critical and life-threatening situations.',
  },
  {
    icon: Heart,
    title: 'Cardiology',
    description:
      'Full-spectrum cardiac care from preventive screenings to interventional procedures. Features cardiac ICU, electrophysiology lab, and cardiac rehabilitation unit.',
  },
  {
    icon: Brain,
    title: 'Neurology',
    description:
      'Advanced neurological care with EEG, EMG, and neuroimaging facilities. Specializes in stroke management, epilepsy treatment, and movement disorders.',
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    description:
      'Comprehensive musculoskeletal care including joint replacement surgery, spinal surgery, sports medicine, and post-operative physiotherapy programs.',
  },
  {
    icon: Baby,
    title: 'Pediatrics',
    description:
      'Child-friendly environment with pediatric ICUs, neonatal care units, and specialized pediatric specialists covering all subspecialties.',
  },
  {
    icon: Radiation,
    title: 'Oncology',
    description:
      'Multi-disciplinary cancer care with tumor boards, advanced radiation therapy, chemotherapy suites, and oncology day care units for comprehensive cancer treatment.',
  },
  {
    icon: ScanLine,
    title: 'Radiology',
    description:
      'Full-service imaging center with 3T MRI, 128-slice CT scanner, digital X-ray, mammography, and interventional radiology suites for precise diagnostics.',
  },
  {
    icon: FlaskConical,
    title: 'Pathology',
    description:
      'NABL-accredited laboratory with advanced histopathology, cytopathology, and molecular diagnostics. Processes over 1,000 samples daily with rapid turnaround.',
  },
  {
    icon: Scissors,
    title: 'Surgery',
    description:
      'Modern operation theaters with laminar airflow, advanced anesthesia systems, and minimally invasive surgical equipment for safe and efficient surgical procedures.',
  },
  {
    icon: ShieldAlert,
    title: 'ICU',
    description:
      'State-of-the-art intensive care units with ventilators, cardiac monitors, dialysis machines, and 24/7 intensivist coverage for critically ill patients.',
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description:
      'In-house pharmacy with automated dispensing systems, drug interaction checks, and a wide inventory of medications ensuring timely and accurate dispensing.',
  },
  {
    icon: TestTubeDiagonal,
    title: 'Laboratory',
    description:
      'Full-service clinical laboratory offering hematology, biochemistry, microbiology, and serology testing with automated analyzers and strict quality controls.',
  },
  {
    icon: Dumbbell,
    title: 'Physiotherapy',
    description:
      'Rehabilitation department with dedicated physiotherapists, electrotherapy equipment, hydrotherapy pools, and exercise programs for recovery and mobility.',
  },
];

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our Departments
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            A wide network of specialized departments working together to
            provide holistic healthcare under one roof.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.title}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-primary-200 transition-all"
              >
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <dept.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {dept.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
