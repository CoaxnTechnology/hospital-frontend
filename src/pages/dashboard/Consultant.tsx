const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
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
    const interval = setInterval(loadQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  /**
   * CALL NEXT PATIENT
   */
  const callNext = async () => {
    const today = new Date().toISOString().slice(0, 10);

    await nextPatient({
      doctor_id,
      date: today,
    });

    loadQueue();
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

      await skipPatient({
        id,
        doctor_id,
        date: today,
      });

      loadQueue();
    } catch (err) {
      console.error(err);
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Consultant Panel
          </h2>

          <button
            onClick={callNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Call Next Patient
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      {a.token_number}
                    </td>

                    <td className="px-4 py-3">{a.patient_name}</td>

                    <td className="px-4 py-3">{a.department}</td>

                    <td className="px-4 py-3">{a.date}</td>

                    <td className="px-4 py-3">{a.time}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
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
                      {/* 🔥 SHOW ONLY ACTIVE PATIENT ACTIONS */}
                      {a.status === "In Consultation" && (
                        <>
                          <button
                            onClick={() => skip(a.id)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                          >
                            Skip
                          </button>

                          <a
                            href={`/consultant/prescription/${a.id}`}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                          >
                            Add Prescription
                          </a>
                        </>
                      )}

                      {a.status === "Prescription Added" && (
                        <>
                          {/* 👁 VIEW / DOWNLOAD */}
                          <button
                            onClick={() =>
                              window.open(
                                `${BASE_URL}/api/prescription/${a.prescription_id}/pdf`,
                              )
                            }
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                          >
                            View / Download
                          </button>

                          {/* 🖨 PRINT */}
                          <button
                            onClick={() =>
                              window.open(
                                `${BASE_URL}/api/prescription/${a.id}/pdf`,
                              )
                            }
                            className="px-3 py-1 text-xs bg-indigo-600 text-white rounded"
                          >
                            Print
                          </button>

                          {/* ✏ EDIT */}
                          <a
                            href={`/consultant/prescription/${a.id}?edit=true`}
                            className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </a>

                          {/* ✅ COMPLETE */}
                          <button
                            onClick={() => markCompleted(a.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                          >
                            Complete
                          </button>
                        </>
                      )}

                      {a.status === "Skipped" && (
                        <button
                          onClick={() => recall(a.id)}
                          className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
                        >
                          Recall
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No consultations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Consultant;
