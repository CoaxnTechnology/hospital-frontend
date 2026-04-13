import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userImg from "../../../assets/icons/user-06.jpg";
import { getDoctors } from "../../../services/doctor.service";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DoctorList = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        if (res.success) {
          setDoctors(res.data || []);
        }
      } catch (err) {
        console.error("❌ Doctor fetch error:", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h4 className="text-lg font-semibold">Doctors</h4>
      </div>

      {/* LIST */}
      <ul className="divide-y max-h-[300px] overflow-y-auto no-scrollbar">
        {doctors.length > 0 ? (
          doctors.map((doc, index) => (
            <li
              key={index}
              onClick={() => navigate("/dashboard/doctors")}
              className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer"
            >
              {/* AVATAR */}
              <div className="relative">
                <img
                  src={
                    doc.image
                      ? doc.image.startsWith("http")
                        ? doc.image
                        : `${BASE_URL}${doc.image}`
                      : userImg
                  }
                  className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover"
                  alt={doc.first_name}
                />

                {/* ONLINE STATUS (optional) */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500`}
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="font-semibold">
                  {doc.first_name} {doc.last_name}
                </p>

                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {doc.department || "Doctor"}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="px-6 py-4 text-center text-gray-500">
            No doctors found
          </li>
        )}
      </ul>

      {/* FOOTER */}
      <div className="px-6 py-3 text-center border-t">
        <button
          onClick={() => navigate("/dashboard/doctors")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all Doctors
        </button>
      </div>
    </div>
  );
};

export default DoctorList;