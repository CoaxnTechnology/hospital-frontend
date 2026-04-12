import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const Brand = () => {
  const [name, setName] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const res = await getBrands();
    setBrands(res.data || []);
  };

  const handleAdd = async () => {
    if (!name) return alert("Enter brand name");
    await addBrand(name);
    setName("");
    loadBrands();
  };

  const handleEdit = (brand: any) => {
    setEditId(brand.id);
    setEditName(brand.name);
  };

  const handleUpdate = async () => {
    await updateBrand(editId, editName);
    setEditId(null);
    setEditName("");
    loadBrands();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this brand?")) return;
    await deleteBrand(id);
    loadBrands();
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

            <h2 className="text-2xl font-semibold mt-2">
              Medicine Brand
            </h2>
            <p className="text-gray-500 text-sm">
              Manage all medicine brands
            </p>
          </div>
        </div>

        {/* ADD SECTION */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter brand name..."
            className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
          >
            + Add
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">
              Brand List ({brands.length})
            </h3>
          </div>

          {brands.length === 0 ? (
            <div className="p-6 text-gray-400 text-center">
              No brands found
            </div>
          ) : (
            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Brand Name</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {brands.map((b, index) => (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">{index + 1}</td>

                    <td className="px-5 py-3">
                      {editId === b.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {b.name}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-center">
                      {editId === b.id ? (
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
                            onClick={() => handleEdit(b)}
                            className="px-3 py-1 text-yellow-600 hover:bg-yellow-100 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(b.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-100 rounded"
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

export default Brand;