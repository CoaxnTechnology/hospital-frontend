import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import AppointmentTable from "../../components/dashboard/tables/AppointmentTable";
import DoctorList from "../../components/dashboard/widgets/DoctorList";
import PatientLineChart from "../../components/dashboard/widgets/PatientLineChart";
import StatCard from "../../components/dashboard/widgets/StatCard";
import { getDashboardData } from "../../services/dashboard.service";
type Props = {
  data: any[];
};
const Dashboard = () => {
  // 🔥 FILTER STATE
  const [filterType, setFilterType] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔥 DATA STATE
  const [stats, setStats] = useState<any>({});
  const [appointments, setAppointments] = useState<any[]>([]);
  const [chart, setChart] = useState<any[]>([]);

  // ✅ LOCAL DATE FIX (IMPORTANT)
  const formatLocalDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  // 🔥 FILTER LOGIC (FINAL)
  const handleFilterChange = (value: string) => {
    console.log("handleFilterChange called with value:", value);
    setFilterType(value);

    const today = new Date();
    let start = new Date();
    let end = new Date();

    setStartDate(formatLocalDate(start));
    setEndDate(formatLocalDate(end));
  };

  // 🔥 API CALL
  const fetchDashboard = async () => {
  console.log("fetchDashboard called with:", startDate, endDate);

  try {
    const data = await getDashboardData(startDate, endDate);

    console.log("✅ FINAL DATA:", data);

    setStats(data?.stats || {});
    setAppointments(data?.appointments || []);
    setChart(data?.chart || []); // 🔥 SAME DATA
  } catch (err) {
    console.error("Dashboard Error:", err);
  }
};

  // 🔥 DEFAULT LOAD
  useEffect(() => {
    handleFilterChange("today");
  }, []);

  // 🔥 AUTO FETCH ONLY FOR TODAY'S DATA
  useEffect(() => {
    if (startDate && endDate) {
      const today = new Date();
      const todayStr = formatLocalDate(today);
      console.log(
        "useEffect check: startDate:",
        startDate,
        "endDate:",
        endDate,
        "todayStr:",
        todayStr,
      );
      if (startDate === todayStr && endDate === todayStr) {
        console.log("Calling fetchDashboard for today's data");
        fetchDashboard();
      }
    }
  }, [startDate, endDate]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* 🔥 FILTER UI */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>

          <div className="bg-white px-4 py-3 rounded-xl shadow flex flex-wrap items-center gap-3 border">
            {/* SELECT */}

            {/* START DATE */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setFilterType("custom");
                setStartDate(e.target.value);
              }}
              className="border px-3 py-2 rounded-lg text-sm"
            />

            {/* END DATE */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setFilterType("custom");
                setEndDate(e.target.value);
              }}
              className="border px-3 py-2 rounded-lg text-sm"
            />

            {/* APPLY */}
            <button
              onClick={() => {
                console.log("Apply button clicked, calling fetchDashboard");
                fetchDashboard();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Doctors"
            value={stats?.total_doctors || 0}
            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
            icon={<i className="fa fa-stethoscope"></i>}
          />
          <StatCard
            title="Appointments"
            value={stats?.total_appointments || 0}
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            icon={<i className="fa fa-calendar-check-o"></i>}
          />
          <StatCard
            title="Completed"
            value={stats?.completed || 0}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
            icon={<i className="fa fa-user-md"></i>}
          />
          <StatCard
            title="Pending"
            value={stats?.pending || 0}
            gradient="bg-gradient-to-r from-orange-400 to-amber-500"
            icon={<i className="fa fa-heartbeat"></i>}
          />
        </div>

        {/* 🚀 MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* APPOINTMENTS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Upcoming Appointments
            </h3>

            <div className="overflow-y-auto max-h-[300px]">
              <AppointmentTable data={appointments} />
            </div>
          </div>

          {/* DOCTORS */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Doctors
            </h3>
            <DoctorList />
          </div>
        </div>

        {/* 📊 CHART */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Patient Overview
          </h3>
          <PatientLineChart data={chart} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
