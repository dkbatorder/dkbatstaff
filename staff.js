import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

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
const bookingsDiv = document.getElementById("bookings");

// Store timers
let activeTimers = {};

function startTimer(id, timerDisplay) {
  let seconds = 0;
  timerDisplay.textContent = "00:00";

  activeTimers[id] = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer(id) {
  clearInterval(activeTimers[id]);
  delete activeTimers[id];
}

const bookingsRef = query(ref(db, "bookings"), limitToLast(10));

onValue(bookingsRef, (snapshot) => {
  if (!snapshot.exists()) {
    bookingsDiv.textContent = "No bookings yet.";
    return;
  }

  bookingsDiv.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const id = childSnapshot.key;

    const div = document.createElement("div");
    div.className = "booking";

    const name = data.name || "N/A";
    const type = data.type || "N/A";
    const date = data.date || "N/A";
    const time = data.time || "N/A";

    div.innerHTML = `
      <p><strong>${name}</strong></p>
      <p>${type}</p>
      <p>${date} at ${time}</p>
      <div class="timer" id="timer-${id}">00:00</div>
      <div class="buttons">
        <button id="start-${id}">Start</button>
        <button id="complete-${id}">Complete</button>
      </div>
    `;

    bookingsDiv.prepend(div);

    document.getElementById(`start-${id}`).addEventListener("click", () => {
      if (!activeTimers[id]) {
        const timerDisplay = document.getElementById(`timer-${id}`);
        startTimer(id, timerDisplay);
      }
    });

    document.getElementById(`complete-${id}`).addEventListener("click", () => {
      stopTimer(id);
      document.getElementById(`timer-${id}`).textContent = "Completed ✅";
    });
  });
});
