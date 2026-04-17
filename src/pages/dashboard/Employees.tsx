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

const Employees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* =========================
     FETCH EMPLOYEES
  ========================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let res;

        if (user.role === "admin") {
          res = await getEmployees();
          if (res.success) {
            setEmployees(res.data);
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
  }, []);

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

  /* =========================
     FILTER
  ========================= */
  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.id}`.toLowerCase().includes(search.toLowerCase()),
  );

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
          <div className="bg-white rounded-xl shadow p-4">
            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/3 border rounded-lg px-4 py-2"
            />
          </div>
        )}

        {/* ================= ADMIN TABLE ================= */}
        {user.role === "admin" && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Employee Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Join Date</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{emp.id}</td>
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">{emp.contact}</td>
                    <td className="px-4 py-3">{formatDate(emp.join_date)}</td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                        {emp.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/employee/edit/${emp.id}`}
                          className="w-9 h-9 flex items-center justify-center border rounded-lg"
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>

                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="w-9 h-9 flex items-center justify-center border rounded-lg"
                        >
                          <i className="fa fa-trash"></i>
                        </button>

                        <button
                          onClick={() => handleResend(emp.email)}
                          className="w-9 h-9 flex items-center justify-center border rounded-lg"
                        >
                          <i className="fa fa-refresh"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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
