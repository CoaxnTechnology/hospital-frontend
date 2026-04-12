import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

type Employee = {
  id: number;
  name: string;
  email: string;
  contact: string;
  join_date: string;
  role: string;
  salary: number;
};

const EmployeesSalary = () => {
  const [search, setSearch] = useState("");

  // Dummy data (API se aayega later)
  const employees: Employee[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      contact: "+1 202-555-0189",
      join_date: "12 Jan 2022",
      role: "Doctor",
      salary: 60000,
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      contact: "+1 202-555-0123",
      join_date: "22 Feb 2023",
      role: "Nurse",
      salary: 35000,
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.id}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>

          {/* <a
            href="/employee/add"
            className="inline-flex items-center gap-2
                       bg-blue-600 text-white
                       px-5 py-2.5 rounded-lg
                       hover:bg-blue-700 transition shadow"
          >
            <i className="fa fa-plus"></i>
            Add Employee
          </a> */}
        </div>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Search by Employee Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3
                       border border-gray-300
                       rounded-lg px-4 py-2
                       focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          />
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
                <th className="px-4 py-3 text-left">Salary</th>
                <th className="px-4 py-3 text-left">Payslip</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{emp.id}</td>
                  <td className="px-4 py-3 font-medium">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.contact}</td>
                  <td className="px-4 py-3">{emp.join_date}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-3 py-1 text-xs rounded-full
                                     bg-blue-100 text-blue-700"
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">${emp.salary}</td>

                  {/* PAYSLIP */}
                  <td className="px-4 py-3">
                    <a
                      href={`/payroll/payslip/${emp.id}`}
                      className="inline-flex items-center
                                 px-3 py-1.5
                                 text-xs rounded-lg
                                 bg-green-600 text-white
                                 hover:bg-green-700 transition"
                    >
                      Generate Slip
                    </a>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/employee/edit/${emp.id}`}
                        className="w-9 h-9 flex items-center justify-center
                                   rounded-lg border
                                   hover:bg-blue-50 text-gray-600"
                        title="Edit"
                      >
                        <i className="fa fa-pencil"></i>
                      </a>

                      <a
                        href={`/employee/delete/${emp.id}`}
                        className="w-9 h-9 flex items-center justify-center
                                   rounded-lg border
                                   hover:bg-red-50 text-gray-600"
                        title="Delete"
                      >
                        <i className="fa fa-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
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

export default EmployeesSalary;
