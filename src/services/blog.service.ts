const BASE_URL = import.meta.env.VITE_BASE_URL;
const API = `${BASE_URL}/api/blogs`;

const getToken = () => localStorage.getItem("token");

// 🔥 GET ALL
export const getBlogs = async () => {
  const res = await fetch(API);
  return res.json();
};

// 🔥 GET SINGLE
export const getBlog = async (id: string) => {
  const res = await fetch(`${API}/${id}`);
  return res.json();
};

// 🔥 ADD (FormData)
export const addBlog = async (data: FormData) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ only token
    },
    body: data, // ✅ FormData
  });

  return res.json();
};

// 🔥 UPDATE (FormData)
export const updateBlog = async (id: string, data: FormData) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ only token
    },
    body: data, // ✅ FormData
  });

  return res.json();
};

// 🔥 DELETE
export const deleteBlog = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};