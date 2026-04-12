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

  /**
   * FETCH APPOINTMENTS
   * LIVE QUEUE
   */

  useEffect(() => {
    const fetchData = async () => {
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Appointments</h2>

          <a
            href="/appointment/add_appointment"
            className="inline-flex items-center gap-2
            bg-blue-600 text-white px-5 py-2.5
            rounded-lg shadow hover:bg-blue-700 transition"
          >
            <i className="fa fa-plus text-sm"></i>
            Add Appointment
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("today")}
            className={`px-4 py-2 rounded-lg ${
              filter === "today" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setFilter("yesterday")}
            className={`px-4 py-2 rounded-lg ${
              filter === "yesterday" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Yesterday
          </button>

          <button
            onClick={() => setFilter("tomorrow")}
            className={`px-4 py-2 rounded-lg ${
              filter === "tomorrow" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Tomorrow
          </button>

          <button
            onClick={() => setFilter("custom")}
            className={`px-4 py-2 rounded-lg ${
              filter === "custom" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Custom
          </button>

          {filter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by patient, doctor or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3
            border border-gray-300 rounded-lg
            px-4 py-2
            focus:outline-none
            focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading appointments...
            </div>
          ) : (
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

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                        {a.department}
                      </span>
                    </td>

                    <td className="px-4 py-3">{a.doctor_name}</td>

                    <td className="px-4 py-3">{a.date}</td>

                    <td className="px-4 py-3">{a.time}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          a.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : a.status === "In Consultation"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
