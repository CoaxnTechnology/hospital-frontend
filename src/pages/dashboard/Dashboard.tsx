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
    setFilterType(value);

    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (value) {
      case "today":
        start = new Date();
        end = new Date();
        break;

      case "tomorrow":
        start.setDate(today.getDate() + 1);
        end.setDate(today.getDate() + 1);
        break;

      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;

      case "6months":
        start.setMonth(today.getMonth() - 6);
        end = new Date();
        break;

      case "custom":
        return; // custom me manual input use hoga
    }

    setStartDate(formatLocalDate(start));
    setEndDate(formatLocalDate(end));
  };

  // 🔥 API CALL
  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData(startDate, endDate);
      console.log("CHART DATA:", data?.chart);
      console.log("API DATA:", data);

      setStats(data?.stats || {});
      setAppointments(data?.appointments || []);
      // 🔥 CHART ALWAYS MONTH DATA
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date();

      const formatLocalDate = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().split("T")[0];
      };

      const chartData = await getDashboardData(
        formatLocalDate(start),
        formatLocalDate(end),
      );

      setChart(chartData?.chart || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  // 🔥 DEFAULT LOAD
  useEffect(() => {
    handleFilterChange("today");
  }, []);

  // 🔥 AUTO FETCH
  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboard();
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
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisMonth">This Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Custom</option>
            </select>

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
              onClick={fetchDashboard}
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
