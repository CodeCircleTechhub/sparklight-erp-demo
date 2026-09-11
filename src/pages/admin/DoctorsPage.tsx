import { useState } from 'react';
import { Plus, Star, Clock, Users } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  schedule: string;
  patientCount: number;
  rating: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  initials: string;
}

const doctorsData: Doctor[] = [
  { id: 'D001', name: 'Dr. Sarah Wilson', specialty: 'Cardiology', department: 'Cardiology', schedule: 'Mon-Fri 9AM-5PM', patientCount: 124, rating: 4.8, status: 'Active', initials: 'SW' },
  { id: 'D002', name: 'Dr. Michael Chen', specialty: 'Neurology', department: 'Neurology', schedule: 'Mon-Fri 9AM-5PM', patientCount: 98, rating: 4.6, status: 'Active', initials: 'MC' },
  { id: 'D003', name: 'Dr. Emily Brown', specialty: 'Pediatrics', department: 'Pediatrics', schedule: 'Mon-Wed-Fri 10AM-6PM', patientCount: 156, rating: 4.9, status: 'Active', initials: 'EB' },
  { id: 'D004', name: 'Dr. David Kim', specialty: 'Orthopedics', department: 'Orthopedics', schedule: 'Tue-Thu 8AM-4PM', patientCount: 87, rating: 4.5, status: 'On Leave', initials: 'DK' },
  { id: 'D005', name: 'Dr. James Anderson', specialty: 'Radiology', department: 'Radiology', schedule: 'Mon-Fri 9AM-5PM', patientCount: 112, rating: 4.7, status: 'Active', initials: 'JA' },
  { id: 'D006', name: 'Dr. Robert Johnson', specialty: 'Oncology', department: 'Oncology', schedule: 'Mon-Fri 8AM-4PM', patientCount: 76, rating: 4.4, status: 'Active', initials: 'RJ' },
];

const filterTabs = ['All', 'Active', 'On Leave'];

const DoctorsPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredDoctors = doctorsData.filter((doctor) => {
    if (activeTab === 'All') return true;
    return doctor.status === activeTab;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {doctor.initials}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-blue-600">{doctor.specialty}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Department:</span> {doctor.department}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {doctor.schedule}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-3 h-3" />
                {doctor.patientCount} patients
              </div>
              <div className="flex items-center gap-1">
                {renderStars(doctor.rating)}
                <span className="text-sm text-gray-500 ml-1">({doctor.rating})</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : doctor.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {doctor.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
