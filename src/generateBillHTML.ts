export const generateBillHTML = (data: any) => {
  const { hospital, patient, doctor, items, summary, invoice } = data;

  return `
  <html>
  <head>
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial;
        padding: 20px;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 26px;
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 14px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
      }

      th {
        background: #f5f5f5;
      }

      .total {
        margin-top: 20px;
        text-align: right;
      }

      .total p {
        margin: 5px 0;
      }

      .final {
        font-size: 18px;
        font-weight: bold;
      }
    </style>
  </head>

  <body>

    <div class="header">
      <h1>${hospital.name}</h1>
      <p>${hospital.address}</p>
      <hr/>
    </div>

    <div class="info">
      <div>
        <p><b>Patient:</b> ${patient.name}</p>
        <p><b>Mobile:</b> ${patient.mobile || "-"}</p>
      </div>

      <div>
        <p><b>Doctor:</b> ${doctor.name}</p>
        <p><b>Invoice:</b> ${invoice}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Qty</th>
          <th>Price</th>
          <th>GST</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        ${items
          .map(
            (i: any) => `
          <tr>
            <td>${i.name}</td>
            <td>${i.qty}</td>
            <td>₹${i.price}</td>
            <td>${i.gst}%</td>
            <td>₹${i.total}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="total">
      <p>Subtotal: ₹${summary.subtotal}</p>
      <p>GST: ₹${summary.gst}</p>
      <p class="final">Total: ₹${summary.total}</p>
    </div>

  </body>
  </html>
  `;
};