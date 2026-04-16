import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../../assets/icons/logo.png";
import { getHospital } from "../../../services/setting.service";

type Props = {
  sidebarOpen: boolean;
  closeSidebar: () => void;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Sidebar = ({ sidebarOpen, closeSidebar }: Props) => {
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await getHospital();
        setHospital(res?.data || res);
      } catch (err) {
        console.error("Hospital fetch error:", err);
      } finally {
        setLoading(false); // 🔥 DONE LOADING
      }
    };

    fetchHospital();
  }, []);

  const linkBase =
    "group relative flex items-center gap-3 px-4 py-3 text-sm transition";
  const linkText = "text-gray-600 group-hover:text-blue-600";

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white transition-all duration-300
        shadow-[4px_0_15px_rgba(0,0,0,0.08)]
        ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* 🔥 HEADER */}
        <div className="h-16 flex items-center gap-3 px-4 bg-[#009efb]">
          {/* 🔥 SKELETON OR LOGO */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/30 animate-pulse" />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm p-1">
              <img
                src={hospital?.logo ? `${BASE_URL}${hospital.logo}` : logo}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* 🔥 NAME */}
          <span
            className={`text-white font-semibold text-lg transition-all
            ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            {loading ? (
              <span className="inline-block w-24 h-4 bg-white/30 rounded animate-pulse" />
            ) : (
              hospital?.name || "Preclinic"
            )}
          </span>
        </div>

        {/* MENU */}
        <nav className="mt-3">
          <ul className="space-y-1">
            <SidebarLink
              to="/dashboard"
              icon="dashboard"
              label="Dashboard"
              sidebarOpen={sidebarOpen}
            />
            {(user.role === "admin" || user.role === "doctor") && (
              <SidebarLink
                to="/dashboard/doctors"
                icon="user-md"
                label="Doctors"
                sidebarOpen={sidebarOpen}
              />
            )}
            <SidebarLink
              to="/patients"
              icon="wheelchair"
              label="Patients"
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink
              to="/appointments"
              icon="calendar"
              label="Appointments"
              sidebarOpen={sidebarOpen}
            />
            {(user.role === "admin" || user.role === "doctor") && (
              <SidebarLink
                to="/consultant"
                icon="stethoscope"
                label="Consultant"
                sidebarOpen={sidebarOpen}
              />
            )}
            <SidebarLink
              to="/departments"
              icon="building"
              label="Departments"
              sidebarOpen={sidebarOpen}
            />

            {/* EMPLOYEE */}
            <li>
              <button
                onClick={() => setEmployeeOpen(!employeeOpen)}
                className={`${linkBase} w-full ${linkText}`}
              >
                <i className="fa fa-user text-lg" />
                {sidebarOpen && <span>Employees</span>}
                {sidebarOpen && (
                  <i
                    className={`fa fa-angle-down ml-auto transition ${
                      employeeOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                {!sidebarOpen && <Tooltip text="Employees" />}
              </button>

              {employeeOpen && sidebarOpen && (
                <ul className="ml-10 mt-1 space-y-1 text-sm">
                  <li>
                    <NavLink
                      to="/employees"
                      className="block px-2 py-1 text-gray-600 hover:text-blue-600"
                    >
                      Employee List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/employee/leave"
                      className="block px-2 py-1 text-gray-600 hover:text-blue-600"
                    >
                      Leaves
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <SidebarLink
              to="/medicine-store"
              icon="cube"
              label="Medicine Store"
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink
              to="/settings"
              icon="cog"
              label="Settings"
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink
              to="/patient-queue"
              icon="users"
              label="Patient Queue"
              sidebarOpen={sidebarOpen}
            />
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

/* LINK */
const SidebarLink = ({
  to,
  icon,
  label,
  sidebarOpen,
}: {
  to: string;
  icon: string;
  label: string;
  sidebarOpen: boolean;
}) => (
  <li>
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-3 text-sm transition
        ${
          isActive
            ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <i className={`fa fa-${icon} text-lg`} />
      {sidebarOpen && <span>{label}</span>}
      {!sidebarOpen && <Tooltip text={label} />}
    </NavLink>
  </li>
);

/* TOOLTIP */
const Tooltip = ({ text }: { text: string }) => (
  <span
    className="absolute left-16 top-1/2 -translate-y-1/2
    bg-gray-900 text-white text-xs px-2 py-1 rounded
    opacity-0 group-hover:opacity-100 transition
    whitespace-nowrap z-50"
  >
    {text}
  </span>
);
