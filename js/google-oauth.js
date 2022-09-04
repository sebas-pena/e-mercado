/* GOOGLE OAUTH */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js"
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

const firebaseConfig = {
	apiKey: "AIzaSyCrS_gl9zQ_p-b6MShRxh4gpltc3XBaTy4",
	authDomain: "e-mercado-de138.firebaseapp.com",
	projectId: "e-mercado-de138",
	storageBucket: "e-mercado-de138.appspot.com",
	messagingSenderId: "540625028914",
	appId: "1:540625028914:web:9ac53dd345532d4025792b",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const provider = new GoogleAuthProvider()
document.querySelector("#google-singin").addEventListener("click", async () => {
	provider.addScope("profile")
	signInWithPopup(auth, provider).then(({ user }) => {
		const { displayName, email, photoUrl } = user
		window.localStorage.setItem("user", email)
		window.location.href = "./"
	})
})
