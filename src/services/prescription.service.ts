const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/prescription`;

const getToken = () => localStorage.getItem("token");

/**
 * CREATE PRESCRIPTION
 */
export const createPrescription = async (data: any) => {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/**
 * GET BY APPOINTMENT
 */
export const getPrescriptionByAppointment = async (appointmentId: number) => {
  const res = await fetch(`${API_URL}/${appointmentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

/**
 * 🔥 VIEW / DOWNLOAD PDF (Cloudinary)
 */
export const openPrescriptionPDF = (pdfUrl: string) => {
  if (!pdfUrl) {
    alert("PDF not available");
    return;
  }

  window.open(pdfUrl, "_blank"); // ✅ direct open
};

/**
 * 🔥 FORCE DOWNLOAD
 */
export const downloadPrescriptionPDF = (pdfUrl: string) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "prescription.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * GET MEDICINES
 */
export const getPrescriptionMedicines = async (prescriptionId: number) => {
  const res = await fetch(`${API_URL}/${prescriptionId}/medicines`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

/**
 * GET BY ID
 */
export const getPrescriptionById = async (id: number) => {
  const res = await fetch(`${API_URL}/by-id/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};