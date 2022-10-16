const productId = localStorage.getItem("productID")

fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
  .then((res) => res.json())
  .then(({ name, description, images, soldCount, currency, cost, relatedProducts, id }) => {
    // TITULO
    document.querySelector("#product__title").textContent = name
    // DESCRIPCIÓN
    document.querySelector("#product__description").textContent = description
    // CANTIDAD VENDIDOS
    document.querySelector("#product__sold-count").innerHTML = `<span>Vendidos:</span> ${soldCount}`
    // PRECIO
    document.querySelector("#product__price").textContent = `${currency} ${cost}`

    // GALERIA DE IMAGENES
    let imageOnFocus;
    const galleryListElement = document.querySelector("#gallery__list")
    const galleryDisplayElement = document.querySelector("#gallery__display")
    galleryDisplayElement.setAttribute("src", images[0])

    images.forEach((imageUrl, index) => {
      let item = document.createElement("li");
      if (index == 0) {
        imageOnFocus = item
        item.classList.add("focus")
      }
      item.addEventListener("click", () => {
        galleryDisplayElement.setAttribute("src", imageUrl)
        imageOnFocus.classList.remove("focus")
        item.classList.add("focus")
        imageOnFocus = item
      })
      item.innerHTML = `<img src="${imageUrl}"/>`
      galleryListElement.appendChild(item)
    })

    // PRODUCTOS RELACIONADOS

    const relatedProductsElement = document.querySelector("#related-products__ctn")

    relatedProducts.forEach(({ id, image, name }) => {
      item = document.createElement("li")
      item.innerHTML = `
        <img src="${image}" alt="${name}"/>
        <p>${name}</p>
      `
      item.addEventListener("click", () => {
        localStorage.setItem("productID", id)
        location.reload()
      })
      relatedProductsElement.appendChild(item)
    })
    // AÑADIR AL CARRITO
    document.querySelector("#buy").addEventListener("click", () => {
      const products = JSON.parse(localStorage.getItem("cart")) || []
      if (products.find(product => product.id == id) == undefined) {
        console.log(true)
        products.push(
          {
            "id": id,
            "name": name,
            "count": 1,
            "unitCost": cost,
            "currency": currency,
            "image": images[0]
          }
        )
        localStorage.setItem("cart", JSON.stringify(products))
      }
      console.log(false)
    })
  })

// VARIABLES GLOBALES RELACIONADAS A LOS COMENTARIOS
let productComments = []
let userComments = JSON.parse(localStorage.getItem("comments")) || []
const addCommentBtn = document.querySelector(".add-comment__form > button")

// COMENTARIOS DE OTROS PRODUCTOS
userComments.filter(comment => comment.productId != productId)
// COMENTARIO DEL PRODUCTO
let userComment = userComments.filter(comment => comment.productId == productId)[0]
const userName = localStorage.getItem("user")
const commentsListElement = document.querySelector("#comments__list")

fetch(`https://japceibal.github.io/emercado-api/products_comments/${productId}.json`)
  .then((res) => res.json())
  .then((comments) => {
    productComments = [...comments]
    userComment && comments.push(userComment)
    renderComments(comments)
  })
// FUNCIONES PARA MOSTRAR COMENTARIOS
const renderComments = (comments) => {
  let commentsCount = comments.length
  let commentsStars = 0
  // VACIA LA CAJA DE COMENTARIOS
  commentsListElement.innerHTML = ""
  comments.sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime))
  // VUELVE A DIBUJAR LOS COMENTARIOS
  comments.forEach(comment => {
    commentsStars += comment.score
    userName == comment.user ? createUserComment(comment) : createComment(comment)
  })
  // ACTUALIZA RATING DEL PRODUCTO
  const productRatingElement = document.querySelector("#product__rating")
  productRatingElement.innerHTML = `${starRating({ rating: commentsStars / commentsCount })} (${commentsCount})`
}

// FUNCION PARA GENERAR ESTRELLAS
let id = 0
const starRating = ({
  rating = 2.5,
  size = 16,
  max = 5,
  primary = "#ffd006",
  secondary = "#f5e4a6",
}) => {
  let html = ""
  for (let i = 0; i < max; i++) {
    let percentage
    if (rating - i >= 1) percentage = 100
    else if (rating - (i + 1) > -1) percentage = (rating - i) * 100
    else percentage = 0
    id++
    html += ` <svg viewBox="0 0 576 512" height="${size}">
              <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="star-rating-${id}">
                <stop stop-color="${primary}" offset="${percentage}%"></stop>
                <stop stop-color="${secondary}" offset="0%"></stop>
              </linearGradient>
              <path
                d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                fill="url(#star-rating-${id})"
              ></path>
        </svg>
      `
  }
  return html
}

