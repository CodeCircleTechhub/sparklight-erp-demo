import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import DoctorsPage from './pages/public/DoctorsPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import AdminPatientsList from './pages/super-admin/AdminPatientsList';
import RegisterPatient from './pages/super-admin/RegisterPatient';
import PatientVisits from './pages/super-admin/PatientVisits';
import AdminAppointmentsList from './pages/super-admin/AdminAppointmentsList';
import TodayAppointments from './pages/super-admin/TodayAppointments';
import AdminDepartments from './pages/super-admin/AdminDepartments';
import AdminStaffList from './pages/super-admin/AdminStaffList';
import AddStaff from './pages/super-admin/AddStaff';
import StaffRoles from './pages/super-admin/StaffRoles';
import Consultations from './pages/super-admin/Consultations';
import Diagnoses from './pages/super-admin/Diagnoses';
import AdminClinicalRecords from './pages/super-admin/AdminClinicalRecords';
import Prescriptions from './pages/super-admin/Prescriptions';
import AdminLaboratory from './pages/super-admin/AdminLaboratory';
import AdminPharmacy from './pages/super-admin/AdminPharmacy';
import Invoices from './pages/super-admin/Invoices';
import Payments from './pages/super-admin/Payments';
import OutstandingBills from './pages/super-admin/OutstandingBills';
import Employees from './pages/super-admin/Employees';
import Attendance from './pages/super-admin/Attendance';
import Leave from './pages/super-admin/Leave';
import Payroll from './pages/super-admin/Payroll';
import AdminReportsPage from './pages/super-admin/AdminReportsPage';
import AuditLogs from './pages/super-admin/AuditLogs';
import AdminSettingsPage from './pages/super-admin/AdminSettingsPage';
import AdminNotificationsPage from './pages/super-admin/AdminNotificationsPage';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerPatients from './pages/manager/ManagerPatients';
import ManagerVisits from './pages/manager/ManagerVisits';
import ManagerAppointments from './pages/manager/ManagerAppointments';
import ManagerDepartments from './pages/manager/ManagerDepartments';
import ManagerStaff from './pages/manager/ManagerStaff';
import ManagerClinical from './pages/manager/ManagerClinical';
import ManagerPharmacy from './pages/manager/ManagerPharmacy';
import ManagerLaboratory from './pages/manager/ManagerLaboratory';
import ManagerBilling from './pages/manager/ManagerBilling';
import ManagerHR from './pages/manager/ManagerHR';
import ManagerReports from './pages/manager/ManagerReports';
import ManagerSettings from './pages/manager/ManagerSettings';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistRegisterPatient from './pages/receptionist/RegisterPatient';
import PatientSearch from './pages/receptionist/PatientSearch';
import ReceptionistPatientVisits from './pages/receptionist/PatientVisits';
import ReceptionistAppointments from './pages/receptionist/ReceptionistAppointments';
import QueueManagement from './pages/receptionist/QueueManagement';
import PatientDocuments from './pages/receptionist/PatientDocuments';

// Customer Care Pages
import CustomerCareDashboard from './pages/customer-care/CustomerCareDashboard';
import Enquiries from './pages/customer-care/Enquiries';
import Complaints from './pages/customer-care/Complaints';
import CareFeedback from './pages/customer-care/CareFeedback';
import CareAppointments from './pages/customer-care/CareAppointments';
import Communication from './pages/customer-care/Communication';

// Nurse Pages
import NurseDashboard from './pages/nurse/NurseDashboard';
import MyPatients from './pages/nurse/MyPatients';
import PatientQueue from './pages/nurse/PatientQueue';
import VitalSigns from './pages/nurse/VitalSigns';
import NursingNotes from './pages/nurse/NursingNotes';
import NurseAdmissions from './pages/nurse/NurseAdmissions';
import WardManagement from './pages/nurse/WardManagement';
import MedicationTasks from './pages/nurse/MedicationTasks';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorMyPatients from './pages/doctor/MyPatients';
import DoctorPatientQueue from './pages/doctor/PatientQueue';
import DoctorConsultations from './pages/doctor/Consultations';
import MedicalRecords from './pages/doctor/MedicalRecords';
import DiagnosisPage from './pages/doctor/DiagnosisPage';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import LabRequests from './pages/doctor/LabRequests';
import ImagingRequests from './pages/doctor/ImagingRequests';
import FollowUps from './pages/doctor/FollowUps';
import DoctorAdmission from './pages/doctor/DoctorAdmission';
import Discharge from './pages/doctor/Discharge';

