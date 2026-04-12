import axios from "axios";

/* =========================
BASE URL FROM ENV
========================= */
const BASE_URL = import.meta.env.VITE_BASE_URL;

/* =========================
AXIOS INSTANCE
========================= */
const API = axios.create({
  baseURL: `${BASE_URL}/api/medicine`,
});

/* =========================
ADD TOKEN AUTOMATICALLY
========================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
GET ALL MEDICINES
========================= */
export const getMedicines = async () => {
  const res = await API.get("/");
  return res.data;
};

/* =========================
GET SINGLE MEDICINE
========================= */
export const getMedicineById = async (id: number) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

/* =========================
CREATE MEDICINE
========================= */
export const createMedicine = async (data: any) => {
  const res = await API.post("/", data);
  return res.data;
};

/* =========================
UPDATE MEDICINE
========================= */
export const updateMedicine = async (id: number, data: any) => {
  const res = await API.put(`/${id}`, data);
  return res.data;
};

/* =========================
DELETE MEDICINE
========================= */
export const deleteMedicine = async (id: number) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

/* =========================
SEARCH MEDICINE
========================= */
export const searchMedicine = async (key: string) => {
  const res = await API.get(`/search?key=${key}`);
  return res.data;
};

/* =========================
SELL MEDICINE
========================= */
export const sellMedicine = async (data: any) => {
  const res = await API.post(`/sell`, data);
  return res.data;
};

/* =========================
RETURN MEDICINE
========================= */
export const returnMedicine = async (data: any) => {
  const res = await API.post(`/return`, data);
  return res.data;
};

/* =========================
LOW STOCK
========================= */
export const getLowStock = async () => {
  const res = await API.get(`/low-stock`);
  return res.data;
};

/* =========================
EXPIRING MEDICINES
========================= */
export const getExpiringSoon = async () => {
  const res = await API.get(`/expiring`);
  return res.data;
};

/* =========================
STOCK VALUE
========================= */
export const getStockValue = async () => {
  const res = await API.get(`/stock-value`);
  return res.data;
};

/* =========================
UPLOAD EXCEL
========================= */
export const uploadMedicineExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post(`/upload-excel`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};