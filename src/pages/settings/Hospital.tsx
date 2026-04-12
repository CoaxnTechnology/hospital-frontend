const BASE_URL = import.meta.env.VITE_BASE_URL;

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getHospital, saveHospital } from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const Hospital = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    instagram: "", // ✅ NEW
    facebook: "", // ✅ NEW
  });

  const [logo, setLogo] = useState<any>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getHospital();
    if (res.data) {
      setForm({
        name: res.data.name || "",
        address: res.data.address || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        instagram: res.data.instagram || "", // ✅ GET
        facebook: res.data.facebook || "", // ✅ GET
      });
      setPreview(res.data.logo ? `${BASE_URL}${res.data.logo}` : "");
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v as string));

      if (logo) fd.append("logo", logo);

      const res = await saveHospital(fd);

      if (!res?.success) {
        throw new Error("Save failed");
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error saving data");
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <button
            onClick={() => navigate("/settings")}
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mt-2">Hospital Settings</h2>

          <p className="text-gray-500 text-sm">
            Manage hospital details and branding
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT FORM */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border space-y-5">
            <h3 className="text-lg font-semibold text-gray-700">
              Basic Information
            </h3>

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600">Hospital Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 border px-4 py-2 rounded-lg"
              />
            </div>

            {/* PHONE + EMAIL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 border px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 border px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* 🔥 NEW: SOCIAL LINKS (same UI style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Instagram</label>
                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  className="w-full mt-1 border px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Facebook</label>
                <input
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  className="w-full mt-1 border px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 border px-4 py-2 rounded-lg"
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 rounded-lg shadow-sm text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Saving..." : "Save Settings"}
              </button>

              {loading && (
                <span className="text-sm text-gray-500">Updating...</span>
              )}
            </div>
          </div>

          {/* RIGHT LOGO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Hospital Logo
            </h3>

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center">
              {preview ? (
                <img src={preview} className="w-24 h-24 object-contain mb-3" />
              ) : (
                <div className="text-gray-400 text-sm mb-3">
                  No logo uploaded
                </div>
              )}

              <input type="file" onChange={handleFile} className="text-sm" />
            </div>

            <p className="text-xs text-gray-400 text-center">
              Recommended size: 200x200px
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Hospital;
