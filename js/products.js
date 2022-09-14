let mainElement = document.querySelector("main")
let favorites = JSON.parse(localStorage.getItem("favorites")) || []
let allProducts = []
let searchInputValue = undefined
let sortCriteria = undefined
let minPrice = undefined
let maxPrice = undefined
const productListItem = document.createElement("ul")
productListItem.classList.add("product-list")

const createProductItem = ({
	name,
	id,
	cost,
	currency,
	soldCount,
	image,
	description,
}) => {
	let favoriteClass = favorites.includes(id) ? "active" : "inactive"
	const item = document.createElement("li")
	item.addEventListener("click", (e) => {
		localStorage.setItem("productID", id)
		location.href = "/product-info.html"
	})
	item.innerHTML = `
		<div class="product__ctn"> 
			<img class="product__image" src="${image}" alt="${name}">
				<div class="product__info">
					<h2 class="product__title">${name}</h2>
					<p class="product__description">${description}</p>
					<p class="product__price">${currency} ${cost}</p>
					<p class="product__sold-count">vendidos: ${soldCount}</p>
			</div>
		</div>
		<button class="add-to-favorite ${favoriteClass}" onclick="event.stopPropagation();handleFavorite(this,${id})">
			<img src="./svg/heart.svg" alt="heart">
		</button>
`
	return item
}

const handleFavorite = (element, id) => {
	element.classList.toggle("active")
	element.classList.toggle("inactive")
	if (favorites.includes(id)) {
		favorites = favorites.filter((favorite) => favorite !== id)
	} else {
		favorites.push(id)
	}
	localStorage.setItem("favorites", JSON.stringify(favorites))
}

const normalizeString = (str) => {
	return str
		.replaceAll("á", "a")
		.replaceAll("é", "e")
		.replaceAll("í", "i")
		.replaceAll("ó", "o")
		.replaceAll("u", "u")
}

const sortItems = (products, criteria) => {
	if (criteria == "price-desc")
		return products.sort((a, b) =>
			b.cost - a.cost
		)

	if (criteria == "price-asc")
		return products.sort((a, b) =>
			a.cost - b.cost
		)

	if (criteria == "rel-desc")
		return products.sort((a, b) =>
			b.soldCount - a.soldCount
		)
	return products
}

const filterByName = (products, value) =>
	value ?
		products.filter((product) =>
			normalizeString(product.name.toLowerCase()).includes(
				normalizeString(value.toLowerCase())
			)
		) : products

const filterByPrice = (products, min, max) => products.filter((product) => product.cost >= min && product.cost <= max)

const renderList = () => {
	products = sortItems(
		filterByName(
			filterByPrice(allProducts, minPrice || 0, maxPrice || Infinity),
			searchInputValue
		),
		sortCriteria
	)
	productListItem.innerHTML = ""
	products.forEach((product) => {
		productListItem.appendChild(createProductItem(product))
	})
}

document
	.querySelector("#search-filter")
	.addEventListener("input", ({ target }) => {
		searchInputValue = target.value
		renderList()
	})
document.querySelectorAll("#products__sorts-ctn button").forEach((button) => {
	button.addEventListener("click", () => {
		sortCriteria = button.value
		renderList()
	})
})
document.querySelector("#apply-filters").addEventListener("click", () => {
	minPrice = document.querySelector("#min-price-filter").value
	maxPrice = document.querySelector("#max-price-filter").value
	renderList()
})
document.querySelector("#clear-filter").addEventListener("click", () => {
	document.querySelector("#min-price-filter").value = ""
	document.querySelector("#max-price-filter").value = ""
	minPrice = undefined
	maxPrice = undefined
	renderList()
})
const catId = localStorage.getItem("catID")
fetch(`https://japceibal.github.io/emercado-api/cats_products/${catId}.json`)
	.then((res) => res.json())
	.then(({ catName, products }) => {
		document.querySelector("h1").innerHTML = catName
		document.querySelector("#subtitle-name").innerHTML = catName
		allProducts = products
		renderList(products)
		mainElement.appendChild(productListItem)
	})