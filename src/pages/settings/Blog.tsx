const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getBlogs, deleteBlog } from "../../services/blog.service";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await getBlogs();
    setBlogs(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete blog?")) return;
    await deleteBlog(id);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Blogs</h2>

          <button
            onClick={() => navigate("/settings/blog/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Blog
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b">
                  <td className="p-3">
                    <img
                      src={`${BASE_URL}${blog.image}`}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-3">{blog.title}</td>
                  <td className="p-3">{blog.author}</td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/settings/blog/edit/${blog.id}`)}
                    >
                      ✏️
                    </button>

                    <button onClick={() => handleDelete(blog.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogPage;
