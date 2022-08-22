const form = document.querySelector("form")
const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password")

const displayError = (message, input) => {
	input.previousElementSibling.style.display = "block"
	input.nextElementSibling.style.display = "block"
	input.nextElementSibling.innerHTML = message
	input.classList.add("alert")
}

const hideError = (input) => {
	input.previousElementSibling.style.display = "none"
	input.nextElementSibling.style.display = "none"
	input.classList.remove("alert")
}

form.addEventListener("submit", (e) => {
	e.preventDefault()
	const email = emailInput.value
	const password = passwordInput.value
	email.length < 1
		? displayError("Ingresa tu e-mail", emailInput)
		: hideError(emailInput)
	password.length < 1
		? displayError("Ingresa tu contraseña", passwordInput)
		: hideError(passwordInput)

	if (email.length > 0 && password.length > 0) {
		localStorage.setItem(
			"user",
			JSON.stringify({ email, name: "nombre", photoUrl: "" })
		)
		window.location.replace("./")
	}
})

localStorage.getItem("user") && (window.location.href = "./")
