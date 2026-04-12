import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  addService,
  updateService,
  getServices,
} from "../../services/service.service";

import {
  Ambulance,
  Stethoscope,
  HeartPulse,
  Activity,
  Hospital,
  UserPlus,
} from "lucide-react";

// 🔥 ICON MAP
const iconMap: any = {
  Ambulance,
  Stethoscope,
  HeartPulse,
  Activity,
  Hospital,
  UserPlus,
};

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
  });

  // 🔥 EDIT LOAD
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await getServices();
      const item = res.data.find((x: any) => x.id == id);

      if (item) {
        setForm(item);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.icon) {
      alert("All fields are required");
      return;
    }

    if (id) {
      await updateService(Number(id), form);
    } else {
      await addService(form);
    }

    navigate("/settings/service");
  };

  // 🔥 CURRENT ICON PREVIEW
  const SelectedIcon = iconMap[form.icon];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">

        <h2 className="text-xl font-semibold mb-4">
          {id ? "Edit Service" : "Add Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <input
            placeholder="Service Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Service Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* 🔥 ICON SELECT */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Select Icon
            </label>

            <select
              value={form.icon}
              onChange={(e) =>
                setForm({ ...form, icon: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Icon</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Stethoscope">Stethoscope</option>
              <option value="HeartPulse">HeartPulse</option>
              <option value="Activity">Activity</option>
              <option value="Hospital">Hospital</option>
              <option value="UserPlus">UserPlus</option>
            </select>
          </div>

          {/* 🔥 ICON PREVIEW */}
          {SelectedIcon && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                <SelectedIcon size={22} />
              </div>
              <span className="text-sm text-gray-600">
                Preview: {form.icon}
              </span>
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
            {id ? "Update Service" : "Create Service"}
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default ServiceForm;