import { useState } from 'react';
import {
  Heart,
  Thermometer,
  Activity,
  Wind,
  Droplets,
  Weight,
  Bed,
  Pill,
  Clock,
  Save,
} from 'lucide-react';

const wards = [
  { name: 'ICU', beds: 10, occupied: 8, color: 'bg-red-500' },
  { name: 'General Ward', beds: 20, occupied: 14, color: 'bg-blue-500' },
  { name: 'Pediatrics', beds: 15, occupied: 9, color: 'bg-emerald-500' },
  { name: 'Maternity', beds: 12, occupied: 7, color: 'bg-purple-500' },
];

const medicationSchedule = [
  { time: '08:00 AM', patient: 'Room 301 - John Smith', medicine: 'Amoxicillin 500mg', status: 'given' },
  { time: '09:00 AM', patient: 'Room 205 - Emily Davis', medicine: 'Metformin 500mg', status: 'given' },
  { time: '10:30 AM', patient: 'Room 412 - Michael Brown', medicine: 'Insulin 10 units', status: 'pending' },
  { time: '12:00 PM', patient: 'Room 108 - Sarah Wilson', medicine: 'Lisinopril 20mg', status: 'pending' },
  { time: '02:00 PM', patient: 'Room 306 - David Lee', medicine: 'Paracetamol 650mg', status: 'upcoming' },
  { time: '04:00 PM', patient: 'Room 215 - Anna Martinez', medicine: 'Ibuprofen 400mg', status: 'upcoming' },
];

const patients = [
  'Room 101 - Robert Johnson',
  'Room 108 - Sarah Wilson',
  'Room 205 - Emily Davis',
  'Room 215 - Anna Martinez',
  'Room 301 - John Smith',
  'Room 306 - David Lee',
  'Room 412 - Michael Brown',
];

export default function NursePage() {
  const [vitals, setVitals] = useState({
    patient: '',
    temperature: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nurse Station</h1>
          <p className="text-gray-500 mt-1">Record vitals and manage ward assignments</p>
        </div>

        {/* Ward Assignments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wards.map((ward) => {
            const occupancy = Math.round((ward.occupied / ward.beds) * 100);
            return (
              <div key={ward.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{ward.occupied}/{ward.beds}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${ward.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{occupancy}% occupied</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vitals Entry Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Record Vitals</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                <select
                  name="patient"
                  value={vitals.patient}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" /> Temperature (°F)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="98.6"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    value={vitals.heartRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Blood Pressure
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="systolic"
                      value={vitals.systolic}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="120"
                    />
                    <span className="text-gray-400 self-center">/</span>
                    <input
                      type="number"
                      name="diastolic"
                      value={vitals.diastolic}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="80"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5" /> Respiratory Rate
                  </label>
                  <input
                    type="number"
                    name="respiratoryRate"
                    value={vitals.respiratoryRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" /> SpO2 (%)
                  </label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={vitals.oxygenSaturation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="98"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="70"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Vitals
                </button>
              </div>
            </div>
          </div>

          {/* Medication Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
              <Pill className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {medicationSchedule.map((med, i) => (
                <div key={i} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {med.time}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      med.status === 'given' ? 'bg-emerald-100 text-emerald-700' :
                      med.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {med.status === 'given' ? 'Given' : med.status === 'pending' ? 'Pending' : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{med.patient}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{med.medicine}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
