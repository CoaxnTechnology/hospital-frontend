const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import patientImg from "../../assets/doctors/doctor_2.png";

import {
  getPatientById,
  getPatientHistory,
} from "../../services/patient.service";

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await getPatientById(Number(id));
        const historyData = await getPatientHistory(Number(id));
        console.log("Patient Data:", patientData);
        console.log("History Data:", historyData);
        setPatient(patientData);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/patients")}
            className="w-9 h-9 rounded-full bg-white border shadow"
          >
            <i className="fa fa-arrow-left"></i>
          </button>

          <img
            src={patientImg}
            className="w-16 h-16 rounded-full border shadow"
          />

          <div>
            <h2 className="text-2xl font-semibold">{patient?.name}</h2>
            <p className="text-sm text-gray-500">Patient ID: #{patient?.id}</p>
          </div>
        </div>

        {/* Visit Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Appointment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Prescription</th>
              </tr>
            </thead>

            <tbody>
              {visits.map((v) => (
                <tr key={v.appointment_id} className="border-b">
                  <td className="px-4 py-3">#{v.appointment_id}</td>

                  <td className="px-4 py-3">{v.appointment_date}</td>

                  <td className="px-4 py-3">{v.doctor_name}</td>

                  <td className="px-4 py-3">{v.department}</td>

                  <td className="px-4 py-3">{v.status}</td>

                  <td className="px-4 py-3 text-right">
                    {v.pdf_path ? (
                      <a
                        href={`${BASE_URL}${v.pdf_path}`}
                        target="_blank"
                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Not Available
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {visits.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    No visit history found
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

export default PatientHistory;
