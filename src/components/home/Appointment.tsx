const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import reservationImg from "../../assets/images/reservation.png";
import { getDoctors } from "../../services/doctor.service";

const Appointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    doctor: "",
    department: "",
    date: "",
    time: "",
    problem: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res = await getDoctors();
    console.log("🔥 DOCTORS:", res);
    setDoctors(res.data || []);
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDoctorChange = (doctorId: string) => {
    handleChange("doctor", doctorId);

    const doctor = doctors.find((d) => String(d.id) === doctorId);
    handleChange("department", doctor?.department || "");
  };

  // 🔥 LOAD SLOTS WITH DEBUG
  const loadSlots = async (doctorId: number, date: string) => {
    if (!doctorId || !date) return;

    console.log("📡 CALL API:", doctorId, date);

    setLoadingSlots(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/doctors/${doctorId}/slots?date=${date}`,
      );

      const data = await res.json();

      console.log("🔥 FULL RESPONSE:", data);
      console.log("🔥 SLOT ARRAY:", data.data);

      setSlots(data.data || []);
    } catch (err) {
      console.error("❌ SLOT ERROR", err);
      setSlots([]);
    }

    setLoadingSlots(false);
  };

  useEffect(() => {
    if (form.doctor && form.date) {
      loadSlots(Number(form.doctor), form.date);
    }
  }, [form.doctor, form.date]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_name: form.name,
          phone: form.phone,
          doctor_id: Number(form.doctor),
          department: form.department,
          date: form.date,
          time: form.time,
          problem: form.problem,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error();

      alert("✅ Appointment Booked");

      loadSlots(Number(form.doctor), form.date);
      setForm({ ...form, time: "" });
    } catch (err) {
      alert("❌ Slot already booked");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-100 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Book Appointment</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                placeholder="Name"
                className="input"
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <input
                placeholder="Phone"
                className="input"
                onChange={(e) => handleChange("phone", e.target.value)}
              />

              <select
                className="input"
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input
                placeholder="Age"
                className="input"
                onChange={(e) => handleChange("age", e.target.value)}
              />

              <select
                value={form.doctor || ""}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="input"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr {doc.first_name} {doc.last_name}
                  </option>
                ))}
              </select>

              <input
                value={form.department}
                disabled
                className="input bg-gray-100"
              />

              <input
                type="date"
                className="input"
                onChange={(e) => handleChange("date", e.target.value)}
              />

              {/* 🔥 SLOT UI WITH BOOKED LOGIC */}
              <div className="col-span-2">
                <label>Select Slot</label>

                {loadingSlots ? (
                  <p>Loading...</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {slots.length === 0 && (
                      <p className="text-gray-400">No slots available</p>
                    )}

                    {slots.map((slotObj: any, i) => {
                      console.log("👉 SLOT ITEM:", slotObj);

                      const slot =
                        typeof slotObj === "string" ? slotObj : slotObj.time;

                      const isBooked =
                        typeof slotObj === "object" && slotObj.booked === true;

                      const selected = form.time === slot;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleChange("time", slot)}
                          className={`
                            py-2 rounded-lg border
                            ${selected ? "bg-blue-600 text-white" : ""}
                            ${
                              isBooked
                                ? "bg-red-400 text-white cursor-not-allowed"
                                : "hover:bg-blue-100"
                            }
                          `}
                        >
                          {slot}
                          {isBooked && " (Booked)"}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  🔴 Red = Booked | 🔵 Blue = Selected
                </p>
              </div>

              <textarea
                className="input col-span-2"
                placeholder="Problem"
                onChange={(e) => handleChange("problem", e.target.value)}
              />

              <button className="col-span-2 bg-blue-600 text-white py-3 rounded-xl">
                Book Appointment
              </button>
            </form>
          </div>

          <div>
            <img src={reservationImg} className="w-full" />
          </div>
        </div>
      </div>

      <style>
        {`
          .input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
        `}
      </style>
    </section>
  );
};

export default Appointment;
