import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/icons/logo.png";

type Props = {
  sidebarOpen: boolean;
  closeSidebar: () => void;
};

const Sidebar = ({ sidebarOpen, closeSidebar }: Props) => {
  const [employeeOpen, setEmployeeOpen] = useState(false);
  //  const [payrollOpen, setPayrollOpen] = useState(false); // 🔥 NEW

  const linkBase =
    "group relative flex items-center gap-3 px-4 py-3 text-sm transition";
  const linkText = "text-gray-600 group-hover:text-blue-600";

  return (
    <>
      {/* 🌑 MOBILE OVERLAY */}
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
        {/* HEADER */}
        <div className="h-16 flex items-center gap-3 px-4 bg-[#009efb]">
          <img src={logo} className="w-8 h-8" />
          <span
            className={`text-white font-semibold text-lg transition-all
            ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            Preclinic
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

            <SidebarLink
              to="/dashboard/doctors"
              icon="user-md"
              label="Doctors"
              sidebarOpen={sidebarOpen}
            />

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
            <SidebarLink
              to="/consultant"
              icon="stethoscope"
              label="Consultant"
              sidebarOpen={sidebarOpen}
            />

            <SidebarLink
              to="/departments"
              icon="building"
              label="Departments"
              sidebarOpen={sidebarOpen}
            />

            {/* 👥 EMPLOYEES SUBMENU */}
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

            {/* 💰 PAYROLL SUBMENU (NEW)
            <li>
              <button
                onClick={() => setPayrollOpen(!payrollOpen)}
                className={`${linkBase} w-full ${linkText}`}
              >
                <i className="fa fa-book text-lg" />
                {sidebarOpen && <span>Payroll</span>}
                {sidebarOpen && (
                  <i
                    className={`fa fa-angle-down ml-auto transition ${
                      payrollOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                {!sidebarOpen && <Tooltip text="Payroll" />}
              </button>

              {payrollOpen && sidebarOpen && (
                <ul className="ml-10 mt-1 space-y-1 text-sm">
                  <li>
                    <NavLink
                      to="/employee/payslip"
                      className="block px-2 py-1 text-gray-600 hover:text-blue-600"
                    >
                      Employee Salary
                    </NavLink>
                  </li>
                </ul>
              )}
            </li> */}
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

/* ---------------- SIDEBAR LINK ---------------- */

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

/* ---------------- TOOLTIP ---------------- */

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
