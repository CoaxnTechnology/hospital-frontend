const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
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
      setLoadingPage(false);
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

  const loadSlots = async (doctorId: number, date: string) => {
    if (!doctorId || !date) return;

    setLoadingSlots(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/doctors/${doctorId}/slots?date=${date}`,
      );

      const data = await res.json();
      setSlots(data.data || []);
    } catch (err) {
      console.error(err);
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
          age: Number(form.age),
          gender: form.gender,
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
      window.location.reload();
    } catch (err) {
      alert("❌ Slot already booked");
      window.location.reload();
    }
  };

  const now = new Date();
  const todayDate = new Date().toISOString().split("T")[0];
  const isToday = form.date === todayDate;

  if (loadingPage) {
    return (
      <div className="w-full animate-pulse">
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-h-[75vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Book Appointment
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
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
              value={form.doctor}
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

            <div>
              <label className="text-sm font-medium">Select Slot</label>

              {loadingSlots ? (
                <div className="grid grid-cols-4 gap-2 mt-2 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {slots.map((slotObj: any, i) => {
                    const slot =
                      typeof slotObj === "string" ? slotObj : slotObj.time;
                    const isBooked =
                      typeof slotObj === "object" && slotObj.booked;

                    const [hour, minute] = slot.split(":");
                    const slotTime = new Date();
                    slotTime.setHours(Number(hour), Number(minute), 0);

                    const isPast = isToday && slotTime < now;
                    const selected = form.time === slot;

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isBooked || isPast}
                        onClick={() => handleChange("time", slot)}
                        className={`py-1.5 rounded-lg text-xs border
                          ${selected ? "bg-blue-600 text-white" : ""}
                          ${isBooked ? "bg-red-400 text-white" : ""}
                          ${isPast ? "bg-gray-300 text-gray-500" : ""}
                        `}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <textarea
              className="input"
              placeholder="Problem"
              rows={2}
              onChange={(e) => handleChange("problem", e.target.value)}
            />

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl font-medium">
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      <style>
        {`
          .input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
          }
        `}
      </style>
    </section>
  );
};

export default Appointment;
