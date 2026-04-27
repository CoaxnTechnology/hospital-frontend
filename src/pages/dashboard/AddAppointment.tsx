const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getDoctors } from "../../services/doctor.service";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import { useRef } from "react";

type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
};
declare global {
  interface Window {
    confirmationResult: any;
  }
}

const AddAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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
  const now = new Date();

  const getToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const local = new Date(today.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
  };

  const isToday = form.date === getToday();
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
      const sortedSlots = (data.data || []).sort((a: any, b: any) => {
        const [h1, m1] = a.time.split(":").map(Number);
        const [h2, m2] = b.time.split(":").map(Number);

        return h1 * 60 + m1 - (h2 * 60 + m2);
      });

      setAvailableSlots(sortedSlots);
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

      console.log("🔥 PATIENT DATA:", data);

      if (data.success && data.data) {
        const patient = data.data;

        setForm((prev) => ({
          ...prev,
          patient_id: patient.id || "",
          patient_name: patient.name || "",
          phone: patient.phone || "",
          doctor_id: patient.last_doctor_id || "",
          department: patient.last_department || "",
          gender: patient.gender || "",
          age: patient.age || "",
        }));
      }
    } catch (err) {
      console.error("❌ PATIENT LOAD ERROR:", err);
    }
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (e: any) => {
    if (e.target.name === "phone") {
      setOtp("");
      setOtpSent(false);
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" },
      );
    }
  };
  const sendOtp = async () => {
    // 🔥 validation add करो
    if (!form.patient_name || !form.phone) {
      alert("Enter name & phone");
      return;
    }

    if (!form.doctor_id || !form.date || !form.time) {
      alert("Select doctor, date & slot");
      return;
    }

    try {
      setBookingLoading(true);
      setShowOtpModal(true);

      await auth.signOut();
      setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + form.phone,
        recaptchaVerifierRef.current!,
      );

      window.confirmationResult = confirmation;
      setOtpSent(true);
    } catch (err: any) {
      alert(err.message);
      setShowOtpModal(false);
    } finally {
      setBookingLoading(false);
    }
  };
  const verifyAndCreate = async () => {
    console.log("verifyAndCreate: start", { otp, form });

    if (!otp) {
      console.log("verifyAndCreate: missing OTP");
      alert("Enter OTP");
      return;
    }

    setBookingLoading(true);
    console.log("verifyAndCreate: bookingLoading true");

    try {
      if (!window.confirmationResult) {
        console.log("verifyAndCreate: session expired");
        alert("Session expired");
        setOtp("");
        setOtpSent(false);
        return;
      }

      // 🔥 OTP VERIFY
      const confirmationResult = await window.confirmationResult.confirm(otp);
      console.log("verifyAndCreate: OTP confirmed", confirmationResult);

      // 🔥 TOKEN GET
      const token = await auth.currentUser?.getIdToken();
      console.log("verifyAndCreate: token", token);

      // 🔥 API CALL (same as home page)
      const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 MUST
        },
        body: JSON.stringify({
          patient_id: form.patient_id || null, // dashboard extra field
          patient_name: form.patient_name,
          phone: form.phone,
          age: Number(form.age),
          gender: form.gender,
          doctor_id: Number(form.doctor_id),
          department: form.department,
          date: form.date,
          time: form.time,
          problem: form.problem,
        }),
      });

      console.log("verifyAndCreate: request sent", res.status);

      const data = await res.json();
      console.log("verifyAndCreate: response", data);

      if (!data.success) {
        throw new Error(data.message);
      }

      alert("✅ Appointment created");

      setShowOtpModal(false);
      navigate("/appointments");
    } catch (err: any) {
      console.error("verifyAndCreate ERROR:", err);
      alert(err.message || "Wrong or expired OTP");
    } finally {
      setBookingLoading(false);
      console.log("verifyAndCreate: bookingLoading false");
    }
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

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add Appointment</h2>

        <form className="bg-white p-8 rounded-2xl shadow grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Patient ID"
            onChange={(e) => {
              const id = e.target.value;

              setForm((prev) => ({
                ...prev,
                patient_id: id,
              }));

              loadPatientById(id); // 🔥 safe call
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
                {d.first_name} {d.last_name}
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

                // 🔥 TIME SPLIT
                const [hour, minute] = slot.split(":");

                const slotTime = new Date();
                slotTime.setHours(Number(hour), Number(minute), 0);

                // 🔥 EXPIRED LOGIC
                const isPast = isToday && slotTime < now;

                const selected = form.time === slot;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isBooked || isPast}
                    onClick={() => handleSlotClick(slot)}
                    className={`
        py-2 rounded border transition text-sm
        ${selected ? "bg-blue-600 text-white" : ""}
        ${isBooked ? "bg-red-400 text-white cursor-not-allowed" : ""}
        ${isPast ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
        ${!isBooked && !isPast ? "bg-blue-100 hover:bg-blue-200" : ""}
      `}
                  >
                    {formatTime(slot)}

                    {isBooked && " (Booked)"}
                    {isPast && " (Expired)"}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              🔴 Booked | 🔵 Available | ⚪ Expired
            </p>
          </div>

          <textarea
            name="problem"
            onChange={handleChange}
            placeholder="Problem"
            className="input col-span-2"
          />

          <button
            type="button"
            onClick={sendOtp}
            disabled={bookingLoading}
            className="col-span-2 bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {bookingLoading
              ? "Processing..."
              : otpSent
                ? "Verify & Book"
                : "Send OTP"}
          </button>
        </form>
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-5 rounded-xl w-[300px]">
              <h3 className="text-lg font-semibold mb-3">Enter OTP</h3>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input w-full mb-2 text-center"
                placeholder="Enter OTP"
              />

              <button
                onClick={verifyAndCreate}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              >
                {bookingLoading ? "Verifying..." : "Verify & Book"}
              </button>

              <div id="recaptcha-container"></div>

              <button
                onClick={() => setShowOtpModal(false)}
                className="text-red-500 text-sm mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
