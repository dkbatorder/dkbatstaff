// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq6rMjZ0CeydCkWmQFLVmw6fes__Dy_RI",
  authDomain: "dkbat-orders.firebaseapp.com",
  databaseURL: "https://dkbat-orders-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dkbat-orders",
  storageBucket: "dkbat-orders.firebasestorage.app",
  messagingSenderId: "208034554527",
  appId: "1:208034554527:web:97ce73e6f8cc786ae878aa"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const bookingsList = document.getElementById("bookingsList");

// ✅ Listen for bookings in Realtime Database
const bookingsRef = ref(db, "bookings");
onValue(bookingsRef, (snapshot) => {
  // Visual debug line (since no console on mobile)
  bookingsList.innerHTML = "<p>Connected to Firebase...</p>";

  const data = snapshot.val();

  // If no data found
  if (!data) {
    bookingsList.innerHTML = "<p>Connected to Firebase, but no bookings found yet.</p>";
    return;
  }

  // Clear and show all bookings
  bookingsList.innerHTML = "";
  Object.entries(data).slice(-10).forEach(([id, booking]) => {
    const div = document.createElement("div");
    div.classList.add("booking");
    div.innerHTML = `
      <h3>${booking.name || "No Name"}</h3>
      <p>Type: ${booking.type || "Unknown"}</p>
      <p>Date: ${booking.date || "No Date"}</p>
      <p>Status: ${booking.status || "Pending"}</p>
      <div class="timer" id="timer-${id}">00:00</div>
      <button id="start-${id}">Start</button>
      <button id="complete-${id}" disabled>Complete</button>
    `;
    bookingsList.appendChild(div);

    // Timer logic
    let timerInterval;
    let seconds = 0;
    const timerDisplay = document.getElementById(`timer-${id}`);
    const startBtn = document.getElementById(`start-${id}`);
    const completeBtn = document.getElementById(`complete-${id}`);

    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      completeBtn.disabled = false;

      timerInterval = setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");
        timerDisplay.textContent = `${min}:${sec}`;
      }, 1000);
    });

    completeBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      update(ref(db, "bookings/" + id), {
        status: "completed",
        duration: timerDisplay.textContent
      });
      completeBtn.disabled = true;
      completeBtn.textContent = "Done ✔️";
    });
  });
});
