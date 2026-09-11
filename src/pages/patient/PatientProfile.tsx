import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplets,
  Shield,
  Edit,
} from 'lucide-react';

const personalInfo = [
  { label: 'Full Name', value: 'John Doe', icon: User },
  { label: 'Date of Birth', value: 'March 15, 1985', icon: Calendar },
  { label: 'Gender', value: 'Male', icon: User },
  { label: 'Blood Group', value: 'O+', icon: Droplets },
  { label: 'Phone', value: '+1 234 567 890', icon: Phone },
  { label: 'Email', value: 'john.doe@email.com', icon: Mail },
  { label: 'Address', value: '123 Main Street, New York, NY 10001', icon: MapPin },
];

const emergencyContact = [
  { label: 'Name', value: 'Jane Doe' },
  { label: 'Relationship', value: 'Spouse' },
  { label: 'Phone', value: '+1 234 567 891' },
];

const insuranceInfo = [
  { label: 'Provider', value: 'Blue Cross Blue Shield' },
  { label: 'Policy Number', value: 'BCB-2024-56789' },
  { label: 'Expiry', value: 'December 31, 2027' },
];

export default function PatientProfile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              JD
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-500">Patient ID: PT-000123</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personalInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              {emergencyContact.map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Insurance Information
            </h3>
            <div className="space-y-3">
              {insuranceInfo.map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
