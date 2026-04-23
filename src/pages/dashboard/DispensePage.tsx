import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createSale } from "../../services/medicinesell.service";
import { generateBillHTML } from "../../generateBillHTML";
import { useHospital } from "../../context/HospitalContext";
import axios from "axios";
import {
  Search,
  Pill,
  User,
  Stethoscope,
  Calculator,
  Receipt,
  Loader2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DispensePage = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editedQty, setEditedQty] = useState<{ [key: number]: number }>({});
  /* ======================
     FETCH PRESCRIPTION
  ====================== */
  const { hospital, loading: hospitalLoading } = useHospital();
  console.log("Hospital from context:", hospital, "Loading:", hospitalLoading);
  const fetchPrescription = async () => {
    if (!prescriptionId) return alert("Enter prescription ID");

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/prescription/${prescriptionId}`,
      );

      console.log("API DATA:", res.data);

      setData(res.data.data || []);
    } catch (err: any) {
      console.log(err);
      alert("Prescription not found");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     FIXED QTY CALCULATION
  ====================== */

  const calculateQty = (dosage: string, duration: any) => {
    if (!dosage || !duration) return 0;

    const parts = dosage.split("-");
    const perDay = parts.reduce((a, b) => a + Number(b), 0);

    // 🔥 extract number from "10 days"
    const days = Number(String(duration).replace(/\D/g, ""));

    return perDay * days;
  };

  /* ======================
     PREPARE ITEMS
  ====================== */

  const items = data.map((item, index) => {
    const defaultQty = calculateQty(item.dosage, item.duration);
    const qty = editedQty[index] ?? defaultQty;
    const stock = Number(item.stock || 0); // ✅ add this
    const price = Number(item.selling_price || 0);
    const gstPercent = Number(item.gst_percentage || 0);

    const total = price * qty;
    const gstAmount = (total * gstPercent) / 100;

    return {
      ...item,
      qty,
      stock,
      medicine_id: item.medicine_id || item.id,
      price,
      gstPercent,
      gstAmount,
      final: total + gstAmount,
    };
  });
  console.log("ITEM:", items);

  const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
  const totalGst = items.reduce((a, b) => a + b.gstAmount, 0);
  const total = subtotal + totalGst - discount;

  /* ======================
     GENERATE BILL
  ====================== */
  if (!hospital) {
    alert("Hospital data not loaded");
    return;
  }
  const generateBill = async () => {
    console.log("Starting generateBill");
    setGenerating(true);
    console.log("Set generating to true");

    try {
      console.log("Entering try block");
      if (items.some((item) => item.qty === 0)) {
        console.log("Some item has qty 0");
        setGenerating(false);
        console.log("Set generating to false");
        return alert("Quantity cannot be 0");
      }

      // 🔥 1. SAVE SALE
      console.log("Saving sale");
      const res = await createSale({
        prescription_no: Number(prescriptionId),
        discount,
        items: items.map((item) => ({
          medicine_id: item.medicine_id,
          name: item.medicine_name, // ✅ ADD THIS
          qty: item.qty,
          price: item.price,
          gst: item.gstPercent,
        })),
      });
      console.log("Sale saved, res:", res);

      const invoice = res.invoice_number;
      console.log("Invoice number:", invoice);

      // 🔥 2. PREPARE BILL DATA
      console.log("Preparing bill data");
      const billData = {
        hospital: {
          name: hospital.name,
          address: hospital.address,
          logo: hospital.logo,
        },
        patient: {
          name: data[0]?.patient_name,
          mobile: data[0]?.mobile,
        },
        doctor: {
          name: data[0]?.doctor_name,
        },
        items: items.map((i) => ({
          name: i.medicine_name,
          qty: i.qty,
          price: i.price,
          gst: i.gstPercent,
          total: i.final,
        })),
        summary: {
          subtotal,
          gst: totalGst,
          total,
        },
        invoice,
      };
      console.log("Bill data prepared:", billData);

      // 🔥 3. OPEN PRINT WINDOW
      console.log("Opening print window");
      const printWindow = window.open("", "_blank");
      console.log("Print window opened");

      printWindow.document.write(generateBillHTML(billData));
      console.log("Wrote to print window");
      printWindow.document.close();
      console.log("Closed print window document");

      // 🔥 4. PRINT
      console.log("Printing");
      printWindow.print();
      console.log("Print called");

      // 🔥 5. AUTO CLOSE
      console.log("Setting onafterprint");
      printWindow.onafterprint = () => printWindow.close();
      console.log("Set onafterprint");

      alert("Bill Generated & Printed Successfully");
      console.log("Alert shown");

      // 🔥 RESET
      console.log("Resetting data");
      setData([]);
      setPrescriptionId("");
      setDiscount(0);
      setEditedQty({});
      console.log("Data reset");
    } catch (err: any) {
      console.log("Error in generateBill:", err);
      console.error(err);
      alert("Error generating bill");
    } finally {
      console.log("Finally block");
      setGenerating(false);
      console.log("Set generating to false");
    }
  };
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Prescription Billing
              </h1>
              <p className="text-gray-600">
                Manage and dispense medications for prescriptions
              </p>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Enter Prescription ID"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && fetchPrescription()}
                />
              </div>
              <button
                type="button"
                onClick={fetchPrescription}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Fetch
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PATIENT DETAILS */}
          {data.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Patient Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {data[0].patient_name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Mobile:</span>{" "}
                    {data[0].mobile}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Age:</span> {data[0].age}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">ID:</span>{" "}
                    {data[0].patient_id}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Doctor Information
                  </h3>
                </div>
                <p className="text-gray-700">{data[0].doctor_name}</p>
              </div>
            </div>
          )}

          {/* MEDICINES TABLE */}
          {data.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Prescribed Medicines
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.medicine_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.dosage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {String(item.duration).replace(/\D/g, "")} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            value={item.qty}
                            min={0}
                            onChange={(e) => {
                              const value = Number(e.target.value);

                              if (value > item.stock) {
                                alert(
                                  "Out of stock! Max available: " + item.stock,
                                );
                                return;
                              }

                              setEditedQty({
                                ...editedQty,
                                [i]: Math.max(0, value),
                              });
                            }}
                            className="w-20 border px-2 py-1 rounded text-center"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.gstPercent}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{item.final.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BILLING SUMMARY */}
          {data.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Billing Summary
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-medium">₹{totalGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount:</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GENERATE BILL BUTTON */}
          {data.length > 0 && (
            <button
              onClick={generateBill}
              disabled={generating}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {generating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Bill...
                </>
              ) : (
                <>
                  <Receipt className="w-6 h-6" />
                  Generate Bill
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DispensePage;
