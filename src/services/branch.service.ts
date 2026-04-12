const BASE_URL = import.meta.env.VITE_BASE_URL;
const API = `${BASE_URL}/branches`;

/* GET ALL */
export const getBranches = async () => {
  const res = await fetch(API);
  return res.json();
};

/* CREATE */
export const createBranch = async (data: any) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* UPDATE */
export const updateBranch = async (id: number, data: any) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* DELETE */
export const deleteBranch = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return res.json();
};