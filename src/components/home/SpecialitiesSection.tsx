import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHomeData } from "../../services/department.service"; // 🔥 use single API

const SpecialitiesSection = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<any[]>([]);
  const [section, setSection] = useState<any>(null);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeData();
          console.log("Home data response:", res);

        setDepartments(res.departments || []);
        setSection(res.sections?.specialities || null);
      } catch (error) {
        console.error("Error loading specialities", error);
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
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
          </div>

          {/* RIGHT SIDE LIST */}
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
            {departments.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleClick(item.department_name)}
                className="flex items-center justify-between py-4 border-b last:border-none cursor-pointer group"
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

            {/* VIEW ALL */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialitiesSection;
