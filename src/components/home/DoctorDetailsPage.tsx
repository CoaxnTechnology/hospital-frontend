import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Hero from "../home/Hero";
import Footer from "../layout/Footer";

import doctor1 from "../../assets/doctors/doctor_1.png";
import doctor2 from "../../assets/doctors/doctor_2.png";
import doctor3 from "../../assets/doctors/doctor_3.png";
import doctor4 from "../../assets/doctors/doctor_4.png";

/* -------------------------
   TEMP STATIC DATA
--------------------------*/
const doctorsData = [
  {
    id: 1,
    name: "Dr Adam Billiard",
    speciality: "Cardiac Sciences",
    hospital: "Sterling Hospital, Ahmedabad",
    degree: ["MBBS", "MD", "DM (Cardiology)"],
    languages: ["English", "Hindi", "Gujarati"],
    image: doctor1,
  },
  {
    id: 2,
    name: "Dr Aamir Khan",
    speciality: "Medicine",
    hospital: "City Care Hospital",
    degree: ["MBBS", "MD"],
    languages: ["English", "Hindi"],
    image: doctor4,
  },
  {
    id: 3,
    name: "Dr Fred Macyard",
    speciality: "Cardiac Sciences",
    hospital: "Apollo Hospital",
    degree: ["MBBS", "MD"],
    languages: ["English"],
    image: doctor2,
  },
  {
    id: 4,
    name: "Dr Justin Stuard",
    speciality: "Cardiac Sciences",
    hospital: "Sterling Hospital",
    degree: ["MBBS", "MD"],
    languages: ["English", "Gujarati"],
    image: doctor3,
  },
];

/* -------------------------
   SLUG FUNCTION
--------------------------*/
const createSlug = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const DoctorDetailsPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  /* -------------------------
     SCROLL TOP FIX
  --------------------------*/
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const doctor = doctorsData.find((d) => d.id === Number(id));

  /* -------------------------
     NOT FOUND
  --------------------------*/
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Doctor not found
      </div>
    );
  }

  /* -------------------------
     SLUG VALIDATION
  --------------------------*/
  useEffect(() => {
    if (doctor && slug !== createSlug(doctor.name)) {
      navigate(`/doctor/${doctor.id}/${createSlug(doctor.name)}`, {
        replace: true,
      });
    }
  }, [doctor, slug, navigate]);

  return (
    <>
      {/* 🔥 HERO */}
      <Hero showButton={false} />

      {/* 🔥 TOP PROFILE SECTION */}
      <div className="bg-gradient-to-r from-gray-100 to-blue-50 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* IMAGE */}
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-xl"
            />
          </div>

          {/* DETAILS */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              {doctor.name}
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-2">
              {doctor.speciality}
            </p>

            <p className="text-sm md:text-base text-gray-500 mb-5">
              {doctor.hospital}
            </p>

            {/* DEGREE */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {doctor.degree.map((deg, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
                >
                  {deg}
                </span>
              ))}
            </div>

            {/* LANGUAGES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {doctor.languages.map((lang, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border rounded-full text-xs sm:text-sm text-gray-600"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/appointment")}
              className="bg-green-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
            >
              Request an Appointment
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 ABOUT SECTION */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 md:mb-6">
            A Brief Introduction
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            {doctor.name} is a highly experienced specialist in{" "}
            {doctor.speciality}. With years of clinical expertise, the doctor
            provides advanced treatment using modern medical technology and
            patient-centered care. The focus is always on delivering the best
            outcomes and ensuring patient comfort.
          </p>
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <Footer />
    </>
  );
};

export default DoctorDetailsPage;