// FUNCION PARA PARSEAR DATATIME
const parseDate = (date) => {
  const actualTime = new Date()
  const timeDiff = Math.abs(+ actualTime - (+date))
  if (timeDiff / 1000 < 60) return "Ahora"
  if (timeDiff / (1000 * 60) < 60) return `Hace ${Math.floor(timeDiff / (1000 * 60))} minutos`
  if (timeDiff / (1000 * 60 * 60) < 24) return `Hace ${Math.floor(timeDiff / (1000 * 60 * 60))} horas`
  if (timeDiff / (1000 * 60 * 60 * 24) < 365) return `Hace ${Math.floor(timeDiff / (1000 * 60 * 60 * 24))} dias`
  return `Más de  ${Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365))} años`
}
// SI EXISTE ALGUN COMENTARIO VIEJO, ACTUALIZAR TEXTO DEL BOTON
if (userComment) {
  addCommentBtn.textContent = "Actualizar"
}
// FUNCION PARA CREAR COMENTARIOS DE OTROS USUARIOS
const createComment = ({ user, description, score, dateTime }) => {
  const comment = document.createElement("li")
  !description.endsWith(".") && (description += ".")
  comment.innerHTML = `
    <p class="comment__user">${user} <span>${starRating({ rating: score, size: 13 })}</span></p>
    <p class="comment__description"><span class="comment">${description}</span><span class="date">${parseDate(new Date(dateTime))}</span></p>
    <button class="comment__like">Me gusta</button>
  `
  commentsListElement.insertAdjacentElement("afterbegin", comment)
}

// FUNCION PARA CREAR COMENTARIOS DEL USUARIO
const createUserComment = ({ user, description, score, dateTime }) => {
  const comment = document.createElement("li")
  comment.id = "user-comment"
  !description.endsWith(".") && (description += ".")
  comment.innerHTML = `
    <p class="comment__user">${user} <span>${starRating({ rating: score, size: 13 })}</span></p>
    <p class="comment__description"><span class="comment">${description}</span><span class="date">${parseDate(new Date(dateTime))}</span></p>
    <button class="comment__like">Me gusta</button>
  `
  const deleteCommentButton = document.createElement("button")
  deleteCommentButton.classList.add("user-comment__delete-btn")
  deleteCommentButton.innerHTML = "Eliminar"
  deleteCommentButton.addEventListener("click", () => {
    // GUARDAR EN EL LOCALSTORAGE SOLO LOS COMENTARIOS DE OTROS PRODUCTOS
    localStorage.setItem("comments", JSON.stringify(userComments))
    // DIBUJAR SOLO LOS COMENTARIOS DE OTROS USUARIOS
    renderComments(productComments)
    // ACTUALIZAR TEXTO DEL BOTON
    addCommentBtn.textContent = "Agregar"
  })
  comment.appendChild(deleteCommentButton)
  commentsListElement.insertAdjacentElement("afterbegin", comment)
}

// AÑADE EVENTOS AL FORMULARIO PARA CREAR COMENTARIOS
const addCommentStar = document.querySelector("#add-comment__star")
addCommentStar.innerHTML = starRating({ rating: 0 })
let rateSelected = 0
let stars = addCommentStar.querySelectorAll("svg")
stars.forEach((element, index) => {
  element.addEventListener("click", () => {
    rateSelected = index + 1
    for (let i = 0; i <= rateSelected - 1; i++) {
      stars[i].querySelector("stop").setAttribute("offset", "100%")
    }
    for (let i = rateSelected; i < 5; i++) {
      stars[i].querySelector("stop").setAttribute("offset", "0%")
    }
  })
})

const commentInput = document.querySelector("#comment-input")

addCommentBtn.addEventListener("click", () => {
  userComment = { user: userName, description: commentInput.value, score: rateSelected, dateTime: +new Date(), productId }
  localStorage.setItem("comments", JSON.stringify([...userComments, userComment]))
  renderComments([...productComments, userComment])
})

