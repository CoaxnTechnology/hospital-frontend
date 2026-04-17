import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

const Settings = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const menu = [
    {
      label: "Doctor Schedule",
      path: "/settings/schedule",
      color: "bg-blue-100 text-blue-600",
      roles: ["admin", "doctor"], // ✅
    },
    {
      label: "Doctor Signature",
      path: "/settings/signature",
      color: "bg-yellow-100 text-yellow-600",
      roles: ["admin", "doctor"], // ✅
    },
    {
      label: "Medicine Brand",
      path: "/settings/medicine",
      color: "bg-green-100 text-green-600",
      roles: ["admin", "staff"], // ✅
    },
    {
      label: "Medicine Dosage",
      path: "/settings/dosage",
      color: "bg-purple-100 text-purple-600",
      roles: ["admin", "staff"],
    },
    {
      label: "Medicine Strength",
      path: "/settings/strength",
      color: "bg-orange-100 text-orange-600",
      roles: ["admin", "staff"],
    },
    {
      label: "Medicine Supplier",
      path: "/settings/supplier",
      color: "bg-pink-100 text-pink-600",
      roles: ["admin", "staff"],
    },
    {
      label: "Medicine Category",
      path: "/settings/category",
      color: "bg-indigo-100 text-indigo-600",
      roles: ["admin", "staff"],
    },
    {
      label: "Hospital Details & Logo",
      path: "/settings/details",
      color: "bg-gray-100 text-gray-600",
      roles: ["admin"],
    },
    {
      label: "Hero Section",
      path: "/settings/hero",
      color: "bg-red-100 text-red-600",
      roles: ["admin"],
    },
    {
      label: "Service Section",
      path: "/settings/service",
      color: "bg-red-100 text-red-600",
      roles: ["admin"],
    },
    {
      label: "Blog Section",
      path: "/settings/blog",
      color: "bg-red-100 text-red-600",
      roles: ["admin"],
    },
    {
      label: "Branch Section",
      path: "/settings/branch",
      color: "bg-red-100 text-red-600",
      roles: ["admin"],
    },
  ];

  // 🔥 FILTER BASED ON ROLE
  const filteredMenu = menu.filter((item) => item.roles.includes(role));

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow">
          <h2 className="text-xl sm:text-2xl font-semibold">Settings</h2>
          <p className="text-sm opacity-90">
            Manage system configuration & modules
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenu.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="group bg-white p-5 rounded-2xl shadow-sm border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* ICON */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${item.color}`}
              >
                ⚙️
              </div>

              {/* TITLE */}
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                {item.label}
              </h3>

              <p className="text-xs text-gray-500 mt-1">Manage settings</p>

              <div className="mt-3 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition">
                → Open
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
