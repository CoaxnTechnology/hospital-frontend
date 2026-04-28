const BASE_URL = "http://localhost:5000";
//const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
import { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { getHospital } from "../../services/setting.service";
import { getBranches } from "../../services/branch.service";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [hospital, setHospital] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoadingPage(true);

      const hRes = await getHospital();
      setHospital(hRes.data);

      const bRes = await getBranches();
      setBranches(bRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoadingSubmit(true);
    setSuccessMsg("");

    try {
      console.log("👉 Sending:", form);

      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("👉 Response:", data);

      if (data.success) {
        setSuccessMsg("Message sent successfully ✅");

        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSuccessMsg("Failed to send ❌");
      }
    } catch (err) {
      console.error(err);
      setSuccessMsg("Server error ❌");
    } finally {
      setLoadingSubmit(false);
    }
  };
  /* 🔥 MAP GENERATOR */
  const getMap = (address: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="text-gray-500 mt-3">
              Get in touch with our team for any queries
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* 🔥 FORM */}
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Send Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="input"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="input"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="input"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />

                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="input"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />

                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className={`w-full py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2
    ${
      loadingSubmit
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
    }`}
                >
                  {loadingSubmit ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
                {successMsg && (
                  <p className="text-center text-sm mt-3 text-green-600 font-medium">
                    {successMsg}
                  </p>
                )}
              </form>

              {/* 🔥 EMAIL LINK */}
            </div>

            {/* 🔥 LOCATIONS */}
            <div className="space-y-6">
              {/* 🔥 IF BRANCHES EXIST */}
              {branches.length > 0
                ? branches.map((b) => {
                    const fullAddress = `${b.address}, ${b.city}`;

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden"
                      >
                        <iframe
                          src={getMap(fullAddress)}
                          className="w-full h-52 md:h-64 border-0"
                          loading="lazy"
                        />

                        <div className="p-5">
                          <h3 className="font-semibold text-lg mb-2">
                            {b.city} - {b.area}
                          </h3>

                          <p className="text-gray-600 text-sm mb-1">
                            📍 {fullAddress}
                          </p>
                        </div>
                      </div>
                    );
                  })
                : hospital && (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                      <iframe
                        src={getMap(hospital.address)}
                        className="w-full h-52 md:h-64 border-0"
                        loading="lazy"
                      />

                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-2">
                          Main Hospital
                        </h3>

                        <p className="text-gray-600 text-sm mb-1">
                          📍 {hospital.address}
                        </p>

                        <p className="text-gray-600 text-sm">
                          📞 {hospital.phone}
                        </p>
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </div>

        {/* INPUT STYLE */}
        <style>
          {`
            .input {
              width: 100%;
              padding: 12px 14px;
              border-radius: 12px;
              border: 1px solid #d1d5db;
              outline: none;
              font-size: 14px;
            }

            .input:focus {
              border-color: #2563eb;
              box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
            }
          `}
        </style>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
