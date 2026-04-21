const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getPrivateDoctors } from "../../services/doctor.service";
import { deleteDoctor } from "../../services/doctor.service";
type Doctor = {
  id: number;
  image: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  user_id: number;
  phone: string;
  department: string;
};

const Doctors = () => {
  const [search, setSearch] = useState(""); // actual API search
  const [searchInput, setSearchInput] = useState(""); // input field
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // 🔥 GET DOCTORS API CALL
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getPrivateDoctors(page, 10, search);
        console.log("Doctors API Response:", res);

        if (!res.success) {
          setError(res.message || "Failed to load doctors");
          setLoading(false);
          return;
        }

        setDoctors(res.data);

        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [page, search]);

  // Get doctor's own profile
  const doctorProfile = doctors.find((doc) => doc.user_id === user.id);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?",
    );

    if (!confirmDelete) return;

    const res = await deleteDoctor(id);

    if (res.success) {
      // ✅ UI se bhi remove
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert(res.message || "Delete failed");
    }
  };

  // DOCTOR VIEW - Full page card
  if (user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center">
          {loading && (
            <div className="text-center text-gray-500 py-10">
              Loading profile...
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
          )}

          {!loading && !error && doctorProfile && (
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                {/* Profile Content */}
                <div className="px-8 pb-8">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center -mt-16 mb-6">
                    <img
                      src={
                        doctorProfile.image
                          ? `${BASE_URL}${doctorProfile.image}`
                          : "/default-avatar.png"
                      }
                      alt={doctorProfile.first_name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover object-center shadow-lg"
                    />
                  </div>

                  {/* Profile Details */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {doctorProfile.first_name} {doctorProfile.last_name}
                    </h1>
                    <p className="text-blue-600 text-lg font-semibold mt-2">
                      {doctorProfile.department}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-semibold">
                        Email
                      </p>
                      <p className="text-gray-800 text-lg mt-1">
                        {doctorProfile.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-semibold">
                        Phone
                      </p>
                      <p className="text-gray-800 text-lg mt-1">
                        {doctorProfile.phone}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-semibold">
                        Date of Birth
                      </p>
                      <p className="text-gray-800 text-lg mt-1">
                        {new Date(doctorProfile.dob).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-semibold">
                        Gender
                      </p>
                      <p className="text-gray-800 text-lg mt-1">
                        {doctorProfile.gender}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                      <p className="text-gray-600 text-sm font-semibold">
                        Address
                      </p>
                      <p className="text-gray-800 text-lg mt-1">
                        {doctorProfile.address}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm font-semibold">ID</p>
                      <p className="text-gray-800 text-lg mt-1">
                        {doctorProfile.id}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    {user.role === "admin" && (
                      <div className="flex justify-center">
                        <a
                          href={`/doctors/edit_doctor/${doctorProfile.id}`}
                          className="inline-flex items-center gap-2
      bg-blue-600 text-white px-6 py-3 rounded-lg
      hover:bg-blue-700 transition shadow"
                        >
                          <i className="fa fa-pencil"></i>
                          Edit Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !doctorProfile && (
            <div className="text-center text-gray-500 py-10">
              No profile found
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ADMIN VIEW - Table
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Doctors Management
          </h2>

          <a
            href="/doctors/add_doctor"
            className="inline-flex items-center gap-2
              bg-blue-600 text-white px-5 py-2.5 rounded-lg
              hover:bg-blue-700 transition shadow"
          >
            <i className="fa fa-plus text-sm"></i>
            Add Doctor
          </a>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search doctor by name, phone, ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={() => {
                setSearch(searchInput);
                setPage(1);
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* STATES */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 animate-pulse border-b py-3"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {/* TABLE WRAPPER */}
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Doctor</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* DOCTOR INFO */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              doc.image
                                ? `${BASE_URL}${doc.image}`
                                : "/default-avatar.png"
                            }
                            className="w-12 h-12 rounded-full object-cover border"
                          />

                          <div>
                            <div className="font-semibold text-gray-800">
                              {doc.first_name} {doc.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {doc.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-gray-700">{doc.email}</div>
                        <div className="text-xs text-gray-500">{doc.phone}</div>
                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {doc.department}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* 👁 VIEW */}
                          <a
                            href={`/doctors/view/${doc.id}`}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow hover:bg-green-50 text-gray-600 hover:text-green-600 transition"
                            title="View Doctor"
                          >
                            <i className="fa fa-eye"></i>
                          </a>

                          {/* ✏ EDIT */}
                          <a
                            href={`/doctors/edit_doctor/${doc.id}`}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                          >
                            <i className="fa fa-pencil"></i>
                          </a>

                          {/* 🗑 DELETE */}
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {doctors.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-500"
                      >
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                  >
                    ⬅
                  </button>

                  <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    {pagination.page}
                  </span>

                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                  >
                    ➡
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
