"use strict";

(() => {
  const ADMIN_PASSWORD = "123456";
  const IMG_DIR = "img";
  const DEFAULT_IMAGE_FILE = "La-sombra-del-viento.jpg";
  const ADD_TO_CART_ICON = '<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(4 4)"><path d="m2.42575356.50254623 8.09559774-.00228586c.5209891-.00014706.9548019.39973175.9969972.91900932l.8938128 10.99973961c.0447299.5504704-.3652538 1.0329756-.9157242 1.0777056l-.0809907.0032851h-9.83555122c-.55228475 0-1-.4477152-1-1l.00294679-.076713.84614072-10.99745378c.0400765-.52088193.4743495-.92313949.99677087-.92328699z"/><path d="m9.5 4.5v.64527222c0 1.10456949-1.8954305 1.35472778-3 1.35472778s-3-.3954305-3-1.5v-.5"/></g></svg>';

  const state = {
    categories: [],
    products: [],
    cart: {},
    cartVisible: true,
    categoryVisibility: {},
    catalogSearchQuery: "",
    catalogSortBy: "default"
  };
  let confirmModalResolver = null;

  function buildImagePath(fileName) {
    const normalized = String(fileName || "").trim().replaceAll("\\", "/").replace(/^\/+/, "");
    if (!normalized) return `${IMG_DIR}/${DEFAULT_IMAGE_FILE}`;
    if (normalized.startsWith(`${IMG_DIR}/`)) return normalized;
    return `${IMG_DIR}/${normalized}`;
  }

  function bootstrapData() {
    state.categories = [
      { id: "novela", name: "Novela" },
      { id: "ensayo", name: "Ensayo" },
      { id: "infantil", name: "Infantil" }
    ];

    state.products = [
      {
        titulo: "La sombra del viento",
        code: "EL001",
        categoryId: "novela",
        description: "Novela de misterio literario ambientada en Barcelona.",
        price: 21.9,
        stock: 6,
        image: buildImagePath("La-sombra-del-viento.jpg")
      },
      {
        titulo: "Patria",
        code: "EL002",
        categoryId: "novela",
        description: "Relato sobre memoria, conflicto y reconciliacion.",
        price: 18.5,
        stock: 4,
        image: buildImagePath("patria.jpg")
      },
      {
        titulo: "Sapiens",
        code: "EL003",
        categoryId: "ensayo",
        description: "Breve historia de la humanidad y sus transformaciones.",
        price: 24.2,
        stock: 5,
        image: buildImagePath("sapiens.jfif")
      },
      {
        titulo: "El principito",
        code: "EL004",
        categoryId: "infantil",
        description: "Clasico ilustrado para lectores de todas las edades.",
        price: 14.75,
        stock: 8,
        image: buildImagePath("el-principito.jpg")
      },
      {
        titulo: "Cuentos para soñar",
        code: "EL005",
        categoryId: "infantil",
        description: "Historias cortas para lectura antes de dormir.",
        price: 12.9,
        stock: 3,
        image: buildImagePath("cuentos.jpg")
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
    return `${value.toFixed(2)} €`;
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function applyCatalogFiltersAndSorting(products) {
    const query = normalizeSearchText(state.catalogSearchQuery);
    let filtered = [...products];

    if (query) {
      filtered = filtered.filter((product) => {
        const searchableText = [
          product.titulo,
          product.description,
          product.code
        ]
          .map((text) => normalizeSearchText(text))
          .join(" ");
        return searchableText.includes(query);
      });
    }

    switch (state.catalogSortBy) {
      case "titulo-asc":
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" }));
        break;
      case "titulo-desc":
        filtered.sort((a, b) => b.titulo.localeCompare(a.titulo, "es", { sensitivity: "base" }));
        break;
      case "precio-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
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

  function askForConfirmation({ title, message, confirmText = "Confirmar", confirmButtonClass = "btn-danger" }) {
    const $modalTitle = $("#confirmActionModalLabel");
    const $modalText = $("#confirmActionModalText");
    const $confirmButton = $("#confirmActionBtn");
    const modalElement = document.getElementById("confirmActionModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    $modalTitle.text(title);
    $modalText.text(message);
    $confirmButton
      .removeClass("btn-danger btn-warning btn-primary btn-success")
      .addClass(confirmButtonClass)
      .text(confirmText);

    return new Promise((resolve) => {
      confirmModalResolver = resolve;
      modal.show();
    });
  }

  function findProduct(code) {
    return state.products.find((product) => product.code === code);
  }

  function findCategory(id) {
    return state.categories.find((category) => category.id === id);
  }

  function buildCategorySelect() {
    const options = state.categories.length > 0
      ? state.categories
        .map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
        .join("")
      : '<option value="">No hay categorías disponibles</option>';

    $("#productCategory").html(options);
    $("#editProductCategory").html(options);
  }

  function buildCategoryQuickNav(selectedId = "") {
    const options = [
      '<option value="">Selecciona una categoría...</option>',
      ...state.categories.map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
    ].join("");

    const $quickNav = $("#categoryQuickNav");
    $quickNav.html(options);
    if (selectedId && categoryIdExists(selectedId)) {
      $quickNav.val(selectedId);
    }
  }

  function extractImageFileName(imagePath) {
    const normalized = String(imagePath || "").replaceAll("\\", "/");
    const prefix = `${IMG_DIR}/`;
    return normalized.startsWith(prefix) ? normalized.slice(prefix.length) : normalized;
  }

  function buildCategoryEditorSelect(selectedId = "") {
    const $select = $("#editCategorySelect");
    if (state.categories.length === 0) {
      $select.html('<option value="">No hay categorías</option>');
      $select.val("");
      return;
    }

    const options = state.categories
      .map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
      .join("");
    $select.html(options);

    const fallbackId = state.categories[0].id;
    const nextId = selectedId && categoryIdExists(selectedId) ? selectedId : fallbackId;
    $select.val(nextId);
  }

  function buildProductEditorSelect(selectedCode = "") {
    const $select = $("#editProductSelect");
    if (state.products.length === 0) {
      $select.html('<option value="">No hay productos</option>');
      $select.val("");
      return;
    }

    const options = state.products
      .map((product) => `<option value="${escapeHtml(product.code)}">${escapeHtml(product.titulo)} (${escapeHtml(product.code)})</option>`)
      .join("");
    $select.html(options);

    const fallbackCode = state.products[0].code;
    const nextCode = selectedCode && findProduct(selectedCode) ? selectedCode : fallbackCode;
    $select.val(nextCode);
  }

  function syncCategoryEditorFields() {
    const selectedId = $("#editCategorySelect").val();
    const category = findCategory(selectedId);
    const disabled = !category;

    $("#editCategoryId, #editCategoryName, #deleteCategoryBtn, #categoryEditForm button[type='submit']").prop("disabled", disabled);

    if (!category) {
      $("#editCategoryId").val("");
      $("#editCategoryName").val("");
      return;
    }

    $("#editCategoryId").val(category.id);
    $("#editCategoryName").val(category.name);
  }

  function syncProductEditorFields() {
    const selectedCode = $("#editProductSelect").val();
    const product = findProduct(selectedCode);
    const disabled = !product;

    $("#editProductTitle, #editProductCode, #editProductCategory, #editProductDescription, #editProductPrice, #editProductStock, #editProductImageName, #deleteProductBtn, #productEditForm button[type='submit']").prop("disabled", disabled);

    if (!product) {
      $("#editProductTitle").val("");
      $("#editProductCode").val("");
      $("#editProductCategory").val("");
      $("#editProductDescription").val("");
      $("#editProductPrice").val("");
      $("#editProductStock").val("");
      $("#editProductImageName").val("");
      return;
    }

    $("#editProductTitle").val(product.titulo);
    $("#editProductCode").val(product.code);
    $("#editProductCategory").val(product.categoryId);
    $("#editProductDescription").val(product.description);
    $("#editProductPrice").val(product.price.toFixed(2));
    $("#editProductStock").val(product.stock);
    $("#editProductImageName").val(extractImageFileName(product.image));
  }

  function refreshAdminEditors(selectedCategoryId = "", selectedProductCode = "") {
    buildCategorySelect();
    buildCategoryQuickNav(selectedCategoryId);
    buildCategoryEditorSelect(selectedCategoryId);
    buildProductEditorSelect(selectedProductCode);
    syncCategoryEditorFields();
    syncProductEditorFields();

    const hasCategories = state.categories.length > 0;
    $("#productCategory, #productForm button[type='submit']").prop("disabled", !hasCategories);
  }

  function openAndFocusCategory(categoryId) {
    if (!categoryId || !categoryIdExists(categoryId)) return;

    state.categoryVisibility[categoryId] = true;
    renderProducts();

    const $targetCard = $("#productsContainer .category-card")
      .filter((_, element) => $(element).data("category-id") === categoryId)
      .first();

    if ($targetCard.length > 0) {
      $targetCard[0].scrollIntoView({ behavior: "smooth", block: "start" });
      $targetCard.addClass("category-card-focus");
      setTimeout(() => {
        $targetCard.removeClass("category-card-focus");
      }, 1100);
    }
  }

  function renderProducts() {
    const $container = $("#productsContainer");
    $container.empty();
    let hasVisibleProducts = false;

    state.categories.forEach((category) => {
      const relatedProducts = applyCatalogFiltersAndSorting(
        state.products.filter((product) => product.categoryId === category.id)
      );
      const isOpen = state.categoryVisibility[category.id] !== false;
      if (relatedProducts.length > 0) {
        hasVisibleProducts = true;
      }

      let productsHtml = "";
      if (relatedProducts.length === 0) {
        productsHtml = '<p class="text-muted mb-1">No hay productos en esta categoria.</p>';
      } else {
        productsHtml = relatedProducts
          .map((product) => {
            const outOfStock = product.stock <= 0;
            const buttonClasses = outOfStock ? "btn cart-add-btn disabled-link" : "btn cart-add-btn";
            const disabledAttr = outOfStock ? "disabled" : "";
            return `
              <div class="product-row ${outOfStock ? "out-of-stock" : ""}">
                <div class="product-thumb-wrap">
                  <img class="product-thumb" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.titulo)}">
                </div>
                <div>
                  <p class="product-code mb-1">Código: <strong>${escapeHtml(product.code)}</strong></p>
                  <p class="mb-1"><strong>${escapeHtml(product.titulo)}</strong></p>
                  <p class="product-desc">${escapeHtml(product.description)}</p>
                  <p class="mb-1">Precio: <strong>${formatCurrency(product.price)}</strong></p>
                  <p class="mb-2">Stock disponible: <strong>${product.stock}</strong></p>
                  <button type="button" class="${buttonClasses} add-to-cart" data-code="${escapeHtml(product.code)}" ${disabledAttr}>
                    ${ADD_TO_CART_ICON}
                    <span>Agregar a la cesta</span>
                  </button>
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

    if (!hasVisibleProducts) {
      $container.prepend('<div class="alert alert-warning mb-3">No hay productos que coincidan con la búsqueda aplicada.</div>');
    }
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
      $cartItems.html('<p class="text-muted mb-2">La cesta está vacía.</p>');
    } else {
      const cartHtml = items
        .map(([code, quantity]) => {
          const product = findProduct(code);
          if (!product) return "";

          const itemTotal = quantity * product.price;
          return `
            <div class="cart-item">
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.titulo)}">
              <div>
                <p class="mb-1"><strong>${escapeHtml(product.titulo)}</strong></p>
                <small>${escapeHtml(product.description)}</small><br>
                <small>Código: ${escapeHtml(product.code)}</small><br>
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
    $("#clearCartBtn").prop("disabled", items.length === 0);
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
      showSystemMessage("Tu cesta está vacía. Agrega productos antes de pedir.", "warning");
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

  async function clearCart() {
    const items = Object.entries(state.cart);
    if (items.length === 0) {
      showSystemMessage("La cesta ya está vacía.", "info");
      return;
    }

    const confirmed = await askForConfirmation({
      title: "Vaciar cesta",
      message: "¿Quieres vaciar toda la cesta? Se restaurará el stock de los productos.",
      confirmText: "Vaciar cesta",
      confirmButtonClass: "btn-warning"
    });

    if (!confirmed) {
      return;
    }

    items.forEach(([code, quantity]) => {
      const product = findProduct(code);
      if (product) {
        product.stock += quantity;
      }
    });

    state.cart = {};
    clearOrderMessage();
    renderProducts();
    renderCart();
    showSystemMessage("Cesta vaciada correctamente.", "success");
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
    refreshAdminEditors(normalizedId, $("#editProductSelect").val());
    renderProducts();
    showAdminMessage(`Categoria "${rawName}" creada correctamente.`, false);
    event.target.reset();
  }

  function addProduct(event) {
    event.preventDefault();

    const titulo = $("#productTitle").val().trim();
    const code = $("#productCode").val().trim();
    const categoryId = $("#productCategory").val();
    const description = $("#productDescription").val().trim();
    const price = Number.parseFloat($("#productPrice").val());
    const stock = Number.parseInt($("#productStock").val(), 10);
    const imageName = $("#productImageName").val().trim();

    if (!titulo || !code || !categoryId || !description || Number.isNaN(price) || Number.isNaN(stock)) {
      showAdminMessage("Completa todos los campos obligatorios del producto.", true);
      return;
    }

    if (price < 0 || stock < 0) {
      showAdminMessage("Precio y stock deben ser valores no negativos.", true);
      return;
    }

    if (productCodeExists(code)) {
      showAdminMessage("El código del producto ya existe.", true);
      return;
    }

    if (!categoryIdExists(categoryId)) {
      showAdminMessage("La categoría seleccionada no existe.", true);
      return;
    }

    state.products.push({
      titulo,
      code,
      categoryId,
      description,
      price,
      stock,
      image: buildImagePath(imageName)
    });

    refreshAdminEditors(categoryId, code);
    renderProducts();
    showAdminMessage(`Producto "${code}" agregado correctamente.`, false);
    event.target.reset();
  }

  function updateCategory(event) {
    event.preventDefault();

    const selectedCategoryId = $("#editCategorySelect").val();
    const category = findCategory(selectedCategoryId);
    if (!category) {
      showAdminMessage("No hay categoría seleccionada para editar.", true);
      return;
    }

    const nextCategoryId = $("#editCategoryId").val().trim().toLowerCase();
    const nextCategoryName = $("#editCategoryName").val().trim();

    if (!nextCategoryId || !nextCategoryName) {
      showAdminMessage("Debes completar identificador y nombre de categoría.", true);
      return;
    }

    if (nextCategoryId !== selectedCategoryId && categoryIdExists(nextCategoryId)) {
      showAdminMessage("Ya existe otra categoría con ese identificador.", true);
      return;
    }

    const oldCategoryId = category.id;
    category.id = nextCategoryId;
    category.name = nextCategoryName;

    if (oldCategoryId !== nextCategoryId) {
      state.products.forEach((product) => {
        if (product.categoryId === oldCategoryId) {
          product.categoryId = nextCategoryId;
        }
      });

      const wasVisible = state.categoryVisibility[oldCategoryId] !== false;
      delete state.categoryVisibility[oldCategoryId];
      state.categoryVisibility[nextCategoryId] = wasVisible;
    }

    refreshAdminEditors(nextCategoryId, $("#editProductSelect").val());
    renderProducts();
    showAdminMessage(`Categoría "${nextCategoryName}" actualizada correctamente.`, false);
  }

  async function deleteCategory() {
    const selectedCategoryId = $("#editCategorySelect").val();
    const category = findCategory(selectedCategoryId);
    if (!category) {
      showAdminMessage("No hay categoría seleccionada para eliminar.", true);
      return;
    }

    const productsInCategory = state.products.filter((product) => product.categoryId === selectedCategoryId);
    const confirmationText = productsInCategory.length > 0
      ? `La categoría "${category.name}" tiene ${productsInCategory.length} producto(s) asociados. Se eliminarán también. ¿Continuar?`
      : `¿Eliminar la categoría "${category.name}"?`;

    const confirmed = await askForConfirmation({
      title: "Eliminar categoría",
      message: confirmationText,
      confirmText: "Eliminar",
      confirmButtonClass: "btn-danger"
    });

    if (!confirmed) {
      return;
    }

    const removedCodes = new Set(productsInCategory.map((product) => product.code));

    state.categories = state.categories.filter((item) => item.id !== selectedCategoryId);
    state.products = state.products.filter((product) => product.categoryId !== selectedCategoryId);
    delete state.categoryVisibility[selectedCategoryId];

    removedCodes.forEach((code) => {
      delete state.cart[code];
    });

    const nextCategoryId = state.categories[0]?.id || "";
    const nextProductCode = state.products[0]?.code || "";
    refreshAdminEditors(nextCategoryId, nextProductCode);
    renderProducts();
    renderCart();
    showAdminMessage(`Categoría "${category.name}" eliminada correctamente.`, false);
  }

  function updateProduct(event) {
    event.preventDefault();

    const selectedCode = $("#editProductSelect").val();
    const product = findProduct(selectedCode);
    if (!product) {
      showAdminMessage("No hay producto seleccionado para editar.", true);
      return;
    }

    const nextTitle = $("#editProductTitle").val().trim();
    const nextCode = $("#editProductCode").val().trim();
    const nextCategoryId = $("#editProductCategory").val();
    const nextDescription = $("#editProductDescription").val().trim();
    const nextPrice = Number.parseFloat($("#editProductPrice").val());
    const nextStock = Number.parseInt($("#editProductStock").val(), 10);
    const nextImageName = $("#editProductImageName").val().trim();

    if (!nextTitle || !nextCode || !nextCategoryId || !nextDescription || Number.isNaN(nextPrice) || Number.isNaN(nextStock)) {
      showAdminMessage("Completa todos los campos obligatorios del producto.", true);
      return;
    }

    if (nextPrice < 0 || nextStock < 0) {
      showAdminMessage("Precio y stock deben ser valores no negativos.", true);
      return;
    }

    if (nextCode.toLowerCase() !== selectedCode.toLowerCase() && productCodeExists(nextCode)) {
      showAdminMessage("Ya existe otro producto con ese código.", true);
      return;
    }

    if (!categoryIdExists(nextCategoryId)) {
      showAdminMessage("La categoría seleccionada no existe.", true);
      return;
    }

    const oldCode = product.code;
    product.titulo = nextTitle;
    product.code = nextCode;
    product.categoryId = nextCategoryId;
    product.description = nextDescription;
    product.price = nextPrice;
    product.stock = nextStock;
    product.image = buildImagePath(nextImageName);

    if (oldCode !== nextCode && state.cart[oldCode]) {
      state.cart[nextCode] = (state.cart[nextCode] || 0) + state.cart[oldCode];
      delete state.cart[oldCode];
    }

    refreshAdminEditors(nextCategoryId, nextCode);
    renderProducts();
    renderCart();
    showAdminMessage(`Producto "${nextCode}" actualizado correctamente.`, false);
  }

  async function deleteProduct() {
    const selectedCode = $("#editProductSelect").val();
    const product = findProduct(selectedCode);
    if (!product) {
      showAdminMessage("No hay producto seleccionado para eliminar.", true);
      return;
    }

    const confirmed = await askForConfirmation({
      title: "Eliminar producto",
      message: `¿Eliminar el producto "${product.titulo}" (${product.code})?`,
      confirmText: "Eliminar",
      confirmButtonClass: "btn-danger"
    });

    if (!confirmed) {
      return;
    }

    state.products = state.products.filter((item) => item.code !== selectedCode);
    delete state.cart[selectedCode];

    const nextCategoryId = state.categories[0]?.id || "";
    const nextProductCode = state.products[0]?.code || "";
    refreshAdminEditors(nextCategoryId, nextProductCode);
    renderProducts();
    renderCart();
    showAdminMessage(`Producto "${product.code}" eliminado correctamente.`, false);
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
    $("#clearCartBtn").on("click", clearCart);
    $("#adminAccessBtn").on("click", requestAdminAccess);
    $("#categoryForm").on("submit", addCategory);
    $("#categoryEditForm").on("submit", updateCategory);
    $("#editCategorySelect").on("change", syncCategoryEditorFields);
    $("#deleteCategoryBtn").on("click", deleteCategory);
    $("#productForm").on("submit", addProduct);
    $("#productEditForm").on("submit", updateProduct);
    $("#editProductSelect").on("change", syncProductEditorFields);
    $("#deleteProductBtn").on("click", deleteProduct);
    $("#categoryQuickNav").on("change", function onCategoryQuickNavChange() {
      const selectedCategoryId = $(this).val();
      openAndFocusCategory(selectedCategoryId);
    });
    $("#catalogSearch").on("input", function onCatalogSearchInput() {
      state.catalogSearchQuery = $(this).val().trim();
      renderProducts();
    });
    $("#catalogSort").on("change", function onCatalogSortChange() {
      state.catalogSortBy = $(this).val();
      renderProducts();
    });
    $("#confirmActionBtn").on("click", function onConfirmActionClick() {
      if (!confirmModalResolver) return;
      const resolve = confirmModalResolver;
      confirmModalResolver = null;
      const modalElement = document.getElementById("confirmActionModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
      resolve(true);
    });
    $("#confirmActionModal").on("hidden.bs.modal", function onConfirmModalHidden() {
      if (!confirmModalResolver) return;
      const resolve = confirmModalResolver;
      confirmModalResolver = null;
      resolve(false);
    });
  }

  function init() {
    bootstrapData();
    refreshAdminEditors();
    $("#catalogSort").val(state.catalogSortBy);
    renderProducts();
    renderCart();
    setCartVisibility(true);
    bindEvents();
  }

  $(init);
})();
