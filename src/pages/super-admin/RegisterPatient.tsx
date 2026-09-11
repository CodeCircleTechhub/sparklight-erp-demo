import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypeOptions = ['AA', 'AS', 'SS', 'AC', 'SC'];
const maritalStatusOptions = ['Single', 'Maried', 'Divorced', 'Widowed', 'Separated'];
const stateOptions = ['Lagos', 'Abuja', 'Oyo', 'Kano', 'Rivers', 'Enugu', 'Delta', 'Ogun'];

export default function RegisterPatient() {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    lga: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    relationship: '',
    bloodGroup: '',
    genotype: '',
    maritalStatus: '',
    occupation: '',
    emergencyContact: '',
  });

  const patientId = 'SPH-2026-483921';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader title="Register New Patient" icon={UserPlus} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">Auto-generated Patient ID:</span>
          <span className="text-sm font-bold text-primary-600">{patientId}</span>
        </div>

        <form className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Middle Name</label>
                <input type="text" name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Surname</label>
                <input type="text" name="surname" value={form.surname} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className={selectClass}>
                  <option value="">Select Status</option>
                  {maritalStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select name="state" value={form.state} onChange={handleChange} className={selectClass}>
                  <option value="">Select State</option>
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>LGA</label>
                <input type="text" name="lga" value={form.lga} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={selectClass}>
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Genotype</label>
                <select name="genotype" value={form.genotype} onChange={handleChange} className={selectClass}>
                  <option value="">Select Genotype</option>
                  {genotypeOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Next of Kin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Next of Kin Name</label>
                <input type="text" name="nextOfKin" value={form.nextOfKin} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next of Kin Phone</label>
                <input type="tel" name="nextOfKinPhone" value={form.nextOfKinPhone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Relationship</label>
                <input type="text" name="relationship" value={form.relationship} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Emergency Contact</label>
                <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="button" className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
              Save Patient
            </button>
            <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
