const BASE_URL = import.meta.env.VITE_BASE_URL;

const DOCTOR_API = `${BASE_URL}/api/doctors`;
const COMMON_API = `${BASE_URL}/api`;
/**
 * =========================
 * GET TOKEN
 * =========================
 */
const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("🔑 TOKEN:", token);
  return token;
};

/**
 * =========================
 * ADD DOCTOR SCHEDULE
 * =========================
 */
export const addDoctorSchedule = async (data) => {
  try {
    console.log("📤 addDoctorSchedule PAYLOAD:", data);

    const res = await fetch(`${DOCTOR_API}/addschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    console.log("📥 STATUS:", res.status);

    return res.json();
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

/**
 * =========================
 * GET MY SCHEDULE
 * =========================
 */
export const getMySchedule = async () => {
  try {
    const res = await fetch(`${DOCTOR_API}/schedule`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.json();
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

/**
 * =========================
 * ADD BRAND
 * =========================
 */
export const addBrand = async (name) => {
  const res = await fetch(`${COMMON_API}/brand`, {
    // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};

/**
 * =========================
 * GET BRANDS
 * =========================
 */
export const getBrands = async () => {
  const res = await fetch(`${COMMON_API}/brand`); // ✅ FIXED
  return res.json();
};
export const updateBrand = async (id, name) => {
  const res = await fetch(`${COMMON_API}/brand/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};

/**
 * =========================
 * DELETE BRAND
 * =========================
 */
export const deleteBrand = async (id) => {
  const res = await fetch(`${COMMON_API}/brand/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
/**
 * DOSAGE FORM APIs
 */

export const addDosage = async (name) => {
  const res = await fetch(`${COMMON_API}/dosage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};

export const getDosage = async () => {
  const res = await fetch(`${COMMON_API}/dosage`);
  return res.json();
};

export const updateDosage = async (id, name) => {
  const res = await fetch(`${COMMON_API}/dosage/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
};

export const deleteDosage = async (id) => {
  const res = await fetch(`${COMMON_API}/dosage/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
export const addStrength = async (name) => {
  const res = await fetch(`${COMMON_API}/strength`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const getStrength = async () => {
  const res = await fetch(`${COMMON_API}/strength`);
  return res.json();
};

export const updateStrength = async (id, name) => {
  const res = await fetch(`${COMMON_API}/strength/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteStrength = async (id) => {
  const res = await fetch(`${COMMON_API}/strength/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
export const addSupplier = async (data) => {
  const res = await fetch(`${COMMON_API}/supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getSupplier = async () => {
  const res = await fetch(`${COMMON_API}/supplier`);
  return res.json();
};

export const updateSupplier = async (id, data) => {
  const res = await fetch(`${COMMON_API}/supplier/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteSupplier = async (id) => {
  const res = await fetch(`${COMMON_API}/supplier/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
export const addCategory = async (name) => {
  const res = await fetch(`${COMMON_API}/category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const getCategory = async () => {
  const res = await fetch(`${COMMON_API}/category`);
  return res.json();
};

export const updateCategory = async (id, name) => {
  const res = await fetch(`${COMMON_API}/category/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${COMMON_API}/category/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
export const getHospital = async () => {
  const res = await fetch(`${COMMON_API}/hospital`);
  return res.json();
};

export const saveHospital = async (formData) => {
  const res = await fetch(`${COMMON_API}/hospital`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};
/**
 * =========================
 * DOCTOR SIGNATURE
 * =========================
 */

export const uploadSignature = async (formData) => {
  const res = await fetch(`${DOCTOR_API}/signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`, // 🔥 important
    },
    body: formData,
  });

  return res.json();
};
/**
 * =========================
 * GET SIGNATURE
 * =========================
 */
export const getSignature = async () => {
  try {
    const res = await fetch(`${DOCTOR_API}/signature`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.json();
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};
const HERO_API = `${BASE_URL}/api/hero`;
/**
 * =========================
 * GET HERO
 * =========================
 */
export const getHero = async () => {
  const res = await fetch(HERO_API);
  return res.json();
};

/**
 * =========================
 * ADD HERO
 * =========================
 */
export const addHero = async (formData: FormData) => {
  const res = await fetch(HERO_API, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

/**
 * =========================
 * UPDATE HERO
 * =========================
 */
export const updateHero = async (id: number, formData: FormData) => {
  const res = await fetch(`${HERO_API}/${id}`, {
    method: "PUT",
    body: formData,
  });

  return res.json();
};

/**
 * =========================
 * DELETE HERO
 * =========================
 */
export const deleteHero = async (id: number) => {
  const res = await fetch(`${HERO_API}/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
