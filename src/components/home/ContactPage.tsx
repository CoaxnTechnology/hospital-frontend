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

  const [hospital, setHospital] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const hRes = await getHospital();
      setHospital(hRes.data);

      const bRes = await getBranches();
      setBranches(bRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("CONTACT FORM:", form);
    alert("Message Sent (Demo)");
  };

  /* 🔥 MAP GENERATOR */
  const getMap = (address: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-16">
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

          <div className="grid lg:grid-cols-2 gap-10">
            {/* 🔥 FORM */}
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Send Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="input"
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="input"
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="input"
                  onChange={(e) => handleChange("phone", e.target.value)}
                />

                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="input"
                  onChange={(e) => handleChange("message", e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>

              {/* 🔥 EMAIL LINK */}
              {hospital?.email && (
                <p className="mt-4 text-sm text-gray-600">
                  📧 Email:{" "}
                  <a
                    href={`mailto:${hospital.email}`}
                    className="text-blue-600 underline"
                  >
                    {hospital.email}
                  </a>
                </p>
              )}
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
