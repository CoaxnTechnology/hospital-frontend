const BASE_URL = import.meta.env.VITE_BASE_URL;

/* =========================
LOGIN USER
========================= */
export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  console.log("Sending login request:", data);

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log("Login response:", result);

  return result;
};