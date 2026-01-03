import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  databaseURL: "https://dkbat-orders-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* 🔁 LOAD ORDERS */
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
        Status: <b>${o.status || "Pending"}</b><br><br>

        <button onclick="updateStatus('${id}','Started')">Start</button>
        <button onclick="updateStatus('${id}','Completed')"
          ${o.status === "Completed" ? "disabled" : ""}>
          Complete
        </button>
      </div>
    `;
  }
});

/* ✅ UPDATE STATUS */
window.updateStatus = function (id, status) {
  update(ref(db, "orders/" + id), { status }).then(() => {
    if (status === "Completed") {
      openWhatsApp(id);
    }
  });
};

/* 📲 WHATSAPP (NO NUMBER) */
function openWhatsApp(orderId) {
  get(ref(db, "orders/" + orderId)).then(snapshot => {
    const o = snapshot.val();
    if (!o) return;

    const invoiceLink =
      "https://yourdomain.com/invoice.html?id=" + orderId;

    const message =
`🧾 *DKBat Massage Invoice*

👤 Name: ${o.name}
💆 Service: ${o.service}
📌 Status: ${o.status}

🔗 Invoice:
${invoiceLink}

Thank you 🙏`;

    const waUrl =
      "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(waUrl, "_blank");
  });
}
