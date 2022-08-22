let mainElement = document.querySelector("main")
let favorites = JSON.parse(localStorage.getItem("favorites")) || []
console.log(favorites)

const createProductItem = ({
	img,
	name,
	id,
	cost,
	currency,
	soldCount,
	image,
	description,
}) => {
	const product = document.createElement("li")
	let favoriteClass = favorites.includes(id) ? "active" : "inactive"
	console.log(favoriteClass)
	product.innerHTML = `
  <a class="product__ctn" href="product-info.html?id=${id}"> 
    <img class="product__image" src="${image}" alt="${name}">
			<div class="product__info">
				<h2 class="product__title">${name}</h2>
				<p class="product__description">${description}</p>
				<p class="product__price">${currency} ${cost}</p>
				<p class="product__sold-count">vendidos: ${soldCount}</p>
		</div>
	</a>
	<button class="add-to-favorite ${favoriteClass}" onclick="handleFavorite(this,${id})">
		<img src="./svg/heart.svg" alt="heart"   >
	</button>
  `
	return product
}
/* 
  busca los productos de una categoria
  por defecto la de autos para que se vea el ejemplo
*/
const id = localStorage.getItem("catID") || 101
fetch(`https://japceibal.github.io/emercado-api/cats_products/${id}.json`)
	.then((res) => res.json())
	.then(({ catName, products }) => {
		mainElement.innerHTML = ` 
      <h1>${catName}</h1>
      <p class="category__subtitle">Listado de todos los productos de la categoria <span>${catName}</span></p>
    `
		const productList = document.createElement("ul")
		productList.classList.add("product-list")

		products.forEach((product) =>
			productList.appendChild(createProductItem(product))
		)

		mainElement.appendChild(productList)
	})

const handleFavorite = (element, id) => {
	console.log(element)
	element.classList.toggle("active")
	element.classList.toggle("inactive")
	if (favorites.includes(id)) {
		favorites = favorites.filter((favorite) => favorite !== id)
	} else {
		favorites.push(id)
	}
	localStorage.setItem("favorites", JSON.stringify(favorites))
}
