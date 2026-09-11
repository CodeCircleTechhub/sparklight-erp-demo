import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const departmentOptions = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General', 'Dermatology', 'ENT', 'Laboratory', 'Pharmacy', 'Accounting', 'HR', 'IT'];
const roleOptions = ['Super Admin', 'Manager', 'Receptionist', 'Customer Care', 'Nurse', 'Doctor', 'Laboratory', 'Pharmacist', 'Accountant', 'HR'];
const genderOptions = ['Male', 'Female', 'Other'];

export default function AddStaff() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    department: '',
    position: '',
    role: '',
    employmentDate: '',
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, photo: e.target.files[0] });
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Staff" icon={UserPlus} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>Full Name</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
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
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <select name="department" value={form.department} onChange={handleChange} className={selectClass}>
                  <option value="">Select Department</option>
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Position</label>
                <input type="text" name="position" value={form.position} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className={selectClass}>
                  <option value="">Select Role</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Employment Date</label>
                <input type="date" name="employmentDate" value={form.employmentDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-400">Photo</span>
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                <p className="mt-1 text-xs text-gray-400">JPG, PNG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="button" className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
              Save Staff
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
