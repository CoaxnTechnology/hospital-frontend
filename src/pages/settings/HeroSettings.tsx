import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getHero,
  addHero,
  updateHero,
  deleteHero,
} from "../../services/setting.service";
import imageCompression from "browser-image-compression";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const HeroSettings = () => {
  const [list, setList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    highlight: "",
    description: "",
    image: null as File | null,
  });

  // 🔥 FETCH
  const fetchData = async () => {
    setPageLoading(true);
    const data = await getHero();
    setList(data || []);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // INPUT
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FILE
  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🔥 TYPE CHECK
    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload a valid image file");
      return;
    }

    console.log("📦 Original size:", file.size / 1024, "KB");

    const maxSize = 400 * 1024; // 🔥 400KB RULE

    // ✅ SMALL FILE → NO COMPRESSION
    if (file.size <= maxSize) {
      console.log("✅ Under 400KB → no compression");

      setForm((prev) => ({
        ...prev,
        image: file,
      }));
      const url = URL.createObjectURL(file);
      setPreview(url);
      return;
    }

    console.log("⚡ Large image → compressing...");

    // 🔥 COMPRESS FUNCTION
    const compressImage = async (file: File) => {
      let quality = 0.9;
      let compressed = file;
      let attempts = 0;

      while (compressed.size > maxSize && quality > 0.4 && attempts < 6) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          initialQuality: quality,
          useWebWorker: true,
        };

        compressed = await imageCompression(compressed, options);
        quality -= 0.1;
        attempts++;
      }

      return compressed;
    };

    try {
      const compressedFile = await compressImage(file);

      console.log("✅ Compressed size:", compressedFile.size / 1024, "KB");
      setForm((prev) => ({
        ...prev,
        image: compressedFile,
      }));

      setPreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("❌ Compression error", err);
      alert("Compression failed");
    }
  };
  // 🔥 SUBMIT FIXED
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.title || !form.highlight || !form.description) {
      alert("Please fill all fields");
      return;
    }

    if (!editingId && !form.image) {
      alert("Please select image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("highlight", form.highlight);
      formData.append("description", form.description);

      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await updateHero(editingId, formData);
      } else {
        await addHero(formData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (item: any) => {
    setForm({
      title: item.title,
      highlight: item.highlight,
      description: item.description,
      image: null,
    });

    setPreview(`${BASE_URL}${item.image}`);
    setEditingId(item.id);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this slide?")) return;
    await deleteHero(id);
    fetchData();
  };

  // RESET
  const resetForm = () => {
    setForm({
      title: "",
      highlight: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow">
          <h2 className="text-2xl font-semibold">Hero Section Manager</h2>
          <p className="text-sm opacity-90">Manage homepage banners</p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter Title"
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="highlight"
              value={form.highlight}
              onChange={handleChange}
              placeholder="Enter Highlight"
              className="border rounded-xl px-4 py-3"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="border rounded-xl px-4 py-3 w-full"
          />

          {/* FILE */}
          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer">
            Upload Image
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          
          {/* PREVIEW */}
          {preview && (
            <img src={preview} className="w-32 h-24 object-cover rounded-xl" />
          )}

          {/* BUTTON */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 🔥 SKELETON LOADING */}
        {pageLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow p-4 space-y-3"
              >
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <img
                  src={`${BASE_URL}${item.image}`}
                  className="w-full h-44 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-blue-600">{item.highlight}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-yellow-400 text-white py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HeroSettings;
