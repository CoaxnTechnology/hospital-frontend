const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctors } from "../../services/doctor.service";

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await getDoctors();
      setDoctors(res.data || []);
    };

    fetchDoctors();
  }, []);

  // 🔥 SMART GRID
  const gridClass =
    doctors.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : doctors.length === 2
        ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Doctors
          </h2>

          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Meet our experienced specialists dedicated to your health.
          </p>
        </div>

        {/* GRID */}
        <div className={`grid gap-8 ${gridClass}`}>
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() =>
                navigate(
                  `/doctor/${doc.id}/${(doc.first_name + " " + doc.last_name)
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                )
              }
              className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={
                    doc.image?.startsWith("http")
                      ? doc.image
                      : `${BASE_URL}/${doc.image}`
                  }
                  alt={doc.first_name}
                  className="w-full h-72 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="text-center p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Dr. {doc.first_name} {doc.last_name}
                </h3>

                <p className="text-sm text-blue-600 mt-1">{doc.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {doctors.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No doctors available
          </p>
        )}
      </div>
    </section>
  );
};

export default Doctors;
