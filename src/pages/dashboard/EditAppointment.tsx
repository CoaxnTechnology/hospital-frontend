import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_name: "",
    department: "",
    doctor_name: "",
    date: "",
    time: "",
    email: "",
    phone: "",
  });

  // 🔹 Simulate API fetch (replace later)
  useEffect(() => {
    // Dummy data (API se ayega later)
    const appointmentData = {
      patient_name: "John Doe",
      department: "Neurology",
      doctor_name: "Dr. Smith",
      date: "2024-05-20",
      time: "10:30",
      email: "john@example.com",
      phone: "9876543210",
    };

    setForm(appointmentData);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 API UPDATE CALL LATER
    console.log("Updated Appointment:", id, form);

    navigate("/appointments");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/appointments")}
            className="w-10 h-10 rounded-lg
                       border border-gray-200
                       flex items-center justify-center
                       hover:bg-gray-100 transition"
            title="Back"
          >
            <i className="fa fa-arrow-left"></i>
          </button>

          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Appointment
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-6"
        >
          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           bg-white
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Department</option>
                <option value="Dentists">Dentists</option>
                <option value="Neurology">Neurology</option>
                <option value="Opthalmology">Opthalmology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cancer Department">Cancer Department</option>
                <option value="ENT Department">ENT Department</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                name="doctor_name"
                value={form.doctor_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ROW 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ACTION */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2
                         bg-blue-600 text-white px-8 py-2.5
                         rounded-lg shadow
                         hover:bg-blue-700 transition"
            >
              <i className="fa fa-save"></i>
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditAppointment;
