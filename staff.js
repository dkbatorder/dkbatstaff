import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDq6rMjZ0CeydCkWmQFLVmw6fes__Dy_RI",
  authDomain: "dkbat-orders.firebaseapp.com",
  databaseURL: "https://dkbat-orders-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dkbat-orders",
  storageBucket: "dkbat-orders.firebasestorage.app",
  messagingSenderId: "208034554527",
  appId: "1:208034554527:web:97ce73e6f8cc786ae878aa",
  measurementId: "G-HHQ00E03VV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const bookingsContainer = document.getElementById("bookings");

onValue(ref(db, "bookings"), (snapshot) => {
  bookingsContainer.innerHTML = "";
  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.keys(data).forEach((key) => {
      const b = data[key];
      const div = document.createElement("div");
      div.style = "background:#fff;color:#000;margin:10px;padding:10px;border-radius:8px;";
      div.innerHTML = `
        <b>${b.name}</b><br>
        ${b.service}<br>
        ${b.date} at ${b.time}<br>
        Status: ${b.status}
      `;
      bookingsContainer.appendChild(div);
    });
  } else {
    bookingsContainer.innerHTML = "<p>No bookings yet</p>";
  }
});
