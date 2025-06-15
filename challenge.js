import { db } from "./firebase-config.js";

import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded",async()=>{

    
    document.getElementById("PushUp").addEventListener("click",async()=>{


        const button=document.getElementById("PushUp")

        const pushUpRegistered = localStorage.getItem("pushup_registered");

        if (pushUpRegistered === "true") {
            button.innerText = "Registered!";
            return;
        }

        try {
            const habit="100 Push-up challenge"
            const goal="21"
            const level="Hard"
            const category="Community Challenge"
            const email=localStorage.getItem("email")
            
          await addDoc(collection(db, "habits"), {
            habit,
            goal,
            level,
            category,
            email,
          });
      
          localStorage.setItem("pushup_registered",true)
          button.innerText="Registered!"
        } catch (error) {
          console.log(error.message)
        }
      })


      document.getElementById("hydra").addEventListener("click",async()=>{
        const button=document.getElementById("hydra")

        const hydraRegistered = localStorage.getItem("hydra_registered");

        if (hydraRegistered === "true") {
            button.innerText = "Registered!";
            return;
        }

        try {
            const habit="Hydration Challenge"
            const goal="21"
            const level="Hard"
            const category="Community Challenge"
            const email=localStorage.getItem("email")
            
          await addDoc(collection(db, "habits"), {
            habit,
            goal,
            level,
            category,
            email,
          });
      
          localStorage.setItem("hydra_registered",true)
          button.innerText="Registered!"
        } catch (error) {
          console.log(error.message)
        }
      })

})

