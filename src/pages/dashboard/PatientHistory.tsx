const BASE_URL = import.meta.env.VITE_BASE_URL
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import patientImg from "../../assets/doctors/doctor_2.png";
import { useHospital } from "../../context/HospitalContext";
import {
  getPatientById,
  getPatientHistory,
} from "../../services/patient.service";
import { generateBillHTML } from "../../generateBillHTML";

// Skeleton Loading Component
const SkeletonRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 p-4 md:p-6 border-b animate-pulse">
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hospital, loading: hospitalLoading } = useHospital();
  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientById(Number(id));
        const historyData = await getPatientHistory(Number(id));
        console.log("Patient Data:", patientData);
        console.log("History Data:", historyData);
        setPatient(patientData.data);

        setVisits(historyData.data || historyData.visits || []);
      } catch (error) {
        console.error(error);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrintInvoice = async (invoice: string) => {
    console.log("Starting handlePrintInvoice with invoice:", invoice);
    try {
      console.log(
        "Fetching invoice data from:",
        `${BASE_URL}/api/sales/invoice/${invoice}`,
      );
      const res = await fetch(`${BASE_URL}/api/sales/invoice/${invoice}`);
      console.log("Fetch response:", res);

      const data = await res.json();
      console.log("Parsed data:", data);

      const items = data.data.items;
      console.log("Items:", items);
      const subtotal = items.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.qty),
        0,
      );
      console.log("Calculated subtotal:", subtotal);

      const gst = items.reduce(
        (sum, i) => sum + (i.price * i.qty * i.gst) / 100,
        0,
      );
      console.log("Calculated GST:", gst);

      const total = subtotal + gst;
      console.log("Calculated total:", total);

      if (!items || items.length === 0) {
        console.log("No items found, alerting user");
        alert("No items found");
        return;
      }

      console.log("Generating bill HTML with data:", {
        hospital: {
          name: "Your Hospital",
          address: "Ahmedabad",
        },
        patient: {
          name: patient.name,
          age: patient.age,
          mobile: patient.mobile,
        },
        doctor: {
          name: "Doctor",
        },
        items,
        invoice,
        date: new Date().toLocaleDateString(),
        summary: {
          subtotal,
          gst,
          total,
        },
      });
      const html = generateBillHTML({
        hospital: {
          name: hospital.name,
          address: hospital.address,
          logo: hospital.logo,
          phone: hospital.phone,
          email: hospital.email,
        },
        patient: {
          name: patient.name,
          age: patient.age,
          mobile: patient.mobile,
        },
        doctor: {
          name: "Doctor",
        },
        items,
        invoice,
        date: new Date().toLocaleDateString(),
        summary: {
          subtotal,
          gst,
          total,
        },
      });
      console.log("Generated HTML:", html);

      console.log("Opening new window for printing");
      const win = window.open("", "", "width=900,height=700");
      console.log("Window opened:", win);

      console.log("Writing HTML to window document");
      win.document.write(html);

      console.log("Closing document");
      win.document.close();

      console.log("Setting timeout to print");
      setTimeout(() => {
        console.log("Printing the bill");
        win.print();
      }, 500);
    } catch (err) {
      console.error("Error in handlePrintInvoice:", err);
    }
  };
  useEffect(() => {
    const fetchBills = async () => {
      const res = await fetch(`${BASE_URL}/api/sales/patient/${id}`);
      const data = await res.json();
      setBills(data.data || []);
    };

    fetchBills();
  }, [id]);
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate("/patients")}
            className="w-9 h-9 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-50 transition flex items-center justify-center"
          >
            <i className="fa fa-arrow-left text-gray-600"></i>
          </button>

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              {patient?.name}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Patient ID: <span className="font-semibold">#{patient?.id}</span>
            </p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Appointment
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Doctor
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Department
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Prescription
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-0">
                      <SkeletonLoader />
                    </td>
                  </tr>
                ) : visits.length > 0 ? (
                  visits.map((v, idx) => {
                    // ✅ visit ke liye bill find karo
                    const bill = bills.find(
                      (b) => b.appointment_id === v.appointment_id,
                    );

                    return (
                      <tr
                        key={v.appointment_id}
                        className={`border-b transition hover:bg-blue-50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-blue-600">
                            #{v.appointment_id}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {v.date ? formatDate(v.date) : "-"}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                          {v.doctor_name || "-"}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {v.department}
                        </td>

                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              v.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : v.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {v.status || "-"}
                          </span>
                        </td>

                        {/* 🔥 BILL COLUMN */}
                        <td className="px-4 py-4 text-right flex justify-end gap-2">
                          {/* PDF */}
                          {v.pdf_path && (
                            <a
                              href={`${BASE_URL}${v.pdf_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                            >
                              <i className="fa fa-file-pdf"></i>
                            </a>
                          )}

                          {/* BILL */}
                          {bill ? (
                            <button
                              onClick={() =>
                                handlePrintInvoice(bill.invoice_number)
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                              <i className="fa fa-receipt"></i>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Bill
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <i className="fa fa-inbox text-4xl text-gray-300 mb-3"></i>
                        <p className="text-gray-500 font-medium">
                          No visit history found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : visits.length > 0 ? (
            visits.map((v) => (
              <div
                key={v.appointment_id}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Appointment
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      #{v.appointment_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Date
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {v.date ? formatDate(v.date) : "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Doctor
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {v.doctor_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Department
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {v.department}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-sm mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                          v.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : v.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {v.status || "-"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Prescription
                    </p>
                    {v.pdf_path ? (
                      <a
                        href={`${BASE_URL}${v.pdf_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition mt-1"
                      >
                        <i className="fa fa-download mr-1"></i> View
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 mt-1 block">
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
              <div className="flex flex-col items-center justify-center">
                <i className="fa fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 font-medium">
                  No visit history found
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientHistory;
