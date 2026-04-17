const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/leaves`;

const getToken = () => localStorage.getItem("token");

/* ========================
GET MY LEAVES
======================== */
export const getMyLeaves = async () => {
  const res = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
};

/* ========================
GET ALL LEAVES (ADMIN)
======================== */
export const getAllLeaves = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
};

/* ========================
CREATE LEAVE
======================== */
export const createLeave = async (data: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};

/* ========================
UPDATE LEAVE STATUS
======================== */
export const updateLeaveStatus = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};

/* ========================
🔔 GET NOTIFICATION COUNT (ADMIN)
======================== */
export const getLeaveNotificationCount = async () => {
  const res = await fetch(`${API_URL}/notification-count`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
};

/* ========================
👁️ MARK LEAVES AS SEEN (ADMIN)
======================== */
export const markLeavesAsSeen = async () => {
  const res = await fetch(`${API_URL}/mark-seen`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
};