const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

import {
  getHero,
  addHero,
  updateHero,
  deleteHero,
} from "../../services/setting.service";

const HeroSettings = () => {
  const [list, setList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    highlight: "",
    description: "",
    image: null as File | null,
  });

  // FETCH
  const fetchData = async () => {
    const data = await getHero();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // INPUT
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FILE UPLOAD
  const handleFile = (e: any) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

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

        {/* FORM CARD */}
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
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="highlight"
              value={form.highlight}
              onChange={handleChange}
              placeholder="Enter Highlight"
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            required
          />

          {/* FILE UPLOAD (PRO UI) */}
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition">
            <p className="text-gray-500">
              Click to upload image or drag & drop
            </p>
            <input type="file" onChange={handleFile} className="hidden" />
          </label>

          {/* PREVIEW */}
          {preview && (
            <div className="flex items-center gap-4">
              <img
                src={preview}
                className="w-32 h-24 object-cover rounded-xl border"
              />
              <p className="text-sm text-gray-500">Preview</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow">
              {editingId ? "Update Slide" : "Add Slide"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${BASE_URL}${item.image}`}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <p className="text-blue-600 font-medium">{item.highlight}</p>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HeroSettings;
