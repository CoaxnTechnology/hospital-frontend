import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  addDoctorSchedule,
  getMySchedule,
} from "../../services/setting.service";
import { useNavigate } from "react-router-dom";

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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    slot_duration: "",
  });

  const [schedule, setSchedule] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadSchedule();
    
  }, []);

  const loadSchedule = async () => {
    const res = await getMySchedule();
    setSchedule(res.data || []);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyWeekdays = () => {
    setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  };

  const applyAllDays = () => {
    setSelectedDays(daysList);
  };

  /**
   * 🔥 SLOT GENERATOR
   */
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

  /**
   * FORMAT TIME
   */
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      alert("Select at least one day");
      return;
    }

    for (const day of selectedDays) {
      await addDoctorSchedule({
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
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate("/settings")}
          className="mb-3 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold">Doctor Schedule</h2>

        {/* QUICK BUTTONS */}
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

        {/* DAYS SELECT */}
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

        {/* TIME INPUT */}
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

        {/* SLOT */}
        <input
          type="number"
          name="slot_duration"
          placeholder="Slot duration (minutes)"
          value={form.slot_duration}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* 🔥 SLOT PREVIEW */}
        {slots.length > 0 && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">
              Slot Preview ({slots.length})
            </h4>

            <div className="flex flex-wrap gap-2">
              {slots.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {formatTime(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Schedule
        </button>

        {/* SAVED SCHEDULE */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Saved Schedule</h3>

          {schedule.map((s, i) => (
            <div key={i} className="border p-2 rounded mb-2">
              <b>{s.day_of_week}</b> → {formatTime(s.start_time)} -{" "}
              {formatTime(s.end_time)} ({s.slot_duration} min)
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
