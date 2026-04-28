const BASE_URL = import.meta.env.VITE_BASE_URL;

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { generatePrescriptionHTML } from "../../generatePrescriptionHTML";
import { useHospital } from "../../context/HospitalContext";
import {
  getDoctorAppointments,
  completeAppointment,
  nextPatient,
  skipPatient,
  recallPatient,
} from "../../services/appointment.Service";

type Appointment = {
  id: number;
  token_number: number;
  patient_name: string;
  department: string;
  date: string;
  time: string;
  prescription_id?: number;
  status:
    | "Pending"
    | "In Consultation"
    | "Prescription Added"
    | "Completed"
    | "Skipped";
};

const Consultant = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const doctor = JSON.parse(localStorage.getItem("user") || "{}");
  const doctor_id = doctor?.id;
  const { hospital } = useHospital();
  /**
   * LOAD QUEUE
   */
  const loadQueue = async () => {
    try {
      const res = await getDoctorAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Queue load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // const interval = setInterval(loadQueue, 3000);
    // return () => clearInterval(interval);
  }, []);

  /**
   * CALL NEXT PATIENT
   */
  const callNext = async () => {
    console.log("🔥 CALL NEXT PATIENT BUTTON CLICKED");
    console.log("👨‍⚕️ DOCTOR ID:", doctor_id);

    const today = new Date().toISOString().slice(0, 10);
    console.log("📅 TODAY'S DATE:", today);

    const payload = {
      doctor_id,
      date: today,
    };
    console.log("📤 PAYLOAD FOR NEXT PATIENT:", payload);

    try {
      console.log("🚀 CALLING nextPatient API...");
      const res = await nextPatient(payload);
      console.log("📥 NEXT PATIENT API RESPONSE:", res);
      console.log("✅ NEXT PATIENT API SUCCESS");
    } catch (error) {
      console.error("❌ NEXT PATIENT API ERROR:", error);
    }

    console.log("🔄 CALLING loadQueue AFTER NEXT PATIENT");
    loadQueue();
    console.log("✅ loadQueue CALLED");
  };

  /**
   * COMPLETE
   */
  const markCompleted = async (id: number) => {
    try {
      const today = new Date().toISOString().slice(0, 10);

      await completeAppointment({
        id,
        doctor_id,
        date: today,
      });

      loadQueue();
    } catch (err) {
      console.error("Complete error:", err);
    }
  };

  /**
   * SKIP (🔥 FIXED)
   */
  const skip = async (id: number) => {
    try {
      const today = new Date().toISOString().slice(0, 10);

      // 🔥 API CALL
      await skipPatient({
        id,
        doctor_id,
        date: today,
      });

      // 🔥 INSTANT UI UPDATE
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Skipped" } : item,
        ),
      );

      // 🔥 OPTIONAL REFRESH
      loadQueue();
    } catch (err) {
      console.error("Skip Error:", err);
    }
  };

  /**
   * RECALL
   */
  const recall = async (id: number) => {
    try {
      await recallPatient(id);
      loadQueue();
    } catch (err) {
      console.error(err);
    }
  };
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatTime = (time: string) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    let h = parseInt(hour);

    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
  };

  const PageSkeletonLoader = () => (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-8 w-2/3 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-12 w-full sm:w-52 rounded-full bg-gray-200 animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-5/6 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const handlePrintPrescription = async (prescriptionId: number) => {
    try {
      if (!hospital) return alert("Hospital not loaded");

      // 🔥 API call (data fetch)
      const res = await fetch(`${BASE_URL}/api/prescription/${prescriptionId}`);
      const data = await res.json();

      const rows = data.data;

      if (!rows || rows.length === 0) {
        return alert("No prescription data");
      }

      // 🔥 prepare data
      const first = rows[0];

      const html = generatePrescriptionHTML({
        hospital,
        prescriptionId: prescriptionId,
        patient: {
          id: first.patient_id,
          name: first.patient_name,
          age: first.age,
          mobile: first.mobile,
        },
        doctor: {
          name: first.doctor_name,
          department: first.department,
        },
        medicines: rows.map((r: any) => ({
          name: r.medicine_name,
          dosage: r.dosage,
          duration: r.duration,
        })),
        date: new Date().toLocaleDateString(),
      });

      // 🔥 open + print
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();

      setTimeout(() => {
        win.print();
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Print error");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Consultant Panel
            </h2>
            <p className="max-w-2xl text-sm text-gray-500">
              Manage your consultation queue and patient actions in a responsive
              doctor panel.
            </p>
          </div>

          {doctor.role === "doctor" && (
            <button
              onClick={callNext}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Call Next Patient
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <PageSkeletonLoader />
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No consultations available
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Token</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Department</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3 font-semibold text-indigo-600">
                          {a.token_number}
                        </td>

                        <td className="px-4 py-3">{a.patient_name}</td>

                        <td className="px-4 py-3">{a.department}</td>

                        <td className="px-4 py-3">{formatDate(a.date)}</td>

                        <td className="px-4 py-3">{formatTime(a.time)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              a.status === "Pending"
                                ? "bg-gray-100 text-gray-700"
                                : a.status === "In Consultation"
                                  ? "bg-blue-100 text-blue-700"
                                  : a.status === "Prescription Added"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : a.status === "Skipped"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right space-x-2">
                          {a.status === "In Consultation" && (
                            <>
                              <button
                                onClick={() => skip(a.id)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
                              >
                                Skip
                              </button>

                              <a
                                href={`/consultant/prescription/${a.id}`}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
                              >
                                Add Prescription
                              </a>
                            </>
                          )}

                          {a.status === "Prescription Added" && (
                            <>
                              <button
                                onClick={() =>
                                  handlePrintPrescription(a.prescription_id)
                                }
                                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg"
                              >
                                Print
                              </button>

                              <button
                                onClick={() =>
                                  handlePrintPrescription(a.prescription_id)
                                }
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
                              >
                                View
                              </button>

                              <button
                                onClick={() => markCompleted(a.id)}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg"
                              >
                                Complete
                              </button>
                            </>
                          )}

                          {a.status === "Skipped" && (
                            <button
                              onClick={() => recall(a.id)}
                              className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg"
                            >
                              Recall
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 sm:hidden p-4">
                {appointments.map((a) => (
                  <article
                    key={a.id}
                    className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Token #{a.token_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {a.patient_name}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          a.status === "Pending"
                            ? "bg-gray-100 text-gray-700"
                            : a.status === "In Consultation"
                              ? "bg-blue-100 text-blue-700"
                              : a.status === "Prescription Added"
                                ? "bg-yellow-100 text-yellow-700"
                                : a.status === "Skipped"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">
                          Department:
                        </span>{" "}
                        {a.department}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Date:</span>{" "}
                        {formatDate(a.date)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Time:</span>{" "}
                        {a.time}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {a.status === "In Consultation" && (
                        <>
                          <button
                            onClick={() => skip(a.id)}
                            className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white"
                          >
                            Skip
                          </button>
                          <a
                            href={`/consultant/prescription/${a.id}`}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white text-center"
                          >
                            Add Prescription
                          </a>
                        </>
                      )}
                      {a.status === "Prescription Added" && (
                        <>
                          <button
                            onClick={() =>
                              window.open(
                                `${BASE_URL}/api/prescription/${a.prescription_id}/pdf`,
                              )
                            }
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                          >
                            View / Download
                          </button>
                          <button
                            onClick={() => {
                              const url = `${BASE_URL}/api/prescription/${a.prescription_id}/pdf`;
                              const printWindow = window.open(url, "_blank");
                              if (printWindow) {
                                printWindow.onload = () => {
                                  printWindow.focus();
                                  printWindow.print();
                                };
                              }
                            }}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => markCompleted(a.id)}
                            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
                          >
                            Complete
                          </button>
                        </>
                      )}
                      {a.status === "Skipped" && (
                        <button
                          onClick={() => recall(a.id)}
                          className="w-full rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white"
                        >
                          Recall
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Consultant;
