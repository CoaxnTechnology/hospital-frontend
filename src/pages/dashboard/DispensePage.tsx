import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createSale } from "../../services/medicinesell.service";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DispensePage = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  /* ======================
     FETCH PRESCRIPTION
  ====================== */

  const fetchPrescription = async () => {
    if (!prescriptionId) return alert("Enter prescription ID");

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/prescription/${prescriptionId}`
      );

      setData(res.data.data || []);
    } catch (err) {
      alert("Prescription not found");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     CALCULATE QTY
  ====================== */

  const calculateQty = (dosage: string, duration: number) => {
    if (!dosage) return 0;
    const parts = dosage.split("-");
    const perDay = parts.reduce((a, b) => a + Number(b), 0);
    return perDay * duration;
  };

  /* ======================
     PREPARE ITEMS
  ====================== */

  const items = data.map((item) => {
    const qty = calculateQty(item.dosage, item.duration);

    const price = Number(item.selling_price || 0);
    const gstPercent = Number(item.gst_percentage || 0);

    const total = price * qty;
    const gstAmount = (total * gstPercent) / 100;

    return {
      ...item,
      qty,
      price,
      gstPercent,
      gstAmount,
      final: total + gstAmount,
    };
  });

  const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
  const totalGst = items.reduce((a, b) => a + b.gstAmount, 0);
  const total = subtotal + totalGst - discount;

  /* ======================
     GENERATE BILL
  ====================== */

  const generateBill = async () => {
    try {
      await createSale({
        prescription_no:  Number(prescriptionId),
        discount,
      });

      alert("Bill Generated Successfully");
      setData([]);
      setPrescriptionId("");
    } catch (err: any) {
      alert(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold">💊 Prescription Billing</h1>
            <p className="text-gray-500">
              Generate bill automatically from prescription
            </p>
          </div>

          {/* INPUT */}
          <div className="bg-white p-6 rounded-2xl shadow flex gap-4">
            <input
              placeholder="Enter Prescription ID"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3"
            />

            <button
              onClick={fetchPrescription}
              className="bg-blue-600 text-white px-6 rounded-xl"
            >
              Fetch
            </button>
          </div>

          {/* PATIENT + DOCTOR */}
          {data.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Patient</h3>
                <p>{data[0].patient_name}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Doctor</h3>
                <p>{data[0].doctor_name}</p>
              </div>
            </div>
          )}

          {/* TABLE */}
          {data.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Medicine</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Days</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">GST</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-center">{item.dosage}</td>
                      <td className="p-3 text-center">{item.duration}</td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-center">₹{item.price}</td>
                      <td className="p-3 text-center">
                        {item.gstPercent}%
                      </td>
                      <td className="p-3 text-center">
                        ₹{item.final.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SUMMARY */}
          {data.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Total GST</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="border px-2 py-1 w-24 text-right"
                />
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* ACTION */}
          {data.length > 0 && (
            <button
              onClick={generateBill}
              className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg"
            >
              Generate Bill
            </button>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DispensePage;