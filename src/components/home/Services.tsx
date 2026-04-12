import { useEffect, useState } from "react";
import { getServices } from "../../services/service.service";

import {
  Ambulance,
  Stethoscope,
  HeartPulse,
  Activity,
  Hospital,
  UserPlus,
} from "lucide-react";

// 🔥 ICON MAP (API VALUE → COMPONENT)
const iconMap: any = {
  Ambulance,
  Stethoscope,
  HeartPulse,
  Activity,
  Hospital,
  UserPlus,
};

const Service = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getServices();
      setServices(res.data || []);
    };

    fetchData();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Hospital Services
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            We provide complete healthcare solutions with advanced technology.
          </p>
        </div>

        {/* GRID */}
        <div
          className={`grid gap-6 ${
            services.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : services.length === 2
                ? "grid-cols-2 max-w-3xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {services.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No services found
            </p>
          )}

          {services.map((service) => {
            const Icon = iconMap[service.icon]; // 🔥 API ICON

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition group"
              >
                {/* ICON */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition">
                  {Icon ? <Icon size={28} /> : "❓"}
                </div>

                {/* TITLE */}
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h4>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Service;
