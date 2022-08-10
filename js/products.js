let mainElement = document.querySelector("main")

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

	product.innerHTML = `
  <a class="product__ctn" href="product-info.html?id=${id}"> 
    <img class="product__image" src="${image}" alt="${name}">
    <div class="product__info">
      <div>
        <h2 class="product__title">${name} - ${currency} ${cost}</h2>
        <p class="product__sold-count">${soldCount} vendidos</p>
      </div>
      <p class="product__description">${description}</p>
    </div>
  </a> 
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
