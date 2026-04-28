const BASE_URL = import.meta.env.VITE_BASE_URL;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Hero from "../home/Hero";
import Footer from "../layout/Footer";
import { getDoctors } from "../../services/doctor.service";

/* 🔥 SLUG */
const createSlug = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const DoctorDetailsPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* 🔥 FETCH */
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctors();
        console.log("Doctors fetched:", res.data);
        const found = res.data.find((d: any) => d.id == id);
        setDoctor(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  /* 🔥 SCROLL */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* 🔥 SLUG FIX (IMPORTANT: hook always run) */
  useEffect(() => {
    if (doctor) {
      const fullName = ` ${doctor.first_name} ${doctor.last_name}`;
      const newSlug = createSlug(fullName);

      if (slug !== newSlug) {
        navigate(`/doctor/${doctor.id}/${newSlug}`, { replace: true });
      }
    }
  }, [doctor, slug, navigate]);

  /* 🔥 SKELETON */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-10 w-1/2 bg-gray-200 rounded" />
          <div className="h-6 w-1/3 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  /* 🔥 NOT FOUND */
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Doctor not found
      </div>
    );
  }

  const fullName = `${doctor.first_name} ${doctor.last_name}`;

  return (
    <>
      <Hero showButton={false} />

      {/* 🔥 PROFILE */}
      <div className="bg-gradient-to-r from-gray-100 to-blue-50 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
          {/* IMAGE */}
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <img
              src={
                doctor.image
                  ? doctor.image.startsWith("http")
                    ? doctor.image
                    : `${BASE_URL}${doctor.image}`
                  : "/default-avatar.png"
              }
              alt={fullName}
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-xl"
            />
          </div>

          {/* DETAILS */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              {fullName}
            </h1>

            <p className="text-blue-600 mb-2 text-sm sm:text-base">
              {doctor.department || "Specialist"}
            </p>

            {/* DEGREE */}
            {doctor.degree && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {doctor.degree.split(",").map((deg: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            )}

            {/* LANGUAGES */}
            {doctor.languages && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {doctor.languages.split(",").map((lang: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 border rounded-full text-xs text-gray-600"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}

            {/* BUTTON */}
            {/* BUTTON */}
            <button
              onClick={() =>
                navigate("/", {
                  state: {
                    openAppointment: true,
                    doctor: {
                      id: doctor.id,
                      name: `${doctor.first_name} ${doctor.last_name}`,
                      department: doctor.department,
                    },
                  },
                })
              }
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
            >
              Request Appointment
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 ABOUT */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-5">
            A Brief Introduction
          </h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {doctor.biography ||
              `${fullName} is a specialist in ${doctor.department}.`}
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DoctorDetailsPage;
