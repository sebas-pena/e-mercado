const productsOnStorage = JSON.parse(localStorage.getItem("cart")) || []
const productsList = document.querySelector("#cart-list")
fetch(CART_INFO_URL + "25801" + EXT_TYPE)
  .then(res => res.json())
  .then(data => {
    const products = [...data.articles, ...productsOnStorage]

    products.forEach(({ count, currency, image, name, unitCost }) => {

      const container = document.createElement("tr")
      container.innerHTML = `
        <td>
          <div>
            <p class="product-name">${name}</p>
            <img class="product-img" src="${image}"/>
          </div>
        </td>
        <td>
          <p class="price">${currency} ${unitCost}</p>
        </td>
        <td>
          <div class="product-controls">
            <button class="quantity-remove">-</button>
            <p class="quantity-input">${count}</p>
            <button class="quantity-add">+</button>
          </div>
        </td>
        <td>
          <p class="total">${currency} ${unitCost * count}</p>
        </td>
        <td>
          <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" fill="currentColor">
              <path d="M432,96h-48V32c0-17.672-14.328-32-32-32H160c-17.672,0-32,14.328-32,32v64H80c-17.672,0-32,14.328-32,32v32h416v-32
                C464,110.328,449.672,96,432,96z M192,96V64h128v32H192z"/>
              <path d="M80,480.004C80,497.676,94.324,512,111.996,512h288.012C417.676,512,432,497.676,432,480.008v-0.004V192H80V480.004z
                M320,272c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M240,272
                c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M160,272c0-8.836,7.164-16,16-16
                s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z"/>
            </svg>
          </buttn>
        </td>
      `
      const input = container.querySelector(".quantity-input")
      const removeBtn = container.querySelector(".quantity-remove")
      const addBtn = container.querySelector(".quantity-add")
      const total = container.querySelector(".total")

      addBtn.addEventListener("click", () => {
        const value = Number(input.textContent) + 1
        input.textContent = value
        total.textContent = `${currency} ${value * unitCost}`
        updateCosts()
      })
      removeBtn.addEventListener("click", () => {
        if (input.textContent == 1) return

        const value = Number(input.textContent) - 1
        input.textContent = value
        total.textContent = `${currency} ${value * unitCost}`
        updateCosts()
      })
      productsList.appendChild(container)
      container.querySelector(".delete-btn").addEventListener("click", () => {
        container.remove()
        updateCosts()
      })

    })
    document.querySelectorAll('input[name="envio"]').forEach(input => {
      input.addEventListener("click", () => { updateCosts() })
    })
    updateCosts()
  })

const updateCosts = () => {
  const totals = document.querySelectorAll(".total")
  let subtotal = 0
  totals.forEach(total => {
    const text = total.textContent.split(" ")
    if (text[0] === "USD") subtotal += Number(text[1])
    else subtotal += Number(text[1]) / 40
  })
  document.querySelector("#subtotal").innerHTML = `USD ${subtotal}`
  const shippingCost = Number(document.querySelector('input[name="envio"]:checked').value) * subtotal / 100
  document.querySelector("#shipping").innerHTML = `USD ${shippingCost}`
  document.querySelector("#total").innerHTML = `USD ${shippingCost + subtotal}`

}

const streetInput = document.querySelector("#street")
const streetNumberInput = document.querySelector("#street-number")
const streetCornerInput = document.querySelector("#street-corner")

const modal = document.querySelector(".queria-usar-la-clase-modal-pero-bootstrap-me-lo-esconde-hernan")

document.querySelector("#pay").addEventListener("click", () => {
  let error = false
  if (streetInput.value.length === 0) {
    streetInput.classList.add("error")
    error = true
  } else {
    streetInput.classList.remove("error")
  }
  if (streetNumberInput.value.length === 0) {
    streetNumberInput.classList.add("error")
    error = true
  } else {
    streetNumberInput.classList.remove("error")
  }
  if (streetCornerInput.value.length === 0) {
    streetCornerInput.classList.add("error")
    error = true
  } else {
    streetCornerInput.classList.remove("error")
  }

  if (error) return
  modal.classList.remove("hidden")
  document.addEventListener("keydown", hideModal)
  document.querySelector("body").style.overflow = "hidden"
})

const hideModal = (e) => {
  if (e) {
    if (e.key === "Escape") {
      modal.classList.add("hidden")
      document.removeEventListener("keydown", hideModal)
    }
  } else {
    modal.classList.add("hidden")
    document.removeEventListener("keydown", hideModal)
  }
  document.querySelector("body").style.overflow = "auto"
}


const bankTransferInput = document.querySelector("#bank-transfer")
const creditCardInput = document.querySelector("#credit-card")
const creditCardNumberInput = document.querySelector("#payment__card-number")
const creditCardCvvInput = document.querySelector("#payment__card-cvv")
const creditCardExpInput = document.querySelector("#payment__card-exp")
const bankAccountInput = document.querySelector("#payment__account")

creditCardInput.addEventListener("click", () => {
  creditCardCvvInput.removeAttribute("disabled")
  creditCardExpInput.removeAttribute("disabled")
  creditCardNumberInput.removeAttribute("disabled")
  bankAccountInput.setAttribute("disabled", "true")
  bankAccountInput.classList.remove("error")
  bankAccountInput.value = ""
})

bankTransferInput.addEventListener("click", () => {
  creditCardCvvInput.setAttribute("disabled", "true")
  creditCardCvvInput.classList.remove("error")
  creditCardCvvInput.value = ""
  creditCardExpInput.setAttribute("disabled", "true")
  creditCardExpInput.classList.remove("error")
  creditCardExpInput.value = ""
  creditCardNumberInput.setAttribute("disabled", "true")
  creditCardNumberInput.classList.remove("error")
  creditCardNumberInput.value = ""
  bankAccountInput.removeAttribute("disabled")
})

document.querySelector(".queria-usar-la-clase-modal-pero-bootstrap-me-lo-esconde-hernan").addEventListener("click", (e) => {
  console.log("A")
  if (e.target.classList.contains("queria-usar-la-clase-modal-pero-bootstrap-me-lo-esconde-hernan"))
    hideModal()
})
document.querySelector("#complete-purchase").addEventListener("click", () => {
  let error = false
  if (bankTransferInput.checked) {
    if (bankAccountInput.value == "") {
      bankAccountInput.classList.add("error")
      error = true
    } else {
      bankAccountInput.classList.remove("error")
    }
  } else {
    if (creditCardNumberInput.value.length == 12) {
      creditCardNumberInput.classList.remove("error")
    } else {
      creditCardNumberInput.classList.add("error")
      error = true
    }
    if (creditCardCvvInput.value.length == 3) {
      creditCardCvvInput.classList.remove("error")
    } else {
      creditCardCvvInput.classList.add("error")
      error = true
    }
    if (creditCardExpInput.value.length == 5) {
      creditCardExpInput.classList.remove("error")
    } else {
      creditCardExpInput.classList.add("error")
      error = true
    }
  }
  if (!error) {
    hideModal()
    productsList.innerHTML = ""
    showSuccessfulMessage()
  }
})

const showSuccessfulMessage = () => {
  const message = document.querySelector(".payment-successful-message")
  message.style.opacity = 1
  setTimeout(() => {
    message.style.opacity = 0
  }, 3000)
}