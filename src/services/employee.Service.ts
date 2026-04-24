// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/employees`;

const getToken = () => localStorage.getItem("token");

/* =========================
   GET ALL EMPLOYEES
========================= */
export const getEmployees = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  console.log("👉 API CALL:", { page, limit, search });

  const res = await fetch(
    `${API_URL}?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  const data = await res.json();

  console.log("👉 RESPONSE:", data);

  return data;
};
/* =========================
   GET SINGLE EMPLOYEE
========================= */
export const getEmployeeById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};

/* =========================
   DELETE EMPLOYEE
========================= */
export const deleteEmployee = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};

/* =========================
   CREATE EMPLOYEE
========================= */
export const createEmployee = async (data: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

/* =========================
   UPDATE EMPLOYEE
========================= */
export const updateEmployee = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};
/* =========================
   RESEND RESET LINK
========================= */
export const resendResetLink = async (email: string) => {
  const res = await fetch(`${API_URL}/resend-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ email }),
  });

  return await res.json();
};
/* =========================
   GET MY PROFILE
========================= */
export const getMyProfile = async () => {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
};
