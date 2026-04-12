import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import AppointmentTable from "../../components/dashboard/tables/AppointmentTable";
import NewPatientsTable from "../../components/dashboard/tables/NewPatientsTable";
import DoctorList from "../../components/dashboard/widgets/DoctorList";
import HospitalManagementChart from "../../components/dashboard/widgets/HospitalManagementChart";
import PatientLineChart from "../../components/dashboard/widgets/PatientLineChart";
import PatientsBarChart from "../../components/dashboard/widgets/PatientsBarChart";
import StatCard from "../../components/dashboard/widgets/StatCard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* 🔥 STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Doctors"
            value={2}
            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
            icon={<i className="fa fa-stethoscope"></i>}
          />

          <StatCard
            title="Appointments"
            value={2}
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            icon={<i className="fa fa-calendar-check-o"></i>}
          />

          <StatCard
            title="Attend"
            value={72}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
            icon={<i className="fa fa-user-md"></i>}
          />

          <StatCard
            title="Pending"
            value={618}
            gradient="bg-gradient-to-r from-orange-400 to-amber-500"
            icon={<i className="fa fa-heartbeat"></i>}
          />
        </div>

        {/* 📊 CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PatientLineChart />
          <PatientsBarChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AppointmentTable />
          <DoctorList />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <NewPatientsTable />
  <HospitalManagementChart />
</div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
