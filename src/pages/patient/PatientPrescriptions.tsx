import {
  Pill,
  Calendar,
  Stethoscope,
  Printer,
} from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    date: 'September 8, 2026',
    doctor: 'Dr. Ahmed Hassan',
    medicines: [
      { name: 'Metformin 500mg', dosage: 'Twice daily', duration: '30 days' },
      { name: 'Lisinopril 10mg', dosage: 'Once daily', duration: '30 days' },
    ],
  },
  {
    id: 2,
    date: 'August 20, 2026',
    doctor: 'Dr. Sarah Wilson',
    medicines: [
      { name: 'Amitriptyline 25mg', dosage: 'At bedtime', duration: '14 days' },
    ],
  },
  {
    id: 3,
    date: 'July 15, 2026',
    doctor: 'Dr. Ahmed Hassan',
    medicines: [
      { name: 'Vitamin D3 1000IU', dosage: 'Once daily', duration: '60 days' },
    ],
  },
];

export default function PatientPrescriptions() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>

        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {rx.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Stethoscope className="w-4 h-4" />
                      {rx.doctor}
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 w-fit">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                {rx.medicines.map((med, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{med.name}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">Dosage: <span className="font-medium text-gray-700">{med.dosage}</span></span>
                      <span className="text-gray-500">Duration: <span className="font-medium text-gray-700">{med.duration}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
