import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createLeave } from "../../services/leave.service";

const AddLeave = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leave_type: "",
    date_from: "",
    date_to: "",
    total_days: 0,
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };

    // 🔥 auto calculate leave days
    if (updatedForm.date_from && updatedForm.date_to) {
      const from = new Date(updatedForm.date_from);
      const to = new Date(updatedForm.date_to);

      const diff =
        Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      updatedForm.total_days = diff > 0 ? diff : 0;
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        leave_type: form.leave_type,
        date_from: form.date_from,
        date_to: form.date_to,
        total_days: form.total_days,
        reason: form.reason,
      };

      const res = await createLeave(payload);

      if (res.success) {
        alert("Leave request submitted successfully");
        navigate("/employee/leave");
      } else {
        alert(res.message || "Failed to submit leave");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">

        {/* HEADER */}
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
              Apply Leave
            </h2>
            <p className="text-sm text-gray-500">
              Submit a leave request
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow">
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* LEAVE TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>

              <select
                name="leave_type"
                value={form.leave_type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Paid">Paid Leave</option>
                <option value="Emergency">Emergency Leave</option>
              </select>
            </div>

            {/* TOTAL DAYS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Days
              </label>

              <input
                value={form.total_days}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                bg-gray-100"
              />
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
                required
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
                required
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
                rows={4}
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Write reason for leave"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* BUTTONS */}
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
                {loading ? "Submitting..." : "Submit Leave"}
              </button>

            </div>

          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AddLeave;