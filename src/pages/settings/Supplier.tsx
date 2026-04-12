import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const Supplier = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [list, setList] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getSupplier();
    setList(res.data || []);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name) return alert("Enter name");
    await addSupplier(form);
    setForm({ name: "", phone: "", email: "", address: "" });
    load();
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setForm(item);
  };

  const handleUpdate = async () => {
    await updateSupplier(editId, form);
    setEditId(null);
    setForm({ name: "", phone: "", email: "", address: "" });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete supplier?")) return;
    await deleteSupplier(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

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
              Supplier Management
            </h2>

            <p className="text-gray-500 text-sm">
              Manage all suppliers and agencies
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4">
            {editId ? "Update Supplier" : "Add New Supplier"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Supplier Name"
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border px-4 py-2 rounded-lg"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border px-4 py-2 rounded-lg"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={editId ? handleUpdate : handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {editId ? "Update Supplier" : "+ Add Supplier"}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", phone: "", email: "", address: "" });
                }}
                className="bg-gray-300 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-6 py-4 border-b flex justify-between">
            <h3 className="font-semibold text-gray-700">
              Supplier List ({list.length})
            </h3>
          </div>

          {list.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No suppliers found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.map((s, index) => (
                  <tr
                    key={s.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{index + 1}</td>

                    <td className="px-6 py-3 font-medium text-gray-700">
                      {s.name}
                    </td>

                    <td className="px-6 py-3">{s.phone}</td>

                    <td className="px-6 py-3">{s.email}</td>

                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => handleEdit(s)}
                          className="text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 hover:bg-red-100 px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </div>
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

export default Supplier;