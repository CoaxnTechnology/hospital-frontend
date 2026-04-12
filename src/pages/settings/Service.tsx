import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getServices,
  deleteService,
} from "../../services/service.service";
import { useNavigate } from "react-router-dom";

const ServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await getServices();
    setServices(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete service?")) return;
    await deleteService(id);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Service Section</h2>

          <button
            onClick={() => navigate("/settings/service/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Service
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.description}</td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/settings/service/edit/${item.id}`)
                      }
                    >
                      ✏️
                    </button>

                    <button onClick={() => handleDelete(item.id)}>
                      🗑️
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

export default ServicePage;