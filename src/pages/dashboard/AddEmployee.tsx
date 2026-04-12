import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createEmployee } from "../../services/employee.Service";
const AddEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    designation: "", // Manager, Nurse, etc.
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      contact: form.phone,
      join_date: form.joinDate,
      designation: form.designation,
      role: "staff",
    };

    try {
      setLoading(true);

      const res = await createEmployee(payload);

      if (res.success) {
        alert("Employee created successfully");
        navigate("/employees");
      } else {
        alert(res.message || "Failed to create employee");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/employees")}
            className="text-blue-600 hover:text-blue-800"
          >
            <i className="fa fa-arrow-left text-lg"></i>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Add Employee</h2>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CONTACT */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* JOIN DATE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Join Date
              </label>
              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DESIGNATION (STAFF TYPE) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <select
                name="designation"
                required
                value={form.designation}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Designation</option>
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Accountant">Accountant</option>
                <option value="Nurse">Nurse</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Lab Assistant">Lab Assistant</option>
              </select>

              <p className="text-xs text-gray-500 mt-1">
                * All these roles will be created as <b>Staff</b>
              </p>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="px-6 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg
                bg-blue-600 text-white hover:bg-blue-700 shadow"
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddEmployee;
