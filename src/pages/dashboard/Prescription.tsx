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
      filteredMedicines: [],
      filteredDosage: [],
    },
  ]);

  const dosageOptions = ["1-0-1", "1-1-1", "0-1-0", "1-0-0", "0-0-1"];
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      const payload = {
        appointment_id: Number(id),
        doctor_id: patient?.doctor_id,
        patient_id: patient?.patient_id,
        notes: "Take medicines as prescribed",
        medicines: rows,
      };

      console.log("📤 PRESCRIPTION PAYLOAD:", payload);
      console.log(
        "📁 CHECKING FOR FILE PATHS IN PAYLOAD:",
        JSON.stringify(payload).includes("file") ||
          JSON.stringify(payload).includes("path"),
      );

      const res = await createPrescription(payload);

      console.log("📥 PRESCRIPTION RESPONSE:", res);
      console.log(
        "📁 CHECKING FOR FILE PATHS IN RESPONSE:",
        JSON.stringify(res).includes("file") ||
          JSON.stringify(res).includes("path"),
      );

      if (res.success) {
        navigate("/consultant", {
          state: { prescriptionId: res.prescriptionId },
        });
      } else {
        alert("Failed to save prescription");
      }
    } catch (error) {
      console.error("❌ Error saving prescription:", error);
      alert("Error saving prescription");
    }
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    console.log("🖨️ Starting print prescription...");
    console.log("Hospital data:", hospital);
    if (!hospital) {
      console.error("❌ Hospital not loaded!");
      alert("Hospital not loaded");
      return;
    }

    console.log("🏥 Hospital loaded:", hospital.name);
    console.log("👤 Patient data:", {
      id: patient?.patient_id,
      name: patient?.patient_name,
    });
    console.log("👨‍⚕️ Doctor data:", {
      name: patient?.doctor_name,
      department: patient?.department,
    });
    console.log("💊 Medicines:", rows);

    const html = generatePrescriptionHTML({
      hospital,
      patient: {
        id: patient?.patient_id,
        name: patient?.patient_name,
        age: patient?.age,
        mobile: patient?.mobile,
      },
      doctor: {
        name: patient?.doctor_name,
        department: patient?.department,
        signature: patient?.signature, // optional
      },
      medicines: rows,
      date: new Date().toLocaleDateString(),
    });

    console.log("✅ HTML generated:", html.substring(0, 200) + "...");
    console.log(
      "📁 CHECKING FOR FILE PATHS IN HTML:",
      html.includes("file") || html.includes("path") || html.includes(BASE_URL),
    );

    console.log("🪟 Opening new window for printing...");
    const win = window.open("", "_blank");
    console.log("✅ Window opened:", win);

    console.log("📝 Writing HTML to window...");
    win.document.write(html);
    console.log("✅ HTML written");

    console.log("🔒 Closing document...");
    win.document.close();
    console.log("✅ Document closed");

    console.log("⏱️ Setting timeout for print (300ms)...");
    setTimeout(() => {
      console.log("🖨️ Printing prescription now...");
      win.print();
      console.log("✅ Print dialog opened");
    }, 300);
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
                {console.log(
                  "📁 LOGO SRC:",
                  hospital?.logo ? `${BASE_URL}${hospital.logo}` : logo,
                )}

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
                <strong>Prescription ID:</strong> #{prescriptionId || "New"}
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
                <tr key={row.id}>
                  <td className="border px-3 py-2 text-center">{i + 1}</td>

                  {/* ✅ ONLY CHANGE HERE */}
                  <td className="border px-3 py-2 relative">
                    <input
                      value={row.name}
                      onChange={(e) => handleSearch(e.target.value, i)}
                      className="w-full outline-none"
                      placeholder="Medicine name"
                    />

                    {activeIndex === i && row.filteredMedicines.length > 0 && (
                      <div className="absolute bg-white border w-full z-10 max-h-40 overflow-auto">
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

                    {activeDosageIndex === i &&
                      row.filteredDosage.length > 0 && (
                        <div className="absolute left-0 top-full mt-1 bg-white border w-full z-50 max-h-40 overflow-auto rounded shadow">
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