// Laboratory Pages
import LaboratoryDashboard from './pages/laboratory/LaboratoryDashboard';
import TestRequests from './pages/laboratory/TestRequests';
import PendingTests from './pages/laboratory/PendingTests';
import SampleCollection from './pages/laboratory/SampleCollection';
import Processing from './pages/laboratory/Processing';
import LabResults from './pages/laboratory/LabResults';
import TestCategories from './pages/laboratory/TestCategories';
import LabReports from './pages/laboratory/LabReports';

// Pharmacist Pages
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import Medicines from './pages/pharmacist/Medicines';
import PharmacistCategories from './pages/pharmacist/PharmacistCategories';
import Stock from './pages/pharmacist/Stock';
import PharmacistPrescriptions from './pages/pharmacist/PharmacistPrescriptions';
import Dispensing from './pages/pharmacist/Dispensing';
import Suppliers from './pages/pharmacist/Suppliers';
import PurchaseRecords from './pages/pharmacist/PurchaseRecords';
import ExpiredMedicines from './pages/pharmacist/ExpiredMedicines';
import PharmacistReports from './pages/pharmacist/PharmacistReports';

// Accountant Pages
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import Billing from './pages/accountant/Billing';
import AccountantInvoices from './pages/accountant/Invoices';
import AccountantPayments from './pages/accountant/Payments';
import Outstanding from './pages/accountant/Outstanding';
import Receipts from './pages/accountant/Receipts';
import Refunds from './pages/accountant/Refunds';
import Revenue from './pages/accountant/Revenue';
import FinancialReports from './pages/accountant/FinancialReports';
import Expenses from './pages/accountant/Expenses';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HREmployees from './pages/hr/Employees';
import AddEmployee from './pages/hr/AddEmployee';
import HRDepartments from './pages/hr/HRDepartments';
import HRAttendance from './pages/hr/Attendance';
import LeaveManagement from './pages/hr/LeaveManagement';
import StaffDocuments from './pages/hr/StaffDocuments';
import HRPayroll from './pages/hr/Payroll';
import Recruitment from './pages/hr/Recruitment';
import StaffReports from './pages/hr/StaffReports';

// Patient Portal Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import PatientAppointments from './pages/patient/PatientAppointments';
import VisitHistory from './pages/patient/VisitHistory';
import PatientRecords from './pages/patient/PatientRecords';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import LabResultsPatient from './pages/patient/LabResults';
import BillsPayments from './pages/patient/BillsPayments';
import PatientNotifications from './pages/patient/PatientNotifications';

