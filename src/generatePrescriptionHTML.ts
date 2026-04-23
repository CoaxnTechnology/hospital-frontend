const BASE_URL = import.meta.env.VITE_BASE_URL;

export const generatePrescriptionHTML = (data: any) => {
  const { hospital, patient, doctor, medicines, date, prescriptionId } = data;

  const logo = hospital?.logo ? `${BASE_URL}${hospital.logo}` : "";

  const signature = doctor?.signature
    ? `${BASE_URL}${doctor.signature}`
    : `${BASE_URL}/uploads/static/default-signature.png`;

  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial;
        margin: 0;
        padding: 0;
        position: relative;
      }

      .watermark {
        position: fixed;
        top: 30%;
        left: 20%;
        opacity: 0.05;
        z-index: 0;
      }

      .watermark img {
        width: 400px;
      }

      .left-strip {
        position: fixed;
        left: 0;
        top: 0;
        width: 10px;
        height: 100%;
        background: linear-gradient(to bottom, #6a11cb, #2575fc);
      }

.container {
  width: 800px;   /* 👈 ADD THIS */
  margin: 0 auto; /* 👈 CENTER */
  padding: 20px;
}
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
         align-items: flex-start;
      }

      .left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo img {
        width: 70px;
      }

      .hospital {
        font-size: 22px;
        font-weight: bold;
        color: #333;
      }

      .right {
        text-align: right;
        font-size: 12px;
      }

      /* 🔥 IMPORTANT FIX */
      .right div {
        white-space: nowrap;
      }


      .patient-box {
        margin-top: 15px;
        border: 1px solid #ccc;
        padding: 12px;
        background: #f9f9f9;
        border-radius: 5px;
        font-size: 13px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }

      .rx {
        font-size: 28px;
        font-weight: bold;
       margin: 20px 0 10px 0;

      }

      /* 🔥 TABLE DESIGN */
.medicine-table {
  width: 100%;
  margin: 20px auto;
}
      .medicine-table th {
        border-bottom: 2px solid #000;
        padding: 8px;
        text-align: left;
        font-size: 14px;
      }

      .medicine-table td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
      }

     .medicine-table th:nth-child(1),
.medicine-table td:nth-child(1) {
  width: 50%;
}

.medicine-table th:nth-child(2),
.medicine-table td:nth-child(2) {
  width: 25%;
  text-align: center;
}

.medicine-table th:nth-child(3),
.medicine-table td:nth-child(3) {
  width: 25%;
  text-align: center;
}

      .footer {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
      }

      .signature img {
        width: 120px;
      }

      .note {
        font-size: 12px;
        color: #555;
      }
    </style>
  </head>

  <body>

    <!-- WATERMARK -->
    ${
      logo
        ? `<div class="watermark">
            <img src="${logo}" />
          </div>`
        : ""
    }

    <!-- LEFT STRIP -->
    <div class="left-strip"></div>

    <div class="container">

      <!-- HEADER -->
      <div class="header">
        <div class="left">
          <div class="logo">
            ${logo ? `<img src="${logo}" />` : ""}
          </div>
          <div>
            <div class="hospital">${hospital?.name || "Hospital"}</div>
            <div>${(hospital?.address || "").replace(/\n/g, "<br/>")}</div>
          </div>
        </div>

        <div class="right">
          <div><b>Prescription ID:</b> ${prescriptionId || "-"}</div>
          <div><b>Date:</b> ${date}</div>
        </div>
      </div>

      <!-- PATIENT DETAILS -->
      <div class="patient-box">
        <div class="row">
          <div><b>Patient:</b> ${patient?.name || "N/A"}</div>
          <div><b>ID:</b> ${patient?.id || "N/A"}</div>
        </div>

        <div class="row">
          <div><b>Age:</b> ${patient?.age || "-"}</div>
          <div><b>Mobile:</b> ${patient?.mobile || "-"}</div>
        </div>

        <div class="row">
          <div><b>Doctor:</b> ${doctor?.name || "N/A"}</div>
          <div><b>Department:</b> ${doctor?.department || "General"}</div>
        </div>
      </div>

      <!-- RX -->
      <div class="rx">℞</div>

      <!-- 🔥 MEDICINE TABLE -->
      <table class="medicine-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          ${(medicines || [])
            .map(
              (m: any) => `
              <tr>
                <td><b>${m?.name}</b></td>
                <td>${m?.dosage}</td>
                <td>${m?.duration}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>

      <!-- FOOTER -->
      <div class="footer">
        <div class="signature">
          <p><b>Doctor Signature</b></p>
          <img src="${signature}" />
        </div>

        <div class="note">
          This is computer generated prescription
        </div>
      </div>

    </div>

  </body>
  </html>
  `;
};
