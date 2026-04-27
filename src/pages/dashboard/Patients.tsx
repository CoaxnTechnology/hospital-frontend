import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import patientImg from "../../assets/doctors/doctor_2.png";
import { getPatients } from "../../services/patient.service";
import { getDoctors } from "../../services/doctor.service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  age: number;
  total_visits: number;
  last_visit: string;
  doctor_name: string;
};

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  /* ================= FETCH PATIENTS ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role); // "admin" ya "doctor"
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPatients(page, 10, search, doctor);
        setPatients(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, doctor]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data || res); // depends on API response
      } catch (err) {
        console.error("Error loading doctors", err);
      }
    };

    fetchDoctors();
  }, []);
  const downloadExcel = async () => {
  try {
    // 🔥 ALL DATA FETCH (limit बड़ा रखो)
    const res = await getPatients(1, 10000, search, doctor);

    const allPatients = res.data || [];

    if (!allPatients.length) return;

    const data = allPatients.map((p) => ({
      ID: p.id,
      Name: p.name,
      Phone: p.phone,
      Gender: p.gender,
      Age: p.age,
      Doctor: p.doctor_name || "-",
      Visits: p.total_visits,
      "Last Visit": p.last_visit ? formatDate(p.last_visit) : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Patients.xlsx");

  } catch (err) {
    console.error("Excel download error:", err);
  }
};
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const PageSkeletonLoader = () => (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-8 w-44 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-12 w-full sm:w-44 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

      <div className="space-y-4">
        <div className="h-12 rounded-3xl bg-gray-200 animate-pulse"></div>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 w-32 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-20 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-4/6 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Patients</h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <button
              onClick={downloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
            >
              <i className="fa fa-file-excel mr-2"></i>
              Export Excel
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
                setPage(1);
              }
            }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Search
          </button>

          {role === "admin" && (
            <select
              value={doctor}
              onChange={(e) => {
                setDoctor(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-xl px-4 py-2"
            >
              <option value="">All Doctors</option>
              {doctors.map((doc) => (
                <option
                  key={doc.id}
                  value={`${doc.first_name} ${doc.last_name}`}
                >
                  Dr. {doc.first_name} {doc.last_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* TABLE / MOBILE CARDS */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              Patient List
            </h3>
            <span className="text-xs text-gray-500">
              Total: {patients.length}
            </span>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              🚫 No patients found
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Patient</th>
                      <th className="px-5 py-3 text-left">Contact</th>
                      <th className="px-5 py-3 text-left">Gender</th>
                      <th className="px-5 py-3 text-left">Age</th>
                      <th className="px-5 py-3 text-left">Doctor</th>
                      <th className="px-5 py-3 text-left">Visits</th>
                      <th className="px-5 py-3 text-left">Last Visit</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {patients.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        {/* PATIENT */}
                        <td className="px-5 py-4 flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-800">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-500">#{p.id}</p>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td className="px-5 py-4 text-gray-600">{p.phone}</td>

                        {/* GENDER */}
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                            {p.gender}
                          </span>
                        </td>

                        {/* AGE */}
                        <td className="px-5 py-4 text-gray-600">
                          {p.age ?? "-"}
                        </td>

                        {/* DOCTOR */}
                        <td className="px-5 py-4 text-gray-700 font-medium">
                          {p.doctor_name || "-"}
                        </td>

                        {/* VISITS */}
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-semibold">
                            {p.total_visits}
                          </span>
                        </td>

                        {/* LAST VISIT */}
                        <td className="px-5 py-4 text-gray-600">
                          {p.last_visit ? formatDate(p.last_visit) : "-"}
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          <a
                            href={`/patients/history/${p.id}`}
                            className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-blue-400 shadow hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition"
                            title="View Patient"
                          >
                            <i className="fa fa-eye"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex justify-between items-center px-5 py-4 border-t bg-gray-50">
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-1.5 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-1.5 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE CARDS */}
              <div className="sm:hidden p-4 space-y-4">
                {patients.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border p-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">#{p.id}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        <b>Phone:</b> {p.phone}
                      </p>
                      <p>
                        <b>Doctor:</b> {p.doctor_name || "-"}
                      </p>
                      <p>
                        <b>Visits:</b> {p.total_visits}
                      </p>
                      <p>
                        <b>Last:</b>{" "}
                        {p.last_visit ? formatDate(p.last_visit) : "-"}
                      </p>
                    </div>

                    <a
                      href={`/patients/history/${p.id}`}
                      className="mt-3 block text-center bg-indigo-600 text-white py-2 rounded-lg text-sm"
                    >
                      View History
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
