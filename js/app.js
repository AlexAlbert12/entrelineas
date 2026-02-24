"use strict";

(() => {
  const ADMIN_PASSWORD = "123456";
  const state = {
    categories: [],
    products: [],
    cart: {},
    cartVisible: true,
    categoryVisibility: {}
  };

  let pendingProductImage = "";

  function createBookCover(title, bgColor, textColor) {
    const safeTitle = title
      .slice(0, 34)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="280" height="390" viewBox="0 0 280 390">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bgColor}" />
            <stop offset="100%" stop-color="#ffffff" />
          </linearGradient>
        </defs>
        <rect width="280" height="390" rx="16" fill="url(#g)" />
        <rect x="20" y="20" width="240" height="350" rx="12" fill="none" stroke="rgba(0,0,0,0.12)" />
        <text x="140" y="192" text-anchor="middle" font-size="24" font-family="Georgia, serif" fill="${textColor}">
          ${safeTitle}
        </text>
        <text x="140" y="330" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" fill="rgba(0,0,0,0.45)">
          Entre Lineas
        </text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function bootstrapData() {
    state.categories = [
      { id: "novela", name: "Novela" },
      { id: "ensayo", name: "Ensayo" },
      { id: "infantil", name: "Infantil" }
    ];

    state.products = [
      {
        code: "EL001",
        categoryId: "novela",
        description: "La sombra del viento - novela de misterio literario",
        price: 21.9,
        stock: 6,
        image: createBookCover("La sombra", "#f6d7b0", "#53311f")
      },
      {
        code: "EL002",
        categoryId: "novela",
        description: "Patria - relato de memorias y reconciliacion",
        price: 18.5,
        stock: 4,
        image: createBookCover("Patria", "#e7d9f5", "#362146")
      },
      {
        code: "EL003",
        categoryId: "ensayo",
        description: "Sapiens - historia breve de la humanidad",
        price: 24.2,
        stock: 5,
        image: createBookCover("Sapiens", "#d7eee1", "#1b4d36")
      },
      {
        code: "EL004",
        categoryId: "infantil",
        description: "El principito - clasico ilustrado para todas las edades",
        price: 14.75,
        stock: 8,
        image: createBookCover("Principito", "#ffe9ba", "#7f3f00")
      },
      {
        code: "EL005",
        categoryId: "infantil",
        description: "Cuentos para sonar - historias cortas para ninos",
        price: 12.9,
        stock: 3,
        image: createBookCover("Cuentos", "#cce8ff", "#0f3f75")
      }
    ];

    state.cart = {};
    state.categoryVisibility = {};
    state.categories.forEach((category) => {
      state.categoryVisibility[category.id] = true;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatCurrency(value) {
    return `${value.toFixed(2)} EUR`;
  }

  function showSystemMessage(text, type) {
    const $message = $("#systemMessage");
    $message
      .removeClass("d-none alert-success alert-danger alert-warning alert-info")
      .addClass(`alert-${type}`)
      .text(text);

    clearTimeout(showSystemMessage.timeoutId);
    showSystemMessage.timeoutId = setTimeout(() => {
      $message.addClass("d-none");
    }, 3500);
  }

  function showAdminMessage(text, isError) {
    const $message = $("#adminMessage");
    $message
      .removeClass("admin-status-success admin-status-error")
      .addClass(isError ? "admin-status-error" : "admin-status-success")
      .text(text);
  }

  function findProduct(code) {
    return state.products.find((product) => product.code === code);
  }

  function buildCategorySelect() {
    const options = state.categories
      .map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
      .join("");
    $("#productCategory").html(options);
  }

  function renderProducts() {
    const $container = $("#productsContainer");
    $container.empty();

    state.categories.forEach((category) => {
      const relatedProducts = state.products.filter((product) => product.categoryId === category.id);
      const isOpen = state.categoryVisibility[category.id] !== false;

      let productsHtml = "";
      if (relatedProducts.length === 0) {
        productsHtml = '<p class="text-muted mb-1">No hay productos en esta categoria.</p>';
      } else {
        productsHtml = relatedProducts
          .map((product) => {
            const outOfStock = product.stock <= 0;
            const buttonClasses = outOfStock ? "btn btn-link p-0 disabled-link" : "btn btn-link p-0";
            const disabledAttr = outOfStock ? "disabled" : "";
            return `
              <div class="product-row ${outOfStock ? "out-of-stock" : ""}">
                <div class="product-thumb-wrap">
                  <img class="product-thumb" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.description)}">
                </div>
                <div>
                  <p class="product-code mb-1">Codigo: <strong>${escapeHtml(product.code)}</strong></p>
                  <p class="product-desc">${escapeHtml(product.description)}</p>
                  <p class="mb-1">Precio: <strong>${formatCurrency(product.price)}</strong></p>
                  <p class="mb-2">Stock disponible: <strong>${product.stock}</strong></p>
                  <button type="button" class="${buttonClasses} add-to-cart" data-code="${escapeHtml(product.code)}" ${disabledAttr}>Agregar a la cesta</button>
                </div>
              </div>`;
          })
          .join("");
      }

      const categoryHtml = `
        <article class="category-card card shadow-sm mb-3" data-category-id="${escapeHtml(category.id)}">
          <button type="button" class="category-header category-toggle" data-category-id="${escapeHtml(category.id)}">
            <span>${escapeHtml(category.name)}</span>
            <span class="toggle-indicator" aria-hidden="true">${isOpen ? "-" : "+"}</span>
          </button>
          <div class="category-products" style="display:${isOpen ? "block" : "none"};">
            ${productsHtml}
          </div>
        </article>`;

      $container.append(categoryHtml);
    });
  }

  function calculateTotal() {
    return Object.entries(state.cart).reduce((acc, [code, quantity]) => {
      const product = findProduct(code);
      if (!product) return acc;
      return acc + quantity * product.price;
    }, 0);
  }

  function renderCart() {
    const $cartItems = $("#cartItems");
    const items = Object.entries(state.cart);

    if (items.length === 0) {
      $cartItems.html('<p class="text-muted mb-2">La cesta esta vacia.</p>');
    } else {
      const cartHtml = items
        .map(([code, quantity]) => {
          const product = findProduct(code);
          if (!product) return "";

          const itemTotal = quantity * product.price;
          return `
            <div class="cart-item">
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.description)}">
              <div>
                <p class="mb-1"><strong>${escapeHtml(product.description)}</strong></p>
                <small>Codigo: ${escapeHtml(product.code)}</small><br>
                <small>Precio unidad: ${formatCurrency(product.price)}</small><br>
                <small>Unidades: ${quantity}</small><br>
                <small>Total producto: ${formatCurrency(itemTotal)}</small>
                <div class="mt-2">
                  <button type="button" class="btn btn-sm btn-outline-danger remove-from-cart" data-code="${escapeHtml(product.code)}">Eliminar de la cesta</button>
                </div>
              </div>
            </div>`;
        })
        .join("");
      $cartItems.html(cartHtml);
    }

    $("#cartTotal").text(formatCurrency(calculateTotal()));
    $("#placeOrderBtn").prop("disabled", items.length === 0);
  }

  function setCartVisibility(visible) {
    state.cartVisible = visible;
    const $cartColumn = $("#cartColumn");
    const $productsColumn = $("#productsColumn");
    const $label = $("#toggleCartBtn .btn-label");

    if (visible) {
      $cartColumn.removeClass("d-none");
      $productsColumn.removeClass("col-12").addClass("col-lg-8");
      $label.text("Ocultar cesta");
    } else {
      $cartColumn.addClass("d-none");
      $productsColumn.removeClass("col-lg-8").addClass("col-12");
      $label.text("Mostrar cesta");
    }
  }

  function clearOrderMessage() {
    $("#orderConfirmation").addClass("d-none").text("");
  }

  function addToCart(code) {
    const product = findProduct(code);
    if (!product) return;
    if (product.stock <= 0) {
      showSystemMessage("No queda stock de este producto.", "warning");
      return;
    }

    product.stock -= 1;
    state.cart[code] = (state.cart[code] || 0) + 1;

    clearOrderMessage();
    renderProducts();
    renderCart();
  }

  function removeFromCart(code) {
    if (!state.cart[code]) return;

    const product = findProduct(code);
    if (product) {
      product.stock += 1;
    }

    state.cart[code] -= 1;
    if (state.cart[code] <= 0) {
      delete state.cart[code];
    }

    clearOrderMessage();
    renderProducts();
    renderCart();
  }

  function placeOrder() {
    const total = calculateTotal();
    if (total <= 0) {
      showSystemMessage("Tu cesta esta vacia. Agrega productos antes de pedir.", "warning");
      return;
    }

    state.cart = {};
    renderCart();
    clearOrderMessage();
    $("#orderConfirmation")
      .removeClass("d-none")
      .text(`Pedido confirmado. Gracias por comprar en Entre Lineas. Total: ${formatCurrency(total)}.`);
    showSystemMessage("Pedido realizado correctamente.", "success");
  }

  function requestAdminAccess() {
    const password = window.prompt("Introduce la contrasena de administrador");
    if (password === null) return;

    if (password !== ADMIN_PASSWORD) {
      showSystemMessage("Contrasena incorrecta.", "danger");
      return;
    }

    showAdminMessage("Modo administrador activo.", false);
    const modalElement = document.getElementById("adminModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }

  function categoryIdExists(id) {
    return state.categories.some((category) => category.id.toLowerCase() === id.toLowerCase());
  }

  function productCodeExists(code) {
    return state.products.some((product) => product.code.toLowerCase() === code.toLowerCase());
  }

  function addCategory(event) {
    event.preventDefault();
    const rawId = $("#categoryId").val().trim();
    const rawName = $("#categoryName").val().trim();
    const normalizedId = rawId.toLowerCase();

    if (!normalizedId || !rawName) {
      showAdminMessage("Debes completar identificador y nombre.", true);
      return;
    }

    if (categoryIdExists(normalizedId)) {
      showAdminMessage("Ese identificador de categoria ya existe.", true);
      return;
    }

    state.categories.push({ id: normalizedId, name: rawName });
    state.categoryVisibility[normalizedId] = true;
    buildCategorySelect();
    renderProducts();
    showAdminMessage(`Categoria "${rawName}" creada correctamente.`, false);
    event.target.reset();
  }

  function readSelectedImage(event) {
    const input = event.target;
    const file = input.files && input.files[0];
    pendingProductImage = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showAdminMessage("El archivo seleccionado no es una imagen valida.", true);
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      pendingProductImage = String(loadEvent.target?.result || "");
      showAdminMessage("Imagen local lista para el nuevo producto.", false);
    };
    reader.onerror = () => {
      pendingProductImage = "";
      showAdminMessage("No se pudo leer la imagen seleccionada.", true);
    };
    reader.readAsDataURL(file);
  }

  function addProduct(event) {
    event.preventDefault();

    const code = $("#productCode").val().trim();
    const categoryId = $("#productCategory").val();
    const description = $("#productDescription").val().trim();
    const price = Number.parseFloat($("#productPrice").val());
    const stock = Number.parseInt($("#productStock").val(), 10);
    const imageUrl = $("#productImageUrl").val().trim();

    if (!code || !categoryId || !description || Number.isNaN(price) || Number.isNaN(stock)) {
      showAdminMessage("Completa todos los campos obligatorios del producto.", true);
      return;
    }

    if (price < 0 || stock < 0) {
      showAdminMessage("Precio y stock deben ser valores no negativos.", true);
      return;
    }

    if (productCodeExists(code)) {
      showAdminMessage("El codigo del producto ya existe.", true);
      return;
    }

    if (!categoryIdExists(categoryId)) {
      showAdminMessage("La categoria seleccionada no existe.", true);
      return;
    }

    let imageSource = pendingProductImage || imageUrl;
    if (!imageSource) {
      imageSource = createBookCover(code, "#f1ede1", "#3d3425");
    }

    state.products.push({
      code,
      categoryId,
      description,
      price,
      stock,
      image: imageSource
    });

    renderProducts();
    showAdminMessage(`Producto "${code}" agregado correctamente.`, false);
    event.target.reset();
    pendingProductImage = "";
  }

  function bindEvents() {
    $("#productsContainer").on("click", ".add-to-cart", function onAddClick() {
      const code = $(this).data("code");
      addToCart(code);
    });

    $("#productsContainer").on("click", ".category-toggle", function onCategoryToggle() {
      const categoryId = $(this).data("category-id");
      const $categoryCard = $(this).closest(".category-card");
      const $products = $categoryCard.find(".category-products");
      const $indicator = $(this).find(".toggle-indicator");
      const isOpen = state.categoryVisibility[categoryId] !== false;

      state.categoryVisibility[categoryId] = !isOpen;
      $indicator.text(isOpen ? "+" : "-");
      if (isOpen) {
        $products.stop(true, true).slideUp(220);
      } else {
        $products.stop(true, true).slideDown(220);
      }
    });

    $("#cartItems").on("click", ".remove-from-cart", function onRemoveClick() {
      const code = $(this).data("code");
      removeFromCart(code);
    });

    $("#toggleCartBtn").on("click", () => {
      setCartVisibility(!state.cartVisible);
    });

    $("#placeOrderBtn").on("click", placeOrder);
    $("#adminAccessBtn").on("click", requestAdminAccess);
    $("#categoryForm").on("submit", addCategory);
    $("#productForm").on("submit", addProduct);
    $("#productImageFile").on("change", readSelectedImage);
  }

  function init() {
    bootstrapData();
    buildCategorySelect();
    renderProducts();
    renderCart();
    setCartVisibility(true);
    bindEvents();
  }

  $(init);
})();
