import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBranches, deleteBranch } from "../../services/branch.service";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const BranchService = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const data = await getBranches();
    setBranches(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this branch?")) return;
    await deleteBranch(id);
    loadData();
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Branches</h2>

          <button
            onClick={() => navigate("/settings/branch/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            + Add Branch
          </button>
        </div>

        {/* TABLE CONTAINER (RESPONSIVE) */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Phone</th> {/* 🔥 NEW */}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-400">
                    No branches found
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{b.name}</td>

                    <td className="p-3">{b.city}</td>

                    {/* 🔥 PHONE */}
                    <td className="p-3">
                      {b.phone ? (
                        <span className="text-gray-700">{b.phone}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => navigate(`/settings/branch/edit/${b.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default BranchService;