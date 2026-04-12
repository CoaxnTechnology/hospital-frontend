const BASE_URL = import.meta.env.VITE_BASE_URL;

const API = `${BASE_URL}/api/departments`;
const API2 = `${BASE_URL}/api/departments/home`;

const getToken = () => localStorage.getItem("token");

/* =========================
GET ALL (ADMIN)
========================= */
export const getDepartments = async () => {
  const res = await fetch(API, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });
  return res.json();
};

/* =========================
GET SINGLE
========================= */
export const getDepartment = async (id: string) => {
  const res = await fetch(`${API}/${id}`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });
  return res.json();
};

/* =========================
ADD
========================= */
export const addDepartment = async (data: any) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* =========================
UPDATE
========================= */
export const updateDepartment = async (id: string, data: any) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* =========================
DELETE
========================= */
export const deleteDepartment = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return res.json();
};

/* =====================
SECTION API
===================== */

// GET SECTION
export const getSection = async (key: string) => {
  const res = await fetch(`${API}/section/${key}`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return res.json();
};

// SAVE SECTION
export const saveSection = async (key: string, data: any) => {
  const res = await fetch(`${API}/section/${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// DELETE SECTION
export const deleteSection = async (key: string) => {
  const res = await fetch(`${API}/section/${key}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  return res.json();
};

/* =====================
HOME DATA
===================== */
export const getHomeData = async () => {
  const res = await fetch(`${API}/home`);
  return res.json();
};