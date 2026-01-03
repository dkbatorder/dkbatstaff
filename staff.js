import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://dkbat-orders-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ordersRef = ref(db, "orders");

onValue(ordersRef, (snapshot) => {
  const data = snapshot.val() || {};
  document.getElementById("orders").innerHTML = "";

  for (let id in data) {
    const o = data[id];

    document.getElementById("orders").innerHTML += `
      <div class="card">
        <b>${o.name || "-"}</b><br>
        Service: ${o.service || "-"}<br>
        Status: <b>${o.status || "Pending"}</b><br>

        <button onclick="updateStatus('${id}','Started')">Start</button>
        <button onclick="updateStatus('${id}','Completed')"
          ${o.status === "Completed" ? "disabled" : ""}>
          Complete
        </button>
      </div>
    `;
  }
});

window.updateStatus = function (id, status) {
  update(ref(db, "orders/" + id), { status }).then(() => {
    if (status === "Completed") {
      sendWhatsApp(id);
    }
  });
};

function sendWhatsApp(orderId) {
  get(ref(db, "orders/" + orderId)).then(snapshot => {
    const o = snapshot.val();
    if (!o || !o.phone) {
      alert("Customer phone missing");
      return;
    }

    const invoiceLink =
      `https://yourdomain.com/invoice.html?id=${orderId}`;

    const message = `
🧾 *DKBat Massage Invoice*

👤 Name: ${o.name}
💆 Service: ${o.service}
📌 Status: ${o.status}

🔗 Invoice:
${invoiceLink}

Thank you 🙏
`;

    const waUrl =
      `https://wa.me/${o.phone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
  });
}
