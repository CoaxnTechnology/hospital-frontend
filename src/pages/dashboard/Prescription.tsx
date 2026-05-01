 const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { createPrescription } from "../../services/prescription.service";
import { getMedicines } from "../../services/medicine.Service";
import logo from "../../assets/icons/logo.png";
import { getHospital } from "../../services/setting.service";
import { generatePrescriptionHTML } from "../../generatePrescriptionHTML";
type MedicineRow = {
  id: number;
  name: string;
  dosage: string;
  duration: string;
  timing?: string; // NEW
  frequency?: string; // NEW
  instruction?: string; // NEW
};

const Prescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<any>(null);
  const [prescriptionId, setPrescriptionId] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>([
    {
      id: Date.now(),
      name: "",
      dosage: "",
      duration: "",
      timing: "", // NEW
      frequency: "", // NEW
      instruction: "", // NEW
      filteredMedicines: [],
      filteredDosage: [],
    },
  ]);

  const dosageOptions = ["1-0-1", "1-1-1", "0-1-0", "1-0-0", "0-0-1"];
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
  const [activeDosageIndex, setActiveDosageIndex] = useState<number | null>(
    null,
  );
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
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        dosage: "",
        duration: "",
        timing: "",
        frequency: "",
        instruction: "",
        filteredMedicines: [],
        filteredDosage: [],
      },
    ]);
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
      console.log("📁 HOSPITAL LOGO PATH:", data?.logo);

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
    setActiveIndex(index);

    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              name: value,
              filteredMedicines: value
                ? allMedicines.filter((m: any) =>
                    m.name.toLowerCase().includes(value.toLowerCase()),
                  )
                : [],
            }
          : row,
      ),
    );
  };
  /* ================= UPDATE ROW ================= */
  const updateRow = (
    index: number,
    field: keyof MedicineRow,
    value: string,
  ) => {
    console.log("✏️ Updating row:", { index, field, value });
    const updated = [...rows];
    updated[index][field] = value;
    console.log("✅ Row updated:", updated[index]);
    setRows(updated);
    console.log("📝 All rows after update:", updated);
  };
  const handleDosageSearch = (value: string, index: number) => {
    setActiveDosageIndex(index);

    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              dosage: value,
              filteredDosage: value
                ? dosageOptions.filter((d) =>
                    d.toLowerCase().includes(value.toLowerCase()),
                  )
                : [],
            }
          : row,
      ),
    );
  };
  /* ================= SAVE PRESCRIPTION ================= */
  const savePrescription = async () => {
    try {
      console.log("🚀 SAVE PRESCRIPTION START");

      // 🔥 CLEAN MEDICINES DATA
      const cleanMedicines = rows
        .filter((r) => r.name && r.dosage)
        .map((r) => ({
          name: r.name,
          dosage: r.dosage,
          duration: r.duration,
          timing: r.timing,
          frequency: r.frequency,
          instruction: r.instruction,
        }));

      console.log("🧹 CLEAN MEDICINES:", cleanMedicines);

      // 🔥 VALIDATION
      if (!diagnosis) {
        console.log("❌ Diagnosis missing");
        return alert("Please enter diagnosis");
      }

      if (cleanMedicines.length === 0) {
        console.log("❌ No medicines added");
        return alert("Please add at least one medicine");
      }

      // 🔥 FINAL PAYLOAD
      const payload = {
        appointment_id: Number(id),
        doctor_id: patient?.doctor_id,
        patient_id: patient?.patient_id,
        diagnosis,
        notes: "Take medicines as prescribed",
        medicines: cleanMedicines,
      };

      console.log("📤 FINAL PAYLOAD:", payload);

      // 🔍 DEBUG CHECK
      console.log(
        "📁 CHECK FILE/PATH:",
        JSON.stringify(payload).includes("file") ||
          JSON.stringify(payload).includes("path"),
      );

      // 🔥 API CALL
      console.log("📡 CALLING createPrescription API...");
      const res = await createPrescription(payload);

      console.log("📥 API RESPONSE:", res);

      // 🔥 RESPONSE CHECK
      if (res.success) {
        console.log("✅ PRESCRIPTION SAVED SUCCESSFULLY");
        console.log("🧾 PRESCRIPTION ID:", res.prescriptionId);

        navigate("/consultant", {
          state: { prescriptionId: res.prescriptionId },
        });
      } else {
        console.log("❌ SAVE FAILED RESPONSE:", res);
        alert("Failed to save prescription");
      }
    } catch (error) {
      console.error("❌ SAVE ERROR:", error);
      alert("Error saving prescription");
    } finally {
      console.log("🏁 SAVE PRESCRIPTION END");
    }
  };

  /* ================= PRINT ================= */

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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Diagnosis
            </label>

            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Viral Fever, Gastritis, Diabetes..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              rows={2}
            />
          </div>
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div
                key={row.id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-3 relative"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">
                    Medicine #{i + 1}
                  </h3>

                  <button
                    onClick={() =>
                      setRows((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* MEDICINE */}
                  <div className="relative">
                    <input
                      value={row.name}
                      onChange={(e) => handleSearch(e.target.value, i)}
                      placeholder="Medicine name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    {activeIndex === i && row.filteredMedicines.length > 0 && (
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-lg shadow-xl z-[9999] max-h-48 overflow-auto">
                        {row.filteredMedicines.map((m: any) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setRows((prev) =>
                                prev.map((r, idx) =>
                                  idx === i
                                    ? {
                                        ...r,
                                        name: m.name,
                                        filteredMedicines: [],
                                      }
                                    : r,
                                ),
                              );
                              setActiveIndex(null);
                            }}
                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DOSAGE */}
                  <div className="relative">
                    <input
                      value={row.dosage}
                      onChange={(e) => handleDosageSearch(e.target.value, i)}
                      placeholder="Dosage (1-0-1)"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    {activeDosageIndex === i &&
                      row.filteredDosage.length > 0 && (
                        <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-lg shadow-xl z-[9999] max-h-48 overflow-auto">
                          {row.filteredDosage.map((d, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setRows((prev) =>
                                  prev.map((r, idx) =>
                                    idx === i
                                      ? { ...r, dosage: d, filteredDosage: [] }
                                      : r,
                                  ),
                                );
                                setActiveDosageIndex(null);
                              }}
                              className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                            >
                              {d}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* DURATION */}
                  <input
                    value={row.duration}
                    onChange={(e) => updateRow(i, "duration", e.target.value)}
                    placeholder="Duration (5 days)"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />

                  {/* TIMING */}
                  <select
                    value={row.timing}
                    onChange={(e) => updateRow(i, "timing", e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="">Timing</option>
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                  </select>

                  {/* FREQUENCY */}
                  <input
                    value={row.frequency}
                    onChange={(e) => updateRow(i, "frequency", e.target.value)}
                    placeholder="Frequency (e.g. 2 days gap)"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />

                  {/* INSTRUCTION */}
                  <input
                    value={row.instruction}
                    onChange={(e) =>
                      updateRow(i, "instruction", e.target.value)
                    }
                    placeholder="Instruction"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none col-span-1 md:col-span-3"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={addRow}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
