const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { addBlog, updateBlog, getBlog } from "../../services/blog.service";
import imageCompression from "browser-image-compression";
const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
  });

  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔥 LOAD EDIT
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await getBlog(id);
      if (res.data) {
        setForm(res.data);

        if (res.data.image) {
          setPreview(`${BASE_URL}${res.data.image}`);
        }
      }
    };

    load();
  }, [id]);

  // 🔥 IMAGE CHANGE
  const handleImage = async (file: any) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Only image allowed");
      return;
    }

    console.log("📦 Original:", file.size / 1024, "KB");

    const maxSize = 400 * 1024;

    // ✅ small
    if (file.size <= maxSize) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      return;
    }

    // 🔥 compress
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

      console.log("✅ Final:", compressedFile.size / 1024, "KB");

      setImage(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error(err);
      alert("Compression failed");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("content", form.content);
    formData.append("author", form.author);

    if (image) {
      formData.append("image", image);
    }

    if (id) {
      await updateBlog(id, formData);
    } else {
      await addBlog(formData);
    }

    navigate("/settings/blog");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-6">
          {id ? "Edit Blog" : "Add Blog"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-5"
        >
          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />
          </div>

          {/* AUTHOR */}
          <div>
            <label className="text-sm text-gray-600">Author</label>
            <input
              value={form.author}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  author: e.target.value,
                }))
              }
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Short description..."
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-sm text-gray-600">Full Content</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="w-full mt-1 border rounded-lg px-4 py-2 h-40 focus:ring-2 focus:ring-blue-500"
              placeholder="Write full blog content..."
            />
          </div>

          {/* 🔥 IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              Blog Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition">
              {/* PREVIEW */}
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <p className="text-gray-400 text-sm mb-2">No image selected</p>
              )}

              <input
                type="file"
                onChange={(e) => handleImage(e.target.files?.[0])}
                className="hidden"
                id="upload"
              />

              <label
                htmlFor="upload"
                className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Choose Image
              </label>

              <p className="text-xs text-gray-400 mt-2">JPG, PNG recommended</p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/settings/blog")}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
              {id ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BlogForm;
