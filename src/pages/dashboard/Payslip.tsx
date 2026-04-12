import { useParams } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import logo from "../../assets/icons/logo.png";

type Employee = {
  id: number;
  name: string;
  role: string;
  email: string;
  contact: string;
  join_date: string;
  salary: number;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Payslip = () => {
  const { id } = useParams();
  const [month, setMonth] = useState("July");

  const employees: Employee[] = [
    {
      id: 1,
      name: "John Doe",
      role: "Senior Doctor",
      email: "john@example.com",
      contact: "+1 202-555-0189",
      join_date: "12 Jan 2022",
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

  const employee = employees.find((e) => e.id === Number(id));

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">Employee not found</div>
      </DashboardLayout>
    );
  }

  const hra = employee.salary * 0.15;
  const allowance = employee.salary * 0.1;
  const tax = employee.salary * 0.05;
  const netSalary = employee.salary + hra + allowance - tax;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Payroll Payslip
          </h2>

          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fa fa-print mr-2"></i>Print
            </button>
          </div>
        </div>

        {/* PAYSLIP CARD */}
        <div id="payslip" className="bg-white rounded-2xl shadow-xl p-10">
          {/* COMPANY HEADER */}
          <div className="flex justify-between items-start border-b pb-6 mb-8">
            <div className="flex items-center gap-4">
              {/* LOGO WITH BLACK BACKGROUND FIX */}
              <div className="bg-black p-3 rounded-md">
                <img src={logo} className="w-14" />
              </div>

              <div>
                <h3 className="font-bold text-xl">PreClinic</h3>
                <p className="text-sm text-gray-500">
                  Healthcare Management System
                </p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-xl font-bold">Payslip</h3>
              <p className="text-sm text-gray-500">
                Salary Month: {month} 2025
              </p>
              <p className="text-sm text-gray-500">
                Payslip ID: #{employee.id}
              </p>
            </div>
          </div>

          {/* EMPLOYEE INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-sm">
            <div className="space-y-1">
              <p>
                <strong>Name:</strong> {employee.name}
              </p>
              <p>
                <strong>Role:</strong> {employee.role}
              </p>
              <p>
                <strong>Employee ID:</strong> {employee.id}
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
              <p>
                <strong>Contact:</strong> {employee.contact}
              </p>
              <p>
                <strong>Joining Date:</strong> {employee.join_date}
              </p>
            </div>
          </div>

          {/* SALARY BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* EARNINGS */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Earnings</h4>
              <div className="border rounded-xl divide-y text-sm">
                <div className="p-4 flex justify-between">
                  <span>Basic Salary</span>
                  <span>${employee.salary}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span>HRA (15%)</span>
                  <span>${hra}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span>Allowance</span>
                  <span>${allowance}</span>
                </div>
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Deductions</h4>
              <div className="border rounded-xl divide-y text-sm">
                <div className="p-4 flex justify-between">
                  <span>Tax & PF</span>
                  <span>${tax}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NET SALARY */}
          <div className="mt-10 flex justify-end">
            <div className="bg-blue-50 border border-blue-200 px-8 py-4 rounded-xl text-right">
              <p className="text-sm text-gray-500">Net Salary</p>
              <p className="text-2xl font-bold text-blue-600">${netSalary}</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-12 border-t pt-4 text-center text-sm text-gray-500">
            This is a system-generated payslip and does not require a signature.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payslip;
