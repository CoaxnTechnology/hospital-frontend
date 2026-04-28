 const BASE_URL = import.meta.env.VITE_BASE_URL;
const API = `${BASE_URL}/api/dashboard`;
console.log("BASE_URL:", BASE_URL);
/* GET DASHBOARD DATA */
export const getDashboardData = async (startDate: string, endDate: string) => {
  const res = await fetch(`${API}?startDate=${startDate}&endDate=${endDate}`);

  const data = await res.json();

  // 🔥 SAFE RETURN
  return data?.data || data;
};
