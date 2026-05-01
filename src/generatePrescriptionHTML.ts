const BASE_URL = import.meta.env.VITE_BASE_URL;
export const generatePrescriptionHTML = (data: any) => {
  const {
    hospital,
    patient,
    doctor,
    medicines,
    date,
    prescriptionId,
    diagnosis,
  } = data;

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
      }

      .container {
        width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      /* HEADER */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }

      .left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        width: 70px;
        height: auto;
      }

      .hospital {
        font-size: 20px;
        font-weight: bold;
      }

      .right {
        text-align: right;
        font-size: 13px;
      }

      /* PATIENT */
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

      /* RX */
      .rx {
        font-size: 28px;
        font-weight: bold;
        margin: 20px 0 10px 0;
      }

      /* DIAGNOSIS */
      .diagnosis {
        margin-top: 10px;
        padding: 10px;
        background: #fff7e6;
        border-left: 4px solid #ff9800;
        font-size: 14px;
      }

      /* TABLE */
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin-top: 20px;
      }

      th, td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
        text-align: left;
        word-wrap: break-word;
      }

      th {
        border-bottom: 2px solid #000;
      }

      th:nth-child(1), td:nth-child(1) { width: 20%; }
      th:nth-child(2), td:nth-child(2) { width: 10%; }
      th:nth-child(3), td:nth-child(3) { width: 15%; }
      th:nth-child(4), td:nth-child(4) { width: 15%; }
      th:nth-child(5), td:nth-child(5) { width: 15%; }
      th:nth-child(6), td:nth-child(6) { width: 25%; }

      /* FOOTER */
      .footer {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
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

    <div class="container">

      <!-- HEADER -->
      <div class="header">
        <div class="left">
          ${
            logo
              ? `<img src="${logo}" class="logo" crossorigin="anonymous" />`
              : ""
          }
          <div>
            <div class="hospital">${hospital?.name || ""}</div>
            <div>${(hospital?.address || "").replace(/\n/g, "<br/>")}</div>
          </div>
        </div>

        <div class="right">
          <div><b>ID:</b> ${prescriptionId || "-"}</div>
          <div><b>Date:</b> ${date}</div>
        </div>
      </div>

      <!-- PATIENT -->
      <div class="patient-box">
        <div class="row">
          <div><b>Patient:</b> ${patient?.name || "-"}</div>
          <div><b>PATIENT-ID:</b> ${patient?.id || "-"}</div>
        </div>
        <div class="row">
          <div><b>Age:</b> ${patient?.age || "-"}</div>
          <div><b>Mobile:</b> ${patient?.mobile || "-"}</div>
        </div>
        <div class="row">
          <div><b>Doctor:</b> ${doctor?.name || "-"}</div>
          <div><b>Dept:</b> ${doctor?.department || "-"}</div>
        </div>
      </div>

      <!-- RX -->
      <div class="rx">℞</div>

      <!-- DIAGNOSIS -->
      <div class="diagnosis">
  <b>Diagnosis:</b><br/>
  ${(diagnosis || "-").replace(/\n/g, "<br/>")}
</div>

      <!-- MEDICINE TABLE -->
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Timing</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Instruction</th>
          </tr>
        </thead>

        <tbody>
          ${(medicines || [])
            .map(
              (m: any) => `
              <tr>
                <td><b>${m?.name}</b></td>
                <td>${m?.dosage || "-"}</td>
                <td>${m?.timing || "-"}</td>
                <td>${m?.frequency || "-"}</td>
                <td>${m?.duration || "-"}</td>
                <td>${m?.instruction || "-"}</td>
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
          <img src="${signature}" crossorigin="anonymous" />
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
