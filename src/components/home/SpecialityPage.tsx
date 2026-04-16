const BASE_URL = import.meta.env.VITE_BASE_URL;

import { useParams,useNavigate } from "react-router-dom";
import Hero from "../home/Hero";
import { useEffect, useState } from "react";
import { getDoctorsByDepartment } from "../../services/doctor.service";
import { getHomeData } from "../../services/department.service";
import Footer from "../layout/Footer";

const SpecialityPage = () => {
  const { slug } = useParams();
const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);

  const name = slug
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 FETCH DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!name) return;

      const res = await getDoctorsByDepartment(name);
      console.log("🔥 DOCTORS API:", res);

      setDoctors(res.data || []);
    };

    fetchDoctors();
  }, [name]);

  // 🔥 FETCH DEPARTMENT
  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await getHomeData();
        console.log("🔥 HOME DATA:", res);

        const dept = res.departments?.find(
          (d: any) => d.department_name === name,
        );

        console.log("🔥 SELECTED DEPARTMENT:", dept);

        setDepartment(dept || null);
      } catch (error) {
        console.error("❌ Error loading department", error);
      }
    };

    if (name) fetchDept();
  }, [name]);

  return (
    <>
      <Hero showButton={false} />

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            {name}
          </h1>

          {/* ABOUT */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow mb-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">About {name}</h2>

            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {department?.department_desc || "No description available"}
            </p>
          </div>

          {/* DOCTORS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Our {name} Doctors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {doctors.length === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  No doctors available
                </p>
              )}

              {doctors.map((doc) => {
                // 🔥 DEBUG LOGS
                console.log("👉 FULL DOC:", doc);
                console.log("👉 IMAGE FIELD:", doc.image);

                const imageUrl = doc.image
                  ? doc.image.startsWith("http")
                    ? doc.image
                    : doc.image.startsWith("/uploads")
                      ? `${BASE_URL}${doc.image}`
                      : `${BASE_URL}/uploads/${doc.image}`
                  : "https://via.placeholder.com/150";

                console.log("👉 FINAL IMAGE URL:", imageUrl);

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 text-center"
                  >
                    <img
                      src={imageUrl}
                      onError={(e) => {
                        console.log("❌ IMAGE LOAD FAILED:", imageUrl);
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150";
                      }}
                      alt={doc.first_name}
                      className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                    />

                    <h3 className="font-semibold text-lg">
                      {doc.first_name} {doc.last_name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4">
                      {doc.department}
                    </p>
                    <button
                      onClick={() =>
                        navigate("/#appointment", {
                          state: {
                            doctorId: doc.id,
                            doctorName: `${doc.first_name} ${doc.last_name}`,
                            department: doc.department,
                          },
                        })
                      }
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
                    >
                      Request Appointment
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
};

export default SpecialityPage;
