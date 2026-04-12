const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/patients`;

const getToken = () => localStorage.getItem("token");

/* =========================
   GET ALL PATIENTS
========================= */
export const getPatients = async () => {
  const res = await fetch(API_URL, {
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