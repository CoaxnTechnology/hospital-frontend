import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addDoctorSchedule,
  getMySchedule,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const daysList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Schedule = () => {
  const navigate = useNavigate();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    slot_duration: "",
  });

  const [schedule, setSchedule] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  // 🔥 ROLE + DOCTOR
  const [role, setRole] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user?.role || "");

    loadSchedule();

    if (user?.role === "admin") {
      loadDoctors();
    }
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors`);
      const data = await res.json();
      setDoctors(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSchedule = async () => {
    const res = await getMySchedule();
    console.log(res);
    setSchedule(res.data || []);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  const groupedSchedule = schedule.reduce((acc: any, item: any) => {
    const key = item.doctor_name || "Doctor";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyWeekdays = () => {
    setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  };

  const applyAllDays = () => {
    setSelectedDays(daysList);
  };

  // 🔥 SLOT GENERATOR
  const generateSlots = () => {
    if (!form.start_time || !form.end_time || !form.slot_duration) {
      setSlots([]);
      return;
    }

    const arr: string[] = [];

    let current = new Date(`1970-01-01T${form.start_time}`);
    const end = new Date(`1970-01-01T${form.end_time}`);

    while (current < end) {
      arr.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + Number(form.slot_duration));
    }

    setSlots(arr);
  };

  useEffect(() => {
    generateSlots();
  }, [form.start_time, form.end_time, form.slot_duration]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      alert("Select at least one day");
      return;
    }

    // 🔥 ADMIN CHECK
    if (role === "admin" && !selectedDoctor) {
      alert("Please select doctor");
      return;
    }

    const doctorId =
      role === "admin"
        ? Number(selectedDoctor)
        : JSON.parse(localStorage.getItem("user") || "{}")?.doctor_id;

    for (const day of selectedDays) {
      await addDoctorSchedule({
        doctor_id: doctorId,
        day_of_week: day,
        start_time: form.start_time,
        end_time: form.end_time,
        slot_duration: form.slot_duration,
      });
    }

    alert("Schedule saved");

    setSelectedDays([]);
    setForm({
      start_time: "",
      end_time: "",
      slot_duration: "",
    });
    setSlots([]);

    loadSchedule();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/settings")}
          className="mb-3 px-4 py-1 bg-gray-200 rounded"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold">Doctor Schedule</h2>

        {/* 🔥 ADMIN DOCTOR SELECT */}
        {role === "admin" && (
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.first_name} {doc.last_name}
              </option>
            ))}
          </select>
        )}

        {/* STAFF BLOCK */}
        {role === "staff" && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            Staff cannot create schedule
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={applyWeekdays}
            className="px-3 py-1 bg-blue-100 rounded"
          >
            Mon-Fri
          </button>
          <button
            onClick={applyAllDays}
            className="px-3 py-1 bg-green-100 rounded"
          >
            All Days
          </button>
        </div>

        {/* DAYS */}
        <div className="flex flex-wrap gap-2">
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded ${
                selectedDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* TIME */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <input
          type="number"
          name="slot_duration"
          placeholder="Slot duration"
          value={form.slot_duration}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* SLOT PREVIEW */}
        {slots.length > 0 && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Slots ({slots.length})</h4>
            <div className="flex flex-wrap gap-2">
              {slots.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 rounded">
                  {formatTime(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SAVE */}
        {role !== "staff" && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Save Schedule
          </button>
        )}

        {/* SAVED */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Saved Schedule</h3>
          {Object.keys(groupedSchedule).map((doctor, i) => (
            <div key={i} className="mb-4">
              {/* 🔥 DOCTOR HEADER */}
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                👨‍⚕️ {doctor}
              </h3>

              {/* 🔥 DOCTOR SCHEDULE */}
              {groupedSchedule[doctor].map((s: any, j: number) => (
                <div
                  key={j}
                  className="border p-3 rounded mb-2 bg-gray-50 ml-2"
                >
                  <p className="font-medium">📅 {s.day_of_week}</p>

                  <p className="text-gray-600">
                    ⏰ {formatTime(s.start_time)} - {formatTime(s.end_time)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
