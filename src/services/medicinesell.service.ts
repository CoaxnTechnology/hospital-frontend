import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API = `${BASE_URL}/api/sales`;

const getToken = () => localStorage.getItem("token");

/* =========================
CREATE SALE / GENERATE BILL
========================= */
export const createSale = async (data: any) => {
  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

/* =========================
GET SALE BY INVOICE
========================= */
export const getSaleByInvoice = async (invoice: string) => {
  const res = await axios.get(`${API}/invoice/${invoice}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data.items;
};