// Chat Page
import ChatPage from './pages/chat/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Unified Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Chat */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Super Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="super-admin" />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="patients" element={<AdminPatientsList />} />
          <Route path="patients/register" element={<RegisterPatient />} />
          <Route path="patients/visits" element={<PatientVisits />} />
          <Route path="appointments" element={<AdminAppointmentsList />} />
          <Route path="appointments/today" element={<TodayAppointments />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="staff" element={<AdminStaffList />} />
          <Route path="staff/add" element={<AddStaff />} />
          <Route path="staff/roles" element={<StaffRoles />} />
          <Route path="clinical" element={<Consultations />} />
          <Route path="clinical/consultations" element={<Consultations />} />
          <Route path="clinical/diagnoses" element={<Diagnoses />} />
          <Route path="clinical/records" element={<AdminClinicalRecords />} />
          <Route path="clinical/prescriptions" element={<Prescriptions />} />
          <Route path="laboratory" element={<AdminLaboratory />} />
          <Route path="pharmacy" element={<AdminPharmacy />} />
          <Route path="billing" element={<Invoices />} />
          <Route path="billing/invoices" element={<Invoices />} />
          <Route path="billing/payments" element={<Payments />} />
          <Route path="billing/outstanding" element={<OutstandingBills />} />
          <Route path="hr" element={<Employees />} />
          <Route path="hr/employees" element={<Employees />} />
          <Route path="hr/attendance" element={<Attendance />} />
          <Route path="hr/leave" element={<Leave />} />
          <Route path="hr/payroll" element={<Payroll />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<DashboardLayout role="manager" />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="patients" element={<ManagerPatients />} />
          <Route path="visits" element={<ManagerVisits />} />
          <Route path="appointments" element={<ManagerAppointments />} />
          <Route path="departments" element={<ManagerDepartments />} />
          <Route path="staff" element={<ManagerStaff />} />
          <Route path="clinical" element={<ManagerClinical />} />
          <Route path="pharmacy" element={<ManagerPharmacy />} />
          <Route path="laboratory" element={<ManagerLaboratory />} />
          <Route path="billing" element={<ManagerBilling />} />
          <Route path="hr" element={<ManagerHR />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="notifications" element={<ManagerDashboard />} />
          <Route path="settings" element={<ManagerSettings />} />
        </Route>

        {/* Receptionist Routes */}
        <Route path="/receptionist" element={<DashboardLayout role="receptionist" />}>
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          <Route path="register-patient" element={<ReceptionistRegisterPatient />} />
          <Route path="patient-search" element={<PatientSearch />} />
          <Route path="patient-visits" element={<ReceptionistPatientVisits />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
          <Route path="queue" element={<QueueManagement />} />
          <Route path="documents" element={<PatientDocuments />} />
          <Route path="notifications" element={<ReceptionistDashboard />} />
        </Route>

        {/* Customer Care Routes */}
        <Route path="/customer-care" element={<DashboardLayout role="customer-care" />}>
          <Route path="dashboard" element={<CustomerCareDashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="feedback" element={<CareFeedback />} />
          <Route path="appointments" element={<CareAppointments />} />
          <Route path="communication" element={<Communication />} />
          <Route path="notifications" element={<CustomerCareDashboard />} />
        </Route>

        {/* Nurse Routes */}
        <Route path="/nurse" element={<DashboardLayout role="nurse" />}>
          <Route path="dashboard" element={<NurseDashboard />} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="queue" element={<PatientQueue />} />
          <Route path="vital-signs" element={<VitalSigns />} />
          <Route path="notes" element={<NursingNotes />} />
          <Route path="admissions" element={<NurseAdmissions />} />
          <Route path="ward" element={<WardManagement />} />
          <Route path="medications" element={<MedicationTasks />} />
          <Route path="notifications" element={<NurseDashboard />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<DashboardLayout role="doctor" />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorMyPatients />} />
          <Route path="queue" element={<DoctorPatientQueue />} />
          <Route path="consultations" element={<DoctorConsultations />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="diagnosis" element={<DiagnosisPage />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="lab-requests" element={<LabRequests />} />
          <Route path="imaging" element={<ImagingRequests />} />
          <Route path="follow-ups" element={<FollowUps />} />
          <Route path="admission" element={<DoctorAdmission />} />
          <Route path="discharge" element={<Discharge />} />
          <Route path="notifications" element={<DoctorDashboard />} />
        </Route>

        {/* Laboratory Routes */}
        <Route path="/laboratory" element={<DashboardLayout role="laboratory" />}>
          <Route path="dashboard" element={<LaboratoryDashboard />} />
          <Route path="test-requests" element={<TestRequests />} />
          <Route path="pending" element={<PendingTests />} />
          <Route path="samples" element={<SampleCollection />} />
          <Route path="processing" element={<Processing />} />
          <Route path="results" element={<LabResults />} />
          <Route path="categories" element={<TestCategories />} />
          <Route path="reports" element={<LabReports />} />
          <Route path="notifications" element={<LaboratoryDashboard />} />
        </Route>

        {/* Pharmacist Routes */}
        <Route path="/pharmacist" element={<DashboardLayout role="pharmacist" />}>
          <Route path="dashboard" element={<PharmacistDashboard />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="categories" element={<PharmacistCategories />} />
          <Route path="stock" element={<Stock />} />
          <Route path="prescriptions" element={<PharmacistPrescriptions />} />
          <Route path="dispensing" element={<Dispensing />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchases" element={<PurchaseRecords />} />
          <Route path="expired" element={<ExpiredMedicines />} />
          <Route path="reports" element={<PharmacistReports />} />
          <Route path="notifications" element={<PharmacistDashboard />} />
        </Route>

        {/* Accountant Routes */}
        <Route path="/accountant" element={<DashboardLayout role="accountant" />}>
          <Route path="dashboard" element={<AccountantDashboard />} />
          <Route path="billing" element={<Billing />} />
          <Route path="invoices" element={<AccountantInvoices />} />
          <Route path="payments" element={<AccountantPayments />} />
          <Route path="outstanding" element={<Outstanding />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="notifications" element={<AccountantDashboard />} />
        </Route>

        {/* HR Routes */}
        <Route path="/hr" element={<DashboardLayout role="hr" />}>
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="employees" element={<HREmployees />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="departments" element={<HRDepartments />} />
          <Route path="attendance" element={<HRAttendance />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="documents" element={<StaffDocuments />} />
          <Route path="payroll" element={<HRPayroll />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="reports" element={<StaffReports />} />
          <Route path="notifications" element={<HRDashboard />} />
        </Route>

        {/* Patient Portal Routes */}
        <Route path="/patient" element={<DashboardLayout role="patient" />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="visit-history" element={<VisitHistory />} />
          <Route path="medical-records" element={<PatientRecords />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="lab-results" element={<LabResultsPatient />} />
          <Route path="bills" element={<BillsPayments />} />
          <Route path="notifications" element={<PatientNotifications />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
