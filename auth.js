import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn=document.getElementById("loginBtn")
    const registerBtn=document.getElementById("registerBtn")

    if(loginBtn){
        loginBtn.addEventListener("click",async()=>{
            const email=document.getElementById("login-email").value
            const password=document.getElementById("login-password").value
            try {
                await signInWithEmailAndPassword(auth,email,password)
                window.location.href="dashboard.html"
            } catch (error) {
                document.getElementById("loginMsg").innerText=error.message
            }

        })
    }

    if(registerBtn){
        registerBtn.addEventListener("click",async()=>{
            const name = document.getElementById("name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;

            try {
                const userCredentials=await createUserWithEmailAndPassword(auth,email,password)
                await setDoc(doc(db, "users", userCredentials.user.uid),{
                    email,
                    name,
                })
                alert("Registration Successful! Please log in.")
                window.location.href = "login.html";
            } catch (error) {
                document.getElementById("registerMsg").innerText=error.message
                
            }
        })
    }
});
