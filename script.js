import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container = document.getElementById("container");
container.innerHTML = `<button id="add">+ New Habit</button>`;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("container");
  container.innerHTML = `<button id="add">+ New Habit</button>`;

  let currentUser = null;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const name = userDoc.data().name;
        const email = userDoc.data().email;
        document.getElementById("name").innerText = name;
        localStorage.setItem("email", email);
        fetchHabit();
      }
    } else {
      window.location.href = "login.html";
    }
  });

  const addHabit = document.getElementById("add");
  addHabit.addEventListener("click", () => {
    document.getElementById("form").style.display = "grid";
  });

  document.getElementById("save").addEventListener("click", async () => {
    const habit = document.getElementById("habit").value;
    const goal = document.getElementById("goal").value;
    const level = document.getElementById("level").value;
    const category = document.getElementById("category").value;
    const email = localStorage.getItem("email");
    if (habit.length < 1 || goal < 1 || level === "" || category === "") {
      alert("Please enter valid data!");
      return;
    }

    try {
      await addDoc(collection(db, "habits"), {
        habit,
        goal,
        level,
        category,
        email,
      });
      document.getElementById("habit").value = "";
      document.getElementById("goal").value = "";
      document.getElementById("level").value = "";
      document.getElementById("category").value = "";

      const container = document.getElementById("container");
      container.innerHTML = `<button id="add">+ New Habit</button>`;
      fetchHabit();
    } catch (error) {
      console.log(error.message);
    } finally {
      document.getElementById("form").style.display = "none";
    }
  });

  async function fetchHabit() {
    try {
      const habits = collection(db, "habits");
      const query = await getDocs(habits);
      query.forEach((doc) => {
        const habitData = doc.data();
        if (habitData.email === localStorage.getItem("email")) {
          displayHabit(habitData, doc.id);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  function displayHabit(data, id) {
    const div = document.createElement("div");

    let currentCount = parseInt(localStorage.getItem(data.habit)) || 0;

    div.innerHTML = `<h4><u>${data.habit}</u></h4>
                        <p>Goal : ${data.goal} days</p>
                        <p>Difficulty : ${data.level}</p>
                        <p>Category : ${data.category}</p>
                        <p>Streak : <span class="count">${
                          currentCount + "🔥".repeat(currentCount)
                        }</span>`;

    if (currentCount >= parseInt(data.goal)) {
      div.style.background =
        "linear-gradient(to bottom left, #84cc16, #16a34a, #0f766e)";
      div.style.color = "white";
    }


    const comp = document.createElement("button");
    comp.innerText = "Done Today";

    const lastClick = localStorage.getItem(`${data.habit}_lastClick`);
    const now = Date.now();

    if (lastClick && now - parseInt(lastClick) < 86400000) {
      comp.disabled = true;
    }

    comp.addEventListener("click", () => {
      const lastClick = parseInt(
        localStorage.getItem(`${data.habit}_lastClick`) || 0
      );
      const now = Date.now();

      if (now - lastClick < 86400000) {
        return;
      }

      localStorage.setItem(`${data.habit}_lastClick`, now);

      currentCount++;
      localStorage.setItem(`${data.habit}`, currentCount);

      const countSpan = div.querySelector(".count");
      if (countSpan) {
        countSpan.innerText = currentCount + "🔥".repeat(currentCount);
      }

      let coins = parseInt(localStorage.getItem("coins")) || 0;
      coins += 1;
      localStorage.setItem("coins", coins);
      document.getElementById("coin").textContent = coins;

      comp.disabled = true;
    });

    const Delete = document.createElement("button");
    Delete.innerText = "Delete";
    Delete.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this habit?"
      );
      if (confirmDelete) {
        try {
          await deleteDoc(doc(db, "habits", id));
          location.reload();
        } catch (error) {
          console.log("Delete failed:", error.message);
        }
      }
    });

    div.appendChild(comp);
    div.appendChild(Delete);
    if (data.level.toLowerCase() === "easy") {
      div.classList.add("easy");
    } else if (data.level.toLowerCase() === "moderate") {
      div.classList.add("moderate");
    } else {
      div.classList.add("hard");
    }
    container.appendChild(div);
  }

  document.getElementById("cross").addEventListener("click", () => {
    document.getElementById("form").style.display = "none";
  });

  async function Analysis() {
      const Analysis=document.getElementById("analysis")
      const TotalHabit=document.createElement("div")
      const TotalStreak=document.createElement("div")
      const LastStreak=document.createElement("div")
      const arr=[]
    try {
      
      const habits = collection(db, "habits");
      const query = await getDocs(habits);
      
      query.forEach((doc) => {
        const habitData = doc.data();
        if(habitData.email===localStorage.getItem("email")){
          arr.push(habitData)
        }
      });
      TotalHabit.innerHTML=`<h3>🌱 Habits</h3>
                             <p>${arr.length}</p>`
        Analysis.appendChild(TotalHabit)
      TotalStreak.innerHTML=`<h3>🔥 Streaks</h3>
                             <p>${localStorage.getItem("coins")}🔥</p>`
        Analysis.appendChild(TotalStreak)

      LastStreak.innerHTML=`<h3>💰 Coins</h3>
                            <p>${localStorage.getItem("coins")}</p>`
      Analysis.appendChild(LastStreak)
    } catch (error) {
      
    }
    
  }  

  Analysis()

});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.open("login.html", "_self");
  });
}


const ham = document.getElementById('ham');
const close = document.getElementById('close');
const sidebar = document.getElementById('sidebar');


ham.addEventListener('click', () => {
  sidebar.classList.add('show');
  ham.style.display = 'none';      
  close.classList.add('active');   
});

close.addEventListener('click', () => {
  sidebar.classList.remove('show');
  close.classList.remove('active'); 
  ham.style.display = 'block';      
});




window.addEventListener("resize", () => {
  const sidebar=document.getElementById("sidebar")
  const ham=document.getElementById("ham")
  const close=document.getElementById("close")
  if (window.innerWidth > 890) {
    sidebar.style.display = "block";
    ham.style.display = "none";
    close.style.display = "none";
  } else {
    sidebar.style.display = "none";
    ham.style.display = "block";
    close.style.display = "none";
  }
});

const Theme = document.getElementById("theme");

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  Theme.value = savedTheme;
});

Theme.addEventListener("change", () => {
  const selectedTheme = Theme.value;
  localStorage.setItem("theme", selectedTheme);
  applyTheme(selectedTheme);
});

function applyTheme(val) {
  if (val === "dark") {
    document.body.classList.add("dark");
    
  } else {
    document.body.classList.remove("dark");
    document.body.style.backgroundColor = "#CAE8BD";
    document.getElementById("sidebar").style.backgroundColor = "#B0DB9C";
    document.getElementById("ham").style.color = "black";
    document.getElementById("theme").style.backgroundColor = "#B0DB9C";
    document.getElementById("theme").style.color = "#000";
    document.getElementById("theme").style.color = "white";

  }
}

document.getElementById("alert").addEventListener("click",()=>{
  alert("Time to Make a streak!")
})