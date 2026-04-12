import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getEmployeeById,
  updateEmployee,
} from "../../services/employee.Service";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    join_date: "",
    designation: "",
  });

  /* =========================
     FETCH EMPLOYEE DATA
  ========================= */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(Number(id));
        console.log("Employee data:", res);

        if (res.success) {
          const emp = res.data;

          setForm({
            name: emp.name || "",
            email: emp.email || "",
            contact: emp.contact || "",
            join_date: emp.join_date ? emp.join_date.split("T")[0] : "",
            designation: emp.designation || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     UPDATE EMPLOYEE
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await updateEmployee(Number(id), form);

      if (res.success) {
        alert("Employee updated successfully");
        navigate("/employees");
      } else {
        alert(res.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading employee...</div>
      </DashboardLayout>
    );
  }

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

          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Employee
          </h2>
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
                value={form.name}
                onChange={handleChange}
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
                value={form.email}
                onChange={handleChange}
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
                name="contact"
                value={form.contact}
                onChange={handleChange}
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
                name="join_date"
                value={form.join_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DESIGNATION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>

              <select
                name="designation"
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
                bg-green-600 text-white hover:bg-green-700 shadow"
              >
                Update Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditEmployee;
