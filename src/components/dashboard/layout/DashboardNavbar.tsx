import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const DashboardNavbar = ({ sidebarOpen, toggleSidebar }: Props) => {
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  /* 🔥 GET USER FROM LOCALSTORAGE */
  useEffect(() => {
    const user = localStorage.getItem("user");

    console.log("LOCALSTORAGE USER RAW:", user);

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("PARSED USER:", parsedUser);

      setUserData(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const BASE_URL = "https://hospital.clinicalgynecologists.space";

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
        <div className="flex items-center gap-6 text-white">
          {/* 🔔 ONLY ONE NOTIFICATION */}
          <div className="relative">
            <i className="fa fa-bell-o text-lg"></i>
            <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
              3
            </span>
          </div>

          {/* 👤 USER PROFILE */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2"
            >
              <img
                src={
                  userData?.image
                    ? BASE_URL + userData.image
                    : `https://ui-avatars.com/api/?name=${userData?.name || "User"}&background=0D8ABC&color=fff&size=128`
                }
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${userData?.name || "User"}&background=0D8ABC&color=fff&size=128`;
                }}
              />

              <span className="hidden md:block">
                {userData?.name || "User"}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-44 bg-white text-black shadow rounded">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
