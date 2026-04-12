const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { getBranches } from "../../services/branch.service";
import { getHospital } from "../../services/setting.service";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);

  const [branches, setBranches] = useState<any[]>([]);
  const [hospital, setHospital] = useState<any>(null);

  const hospitalRef = useRef<any>(null);
  const navigate = useNavigate();

  /* 🔥 SCROLL */
  const handleScroll = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  /* 🔥 LOAD BRANCHES */
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (err) {
        console.error("Error loading branches", err);
      }
    };

    loadBranches();
  }, []);

  /* 🔥 LOAD HOSPITAL */
  useEffect(() => {
    const loadHospital = async () => {
      try {
        const res = await getHospital();
        setHospital(res.data);
      } catch (err) {
        console.error("Error loading hospital", err);
      }
    };

    loadHospital();
  }, []);

  /* 🔥 CLOSE DROPDOWN */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (hospitalRef.current && !hospitalRef.current.contains(e.target)) {
        setHospitalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 🔥 LOGO + NAME */}
          <div
            className="flex items-center gap-4 cursor-pointer hover:scale-105 transition"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const section = document.getElementById("home"); // 👈 slider id
                section?.scrollIntoView({ behavior: "smooth" });
              }, 200);
            }}
          >
            <div className="h-16 w-16 flex items-center justify-center bg-white border rounded-2xl shadow-md p-1 overflow-hidden">
              <img
                src={hospital?.logo ? `${BASE_URL}${hospital.logo}` : logo}
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-gray-800">
                {hospital?.name || "Hospital"}
              </span>
              <span className="text-xs text-gray-500">Care & Trust</span>
            </div>
          </div>

          {/* 🔥 DESKTOP MENU */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8 font-medium text-gray-700">
              {/* 🔥 OUR HOSPITALS */}
              <li ref={hospitalRef} className="relative">
                <button
                  onClick={() => {
                    setHospitalOpen(!hospitalOpen);
                    setSpecialityOpen(false);
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Our Hospitals ▾
                </button>

                {hospitalOpen && (
                  <div className="absolute left-0 top-full mt-4 w-[650px] bg-white shadow-2xl rounded-2xl border z-50 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-blue-600 font-medium">
                      {branches.length === 0 ? (
                        <div className="text-gray-400">No branches found</div>
                      ) : (
                        branches.map((b) => (
                          <div
                            key={b.id}
                            className="cursor-pointer hover:text-blue-800 transition"
                            onClick={() => {
                              navigate(`/branch/${b.id}`);
                              setHospitalOpen(false);
                            }}
                          >
                            {b.city} - {b.area}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </li>

              {/* 🔥 DOCTORS */}
              <li
                onClick={() => handleScroll("doctors")}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                Doctors
              </li>

              {/* 🔥 SERVICES */}
              <li
                onClick={() => handleScroll("services")}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                Services
              </li>

              {/* 🔥 CONTACT */}
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition">
                  Contact Us
                </Link>
              </li>

              {/* 🔥 LOGIN */}
              <li>
                <Link to="/login" className="hover:text-blue-600 transition">
                  Log In
                </Link>
              </li>
            </ul>
          </nav>

          {/* 🔥 HOTLINE (CLICKABLE) */}
          <div className="hidden lg:block">
            <a
              href={`tel:${hospital?.phone}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow inline-block"
            >
              📞 HOT LINE - {hospital?.phone || "000000"}
            </a>
          </div>

          {/* 🔥 MOBILE BUTTON */}
          <button className="lg:hidden text-2xl" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>

        {/* 🔥 MOBILE MENU */}
        {open && (
          <div className="lg:hidden bg-white border-t">
            <ul className="flex flex-col space-y-3 p-4 font-medium text-gray-700">
              <li onClick={() => handleScroll("doctors")}>Doctors</li>
              <li onClick={() => handleScroll("services")}>Services</li>
              <li onClick={() => handleScroll("appointment")}>Appointment</li>

              <li>
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/login">Log In</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
