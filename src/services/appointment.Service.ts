const BASE_URL =import.meta.env.VITE_BASE_URL|| "http://localhost:5000";
const API_URL = `${BASE_URL}/api/appointments`;
const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("🔑 TOKEN:", token);
  return token;
};

/**
 * =========================
 * GET ALL APPOINTMENTS
 * =========================
 */
export const getAppointments = async (filter = "today", date?: string) => {
  let url = `${API_URL}?filter=${filter}`;

  if (filter === "custom" && date) {
    url += `&date=${date}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
/**
 * =========================
 * CREATE APPOINTMENT
 * =========================
 */
export const addAppointment = async (data: any) => {
  console.log("📤 addAppointment PAYLOAD:", data);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  console.log("📥 addAppointment STATUS:", res.status);

  const json = await res.json();
  console.log("📥 addAppointment RESPONSE:", json);

  return json;
};

/**
 * =========================
 * SEND TO CONSULTANT
 * =========================
 */
export const sendToConsultant = async (id: number) => {
  console.log("📤 sendToConsultant ID:", id);

  const res = await fetch(`${API_URL}/${id}/send-to-consultant`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  console.log("📥 sendToConsultant STATUS:", res.status);

  const json = await res.json();
  console.log("📥 sendToConsultant RESPONSE:", json);

  return json;
};

/**
 * =========================
 * DOCTOR DASHBOARD
 * =========================
 */
export const getDoctorAppointments = async () => {
  console.log("📡 getDoctorAppointments called");

  const res = await fetch(`${API_URL}/doctor/my`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const json = await res.json();
  console.log("📥 getDoctorAppointments RESPONSE:", json);

  return json;
};

/**
 * =========================
 * COMPLETE APPOINTMENT
 * =========================
 */

export const completeAppointment = async (data: any) => {
  console.log("📤 completeAppointment DATA:", data);

  const res = await fetch(`${API_URL}/${data.id}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  console.log("📥 completeAppointment STATUS:", res.status);

  const json = await res.json();
  console.log("📥 completeAppointment RESPONSE:", json);

  return json;
};

/**
 * =========================
 * CALL NEXT PATIENT
 * =========================
 */

export const nextPatient = async (data: any) => {
  console.log("📤 nextPatient DATA:", data);

  const res = await fetch(`${API_URL}/queue/next`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  console.log("📥 nextPatient RESPONSE:", json);

  return json;
};

/**
 * =========================
 * SKIP PATIENT
 * =========================
 */

export const skipPatient = async (data: {
  id: number;
  doctor_id: number;
  date: string;
}) => {
  console.log("📤 skipPatient DATA:", data);

  const res = await fetch(`${API_URL}/queue/skip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  console.log("📥 skipPatient RESPONSE:", json);

  return json;
};
/**
 * =========================
 * RECALL PATIENT
 * =========================
 */

export const recallPatient = async (id: number) => {
  console.log("📤 recallPatient ID:", id);

  const res = await fetch(`${API_URL}/queue/recall`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ id }),
  });

  const json = await res.json();

  console.log("📥 recallPatient RESPONSE:", json);

  return json;
};
/**
 * =========================
 * GET APPOINTMENTS (PAGINATED + SEARCH)
 * =========================
 */
export const getAppointmentsPaginated = async (
  page = 1,
  limit = 10,
  filter = "today",
  date?: string,
  search = ""
) => {
  let url = `${API_URL}/list?page=${page}&limit=${limit}&filter=${filter}&search=${encodeURIComponent(search)}`;

  if (filter === "custom" && date) {
    url += `&date=${date}`;
  }

  console.log("📡 getAppointmentsPaginated URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  console.log("📥 getAppointmentsPaginated STATUS:", res.status);

  const json = await res.json();

  console.log("📥 getAppointmentsPaginated RESPONSE:", json);

  return json;
};