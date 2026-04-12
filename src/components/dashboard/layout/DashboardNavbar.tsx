import { useState } from "react";
import user from "../../../assets/icons/user-06.jpg";
import { useNavigate } from "react-router-dom";
type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const DashboardNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#009efb] z-50 transition-all duration-300
      ${sidebarOpen ? "left-64" : "left-16"}`}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* LEFT */}
        <button
          onClick={toggleSidebar}
          className="text-white text-xl hover:text-gray-200"
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* RIGHT */}
        <ul className="flex items-center gap-6 text-white">
          <li className="relative">
            <i className="fa fa-bell-o text-lg"></i>
            <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
              3
            </span>
          </li>

          <li className="relative">
            <i className="fa fa-comment-o text-lg"></i>
            <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
              8
            </span>
          </li>

          <li className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2"
            >
              <img src={user} className="w-7 h-7 rounded-full border" />
              <span className="hidden md:block">Admin</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-4 w-44 bg-white text-black shadow rounded">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default DashboardNavbar;
