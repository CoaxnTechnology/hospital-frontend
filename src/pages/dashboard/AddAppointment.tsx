const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { addAppointment } from "../../services/appointment.Service";
import { getDoctors } from "../../services/doctor.service";

type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
};

const AddAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    patient_name: "",
    phone: "",
    gender: "",
    age: "",
    doctor_id: "",
    department: "",
    date: "",
    time: "",
    problem: "",
  });

  // 🔥 FORMAT TIME
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${minute} ${ampm}`;
  };

  // 🔥 LOAD DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔥 LOAD SLOTS
  const loadSlots = async (doctorId: string, date: string) => {
    if (!doctorId || !date) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/doctors/${doctorId}/slots?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("🔥 SLOT DATA:", data.data);

      setAvailableSlots(data.data || []);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    loadSlots(form.doctor_id, form.date);
  }, [form.doctor_id, form.date]);

  // 🔥 LOAD PATIENT BY ID
  const loadPatientById = async (id: string) => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const patient = data.data;

        setForm((prev) => ({
          ...prev,
          patient_id: patient.id,
          patient_name: patient.name,
          phone: patient.phone,
          doctor_id: patient.last_doctor_id || "",
          department: patient.last_department || "",
          gender: patient.gender || "",
          age: patient.age || "",
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 DOCTOR CHANGE
  const handleDoctorChange = (e: any) => {
    const doctorId = e.target.value;

    const doctor = doctors.find((d) => d.id == doctorId);

    setForm({
      ...form,
      doctor_id: doctorId,
      department: doctor ? doctor.department : "",
      time: "",
    });
  };

  // 🔥 SELECT SLOT
  const handleSlotClick = (slot: string) => {
    setForm({ ...form, time: slot });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.phone || form.phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    if (!form.doctor_id || !form.date || !form.time) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      await addAppointment({
        ...form,
        doctor_id: Number(form.doctor_id),
      });

      alert("✅ Appointment created successfully");
      navigate("/appointments");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add Appointment</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow grid grid-cols-2 gap-4"
        >
          <input
            type="number"
            placeholder="Patient ID"
            onChange={(e) => {
              setForm({ ...form, patient_id: e.target.value });
              loadPatientById(e.target.value);
            }}
            className="input"
          />

          <input
            type="text"
            name="patient_name"
            value={form.patient_name}
            onChange={handleChange}
            placeholder="Patient Name"
            className="input"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
          />

          <select name="gender" onChange={handleChange} className="input">
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="input"
          />

          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleDoctorChange}
            className="input"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr {d.first_name} {d.last_name}
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
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input"
          />

          {/* 🔥 SLOT UI */}
          <div className="col-span-2">
            <label className="font-semibold">Select Slot</label>

            <div className="grid grid-cols-4 gap-2 mt-2">
              {availableSlots.length === 0 && (
                <p className="text-gray-400">No slots available</p>
              )}

              {availableSlots.map((slotObj: any, i) => {
                const slot = slotObj.time;
                const isBooked = slotObj.booked === true;
                const selected = form.time === slot;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleSlotClick(slot)}
                    className={`
                      py-2 rounded border transition
                      ${selected ? "bg-blue-600 text-white" : ""}
                      ${
                        isBooked
                          ? "bg-red-400 text-white cursor-not-allowed"
                          : "bg-blue-100 hover:bg-blue-200"
                      }
                    `}
                  >
                    {formatTime(slot)}
                    {isBooked && " (Booked)"}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              🔴 Red = Booked | 🔵 Blue = Available
            </p>
          </div>

          <textarea
            name="problem"
            onChange={handleChange}
            placeholder="Problem"
            className="input col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-3 rounded-xl"
          >
            {submitting ? "Creating..." : "Create Appointment"}
          </button>
        </form>
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
    </DashboardLayout>
  );
};

export default AddAppointment;
