import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import userImg from "../../assets/icons/user-06.jpg";
import { createDoctor } from "../../services/doctor.service";
import { useEffect } from "react";
import { getDepartments } from "../../services/department.service";
const AddDoctor = () => {
  const navigate = useNavigate();

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    department: "",
    biography: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  // Avatar preview state
  const [preview, setPreview] = useState<string>(userImg);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createDoctor(form);

      if (!res.success) {
        setError(res.message || "Doctor creation failed");
        return;
      }

      alert("Doctor created successfully. Email sent.");
      navigate("/dashboard/doctors");
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();

        if (res.success && res.data) {
          setDepartments(res.data);
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error("Department fetch error", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/doctors")}
            className="flex items-center justify-center w-10 h-10 rounded-lg
            border border-gray-200 hover:bg-gray-100 transition"
          >
            <i className="fa fa-arrow-left text-gray-600"></i>
          </button>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Add Doctor</h2>
            <p className="text-sm text-gray-500">Create a new doctor profile</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* FIRST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="first_name"
                type="text"
                placeholder="John"
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="last_name"
                type="text"
                placeholder="Doe"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                  />{" "}
                  Male
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                  />{" "}
                  Female
                </label>
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                type="text"
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                rows={2}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* DEPARTMENT (STATIC) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
  focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select department</option>

                {departments.length > 0 ? (
                  departments.map((dept: any) => (
                    <option key={dept.id} value={dept.department_name}>
                      {dept.department_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No department found</option>
                )}
              </select>
            </div>

            {/* AVATAR */}
            <div className="flex items-center gap-4">
              {/* IMAGE PREVIEW */}
              <img
                src={preview}
                className="w-20 h-20 rounded-full object-cover border cursor-pointer"
                onClick={() => fileRef.current?.click()}
              />

              {/* BUTTON */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Choose Image
              </button>

              {/* FILE INPUT */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            {/* BIO */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Biography
              </label>
              <textarea
                name="biography"
                rows={3}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/dashboard/doctors")}
                className="px-6 py-2 rounded-lg border border-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 rounded-lg bg-blue-600 text-white"
              >
                {loading ? "Saving..." : "Create Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddDoctor;
//VITE_BASE_URL=https://hospital.clinicalgynecologists.space
