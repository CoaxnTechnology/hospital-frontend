const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState, useRef } from "react";
import { getDoctors } from "../../services/doctor.service";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
declare global {
  interface Window {
    confirmationResult: any;
  }
}
const Appointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
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

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      // Clean up the DOM element on unmount
    };
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
    if (key === "phone") {
      setOtpSent(false);
      setIsVerified(false);
      setOtp("");
      setOtpMessage("");

      // Also clear the DOM element
    }

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

  const handleBookAction = async () => {
    if (!form.phone) {
      alert("Enter phone number");
      return;
    }

    if (!otpSent) {
      console.log("Starting OTP send process");
      setBookingLoading(true);
      console.log("Setting booking loading to true");
      try {
        console.log("In try block for OTP send");
        console.log("📲 Sending OTP to", "+91" + form.phone);
        console.log("Checking if recaptcha exists");
        // Create a fresh RecaptchaVerifier instance
        if (recaptchaVerifierRef.current) {
          console.log("Clearing existing recaptcha");
          recaptchaVerifierRef.current.clear();
        }
        console.log("Signing out auth");
        await auth.signOut(); // 🔥 important
        console.log("Creating new RecaptchaVerifier");
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" },
        );
        console.log("Calling signInWithPhoneNumber");
        const confirmation = await signInWithPhoneNumber(
          auth,
          "+91" + form.phone,
          recaptchaVerifierRef.current,
        );
        console.log("Setting confirmation result");
        window.confirmationResult = confirmation;
        console.log("Setting otp sent to true");
        setOtpSent(true);
        console.log("Setting otp message");
        setOtpMessage(`OTP sent to +91 ${form.phone}`);
        console.log("Alerting user");
        alert(
          "OTP sent. Please enter the code and click Book Appointment again.",
        );
      } catch (err: any) {
        console.log("In catch block for OTP send");
        console.error("Error sending OTP", err);
        alert("Failed to send OTP: " + (err?.message || err));
        // Clear the recaptcha on error so user can retry
        if (recaptchaVerifierRef.current) {
          console.log("Clearing recaptcha on error");
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        }
      } finally {
        console.log("In finally block for OTP send");
        setBookingLoading(false);
      }
      return;
    }

    if (!isVerified) {
      console.log("Checking if verified");
      if (!otp) {
        console.log("No OTP entered");
        alert("Enter OTP to verify");
        return;
      }
      console.log("Setting booking loading for verification");
      setBookingLoading(true);
      try {
        console.log("In try block for verification");
        console.log("🔑 Verifying OTP", otp);
        console.log("Confirming OTP");
        await window.confirmationResult.confirm(otp);
        console.log("Setting is verified");
        setIsVerified(true);
        console.log("Setting otp message");
        setOtpMessage("OTP verified. Booking appointment now...");
        console.log("✅ OTP verified");
      } catch (err: any) {
        console.log("In catch for verification");
        console.error("OTP verification failed", err);
        alert("Invalid OTP: " + (err?.message || err));
        setBookingLoading(false);
        return;
      }
    }

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
      alert("⚠️ Please fill all required fields before booking");
      setBookingLoading(false);
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      console.log("🔥 Firebase Token:", token);

      const res = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      console.log("📦 API RESPONSE:", data);

      if (!data.success) throw new Error(data?.message || "Booking failed");

      alert("✅ Appointment Booked");
      window.location.reload();
    } catch (err: any) {
      console.error("Booking failed", err);
      alert("❌ Booking failed: " + (err?.message || err));
    } finally {
      setBookingLoading(false);
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

          <form className="grid grid-cols-1 gap-3">
            <input
              placeholder="Name"
              className="input"
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <input
              placeholder="Phone"
              className="input"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <div id="recaptcha-container"></div>

            {otpSent && !isVerified && (
              <input
                placeholder="Enter OTP"
                className="input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            {otpMessage && (
              <p
                className={`text-sm ${isVerified ? "text-green-600" : "text-blue-600"}`}
              >
                {otpMessage}
              </p>
            )}

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

            <button
              type="button"
              onClick={handleBookAction}
              disabled={bookingLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl font-medium disabled:opacity-50"
            >
              {bookingLoading
                ? "Processing..."
                : otpSent
                  ? isVerified
                    ? "Book Appointment"
                    : "Verify OTP & Book"
                  : "Book Appointment"}
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
