const productsOnStorage = JSON.parse(localStorage.getItem("cart")) || []

const productsList = document.querySelector("#cart-list")
fetch(CART_INFO_URL + "25801" + EXT_TYPE)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    const products = [...data.articles, ...productsOnStorage]

    products.forEach(({ count, currency, image, name, unitCost }) => {

      const container = document.createElement("tr")
      container.innerHTML = `
        <td>
          <div>
            <p class="product-name">${name}</p>
            <img src="${image}"/>
          </div>
        </td>
        <td>
          <div class="product-controls">
            <button class="quantity-remove">-</button>
            <input min="0" value="${count}" class="quantity-input"/>
            <button class="quantity-add">+</button>
          </div>
        </td>
        <td>
          <p class="price">${currency} ${unitCost}</p>
        </td>
        <td>
          <p class="total">${currency} ${unitCost * count}</p>
        </td>
      `
      const input = container.querySelector(".quantity-input")
      const removeBtn = container.querySelector(".quantity-remove")
      const addBtn = container.querySelector(".quantity-add")
      const total = container.querySelector(".total")

      input.addEventListener("input", () => {
        total.textContent = `${currency} ${input.value * unitCost}`
      })

      addBtn.addEventListener("click", () => {
        const value = Number(input.value) + 1
        input.value = value
        total.textContent = `${currency} ${value * unitCost}`
      })
      removeBtn.addEventListener("click", () => {
        if (input.value == 0) return
        const value = Number(input.value) - 1
        input.value = value
        total.textContent = `${currency} ${value * unitCost}`
      })


      productsList.appendChild(container)
    })
  })