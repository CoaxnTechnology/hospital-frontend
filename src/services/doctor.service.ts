const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/doctors`;

const getToken = () => localStorage.getItem("token");

/* =========================
GET ALL DOCTORS
========================= */
export const getDoctors = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

/* =========================
GET SINGLE DOCTOR
========================= */
export const getDoctorById = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

/* =========================
CREATE DOCTOR
========================= */
export const createDoctor = async (formData: FormData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ only token
    },
    body: formData, // ✅ IMPORTANT
  });

  return res.json();
};

/* =========================
UPDATE DOCTOR (FormData)
========================= */
export const updateDoctor = async (id: string, data: FormData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ only token
    },
    body: data, // ✅ FormData (no content-type)
  });

  return res.json();
};

/* =========================
DELETE DOCTOR
========================= */
export const deleteDoctor = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

/* =========================
GET DOCTORS BY DEPARTMENT
========================= */
export const getDoctorsByDepartment = async (department: string) => {
  const res = await fetch(
    `${API_URL}/department/${encodeURIComponent(department)}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return res.json();
};
/* =========================
GET PRIVATE DOCTORS (ROLE BASED)
========================= */
export const getPrivateDoctors = async (page = 1, limit = 10, search = "") => {
  const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

  const res = await fetch(`${API_URL}/private${query}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
