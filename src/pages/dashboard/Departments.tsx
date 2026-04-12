import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getDepartments,
  deleteDepartment,
  getSection,
  saveSection,
} from "../../services/department.service";

type Department = {
  id: number;
  department_name: string;
  department_desc: string;
};

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  // 🔥 SECTION STATE
  const [showSection, setShowSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");

  // ================= FETCH =================
  const fetchData = async () => {
    const res = await getDepartments();
    setDepartments(res.data || []);
  };

  const fetchSection = async () => {
    const res = await getSection("specialities");

    if (res) {
      setSectionTitle(res.department_name || "");
      setSectionDesc(res.department_desc || "");
    }
  };

  useEffect(() => {
    fetchData();
    fetchSection();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this department?")) return;

    await deleteDepartment(id);
    fetchData();
  };

  // ================= SAVE SECTION =================
  const handleSaveSection = async () => {
    await saveSection("specialities", {
      title: sectionTitle,
      description: sectionDesc,
    });

    alert("Section updated");
    setShowSection(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

          <h2 className="text-2xl font-semibold text-gray-800">
            Departments
          </h2>

          <div className="flex gap-3">

            {/* ADD */}
            <a
              href="/departments/add"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
            >
              + Add Department
            </a>

            {/* SECTION BUTTON */}
            <button
              onClick={() => setShowSection(!showSection)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700"
            >
              ⚙️ Edit Section
            </button>

          </div>
        </div>

        {/* 🔥 SECTION FORM */}
        {showSection && (
          <div className="bg-white p-6 rounded-xl shadow border">

            <h3 className="text-lg font-semibold mb-4">
              Specialities Section
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Section Title (e.g. Our)"
                className="border p-3 rounded-lg"
              />

              <input
                value={sectionDesc}
                onChange={(e) => setSectionDesc(e.target.value)}
                placeholder="Short Description"
                className="border p-3 rounded-lg"
              />

            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveSection}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setShowSection(false)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Department Name</th>
                <th className="px-4 py-3 text-left">Department Description</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id} className="border-b hover:bg-gray-50">

                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 font-medium">
                    {dept.department_name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {dept.department_desc}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">

                      {/* EDIT */}
                      <a
                        href={`/departments/edit/${dept.id}`}
                        className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-blue-50"
                      >
                        ✏️
                      </a>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-red-50"
                      >
                        🗑️
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {departments.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Departments;