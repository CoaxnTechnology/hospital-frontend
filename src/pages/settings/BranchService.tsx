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

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Branches</h2>
          <button
            onClick={() => navigate("/settings/branch/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Branch
          </button>
        </div>

        <div className="bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.city}</td>

                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => navigate(`/settings/branch/edit/${b.id}`)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default BranchService;