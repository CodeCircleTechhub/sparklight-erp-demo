import { useState } from 'react';
import {
  Stethoscope,
  Clock,
  Calendar,
  ChevronRight,
  History,
  Save,
  Pill,
} from 'lucide-react';

const patients = [
  { id: 1, name: 'Michael Brown', time: '10:15 AM', type: 'Consultation', age: 45, gender: 'Male' },
  { id: 2, name: 'Sarah Wilson', time: '11:00 AM', type: 'Lab Review', age: 32, gender: 'Female' },
  { id: 3, name: 'David Lee', time: '02:00 PM', type: 'New Patient', age: 58, gender: 'Male' },
  { id: 4, name: 'Anna Martinez', time: '03:30 PM', type: 'Prescription', age: 29, gender: 'Female' },
  { id: 5, name: 'Robert Johnson', time: '04:00 PM', type: 'Follow-up', age: 67, gender: 'Male' },
  { id: 6, name: 'Jennifer White', time: '04:30 PM', type: 'General Checkup', age: 41, gender: 'Female' },
];

const patientHistory = [
  { date: 'Aug 28, 2026', diagnosis: 'Hypertension - Stage 1', prescription: 'Lisinopril 10mg daily' },
  { date: 'Jul 15, 2026', diagnosis: 'Annual Physical', prescription: 'No medication changes' },
  { date: 'Mar 22, 2026', diagnosis: 'Lower back pain', prescription: 'Ibuprofen 400mg as needed' },
];

export default function DoctorStaffPage() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [consultation, setConsultation] = useState({
    diagnosis: '',
    prescription: '',
    followUp: '',
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Panel</h1>
          <p className="text-gray-500 mt-1">Manage consultations and patient care</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Today's Patients</h2>
            <div className="space-y-2">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPatient.id === patient.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{patient.time}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{patient.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Form */}
          <div className="lg:col-span-6 space-y-6">
            {/* Patient Info Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.age} years · {selectedPatient.gender} · {selectedPatient.type}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {selectedPatient.time}
                </div>
              </div>
            </div>

            {/* Consultation Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <textarea
                    value={consultation.diagnosis}
                    onChange={(e) => setConsultation({ ...consultation, diagnosis: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter diagnosis details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Notes</label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={consultation.prescription}
                      onChange={(e) => setConsultation({ ...consultation, prescription: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Medication and dosage..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={consultation.followUp}
                    onChange={(e) => setConsultation({ ...consultation, followUp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Patient History Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Patient History</h2>
            </div>
            <div className="space-y-4">
              {patientHistory.map((visit, i) => (
                <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{visit.date}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{visit.diagnosis}</p>
                  <p className="text-xs text-gray-500 mt-1">{visit.prescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
