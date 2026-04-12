import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getMedicines } from "../../services/medicine.Service";
import { createSale } from "../../services/medicinesell.service";
import { getPatientById } from "../../services/patient.service";

const DispensePage = () => {
  const navigate = useNavigate();

  const [medicineList, setMedicineList] = useState<any[]>([]);

  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState<any>(null);

  const [doctorName, setDoctorName] = useState("");

  const [cart, setCart] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const res = await getMedicines();
      setMedicineList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================
     FETCH PATIENT BY ID
  ====================== */

  const fetchPatient = async (id: string) => {
    if (!id) {
      setPatientDetails(null);
      return;
    }

    try {
      const res = await getPatientById(id);

      if (!res.data) {
        alert("Patient not found");
        setPatientDetails(null);
        return;
      }

      setPatientDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ======================
     ADD MEDICINE
  ====================== */

  const addMedicine = (med: any) => {
    const today = new Date();
    const expiry = new Date(med.expiry_date);

    if (expiry < today) {
      alert(`${med.name} is expired`);
      return;
    }

    if (med.quantity <= 0) {
      alert(`${med.name} is out of stock`);
      return;
    }

    const existing = cart.find((c) => c.id === med.id);

    if (existing) {
      if (existing.qty + 1 > med.quantity) {
        alert(`Only ${med.quantity} available`);
        return;
      }

      existing.qty += 1;
      setCart([...cart]);
    } else {
      setCart([
        ...cart,
        {
          id: med.id,
          name: med.name,
          price: Number(med.selling_price),
          qty: 1,
          stock: med.quantity,
        },
      ]);
    }
  };

  /* ======================
     BILL CALCULATION
  ====================== */

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const gst = subtotal * 0.05;
  const total = subtotal + gst - discount;

  /* ======================
     GENERATE BILL
  ====================== */

  const generateBill = async () => {
    if (!patientDetails) {
      alert("Enter valid patient ID");
      return;
    }

    if (cart.length === 0) {
      alert("Add medicines first");
      return;
    }

    try {
      const payload = {
        patient_id: patientId,
        doctor_name: doctorName,
        discount,
        notes,
        items: cart,
      };

      await createSale(payload);

      alert("Bill Generated Successfully");

      setCart([]);
      setNotes("");
      setDiscount(0);
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Bill generation failed";

      alert(message);
    }
  };

  const printBill = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* HEADER */}

          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 mb-3 hover:underline"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold">Dispensing</h1>
            <p className="text-gray-500">Dispense medicines to patients</p>
          </div>

          {/* PATIENT SECTION */}

          <div className="bg-white p-8 rounded-3xl shadow space-y-6">

            <h2 className="text-xl font-semibold">Patient Details</h2>

            <input
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                fetchPatient(e.target.value);
              }}
              className="w-full border rounded-xl px-4 py-3"
            />

            {patientDetails && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-1">

                <p><b>Name:</b> {patientDetails.name}</p>

                <p><b>Phone:</b> {patientDetails.phone}</p>

                <p><b>Age:</b> {patientDetails.age}</p>

                <p><b>Gender:</b> {patientDetails.gender}</p>

              </div>
            )}

            <input
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="border rounded-xl px-4 py-3 w-full"
            />

          </div>

          {/* MEDICINES */}

          <div className="bg-white p-8 rounded-3xl shadow space-y-6">

            <h2 className="text-xl font-semibold">Medicines</h2>

            <select
              onChange={(e) => {
                const med = medicineList.find(
                  (m) => m.id === Number(e.target.value)
                );

                if (med) addMedicine(med);
              }}
              className="w-full border rounded-xl px-4 py-3"
            >

              <option value="">Select Medicine</option>

              {medicineList.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name} - ₹{med.selling_price}
                </option>
              ))}

            </select>

            {cart.length === 0 ? (
              <div className="border-dashed border-2 rounded-xl p-10 text-center text-gray-400">
                No medicines added
              </div>
            ) : (
              <table className="min-w-full text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Medicine</th>
                    <th className="px-4 py-3 text-left">Qty</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id} className="border-b">

                      <td className="px-4 py-3">
                        {item.name}
                      </td>

                      <td className="px-4 py-3">

                        <input
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) => {

                            const updated = [...cart];
                            const newQty = Number(e.target.value);

                            if (newQty > item.stock) {
                              alert(`Only ${item.stock} available`);
                              return;
                            }

                            updated[index].qty = newQty;

                            setCart(updated);

                          }}
                          className="w-16 border rounded px-2 py-1"
                        />

                      </td>

                      <td className="px-4 py-3">
                        ₹{item.price}
                      </td>

                      <td className="px-4 py-3">
                        ₹{item.price * item.qty}
                      </td>

                      <td>

                        <button
                          onClick={() =>
                            setCart(cart.filter((c) => c.id !== item.id))
                          }
                          className="text-red-500"
                        >
                          🗑
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

          {/* SUMMARY */}

          <div className="bg-white p-6 rounded-3xl shadow space-y-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>

            <div className="flex justify-between">

              <span>Discount</span>

              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20 text-right"
              />

            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex gap-4">

            <button
              onClick={generateBill}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl"
            >
              Generate Bill
            </button>

            <button
              onClick={printBill}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl"
            >
              Print Bill
            </button>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DispensePage;