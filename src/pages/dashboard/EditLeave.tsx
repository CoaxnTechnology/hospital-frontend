import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const EditLeave = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy existing data (API later)
  const [form, setForm] = useState({
    employee: "Rahul Sharma",
    emp_id: "EMP001",
    leave_type: "Sick Leave",
    date_from: "2024-01-10",
    date_to: "2024-01-12",
    reason: "Fever",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Update Leave:", id, form);
    // 🔥 API update call here

    navigate("/employee/leave");
  };

  return (
    <DashboardLayout>
      {/* CENTERED PAGE CONTAINER */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">

        {/* HEADER (SAME AS ADD LEAVE) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/employee/leave")}
            className="flex items-center justify-center w-10 h-10 rounded-lg
            border border-gray-200 hover:bg-gray-100 transition"
          >
            <i className="fa fa-arrow-left text-gray-600"></i>
          </button>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit Leave
            </h2>
            <p className="text-sm text-gray-500">
              Update leave details (ID: {id})
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow">
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* EMPLOYEE NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                name="employee"
                value={form.employee}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* EMPLOYEE ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                name="emp_id"
                value={form.emp_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* LEAVE TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                name="leave_type"
                value={form.leave_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Paid Leave</option>
              </select>
            </div>

            {/* FROM DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="date_from"
                value={form.date_from}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* TO DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="date_to"
                value={form.date_to}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* REASON */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                rows={3}
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/employee/leave")}
                className="px-6 py-2 rounded-lg border border-gray-300
                text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-blue-600
                text-white hover:bg-blue-700 transition"
              >
                Update Leave
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EditLeave;
