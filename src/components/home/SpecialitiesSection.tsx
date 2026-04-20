import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHomeData } from "../../services/department.service";

const SpecialitiesSection = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<any[]>([]);
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeData();
        console.log("Home data response:", res);

        setDepartments(res.departments || []);
        setSection(res.sections?.specialities || null);
      } catch (error) {
        console.error("Error loading specialities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/speciality/${slug}`);
  };

  return (
    <section className="w-full bg-gray-50 py-16">
      {/* 🔥 SCROLLBAR STYLES */}
      <style>
        {`
          .specialities-scroll {
            scrollbar-width: auto;
            scrollbar-color: #3b82f6 #e5e7eb;
          }

          .specialities-scroll::-webkit-scrollbar {
            width: 10px;
          }

          .specialities-scroll::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 9999px;
          }

          .specialities-scroll::-webkit-scrollbar-thumb {
            background-color: #3b82f6;
            border-radius: 9999px;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 w-3/4 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="h-10 w-1/2 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="h-4 w-full max-w-xl rounded-xl bg-gray-200 animate-pulse" />
                <div className="h-4 w-5/6 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {section?.department_name?.split(" ")[0] || "Our"} <br />
                  <span className="text-blue-600">
                    {section?.department_name?.split(" ").slice(1).join(" ") ||
                      "Specialities"}
                  </span>
                </h2>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {section?.department_desc ||
                    "We provide expert healthcare services tailored to your needs."}
                </p>
              </>
            )}
          </div>

          {/* RIGHT SIDE LIST */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            {/* 🔥 SCROLL CONTAINER */}
            <div className="max-h-[280px] overflow-y-auto specialities-scroll">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 px-2 border-b last:border-none rounded-lg"
                    >
                      <div className="h-5 w-2/3 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-5 w-6 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                  ))
                : departments.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleClick(item.department_name)}
                      className="flex items-center justify-between py-4 px-2 border-b last:border-none cursor-pointer group rounded-lg hover:bg-blue-50 transition"
                    >
                      <span className="text-gray-800 font-medium group-hover:text-blue-600 transition">
                        {item.department_name}
                      </span>

                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-blue-600 transition"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialitiesSection;
//new changes
