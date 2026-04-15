const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import reservationImg from "../../assets/images/reservation.png";
import { getDoctors } from "../../services/doctor.service";
import { useLocation, useNavigate } from "react-router-dom";
const Appointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
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
    try {
      const res = await getDoctors();
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPage(false); // 🔥 stop skeleton
    }
  };
  useEffect(() => {
    if (!location.state || doctors.length === 0) return;

    const { doctorId, department } = location.state as any;

    if (doctorId) {
      setForm((prev) => ({
        ...prev,
        doctor: String(doctorId),
        department: department || "",
      }));

      // 🔥 clear state (important)
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, doctors]);
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const getToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const local = new Date(today.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
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

    // ✅ VALIDATION
    if (
      !form.name ||
      !form.phone ||
      !form.gender ||
      !form.age ||
      !form.doctor ||
      !form.department ||
      !form.date ||
      !form.time
    ) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_name: form.name,
          phone: form.phone,
          age: Number(form.age), // 🔥 ADD
          gender: form.gender, // 🔥 ADD
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

      // 🔥 REFRESH PAGE
      window.location.reload();
    } catch (err) {
      alert("❌ Slot already booked");

      // 🔥 REFRESH PAGE ON ERROR
      window.location.reload();
    }
  };
  // 🔥 ADD THIS ABOVE slots.map (inside component)
  const now = new Date();

  // 🔥 TODAY DATE FORMAT (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split("T")[0];

  // 🔥 CHECK IF SELECTED DATE IS TODAY
  const isToday = form.date === todayDate;
  // 🔥 SKELETON LOADER FOR PAGE
  if (loadingPage) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-100 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center animate-pulse">
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

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
                type="number"
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
                    {doc.first_name} {doc.last_name}
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
                min={getToday()}
                onChange={(e) => handleChange("date", e.target.value)}
              />

              {/* 🔥 SLOT UI WITH SKELETON LOADER */}
              <div className="col-span-2">
                <label>Select Slot</label>

                {loadingSlots ? (
                  <div className="grid grid-cols-3 gap-3 mt-2 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {slots.length === 0 && (
                      <p className="text-gray-400">No slots available</p>
                    )}

                    {slots.map((slotObj: any, i) => {
                      const slot =
                        typeof slotObj === "string" ? slotObj : slotObj.time;

                      const isBooked =
                        typeof slotObj === "object" && slotObj.booked === true;

                      const selected = form.time === slot;

                      // 🔥 CONVERT SLOT TIME
                      const [hour, minute] = slot.split(":");
                      const slotTime = new Date();
                      slotTime.setHours(Number(hour), Number(minute), 0);

                      // 🔥 ONLY DISABLE IF TODAY
                      const isPast = isToday && slotTime < now;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isBooked || isPast}
                          onClick={() => handleChange("time", slot)}
                          className={`
    py-2 rounded-lg border text-sm transition
    ${selected ? "bg-blue-600 text-white" : ""}
    ${
      isBooked
        ? "bg-red-400 text-white cursor-not-allowed"
        : isPast
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "hover:bg-blue-100"
    }
  `}
                        >
                          {slot}
                          {isBooked ? " (Booked)" : isPast ? " (Expired)" : ""}
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
