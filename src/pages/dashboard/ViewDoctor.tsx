import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { getDoctorById } from "../../services/doctor.service";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctorById(id!);
        setDoctor(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard/doctors")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          ← Back to Doctors
        </button>

        {/* 🔥 SKELETON LOADER */}
        {loading && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-10"></div>

            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white"></div>
            </div>

            <div className="text-center mb-6 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ ACTUAL DATA */}
        {!loading && doctor && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
            {/* HEADER */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

            <div className="p-6">
              {/* IMAGE */}
              <div className="flex justify-center -mt-16 mb-6">
                <img
                  src={
                    doctor.image
                      ? `${BASE_URL}${doctor.image}`
                      : "/default-avatar.png"
                  }
                  className="w-32 h-32 rounded-full border-4 border-white shadow object-cover"
                />
              </div>

              {/* NAME */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-blue-600">{doctor.department}</p>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{doctor.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{doctor.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p>{doctor.gender}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">DOB</p>
                  <p>{new Date(doctor.dob).toLocaleDateString("en-IN")}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded sm:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{doctor.address}</p>
                </div>

                {doctor.biography && (
                  <div className="bg-gray-50 p-4 rounded sm:col-span-2">
                    <p className="text-sm text-gray-500">Biography</p>
                    <p>{doctor.biography}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewDoctor;
