import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/dashboard/Doctors";
import AddDoctor from "./pages/dashboard/AddDoctor";
import EditDoctor from "./pages/dashboard/EditDoctor";
import Appointments from "./pages/dashboard/Appointments";
import AddAppointment from "./pages/dashboard/AddAppointment";
import EditAppointment from "./pages/dashboard/EditAppointment";
import Departments from "./pages/dashboard/Departments";
import EditDepartment from "./pages/dashboard/EditDepartment";
import AddDepartment from "./pages/dashboard/AddDepartment";
import Employees from "./pages/dashboard/Employees";
import EditEmployee from "./pages/dashboard/EditEmployee";
import AddEmployee from "./pages/dashboard/AddEmployee";
import Leaves from "./pages/dashboard/Leaves";
import EditLeave from "./pages/dashboard/EditLeave";
import AddLeave from "./pages/dashboard/AddLeave";
import Payslip from "./pages/dashboard/Payslip";
import EmployeesSalary from "./pages/dashboard/EmployeesSalary";
import MedicineStore from "./pages/dashboard/MedicineStore";
import EditMedicine from "./pages/dashboard/EditMedicine";
import AddMedicine from "./pages/dashboard/AddMedicine";
import Consultant from "./pages/dashboard/Consultant";
import Prescription from "./pages/dashboard/Prescription";
import Login from "./pages/Login";
import Patients from "./pages/dashboard/Patients";
import PatientHistory from "./pages/dashboard/PatientHistory";
import ResetPassword from "./pages/ResetPassword";
//import ReportsPage from "./pages/dashboard/ReportsPage";
import DispensePage from "./pages/dashboard/DispensePage";
import ReturnMedicine from "./pages/dashboard/ReturnMedicine";
import Settings from "./pages/dashboard/Settings";
import Schedule from "./pages/settings/schedule";
import Brand from "./pages/settings/Brand";
import Dosage from "./pages/settings/Dosage";
import Strength from "./pages/settings/Strength";
import Supplier from "./pages/settings/Supplier";
import Category from "./pages/settings/Category";
import Hospital from "./pages/settings/Hospital";
import Signature from "./pages/settings/signature";
import SpecialityPage from "./components/home/SpecialityPage";
import DoctorDetailsPage from "./components/home/DoctorDetailsPage";
import BlogDetailsPage from "./components/home/BlogDetailsPage";
import ContactPage from "./components/home/ContactPage";
import Hero from "./components/home/Hero";
import HeroSettings from "./pages/settings/HeroSettings";
import ServiceForm from "./pages/settings/ServiceForm";
import ServicePage from "./pages/settings/Service";
import BlogForm from "./pages/settings/BlogForm";
import BlogPage from "./pages/settings/Blog";
import EditBranch from "./pages/settings/EditBranch";
import AddBranch from "./pages/settings/AddBranch";
import BranchService from "./pages/settings/BranchService";
import BranchDetails from "./pages/BranchDetails";
import PatientQueuePage from "./pages/dashboard/PatientQueuePage";
import ViewDoctor from "./pages/dashboard/ViewDoctor";
//import PurchasePage from "./pages/dashboard/PurchasePage";
//import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* 🌐 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/speciality/:slug" element={<SpecialityPage />} />
      <Route path="/doctor/:id/:slug" element={<DoctorDetailsPage />} />
      <Route path="/blog/:id" element={<BlogDetailsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* <Route path="/login" element={<Login />} /> */}

      {/* 🔒 DASHBOARD ROUTE */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/doctors" element={<Doctors />} />
      <Route path="/doctors/add_doctor" element={<AddDoctor />} />
      <Route path="/doctors/edit_doctor/:id" element={<EditDoctor />} />
      <Route path="/doctors/view/:id" element={<ViewDoctor />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/history/:id" element={<PatientHistory />} />
      <Route path="/patient-queue" element={<PatientQueuePage />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/appointment/add_appointment" element={<AddAppointment />} />
      <Route path="/appointment/edit/:id" element={<EditAppointment />} />
      <Route path="/consultant" element={<Consultant />} />
      <Route path="/consultant/prescription/:id" element={<Prescription />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/departments/add" element={<AddDepartment />} />
      <Route path="/departments/edit/:id" element={<EditDepartment />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/employee/add" element={<AddEmployee />} />
      <Route path="/employee/edit/:id" element={<EditEmployee />} />
      <Route path="/employee/leave" element={<Leaves />} />
      <Route path="/employee/add_leave" element={<AddLeave />} />
      <Route path="/employee/edit_leave/:id" element={<EditLeave />} />
      <Route path="/employee/payslip" element={<EmployeesSalary />} />
      <Route path="/payroll/payslip/:id" element={<Payslip />} />
      <Route path="/medicine-store" element={<MedicineStore />} />
      <Route path="/store/add_med" element={<AddMedicine />} />
      <Route path="/store/edit_med/:id" element={<EditMedicine />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/store/sales" element={<DispensePage />} />
      <Route path="/store/return" element={<ReturnMedicine />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/schedule" element={<Schedule />} />
      <Route path="/settings/medicine" element={<Brand />} />
      <Route path="/settings/dosage" element={<Dosage />} />
      <Route path="/settings/strength" element={<Strength />} />
      <Route path="/settings/supplier" element={<Supplier />} />
      <Route path="/settings/category" element={<Category />} />
      <Route path="/settings/details" element={<Hospital />} />
      <Route path="/settings/signature" element={<Signature />} />
      <Route path="/settings/hero" element={<HeroSettings />} />
      <Route path="/settings/service" element={<ServicePage />} />
      <Route path="/settings/service/add" element={<ServiceForm />} />
      <Route path="/settings/service/edit/:id" element={<ServiceForm />} />
      <Route path="/settings/blog" element={<BlogPage />} />
      <Route path="/settings/blog/add" element={<BlogForm />} />
      <Route path="/settings/blog/edit/:id" element={<BlogForm />} />
      <Route path="/settings/branch" element={<BranchService />} />
      <Route path="/settings/branch/add" element={<AddBranch />} />
      <Route path="/settings/branch/edit/:id" element={<EditBranch />} />
      <Route path="/branch/:id" element={<BranchDetails />} />
    </Routes>
  );
}

export default App;
