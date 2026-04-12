import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

type Medicine = {
  id: string;
  name: string;
  buy_price: number;
  sell_price: number;
  quantity: number;
  expiry_date: string;
};

const PurchasePage = () => {
  // 🔥 Static Medicine Data (inside page)
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      buy_price: 5,
      sell_price: 8,
      quantity: 10,
      expiry_date: "2026-01-10",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      buy_price: 10,
      sell_price: 15,
      quantity: 25,
      expiry_date: "2025-02-01",
    },
    {
      id: "3",
      name: "Cetirizine 10mg",
      buy_price: 3,
      sell_price: 6,
      quantity: 50,
      expiry_date: "2024-12-15",
    },
  ]);

  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [purchases, setPurchases] = useState<
    { id: number; medicineName: string; quantity: number; date: string }[]
  >([]);

  const handlePurchase = () => {
    if (!medicineId) {
      alert("Please select a medicine");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Enter valid quantity");
      return;
    }

    // 🔥 Increase Stock
    const updatedMedicines = medicines.map((med) =>
      med.id === medicineId
        ? { ...med, quantity: med.quantity + quantity }
        : med
    );

    setMedicines(updatedMedicines);

    const selectedMedicine = medicines.find((m) => m.id === medicineId);

    const newPurchase = {
      id: Date.now(),
      medicineName: selectedMedicine?.name || "",
      quantity,
      date: new Date().toLocaleString(),
    };

    setPurchases((prev) => [newPurchase, ...prev]);

    setMedicineId("");
    setQuantity(0);

    alert("Stock Updated Successfully");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Purchase Entry
        </h1>

        {/* Purchase Form */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Select Medicine
            </label>
            <select
              value={medicineId}
              onChange={(e) => setMedicineId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Medicine</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Stock: {m.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Quantity
            </label>
            <input
              type="number"
              value={quantity || ""}
              placeholder="Enter quantity"
              onChange={(e) => setQuantity(+e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handlePurchase}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Stock
          </button>
        </div>

        {/* Recent Purchases */}
        {purchases.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-medium mb-4">
              Recent Purchases
            </h2>

            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Medicine</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-2">{p.medicineName}</td>
                    <td className="px-4 py-2">{p.quantity}</td>
                    <td className="px-4 py-2">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchasePage;
