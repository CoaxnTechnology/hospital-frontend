const BASE_URL = import.meta.env.VITE_BASE_URL;
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHospital } from "../../services/setting.service";
import logo from "../../assets/images/logo.png";

/* 🔥 URL FIX FUNCTION */
const formatUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

const Footer = () => {
  const [hospital, setHospital] = useState<any>(null);
  const navigate = useNavigate();

  /* 🔥 FIXED SCROLL (IMPORTANT) */
  const handleScroll = (id: string) => {
    navigate(`/#${id}`);
  };

  /* 🔥 LOAD HOSPITAL DATA */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHospital();
        setHospital(res.data);
      } catch (err) {
        console.error("Error loading hospital", err);
      }
    };

    load();
  }, []);

  return (
    <footer className="bg-[#0b1c39] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* LOGO */}
          <div>
            <img
              src={hospital?.logo ? `${BASE_URL}${hospital.logo}` : logo}
              alt="Logo"
              className="h-10 mb-4"
            />

            <p className="text-sm leading-relaxed">
              {hospital?.name || "Hospital Management"}
            </p>

            {/* 🔥 SOCIAL LINKS */}
            <div className="flex gap-4 mt-4 text-blue-400">
              {hospital?.facebook && (
                <a
                  href={formatUrl(hospital.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="hover:text-white cursor-pointer" />
                </a>
              )}

              {hospital?.instagram && (
                <a
                  href={formatUrl(hospital.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="hover:text-white cursor-pointer" />
                </a>
              )}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>

            <ul className="space-y-2 text-sm">
              <li
                onClick={() => handleScroll("home")}
                className="cursor-pointer hover:text-white"
              >
                Home
              </li>

              <li
                onClick={() => handleScroll("doctors")}
                className="cursor-pointer hover:text-white"
              >
                Doctors
              </li>

              <li
                onClick={() => handleScroll("services")}
                className="cursor-pointer hover:text-white"
              >
                Services
              </li>

              <li
                onClick={() => handleScroll("appointment")}
                className="cursor-pointer hover:text-white"
              >
                Appointment
              </li>

              <li
                onClick={() => handleScroll("blog")}
                className="cursor-pointer hover:text-white"
              >
                Blog
              </li>

              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>

            <ul className="space-y-2 text-sm">
              <li>📍 {hospital?.address || "Ahmedabad, Gujarat"}</li>

              <li>
                📞
                <a
                  href={`tel:${hospital?.phone}`}
                  className="hover:text-white"
                >
                  {hospital?.phone || "+91 0000000000"}
                </a>
              </li>

              <li>📧 {hospital?.email || "hospital@email.com"}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm">
          © {new Date().getFullYear()} All rights reserved |{" "}
          {hospital?.name || "Hospital"}
        </div>
      </div>
    </footer>
  );
};

export default Footer;