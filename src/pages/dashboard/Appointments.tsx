import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getAppointments } from "../../services/appointment.Service";

type Appointment = {
  id: number;
  token_number: number;
  patient_name: string;
  department: string;
  doctor_name: string;
  date: string;
  time: string;
  email: string;
  phone: string;
  status: "Pending" | "In Consultation" | "Completed";
};

const Appointments = () => {
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 🔥 important
      try {
        const data = await getAppointments(filter, customDate);
        const rows = Array.isArray(data) ? data : data.data;
        setAppointments(rows || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3600000);
    return () => clearInterval(interval);
  }, [filter, customDate]);

  const filtered = appointments.filter((a) =>
    `${a.patient_name} ${a.doctor_name} ${a.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Appointments
          </h2>

          <a
            href="/appointment/add_appointment"
            className="inline-flex items-center gap-2
            bg-blue-600 text-white px-4 sm:px-5 py-2
            rounded-lg shadow hover:bg-blue-700 transition"
          >
            <i className="fa fa-plus text-sm"></i>
            Add Appointment
          </a>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <button
            onClick={() => {
              setFilter("today");
              setCustomDate("");
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
              filter === "today" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => {
              setFilter("tomorrow");
              setCustomDate("");
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
              filter === "tomorrow" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Tomorrow
          </button>

          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              const value = e.target.value;
              setCustomDate(value);
              if (value) setFilter("custom");
            }}
            className={`border px-3 py-2 rounded-lg text-sm ${
              filter === "custom" ? "ring-2 ring-blue-500" : ""
            }`}
          />

          {customDate && (
            <button
              onClick={() => {
                setCustomDate("");
                setFilter("today");
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by patient, doctor or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE / LIST */}
        <div className="bg-white rounded-xl shadow">
          {/* 🔥 SKELETON */}
          {loading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Token</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Department</th>
                      <th className="px-4 py-3 text-left">Doctor</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {a.token_number}
                        </td>
                        <td className="px-4 py-3">{a.patient_name}</td>
                        <td className="px-4 py-3">{a.department}</td>
                        <td className="px-4 py-3">{a.doctor_name}</td>
                        <td className="px-4 py-3">{formatDate(a.date)}</td>
                        <td className="px-4 py-3">{a.time}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 🔥 MOBILE CARDS */}
              <div className="md:hidden p-4 space-y-3">
                {filtered.map((a) => (
                  <div key={a.id} className="border rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-600">
                        #{a.token_number}
                      </span>
                      <span className="text-xs">{a.status}</span>
                    </div>

                    <p className="font-medium">{a.patient_name}</p>
                    <p className="text-sm text-gray-500">{a.doctor_name}</p>

                    <div className="flex justify-between text-sm mt-2">
                      <span>{formatDate(a.date)}</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No appointments found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
