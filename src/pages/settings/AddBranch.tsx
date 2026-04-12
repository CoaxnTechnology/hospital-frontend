import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBranch } from "../../services/branch.service";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const AddBranch = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    area: "",   // ✅ NEW FIELD
    address: "",
    city: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createBranch(form);
    navigate("/settings/branch");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">

        <h2 className="text-xl font-semibold mb-4">Add Branch</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 🔥 NAME */}
          <input
            placeholder="Branch Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* 🔥 CITY */}
          <input
            placeholder="City (e.g. Ahmedabad)"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          {/* 🔥 AREA (NEW) */}
          <input
            placeholder="Area (e.g. Gurukul)"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />

          {/* 🔥 ADDRESS */}
          <textarea
            placeholder="Full Address (for Google Map)"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          {/* 🔥 BUTTON */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBranch;