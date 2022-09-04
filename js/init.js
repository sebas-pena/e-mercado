const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json"
const PUBLISH_PRODUCT_URL =
	"https://japceibal.github.io/emercado-api/sell/publish.json"
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/"
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/"
const PRODUCT_INFO_COMMENTS_URL =
	"https://japceibal.github.io/emercado-api/products_comments/"
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/"
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json"
const EXT_TYPE = ".json"

let showSpinner = function () {
	document.getElementById("spinner-wrapper").style.display = "block"
}

let hideSpinner = function () {
	document.getElementById("spinner-wrapper").style.display = "none"
}

let getJSONData = function (url) {
	let result = {}
	showSpinner()
	return fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				throw Error(response.statusText)
			}
		})
		.then(function (response) {
			result.status = "ok"
			result.data = response
			hideSpinner()
			return result
		})
		.catch(function (error) {
			result.status = "error"
			result.data = error
			hideSpinner()
			return result
		})
}

let logoutbtn = document.getElementById("logout")

logoutbtn &&
	logoutbtn.addEventListener("click", () => {
		localStorage.removeItem("user")
		window.location.replace("./login.html")
	})

const userNavItem = document.querySelector("#user-nav")
const userEmail = localStorage.getItem("user")
const createNavUserDropDown = () => {
	userNavItem.innerHTML = `
	<button id="user-nav__btn" class="nav-link nav-user__btn">${userEmail}</button>
	<div id="user-nav__select-box">
		<button id="logout-btn">Cerrar sesión</button>
	</div>
	`
	const userBtn = document.querySelector("#user-nav__btn")
	const logoutBtn = document.querySelector("#logout-btn")
	const selectBox = document.querySelector("#user-nav__select-box")

	userBtn.addEventListener("click", () => {
		selectBox.classList.toggle("open")
		userBtn.classList.toggle("active")
	})
	document.addEventListener("click", ({ target }) => {
		if (!target.closest("#user-nav")) {
			selectBox.classList.remove("open")
			userBtn.classList.remove("active")
		}
	})
	logoutBtn.addEventListener("click", () => {
		localStorage.removeItem("user")
		location.href = "/login.html"
	})
}
userNavItem && createNavUserDropDown()
