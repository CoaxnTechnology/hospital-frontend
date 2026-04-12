const BASE_URL = import.meta.env.VITE_BASE_URL;
const API = `${BASE_URL}/api/services`;
const getToken = () => localStorage.getItem("token");

// 🔥 GET ALL
export const getServices = async () => {
  const res = await fetch(API);
  return res.json();
};

// 🔥 ADD
export const addService = async (data: any) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🔥 UPDATE
export const updateService = async (id: number, data: any) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🔥 DELETE
export const deleteService = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
