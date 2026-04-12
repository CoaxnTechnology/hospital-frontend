import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getEmployees } from "../../services/employee.Service";
import { deleteEmployee } from "../../services/employee.Service";
import { Link } from "react-router-dom";
type Employee = {
  id: number;
  name: string;
  email: string;
  contact: string;
  join_date: string;
  role: string;
};

const Employees = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH EMPLOYEES
  ========================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();

        if (res.success) {
          setEmployees(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteEmployee(id);

      if (res.success) {
        alert("Employee deleted successfully");

        // UI update
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
     SEARCH FILTER
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>

          <a
            href="/employee/add"
            className="inline-flex items-center gap-2
                       bg-blue-600 text-white
                       px-5 py-2.5 rounded-lg
                       hover:bg-blue-700 transition shadow"
          >
            <i className="fa fa-plus text-sm"></i>
            Add Employee
          </a>
        </div>

        {/* SEARCH FILTER */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/3
                         border border-gray-300 rounded-lg
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg
                         hover:bg-green-700 transition shadow"
            >
              Search
            </button>
          </div>
        </div>

        {/* TABLE */}
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
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{emp.id}</td>
                  <td className="px-4 py-3">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.contact}</td>
                  <td className="px-4 py-3">{emp.join_date}</td>

                  <td className="px-4 py-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs
                                 bg-indigo-100 text-indigo-700"
                    >
                      {emp.role}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        to={`/employee/edit/${emp.id}`}
                        className="w-9 h-9 flex items-center justify-center
             rounded-lg border border-gray-200
             text-gray-600
             hover:bg-blue-50 hover:text-blue-600
             transition"
                        title="Edit Employee"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="w-9 h-9 flex items-center justify-center
  rounded-lg border border-gray-200
  text-gray-600
  hover:bg-red-50 hover:text-red-600
  transition"
                        title="Delete Employee"
                      >
                        <i className="fa fa-trash"></i>
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
      </div>
    </DashboardLayout>
  );
};

export default Employees;
