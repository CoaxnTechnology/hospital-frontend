import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateBranch, getBranches } from "../../services/branch.service";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const EditBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    name: "",
    area: "",
    address: "",
    city: "",
    phone: "", // 🔥 NEW
  });

  useEffect(() => {
    const load = async () => {
      const data = await getBranches();
      const branch = data.find((b: any) => b.id == id);

      if (branch) {
        setForm({
          name: branch.name || "",
          city: branch.city || "",
          area: branch.area || "",
          address: branch.address || "",
          phone: branch.phone || "", // 🔥 SET PHONE
        });
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateBranch(Number(id), form);
    navigate("/settings/branch");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">

        <h2 className="text-xl font-semibold mb-4">Edit Branch</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            value={form.name}
            placeholder="Branch Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* CITY */}
          <input
            value={form.city}
            placeholder="City"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          {/* AREA */}
          <input
            value={form.area}
            placeholder="Area"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />

          {/* 🔥 PHONE (NEW) */}
          <input
            value={form.phone}
            placeholder="Mobile Number"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* ADDRESS */}
          <textarea
            value={form.address}
            placeholder="Full Address"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          {/* BUTTON */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditBranch;