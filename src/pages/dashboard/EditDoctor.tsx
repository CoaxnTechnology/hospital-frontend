const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import userImg from "../../assets/icons/user-06.jpg";
import { getDoctorById, updateDoctor } from "../../services/doctor.service";
import { getDepartments } from "../../services/department.service";
import imageCompression from "browser-image-compression";
type DoctorForm = {
  firstName: string;
  lastName: string;
  email: string;
  dob: string; // YYYY-MM-DD
  gender: string;
  phone: string;
  address: string;
  department: string;
  biography: string;
};

const EditDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState<DoctorForm>({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    department: "",
    biography: "",
  });

  // ✅ ORIGINAL DATA (partial update ke liye)
  const [original, setOriginal] = useState<DoctorForm | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [preview, setPreview] = useState<string>(userImg);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ======================
     LOAD DOCTOR FROM API
     ====================== */
  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getDoctorById(id);
      if (res?.success) {
        const d = res.data;
        console.log("Loaded doctor data:", d);

        const mapped: DoctorForm = {
          firstName: d.first_name || "",
          lastName: d.last_name || "",
          email: d.email || "",
          dob: d.dob ? d.dob.split("T")[0] : "", // ✅ already YYYY-MM-DD from backend
          gender: d.gender || "",
          phone: d.phone || "",
          address: d.address || "",
          department: d.department || "",
          biography: d.biography || "",
        };

        setForm(mapped);
        setOriginal(mapped);

        if (d.image) {
          setPreview(`${BASE_URL}${d.image}`);
        }
      }
    })();
  }, [id]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        if (res.success) {
          setDepartments(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);
  /* ======================
     HANDLE CHANGE
     ====================== */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================
     UPDATE DOCTOR
     ====================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !original) return;

    const formData = new FormData();

    // ✅ ONLY SEND CHANGED FIELDS
    if (form.firstName !== original.firstName)
      formData.append("first_name", form.firstName);

    if (form.lastName !== original.lastName)
      formData.append("last_name", form.lastName);

    if (form.email !== original.email) formData.append("email", form.email);

    if (form.dob !== original.dob) formData.append("dob", form.dob); // YYYY-MM-DD

    if (form.gender !== original.gender) formData.append("gender", form.gender);

    if (form.phone !== original.phone) formData.append("phone", form.phone);

    if (form.address !== original.address)
      formData.append("address", form.address);

    if (form.department !== original.department)
      formData.append("department", form.department);

    if (form.biography !== original.biography)
      formData.append("biography", form.biography);

    // ✅ IMAGE ONLY IF USER SELECTED NEW IMAGE
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // ❌ NOTHING CHANGED
    if ([...formData.keys()].length === 0) {
      alert("No changes detected");
      return;
    }

    const res = await updateDoctor(id, formData);

    if (res?.success) {
      navigate("/dashboard/doctors");
    } else {
      alert("Update failed");
    }
  };

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
            <h2 className="text-2xl font-semibold text-gray-800">
              Edit Doctor
            </h2>
            <p className="text-sm text-gray-500">
              Update doctor information (ID: {id})
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* FIRST NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
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
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
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
                    checked={form.gender === "male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === "female"}
                    onChange={handleChange}
                  />
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
                value={form.phone}
                onChange={handleChange}
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
                rows={2}
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
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

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>

              <div className="flex items-center gap-4">
                <img
                  src={preview}
                  className="w-20 h-20 rounded-full object-cover border cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Change Image
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // ❌ TYPE CHECK
                  if (!file.type.startsWith("image/")) {
                    alert("❌ Only image allowed");
                    return;
                  }

                  // 🔥 COMPRESSION OPTIONS
                  const options = {
                    maxSizeMB: 0.7, // 300 KB
                    maxWidthOrHeight: 800, // resize
                    useWebWorker: true,
                  };

                  try {
                    console.log("📦 Original size:", file.size / 1024, "KB");

                    const compressedFile = await imageCompression(
                      file,
                      options,
                    );

                    console.log(
                      "✅ Compressed size:",
                      compressedFile.size / 1024,
                      "KB",
                    );

                    setPreview(URL.createObjectURL(compressedFile));
                    setImageFile(compressedFile);
                  } catch (err) {
                    console.error("❌ Compression error", err);
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
                rows={3}
                name="biography"
                value={form.biography}
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
                Update Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditDoctor;
