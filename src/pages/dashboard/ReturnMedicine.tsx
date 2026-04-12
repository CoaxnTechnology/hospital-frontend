import { useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { returnMedicine } from "../../services/medicine.Service";
import { getSaleByInvoice } from "../../services/medicinesell.service";

type Item = {
  medicine_id: number;
  name: string;
  qty: number;
  price: number;
};

const ReturnMedicine = () => {

  const [invoice, setInvoice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [returns, setReturns] = useState<{ [key: number]: number }>({});

  /* NEW STATE FOR REFUND */
  const [refundDetails,setRefundDetails] = useState<any[]>([]);
  const [totalRefund,setTotalRefund] = useState<number>(0);

  /* NEW STATE FOR LIVE PREVIEW */
  const [previewRefund,setPreviewRefund] = useState<number>(0);

  /* ================= SEARCH INVOICE ================= */

  const handleSearch = async () => {
    try {

      const res = await getSaleByInvoice(invoice);

      console.log("Invoice Response:", res);

      if (!res || res.length === 0) {
        alert("Invoice not found");
        return;
      }

      setItems(res);

    } catch (err) {

      console.error(err);

      alert("Invoice not found");

    }
  };

  /* ================= RETURN QTY CHANGE ================= */

  const handleReturnChange = (id: number, value: number) => {

    const updatedReturns = {
      ...returns,
      [id]: value,
    };

    setReturns(updatedReturns);

    /* LIVE REFUND CALCULATION */

    let subtotal = 0;

    items.forEach((item) => {
      const qty = updatedReturns[item.medicine_id] || 0;
      subtotal += qty * Number(item.price);
    });

    const gst = subtotal * 0.05;

    const refund = subtotal + gst;

    setPreviewRefund(refund);

  };

  /* ================= PROCESS RETURN ================= */

  const handleReturn = async () => {

    try {

      const payload = Object.keys(returns).map((id)=>({
        medicine_id:Number(id),
        quantity:returns[Number(id)]
      }));

      console.log("Return Payload:", payload);

      const res = await returnMedicine(payload);

      console.log("Refund Response:", res);

      /* STORE REFUND DATA */
      if(res){
        setRefundDetails(res.refundDetails || []);
        setTotalRefund(res.totalRefund || 0);
      }

      alert("Return processed successfully");

    } catch(err){

      console.error("Return Error:", err);

      alert("Return failed");

    }

  };

  return (

    <DashboardLayout>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* PAGE TITLE */}

        <h1 className="text-3xl font-semibold">
          Return Medicine
        </h1>

        {/* SEARCH INVOICE */}

        <div className="bg-white p-6 rounded-xl shadow flex gap-3">

          <input
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Enter Invoice Number"
            className="flex-1 border px-4 py-2 rounded-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>

        </div>

        {/* ITEMS TABLE */}

        {items.length > 0 && (

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-6 py-3 text-left">
                    Medicine
                  </th>

                  <th className="px-6 py-3 text-left">
                    Sold Qty
                  </th>

                  <th className="px-6 py-3 text-left">
                    Return Qty
                  </th>

                  <th className="px-6 py-3 text-left">
                    Price
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item) => (

                  <tr key={item.medicine_id} className="border-t">

                    <td className="px-6 py-3 font-medium">
                      {item.name}
                    </td>

                    <td className="px-6 py-3">
                      {item.qty}
                    </td>

                    <td className="px-6 py-3">

                      <input
                        type="number"
                        min="0"
                        max={item.qty}
                        className="border px-2 py-1 w-20 rounded"
                        onChange={(e) =>
                          handleReturnChange(
                            item.medicine_id,
                            Number(e.target.value),
                          )
                        }
                      />

                    </td>

                    <td className="px-6 py-3">
                      ₹ {item.price}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* LIVE REFUND PREVIEW */}

        {previewRefund > 0 && (

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

            <h3 className="font-semibold text-lg">
              Refund Preview
            </h3>

            <p>
              Subtotal: ₹ {(previewRefund / 1.05).toFixed(2)}
            </p>

            <p>
              GST (5%): ₹ {(previewRefund - previewRefund / 1.05).toFixed(2)}
            </p>

            <p className="text-green-700 font-bold">
              Customer Refund: ₹ {previewRefund.toFixed(2)}
            </p>

          </div>

        )}

        {/* RETURN BUTTON */}

        {items.length > 0 && (

          <div className="flex justify-end">

            <button
              onClick={handleReturn}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Process Return
            </button>

          </div>

        )}

        {/* REFUND SUMMARY */}

        {refundDetails.length > 0 && (

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Refund Summary
            </h2>

            <table className="min-w-full text-sm">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-6 py-3 text-left">
                    Medicine
                  </th>

                  <th className="px-6 py-3 text-left">
                    Qty
                  </th>

                  <th className="px-6 py-3 text-left">
                    Price
                  </th>

                  <th className="px-6 py-3 text-left">
                    GST
                  </th>

                  <th className="px-6 py-3 text-left">
                    Refund
                  </th>

                </tr>

              </thead>

              <tbody>

                {refundDetails.map((item,index)=>(

                  <tr key={index} className="border-t">

                    <td className="px-6 py-3">
                      {item.name}
                    </td>

                    <td className="px-6 py-3">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-3">
                      ₹ {item.price}
                    </td>

                    <td className="px-6 py-3">
                      ₹ {Number(item.gst).toFixed(2)}
                    </td>

                    <td className="px-6 py-3 text-green-600 font-semibold">
                      ₹ {Number(item.refundAmount).toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="text-right mt-4 text-lg font-bold text-green-700">
              Total Refund: ₹ {Number(totalRefund).toFixed(2)}
            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

export default ReturnMedicine;