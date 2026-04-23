const BASE_URL = import.meta.env.VITE_BASE_URL;

export const generateBillHTML = (data: any) => {
  const { hospital, patient, doctor, items, summary, invoice } = data;

  const logoUrl = hospital?.logo ? `${BASE_URL}${hospital.logo}` : "";
  return `
  <html>
  <head>
    <title>Invoice</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial;
        padding: 20px;
        color: #333;
      }

      .invoice-box {
        max-width: 800px;
        margin: auto;
        border: 1px solid #eee;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }

      .hospital-info {
        text-align: right;
      }

      .hospital-info h1 {
        margin: 0;
        font-size: 22px;
      }

      .logo {
        width: 80px;
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .info div {
        font-size: 14px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        background: #f4f6f8;
        padding: 10px;
        text-align: left;
        border-bottom: 2px solid #ddd;
      }

      td {
        padding: 10px;
        border-bottom: 1px solid #eee;
      }

      .right {
        text-align: right;
      }

      .summary {
        margin-top: 20px;
        width: 300px;
        float: right;
      }

      .summary p {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
      }

      .total {
        font-weight: bold;
        font-size: 16px;
        border-top: 2px solid #000;
        padding-top: 5px;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }

    </style>
  </head>

  <body>
    <div class="invoice-box">

      <!-- HEADER -->
      <div class="header">
        <div>
          ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ""}
        </div>

        <div class="hospital-info">
          <h1>${hospital.name}</h1>
          <p>${hospital.address.replace(/\n/g, "<br/>")}</p>
          <p>${hospital.phone || ""}</p>
          <p>${hospital.email || ""}</p>
        </div>
      </div>

      <!-- INFO -->
      <div class="info">
        <div>
          <p><b>Patient:</b> ${patient.name}</p>
          <p><b>Mobile:</b> ${patient.mobile || "-"}</p>
        </div>

        <div>
          <p><b>Doctor:</b> ${doctor.name}</p>
          <p><b>Invoice:</b> ${invoice}</p>
          <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th class="right">Qty</th>
            <th class="right">Price</th>
            <th class="right">GST</th>
            <th class="right">Total</th>
          </tr>
        </thead>

        <tbody>
          ${items
            .map(
              (i: any) => `
            <tr>
              <td>${i.name}</td>
              <td class="right">${i.qty}</td>
              <td class="right">₹${Number(i.price).toFixed(2)}</td>
              <td class="right">${i.gst}%</td>
              <td class="right">₹${Number(i.total).toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <!-- SUMMARY -->
      <div class="summary">
        <p><span>Subtotal:</span> <span>₹${summary.subtotal.toFixed(2)}</span></p>
        <p><span>GST:</span> <span>₹${summary.gst.toFixed(2)}</span></p>
        <p class="total">
          <span>Total:</span> <span>₹${summary.total.toFixed(2)}</span>
        </p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p>Thank you for visiting ${hospital.name}</p>
      </div>

    </div>
  </body>
  </html>
  `;
};
