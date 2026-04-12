const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/employees`;

const getToken = () => localStorage.getItem("token");

/* =========================
   GET ALL EMPLOYEES
========================= */
export const getEmployees = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return await res.json();
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