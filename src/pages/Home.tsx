import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Doctors from "../components/home/Doctors";
import Appointment from "../components/home/Appointment";
import Blog from "../components/home/Blog";
import Footer from "../components/layout/Footer";
import SpecialitiesSection from "../components/home/SpecialitiesSection";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  // 🔥 MODAL STATE
  const [openAppointment, setOpenAppointment] = useState(false);

  // 🔥 SCROLL HANDLER
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      setTimeout(() => {
        const el = document.getElementById(id);

        if (el) {
          const yOffset = -100;
          const y =
            el.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [location]);

  // 🔥 ESC KEY CLOSE
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAppointment(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <Navbar />

      {/* ✅ HERO */}
      <div id="home">
        <Hero onAppointmentClick={() => setOpenAppointment(true)} />
      </div>

      {/* ✅ SPECIALITIES */}
      <div id="specialities">
        <SpecialitiesSection />
      </div>

      {/* ✅ DOCTORS */}
      <div id="doctors">
        <Doctors />
      </div>

      {/* ❌ REMOVED OLD APPOINTMENT */}

      {/* ✅ SERVICES */}
      <div id="services">
        <Services />
      </div>

      {/* ✅ BLOG */}
      <div id="blog">
        <Blog />
      </div>

      <Footer />

      {/* 🔥 APPOINTMENT MODAL */}
      {openAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenAppointment(false)} // 👈 outside click close
        >
          <div
            className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()} // 👈 prevent close on inside click
          >
            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={() => setOpenAppointment(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-black"
            >
              ✖
            </button>

            {/* 🧾 APPOINTMENT FORM */}
            <Appointment />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;