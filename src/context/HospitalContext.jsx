import { createContext, useContext, useEffect, useState } from "react";
import { getHospital } from "../services/setting.service"; // adjust path

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await getHospital();
        setHospital(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, []);

  return (
    <HospitalContext.Provider value={{ hospital, loading }}>
      {children}
    </HospitalContext.Provider>
  );
};

// custom hook (easy use)
export const useHospital = () => useContext(HospitalContext);