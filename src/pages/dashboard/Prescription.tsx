const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createPrescription } from "../../services/prescription.service";
import { getMedicines } from "../../services/medicine.Service";
import logo from "../../assets/icons/logo.png";
import { getHospital } from "../../services/setting.service";

type MedicineRow = {
  name: string;
  dosage: string;
  duration: string;
};

const Prescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<any>(null);

  const [rows, setRows] = useState<MedicineRow[]>([
    { name: "", dosage: "", duration: "" },
  ]);
  const dosageOptions = ["1-0-1", "1-1-1", "0-1-0", "1-0-0"];
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]);

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filteredDosage, setFilteredDosage] = useState<string[]>([]);
  /* ================= FETCH MEDICINES ================= */
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const res = await getMedicines();
      console.log("📥 MEDICINES:", res);
      setAllMedicines(res.data || []);
    } catch (err) {
      console.error("❌ Medicine fetch error:", err);
    }
  };

  /* ================= FETCH APPOINTMENT ================= */
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("🟢 APPOINTMENT RESPONSE:", data);

        setPatient(data.data);
      } catch (error) {
        console.error("❌ Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  /* ================= FETCH HOSPITAL ================= */
  useEffect(() => {
    fetchHospital();
  }, []);

  const fetchHospital = async () => {
    try {
      const res = await getHospital();

      console.log("🟢 RAW HOSPITAL API RESPONSE:", res);

      const data = res?.data;

      console.log("🟢 FINAL HOSPITAL DATA:", data);

      setHospital(data);
    } catch (err) {
      console.error("❌ Hospital fetch error:", err);
    }
  };

  /* ================= DEBUG STATE ================= */
  useEffect(() => {
    console.log("🔥 HOSPITAL STATE UPDATED:", hospital);
  }, [hospital]);

  /* ================= SEARCH MEDICINE ================= */
  const handleSearch = (value: string, index: number) => {
    updateRow(index, "name", value);

    if (!value) {
      setFilteredMedicines([]);
      return;
    }

    const filtered = allMedicines.filter((m: any) =>
      m.name.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredMedicines(filtered);
  };

  /* ================= ADD ROW ================= */
  const addRow = () => {
    setRows([...rows, { name: "", dosage: "", duration: "" }]);
  };
  const handleDosageSearch = (value: string, index: number) => {
    updateRow(index, "dosage", value);

    if (!value) return setFilteredDosage([]);

    const filtered = dosageOptions.filter((d) =>
      d.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredDosage(filtered);
  };

  /* ================= UPDATE ROW ================= */
  const updateRow = (
    index: number,
    field: keyof MedicineRow,
    value: string,
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= SAVE PRESCRIPTION ================= */
  const savePrescription = async () => {
    try {
      const payload = {
        appointment_id: Number(id),
        doctor_id: patient?.doctor_id,
        patient_id: patient?.patient_id,
        notes: "Take medicines as prescribed",
        medicines: rows,
      };

      console.log("📤 PRESCRIPTION PAYLOAD:", payload);

      const res = await createPrescription(payload);

      console.log("📥 PRESCRIPTION RESPONSE:", res);

      if (res.success) {
        navigate("/consultant");
      } else {
        alert("Failed to save prescription");
      }
    } catch (error) {
      console.error("❌ Error saving prescription:", error);
      alert("Error saving prescription");
    }
  };

  /* ================= PRINT ================= */
  const printPrescription = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Prescription</h2>

          <div className="flex gap-3">
            <button
              onClick={savePrescription}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* PRESCRIPTION TEMPLATE */}
        <div id="print-area" className="bg-white rounded-xl shadow p-8">
          {/* HOSPITAL HEADER */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4">
                <img
                  src={hospital?.logo ? `${BASE_URL}${hospital.logo}` : logo}
                  className="h-24 w-24 object-contain"
                  alt="logo"
                />

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {hospital?.name || "Hospital Name"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {hospital?.address || "Hospital Address"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-right">
              <p>
                <strong>Prescription ID:</strong> #{id}
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* PATIENT INFO */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <p>
              <strong>Patient Name:</strong> {patient?.patient_name}
            </p>

            <p>
              <strong>Patient ID:</strong> {patient?.patient_id}
            </p>

            <p>
              <strong>Doctor:</strong> {patient?.doctor_name}
            </p>

            <p>
              <strong>Department:</strong> {patient?.department}
            </p>

            <p>
              <strong>Appointment ID:</strong> {id}
            </p>
          </div>

          {/* MEDICINE TABLE */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Medicine</th>
                <th className="border px-3 py-2">Dosage</th>
                <th className="border px-3 py-2">Duration</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2 text-center">{i + 1}</td>

                  {/* ✅ ONLY CHANGE HERE */}
                  <td className="border px-3 py-2 relative">
                    <input
                      value={row.name}
                      onChange={(e) => handleSearch(e.target.value, i)}
                      className="w-full outline-none"
                      placeholder="Medicine name"
                    />

                    {filteredMedicines.length > 0 && (
                      <div className="absolute bg-white border w-full z-10 max-h-40 overflow-auto">
                        {filteredMedicines.map((m: any) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              updateRow(i, "name", m.name);
                              setFilteredMedicines([]);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="border px-3 py-2 relative">
                    <input
                      value={row.dosage}
                      onChange={(e) => handleDosageSearch(e.target.value, i)}
                      className="w-full outline-none"
                      placeholder="1-0-1"
                    />

                    {filteredDosage.length > 0 && (
                      <div className="absolute left-0 top-full mt-1 bg-white border w-full z-50 max-h-40 overflow-auto rounded shadow">
                        {filteredDosage.map((d, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              updateRow(i, "dosage", d);
                              setFilteredDosage([]);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      value={row.duration}
                      onChange={(e) => updateRow(i, "duration", e.target.value)}
                      className="w-full outline-none"
                      placeholder="5 days"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="mt-4 px-4 py-1.5 text-sm rounded-lg border hover:bg-gray-100"
          >
            + Add Medicine
          </button>

          {/* FOOTER */}
          <div className="mt-10 flex justify-between text-sm">
            <div className="text-right text-gray-500">
              This is a system generated prescription
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Prescription;
