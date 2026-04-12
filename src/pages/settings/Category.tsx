import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getCategory();
    setList(res.data || []);
  };

  const handleAdd = async () => {
    if (!name) return alert("Enter category");
    await addCategory(name);
    setName("");
    load();
  };

  const handleUpdate = async () => {
    await updateCategory(editId, editName);
    setEditId(null);
    setEditName("");
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <button
              onClick={() => navigate("/settings")}
              className="text-blue-600 text-sm hover:underline"
            >
              ← Back
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mt-1">
              Medicine Category
            </h2>

            <p className="text-gray-500 text-xs sm:text-sm">
              Manage medicine types (Tablet, Capsule, Syrup)
            </p>
          </div>
        </div>

        {/* ADD CARD */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">
            Add New Category
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category..."
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handleAdd}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              + Add
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="px-4 sm:px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
              Category List ({list.length})
            </h3>
          </div>

          {list.length === 0 ? (
            <div className="p-6 text-gray-400 text-center text-sm">
              No categories found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">

                {/* HEADER */}
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left">#</th>
                    <th className="px-4 sm:px-6 py-3 text-left">Category</th>
                    <th className="px-4 sm:px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {list.map((c, index) => (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 sm:px-6 py-3">
                        {index + 1}
                      </td>

                      <td className="px-4 sm:px-6 py-3">
                        {editId === c.id ? (
                          <input
                            value={editName}
                            onChange={(e) =>
                              setEditName(e.target.value)
                            }
                            className="border px-3 py-1 rounded w-full"
                          />
                        ) : (
                          <span className="font-medium text-gray-700">
                            {c.name}
                          </span>
                        )}
                      </td>

                      <td className="px-4 sm:px-6 py-3 text-center">
                        {editId === c.id ? (
                          <div className="flex flex-col sm:flex-row justify-center gap-2">
                            <button
                              onClick={handleUpdate}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditId(null)}
                              className="bg-gray-400 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditId(c.id);
                                setEditName(c.name);
                              }}
                              className="text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(c.id)
                              }
                              className="text-red-600 hover:bg-red-100 px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Category;