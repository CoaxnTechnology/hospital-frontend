import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { getMedicines, deleteMedicine } from "../../services/medicine.Service";

/* ================= TYPES ================= */
type Medicine = {
  id: number;
  name: string;
  category: string;
  expiry_date: string;
  selling_price: number;
  quantity: number;
};
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const MedicineStore = () => {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MEDICINES ================= */
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);

      const data = await getMedicines();

      setMedicines(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this medicine?",
      );

      if (!confirmDelete) return;

      await deleteMedicine(id);

      setMedicines((prev) => prev.filter((m) => m.id !== id));

      alert("Medicine deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete medicine");
    }
  };

  /* ================= FILTER ================= */
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) =>
      med.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, medicines]);

  /* ================= DASHBOARD STATS ================= */
  const totalMedicines = medicines.length;

  const lowStock = medicines.filter((m) => m.quantity <= 10).length;

  const expiringSoon = medicines.filter((m) => {
    const diff =
      (new Date(m.expiry_date).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24);
    return diff <= 30;
  }).length;

  const stockValue = medicines.reduce(
    (acc, med) => acc + Number(med.selling_price) * med.quantity,
    0,
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Pharmacy</h1>
            <p className="text-gray-500">Manage medicines inventory</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/store/return"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              ↩ Return Medicine
            </Link>

            <Link
              to="/store/sales"
              className="border border-blue-500 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              📦 Dispensing
            </Link>

            <Link
              to="/store/add_med"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Medicine
            </Link>

            {/* 🔥 ADD THIS BUTTON */}
            <a
              href={`${import.meta.env.VITE_BASE_URL}/public/sample/medicine_upload_template.csv`}
              download
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              ⬇ Sample CSV
            </a>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border px-4 py-2 rounded-xl"
          />
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Medicines</p>
            <h2 className="text-3xl font-bold">{totalMedicines}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <h2 className="text-3xl font-bold text-orange-500">{lowStock}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Expiring Soon</p>
            <h2 className="text-3xl font-bold text-red-500">{expiringSoon}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Stock Value</p>
            <h2 className="text-3xl font-bold text-green-600">
              ₹ {stockValue.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">MEDICINE</th>
                <th className="px-6 py-4 text-left">CATEGORY</th>
                <th className="px-6 py-4 text-left">STOCK</th>
                <th className="px-6 py-4 text-left">PRICE</th>
                <th className="px-6 py-4 text-left">EXPIRY</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="h-8 bg-gray-300 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => (
                  <tr key={med.id} className="border-t hover:bg-gray-50">
                    {/* MEDICINE */}
                    <td className="px-6 py-4">
                      <div className="font-semibold">{med.name}</div>
                      <div className="text-xs text-gray-400">
                        MED-{String(med.id).padStart(5, "0")}
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded text-xs">
                        {med.category}
                      </span>
                    </td>

                    {/* STOCK */}
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs">
                        {med.quantity} Pcs
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4">
                      ₹ {Number(med.selling_price).toFixed(2)}
                    </td>

                    {/* EXPIRY */}
                    <td className="px-6 py-4 text-red-500">
                      {formatDate(med.expiry_date)}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/store/edit_med/${med.id}`}>
                          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                            ✏
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(med.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No medicines found
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

export default MedicineStore;
