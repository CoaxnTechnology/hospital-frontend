import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getEmployees,
  deleteEmployee,
  resendResetLink,
  getMyProfile,
} from "../../services/employee.Service";
import { Link } from "react-router-dom";

type Employee = {
  id: number;
  name: string;
  email: string;
  contact: string;
  user_id: number;
  join_date: string;
  role: string;
};

const SkeletonRow = () => (
  <tr className="border-b">
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
    </td>
    <td className="px-5 py-4 text-right">
      <div className="flex justify-end gap-2">
        <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border p-4 bg-white shadow-sm">
    <div className="h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3 mb-3"></div>
    <div className="space-y-1">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="flex gap-2 mt-3">
      <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const SkeletonStaffCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
    <div className="text-center mb-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded animate-pulse mt-3"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto mt-1"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg">
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const Employees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  // ✅ ADD THIS
  // ✅ NEW STATES
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const totalPages = Math.ceil(total / limit);

  /* =========================
     FETCH EMPLOYEES
  ========================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let res;

        if (user.role === "admin") {
          console.log("👉 Fetching with:", { page, limit, search });

          res = await getEmployees(page, limit, search);

          console.log("👉 Response:", res);

          if (res.success) {
            setEmployees(res.data);
            setTotal(res.total); // ✅ IMPORTANT
          }
        } else {
          res = await getMyProfile();
          if (res.success) {
            setEmployees([res.data]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, search]); // ✅ DEPENDENCY ADDED
  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteEmployee(id);

      if (res.success) {
        alert("Employee deleted successfully");
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } else {
        alert(res.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* =========================
     RESEND
  ========================= */
  const handleResend = async (email: string) => {
    const confirmAction = window.confirm("Send reset password link again?");
    if (!confirmAction) return;

    try {
      const res = await resendResetLink(email);

      if (res.success) {
        alert("Reset link sent successfully ✅");
      } else {
        alert(res.message || "Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = () => {
    console.log("👉 Searching:", searchInput);

    setPage(1);
    setSearch(searchInput);
  };
  /* =========================
     FILTER
  ========================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Loading employees...</div>
      </DashboardLayout>
    );
  }
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.role === "admin" ? "Employees" : user.name}
          </h2>

          {user.role === "admin" && (
            <a
              href="/employee/add"
              className="inline-flex items-center gap-2
              bg-blue-600 text-white px-5 py-2.5 rounded-lg
              hover:bg-blue-700 transition shadow"
            >
              <i className="fa fa-plus text-sm"></i>
              Add Employee
            </a>
          )}
        </div>

        {/* SEARCH (Admin only) */}
        {user.role === "admin" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full sm:w-1/3 border rounded-lg px-4 py-2"
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              Search
            </button>
          </div>
        )}

        {/* ================= ADMIN TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              Employee List
            </h3>
            <span className="text-xs text-gray-500">Total: {total}</span>
          </div>

          {employees.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              🚫 No employees found
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Employee</th>
                      <th className="px-5 py-3 text-left">Email</th>
                      <th className="px-5 py-3 text-left">Contact</th>
                      <th className="px-5 py-3 text-left">Join Date</th>
                      <th className="px-5 py-3 text-left">Role</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        {/* NAME */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {emp.name}
                          </p>
                          <p className="text-xs text-gray-500">#{emp.id}</p>
                        </td>

                        {/* EMAIL */}
                        <td className="px-5 py-4 text-gray-600">{emp.email}</td>

                        {/* CONTACT */}
                        <td className="px-5 py-4 text-gray-600">
                          {emp.contact}
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(emp.join_date)}
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                            {emp.role}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/employee/edit/${emp.id}`}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100"
                            >
                              <i className="fa fa-pencil"></i>
                            </Link>

                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100"
                            >
                              <i className="fa fa-trash"></i>
                            </button>

                            <button
                              onClick={() => handleResend(emp.email)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-green-100"
                            >
                              <i className="fa fa-refresh"></i>
                            </button>
                          </div>
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
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="px-4 py-1.5 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <button
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => (p < totalPages ? p + 1 : p))
                      }
                      className="px-4 py-1.5 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE CARDS */}
              <div className="sm:hidden p-4 space-y-4">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="rounded-2xl border p-4 bg-white shadow-sm"
                  >
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-500">#{emp.id}</p>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        <b>Email:</b> {emp.email}
                      </p>
                      <p>
                        <b>Contact:</b> {emp.contact}
                      </p>
                      <p>
                        <b>Join:</b> {formatDate(emp.join_date)}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/employee/edit/${emp.id}`}
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= STAFF / DOCTOR CARD ================= */}
        {user.role !== "admin" &&
          employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {emp.name?.charAt(0)}
                </div>

                <h2 className="text-2xl font-semibold mt-3">{emp.name}</h2>
                <p className="text-gray-500">{emp.role}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{emp.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{emp.contact}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">{formatDate(emp.join_date)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">#{emp.id}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
};

export default Employees;
