const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState, useRef } from "react";
import { getDoctors } from "../../services/doctor.service";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
declare global {
  interface Window {
    confirmationResult: any;
    grecaptcha: any;
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
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
  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  };

  const resetOTPFlow = () => {
    console.log("resetOTPFlow: start");
    setOtp("");
    console.log("resetOTPFlow: otp reset");
    setOtpSent(false);
    console.log("resetOTPFlow: otpSent false");
    setIsVerified(false);
    console.log("resetOTPFlow: isVerified false");
    setOtpMessage("");
    console.log("resetOTPFlow: otpMessage cleared");

    console.log("resetOTPFlow: end");
  };
  useEffect(() => {
    return () => {
      resetOTPFlow(); // 🔥 cleaner
    };
  }, []);
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [otpSent, timer]);

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
      console.log("handleChange: phone change detected", value);
      resetOTPFlow();
      console.log("handleChange: OTP flow reset after phone change");

      // Also clear the DOM element
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log("handleChange: form updated", { key, value });
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

  const sendOtp = async () => {
    try {
      setBookingLoading(true);

      setOtpMessage("⏳ Sending OTP...");
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
      setTimer(30); // 🔥 start timer
      setCanResend(false);

      setOtpMessage(`✅ OTP sent to +91 ${form.phone}`);
    } catch (err: any) {
      alert(err?.message || "Failed to send OTP");
      resetOTPFlow();
      setShowOtpModal(false);
    } finally {
      setBookingLoading(false);
    }
  };
  const verifyAndBook = async () => {
    console.log("verifyAndBook: start", { otp, form });
    if (!otp) {
      console.log("verifyAndBook: missing OTP");
      alert("Enter OTP");
      return;
    }

    setBookingLoading(true);
    console.log("verifyAndBook: bookingLoading set true");

    try {
      if (!window.confirmationResult) {
        console.log("verifyAndBook: confirmationResult missing");
        alert("Session expired");
        resetOTPFlow();
        console.log(
          "verifyAndBook: resetOTPFlow called because session expired",
        );
        return;
      }

      const confirmationResult = await window.confirmationResult.confirm(otp);
      console.log("verifyAndBook: OTP confirmed", confirmationResult);

      const token = await auth.currentUser?.getIdToken();
      console.log("verifyAndBook: token retrieved", token);

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
      console.log("verifyAndBook: appointment fetch request sent", res.status);

      const data = await res.json();
      console.log("verifyAndBook: response data", data);

      if (!data.success) {
        console.log("verifyAndBook: booking failed", data.message);
        throw new Error(data.message);
      }

      alert("Appointment Booked ✅");
      console.log("verifyAndBook: booking succeeded");
      setShowOtpModal(false);
      console.log("verifyAndBook: OTP modal hidden after success");
      window.location.reload();
      console.log("verifyAndBook: page reload triggered");
    } catch (err: any) {
      console.error("verifyAndBook ERROR:", err);
      alert("Wrong or expired OTP");
    } finally {
      setBookingLoading(false);
      console.log("verifyAndBook: bookingLoading set false");
    }
  };
  const resendOtp = async () => {
    try {
      setBookingLoading(true);

      await auth.signOut();

      if (recaptchaVerifierRef.current) {
        const widgetId = await recaptchaVerifierRef.current.render();
        window.grecaptcha.reset(widgetId);
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + form.phone,
        recaptchaVerifierRef.current!,
      );

      window.confirmationResult = confirmation;

      setTimer(30);
      setCanResend(false);
      setOtpMessage(`🔁 OTP resent to +91 ${form.phone}`);
    } catch (err: any) {
      alert("Failed to resend OTP");
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
              onClick={sendOtp}
              disabled={bookingLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl font-medium disabled:opacity-50"
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
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input w-full mb-2 text-center tracking-widest text-lg"
                />

                <p
                  className={`text-sm mb-2 ${
                    otpMessage.includes("✅")
                      ? "text-green-600"
                      : otpMessage.includes("⏳")
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {otpMessage}
                </p>

                <button
                  onClick={verifyAndBook}
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded mb-2 disabled:opacity-50"
                >
                  {bookingLoading ? "Verifying..." : "Verify & Book"}
                </button>

                {/* 🔥 CAPTCHA HERE */}
                <div id="recaptcha-container" className="mb-2"></div>

                {!canResend ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in {timer}s
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setOtp("");
                      resendOtp();
                    }}
                    className="text-blue-600 text-sm"
                  >
                    🔁 Resend OTP
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    resetOTPFlow(); // 🔥 important
                  }}
                  className="text-red-500 text-sm ml-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
