import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addDosage,
  getDosage,
  updateDosage,
  deleteDosage,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const Dosage = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDosage();
    setList(res.data || []);
  };

  const handleAdd = async () => {
    if (!name) return;
    await addDosage(name);
    setName("");
    load();
  };

  const handleUpdate = async () => {
    await updateDosage(editId, editName);
    setEditId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await deleteDosage(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/settings")}
              className="text-blue-600 text-sm hover:underline"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-semibold mt-2">Dosage Form</h2>
            <p className="text-gray-500 text-sm">
              Manage dosage types (Tablet, Syrup, Injection)
            </p>
          </div>
        </div>

        {/* ADD CARD */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter dosage form..."
            className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
          >
            + Add
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-5 py-4 border-b flex justify-between">
            <h3 className="font-semibold text-gray-700">
              Dosage List ({list.length})
            </h3>
          </div>

          {list.length === 0 ? (
            <div className="p-6 text-gray-400 text-center">No data found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.map((d, index) => (
                  <tr
                    key={d.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">{index + 1}</td>

                    <td className="px-5 py-3">
                      {editId === d.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {d.name}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-center">
                      {editId === d.id ? (
                        <div className="flex justify-center gap-2">
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
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditId(d.id);
                              setEditName(d.name);
                            }}
                            className="text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(d.id)}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dosage;
