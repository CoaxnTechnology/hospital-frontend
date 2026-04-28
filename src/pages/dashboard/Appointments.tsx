import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getAppointmentsPaginated } from "../../services/appointment.Service";
import { generatePrescriptionHTML } from "../../generatePrescriptionHTML";
import { useHospital } from "../../context/HospitalContext";
const BASE_URL = import.meta.env.VITE_BASE_URL;
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
  status: "Pending" | "In Consultation" | "Completed" | "Skipped";
  prescription_id?: number;
};

const Appointments = () => {
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const { hospital } = useHospital();
  const fetchData = async (customPage = page, customSearch = search) => {
    setLoading(true);
    try {
      const res = await getAppointmentsPaginated(
        customPage,
        10,
        filter,
        customDate,
        customSearch,
      );

      setAppointments(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(page, search);

    const interval = setInterval(() => {
      fetchData(page, search);
    }, 3600000);

    return () => clearInterval(interval);
  }, [filter, customDate, page, search]);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const isToday = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };
  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();

    if (s === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (s === "in consultation") {
      return "bg-blue-100 text-blue-700";
    }
    if (s === "completed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  };
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "-";

    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
  };
  const handlePrintPrescription = async (prescriptionId: number) => {
    try {
      if (!hospital) return alert("Hospital not loaded");

      const res = await fetch(`${BASE_URL}/api/prescription/${prescriptionId}`);
      const data = await res.json();

      const rows = data.data;

      if (!rows || rows.length === 0) {
        return alert("No prescription data");
      }

      const first = rows[0];

      const html = generatePrescriptionHTML({
        hospital,
        prescriptionId,
        patient: {
          id: first.patient_id,
          name: first.patient_name,
          age: first.age,
          mobile: first.mobile,
        },
        doctor: {
          name: first.doctor_name,
          department: first.department,
        },
        medicines: rows.map((r: any) => ({
          name: r.medicine_name,
          dosage: r.dosage,
          duration: r.duration,
        })),
        date: new Date().toLocaleDateString(),
      });

      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();

      setTimeout(() => {
        win.print();
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Print error");
    }
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
        <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name / phone / doctor / ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
                setPage(1);
                fetchData(1, searchInput);
              }
            }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
              fetchData(1, searchInput);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Search
          </button>
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
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Token</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Department</th>
                      <th className="px-4 py-3 text-left">Doctor</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>{" "}
                      {/* ✅ ADD THIS */}
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {a.token_number}
                        </td>
                        <td className="px-4 py-3">{a.patient_name}</td>
                        <td className="px-4 py-3">{a.department}</td>
                        <td className="px-4 py-3">{a.doctor_name}</td>
                        <td className="px-4 py-3">{formatDate(a.date)}</td>
                        <td className="px-4 py-3">{formatTime(a.time)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(a.status)}`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                          {/* ⬇️ DOWNLOAD */}
                          {a.status === "Completed" && a.prescription_id && (
                            <button
                              onClick={() =>
                                handlePrintPrescription(a.prescription_id!)
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow hover:bg-green-50 text-gray-600 hover:text-green-600 transition"
                              title="Print / Download Prescription"
                            >
                              <i className="fa fa-download"></i>
                            </button>
                          )}

                          {/* 🔄 RECALL */}
                          {a.status === "Skipped" && isToday(a.date) && (
                            <button
                              // onClick={() => handleRecall(a.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 transition"
                              title="Recall Patient"
                            >
                              <i className="fa fa-refresh"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center p-4 border-t">
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 border rounded"
                    >
                      Prev
                    </button>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 border rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* 🔥 MOBILE CARDS */}
              <div className="md:hidden p-4 space-y-3">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-xl p-4 shadow-sm bg-white"
                  >
                    {/* TOP */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-600 text-lg">
                        {a.token_number}
                      </span>

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(a.status)}`}
                      >
                        {a.status}
                      </span>
                    </div>

                    {/* PATIENT */}
                    <p className="font-medium mt-2 text-gray-800">
                      {a.patient_name}
                    </p>

                    <p className="text-sm text-gray-500">{a.doctor_name}</p>

                    {/* DATE TIME */}
                    <div className="flex justify-between text-sm mt-2 text-gray-600">
                      <span>{formatDate(a.date)}</span>
                      <span>{formatTime(a.time)}</span>
                    </div>

                    {/* 🔥 ACTION BUTTONS */}
                    <div className="flex justify-between mt-4 gap-2">
                      {/* VIEW */}
                      <a
                        href={`/prescription/view/${a.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
                      >
                        <i className="fa fa-eye"></i>
                        View
                      </a>

                      {/* DOWNLOAD */}
                      {a.status === "Completed" && (
                        <a
                          href={`/prescription/download/${a.id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium"
                        >
                          <i className="fa fa-download"></i>
                          Download
                        </a>
                      )}

                      {/* RECALL */}
                      {a.status === "Skipped" && isToday(a.date) && (
                        <button
                          // onClick={() => handleRecall(a.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-50 text-yellow-600 text-sm font-medium"
                        >
                          <i className="fa fa-refresh"></i>
                          Recall
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {appointments.length === 0 && (
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
