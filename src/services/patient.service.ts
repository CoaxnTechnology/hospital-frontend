const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/patients`;

const getToken = () => localStorage.getItem("token");

/* =========================
   GET ALL PATIENTS
========================= */
export const getPatients = async (
  page = 1,
  limit = 10,
  search = "",
  doctor = "", // 👈 NEW
) => {
  const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${
    doctor ? `&doctor=${encodeURIComponent(doctor)}` : ""
  }`;

  const res = await fetch(`${API_URL}${query}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};

/* =========================
   GET SINGLE PATIENT
========================= */
export const getPatientById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};

/* =========================
   GET PATIENT HISTORY
========================= */
export const getPatientHistory = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}/history`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};
