import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getDepartment,
  updateDepartment,
} from "../../services/department.service"; // 🔥 IMPORT

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 FETCH DATA FROM API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDepartment(id!);

        if (res.success) {
          setName(res.data.department_name);
          setDescription(res.data.department_desc);
        }
      } catch (error) {
        console.error("❌ FETCH ERROR:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  // 🔥 UPDATE API CALL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await updateDepartment(id!, {
        department_name: name,
        department_desc: description,
      });

      if (res.success) {
        navigate("/departments");
      } else {
        alert("Update failed");
      }

    } catch (error) {
      console.error("❌ UPDATE ERROR:", error);
      alert("Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/departments")}
            className="text-blue-600 hover:text-blue-800"
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Department
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/departments")}
              className="px-5 py-2 rounded-lg border border-gray-300
                         text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 transition shadow"
            >
              Update Department
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditDepartment;