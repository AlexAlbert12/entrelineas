"use strict";

(() => {
  const ADMIN_PASSWORD = "123456";
  const IMG_DIR = "img";
  const DEFAULT_IMAGE_FILE = "La-sombra-del-viento.jpg";
  const STORAGE_KEY = "entrelineas-state-v1";
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
      { id: "infantil", name: "Infantil" },
      { id: "fantasia", name: "Fantasia" },
      { id: "poesia", name: "Poesia" },
      { id: "historia", name: "Historia" }
    ];

    state.products = [
      {
        titulo: "La sombra del viento",
        author: "Carlos Ruiz Zafon",
        code: "EL001",
        categoryId: "novela",
        description: "Novela de misterio literario ambientada en Barcelona.",
        price: 21.9,
        stock: 6,
        image: buildImagePath("La-sombra-del-viento.jpg")
      },
      {
        titulo: "Patria",
        author: "Fernando Aramburu",
        code: "EL002",
        categoryId: "novela",
        description: "Relato sobre memoria, conflicto y reconciliacion.",
        price: 18.5,
        stock: 4,
        image: buildImagePath("patria.jpg")
      },
      {
        titulo: "Sapiens",
        author: "Yuval Noah Harari",
        code: "EL003",
        categoryId: "ensayo",
        description: "Breve historia de la humanidad y sus transformaciones.",
        price: 24.2,
        stock: 5,
        image: buildImagePath("sapiens.jfif")
      },
      {
        titulo: "El principito",
        author: "Antoine de Saint-Exupery",
        code: "EL004",
        categoryId: "infantil",
        description: "Clasico ilustrado para lectores de todas las edades.",
        price: 14.75,
        stock: 8,
        image: buildImagePath("el-principito.jpg")
      },
      {
        titulo: "Cuentos para soñar",
        author: "Varios autores",
        code: "EL005",
        categoryId: "infantil",
        description: "Historias cortas para lectura antes de dormir.",
        price: 12.9,
        stock: 3,
        image: buildImagePath("cuentos.jpg")
      },
      {
        titulo: "1984",
        author: "George Orwell",
        code: "EL006",
        categoryId: "novela",
        description: "Distopia clasica sobre vigilancia y control social.",
        price: 16.4,
        stock: 7,
        image: buildImagePath("1984.jpg")
      },
      {
        titulo: "El hombre en busca de sentido",
        author: "Viktor Frankl",
        code: "EL007",
        categoryId: "ensayo",
        description: "Reflexion sobre resiliencia, libertad interior y proposito.",
        price: 19.6,
        stock: 5,
        image: buildImagePath("hombre_en_busca_sentido.jpg")
      },
      {
        titulo: "El hobbit",
        author: "J. R. R. Tolkien",
        code: "EL008",
        categoryId: "fantasia",
        description: "Aventura fantastica sobre el viaje de Bilbo Bolsón.",
        price: 22.1,
        stock: 6,
        image: buildImagePath("el_hobbit.jpg")
      },
      {
        titulo: "Mitos nordicos",
        author: "Neil Gaiman",
        code: "EL009",
        categoryId: "fantasia",
        description: "Recopilacion de leyendas y dioses del norte de Europa.",
        price: 17.3,
        stock: 4,
        image: buildImagePath("mitos_nordicos.jpg")
      },
      {
        titulo: "Veinte poemas de amor",
        author: "Pablo Neruda",
        code: "EL010",
        categoryId: "poesia",
        description: "Coleccion poetica centrada en el amor y la melancolia.",
        price: 13.8,
        stock: 9,
        image: buildImagePath("veinte_poemas.jpg")
      },
      {
        titulo: "Poeta en Nueva York",
        author: "Federico Garcia Lorca",
        code: "EL011",
        categoryId: "poesia",
        description: "Obra lirica con critica social y lenguaje simbolico.",
        price: 15.2,
        stock: 5,
        image: buildImagePath("poeta_nueva_york.jpg")
      },
      {
        titulo: "SPQR: Una historia de la antigua Roma",
        author: "Mary Beard",
        code: "EL012",
        categoryId: "historia",
        description: "Panorama claro sobre la expansion y legado de Roma.",
        price: 23.7,
        stock: 4,
        image: buildImagePath("spqr.jpg")
      },
      {
        titulo: "Breve historia de casi todo",
        author: "Bill Bryson",
        code: "EL013",
        categoryId: "historia",
        description: "Recorrido divulgativo por ciencia e historia del conocimiento.",
        price: 20.5,
        stock: 6,
        image: buildImagePath("breve-historia.jpg")
      }
    ];

    state.cart = {};
    state.categoryVisibility = {};
    state.categories.forEach((category) => {
      state.categoryVisibility[category.id] = true;
    });
  }

  function normalizeState() {
    const categoryIdSet = new Set();
    state.categories = Array.isArray(state.categories)
      ? state.categories
        .filter((category) => category && typeof category.id === "string" && typeof category.name === "string")
        .map((category) => ({
          id: category.id.trim().toLowerCase(),
          name: category.name.trim()
        }))
        .filter((category) => {
          if (!category.id || !category.name || categoryIdSet.has(category.id)) return false;
          categoryIdSet.add(category.id);
          return true;
        })
      : [];

    const validCategoryIds = new Set(state.categories.map((category) => category.id));
    const codeSet = new Set();
    state.products = Array.isArray(state.products)
      ? state.products
        .filter((product) => (
          product
          && typeof product.titulo === "string"
          && typeof product.code === "string"
          && typeof product.categoryId === "string"
          && typeof product.description === "string"
        ))
        .map((product) => {
          const rawAuthor = typeof product.author === "string"
            ? product.author
            : (typeof product.autor === "string" ? product.autor : "");

          return {
            titulo: product.titulo.trim(),
            author: rawAuthor.trim() || "Autor desconocido",
            code: product.code.trim(),
            categoryId: product.categoryId.trim().toLowerCase(),
            description: product.description.trim(),
            price: Number.parseFloat(product.price),
            stock: Number.parseInt(product.stock, 10),
            image: buildImagePath(product.image)
          };
        })
        .filter((product) => {
          if (
            !product.titulo
            || !product.author
            || !product.code
            || !product.categoryId
            || !product.description
            || !validCategoryIds.has(product.categoryId)
            || Number.isNaN(product.price)
            || Number.isNaN(product.stock)
            || product.price < 0
            || product.stock < 0
            || codeSet.has(product.code.toLowerCase())
          ) {
            return false;
          }
          codeSet.add(product.code.toLowerCase());
          return true;
        })
      : [];

    const validCodes = new Set(state.products.map((product) => product.code));
    const nextCart = {};
    if (state.cart && typeof state.cart === "object") {
      Object.entries(state.cart).forEach(([code, quantity]) => {
        const parsedQuantity = Number.parseInt(quantity, 10);
        if (validCodes.has(code) && Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
          nextCart[code] = parsedQuantity;
        }
      });
    }
    state.cart = nextCart;

    const visibility = state.categoryVisibility && typeof state.categoryVisibility === "object"
      ? state.categoryVisibility
      : {};
    const nextVisibility = {};
    state.categories.forEach((category) => {
      nextVisibility[category.id] = visibility[category.id] !== false;
    });
    state.categoryVisibility = nextVisibility;

    state.cartVisible = state.cartVisible !== false;
    state.catalogSearchQuery = typeof state.catalogSearchQuery === "string"
      ? state.catalogSearchQuery.trim()
      : "";

    const validSorts = new Set(["default", "titulo-asc", "titulo-desc", "precio-asc", "precio-desc"]);
    state.catalogSortBy = validSorts.has(state.catalogSortBy) ? state.catalogSortBy : "default";
  }

  function saveStateToStorage() {
    try {
      const snapshot = {
        categories: state.categories,
        products: state.products,
        cart: state.cart,
        cartVisible: state.cartVisible,
        categoryVisibility: state.categoryVisibility,
        catalogSearchQuery: state.catalogSearchQuery,
        catalogSortBy: state.catalogSortBy
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn("No se pudo guardar el estado en localStorage.", error);
    }
  }

  function loadStateFromStorage() {
    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) return false;

      const parsedState = JSON.parse(rawState);
      if (!parsedState || typeof parsedState !== "object") return false;

      state.categories = parsedState.categories;
      state.products = parsedState.products;
      state.cart = parsedState.cart;
      state.cartVisible = parsedState.cartVisible;
      state.categoryVisibility = parsedState.categoryVisibility;
      state.catalogSearchQuery = parsedState.catalogSearchQuery;
      state.catalogSortBy = parsedState.catalogSortBy;

      normalizeState();
      return true;
    } catch (error) {
      console.warn("No se pudo cargar el estado desde localStorage.", error);
      return false;
    }
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
          product.author,
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
    const variantMap = {
      success: "success",
      danger: "danger",
      warning: "warning",
      info: "info"
    };
    showToast(text, {
      title: "Sistema",
      variant: variantMap[type] || "success",
      delay: type === "danger" ? 3200 : 2600
    });
  }

  function resolveToastVariantClass(variant) {
    switch (variant) {
      case "success":
        return "text-bg-success";
      case "danger":
        return "text-bg-danger";
      case "warning":
        return "text-bg-warning";
      case "info":
        return "text-bg-primary";
      default:
        return "text-bg-dark";
    }
  }

  function showToast(message, { title = "Entre Lineas", variant = "success", delay = 2600 } = {}) {
    const container = document.getElementById("toastContainer");
    if (!container || !window.bootstrap?.Toast) return;

    const toastId = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toastHtml = `
      <div id="${toastId}" class="toast ${resolveToastVariantClass(variant)} border-0" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="${delay}">
        <div class="d-flex">
          <div class="toast-body">
            <strong class="me-2">${escapeHtml(title)}</strong>${escapeHtml(message)}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
      </div>`;

    $(container).append(toastHtml);
    const toastElement = document.getElementById(toastId);
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement, { delay, autohide: true });
    toastElement.addEventListener("hidden.bs.toast", () => {
      $(toastElement).remove();
    }, { once: true });
    toastInstance.show();
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
    const $quickNav = $(".category-quick-nav");
    const $trigger = $("#categoryQuickNavBtn");
    const $triggerLabel = $trigger.find(".btn-label");
    const $menu = $("#categoryQuickNavMenu");

    if (state.categories.length === 0) {
      $menu.html('<span class="category-fan-empty">No hay categorías disponibles</span>');
      $trigger.prop("disabled", true);
      $triggerLabel.text("Categoría");
      setCategoryQuickNavOpen(false);
      return;
    }

    const options = state.categories
      .map((category, index) => `
        <button
          type="button"
          class="category-fan-item ${selectedId === category.id ? "is-active" : ""}"
          data-category-id="${escapeHtml(category.id)}"
          role="menuitem"
          style="--item-index:${index};">
          ${escapeHtml(category.name)}
        </button>`)
      .join("");

    $menu.html(options);
    $trigger.prop("disabled", false);

    const selectedCategory = selectedId && categoryIdExists(selectedId)
      ? findCategory(selectedId)
      : null;
    $triggerLabel.text(selectedCategory ? `Categoría: ${selectedCategory.name}` : "Categoría");
    $quickNav.removeClass("is-open");
    $trigger.attr("aria-expanded", "false");
  }

  function setCategoryQuickNavOpen(isOpen) {
    const $quickNav = $(".category-quick-nav");
    const $trigger = $("#categoryQuickNavBtn");
    $quickNav.toggleClass("is-open", isOpen);
    $trigger.attr("aria-expanded", isOpen ? "true" : "false");
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

  function setInlineFieldError(inputSelector, errorSelector, message) {
    const hasError = Boolean(message);
    $(inputSelector).toggleClass("is-invalid", hasError);
    const $error = $(errorSelector);
    $error.toggleClass("d-none", !hasError);
    $error.text(hasError ? message : "");
  }

  function validateUniqueAdminIdentifiers() {
    const newCategoryId = $("#categoryId").val().trim().toLowerCase();
    const newCategoryDuplicate = Boolean(newCategoryId) && categoryIdExists(newCategoryId);
    setInlineFieldError("#categoryId", "#categoryIdDuplicateError", newCategoryDuplicate ? "Ese identificador de categoria ya existe." : "");
    $("#categoryForm button[type='submit']").prop("disabled", newCategoryDuplicate);

    const hasCategories = state.categories.length > 0;
    const newProductCode = $("#productCode").val().trim();
    const newProductDuplicate = Boolean(newProductCode) && productCodeExists(newProductCode);
    setInlineFieldError("#productCode", "#productCodeDuplicateError", newProductDuplicate ? "Ese codigo de producto ya existe." : "");
    $("#productForm button[type='submit']").prop("disabled", !hasCategories || newProductDuplicate);

    const selectedCategoryId = String($("#editCategorySelect").val() || "").toLowerCase();
    const hasEditableCategory = Boolean(findCategory(selectedCategoryId));
    const editCategoryId = $("#editCategoryId").val().trim().toLowerCase();
    const editCategoryDuplicate = hasEditableCategory
      && Boolean(editCategoryId)
      && editCategoryId !== selectedCategoryId
      && categoryIdExists(editCategoryId);
    setInlineFieldError("#editCategoryId", "#editCategoryIdDuplicateError", editCategoryDuplicate ? "Ese identificador de categoria ya existe." : "");
    $("#categoryEditForm button[type='submit']").prop("disabled", !hasEditableCategory || editCategoryDuplicate);

    const selectedProductCode = String($("#editProductSelect").val() || "");
    const hasEditableProduct = Boolean(findProduct(selectedProductCode));
    const editProductCode = $("#editProductCode").val().trim();
    const editProductDuplicate = hasEditableProduct
      && Boolean(editProductCode)
      && editProductCode.toLowerCase() !== selectedProductCode.toLowerCase()
      && productCodeExists(editProductCode);
    setInlineFieldError("#editProductCode", "#editProductCodeDuplicateError", editProductDuplicate ? "Ese codigo de producto ya existe." : "");
    $("#productEditForm button[type='submit']").prop("disabled", !hasEditableProduct || editProductDuplicate);
  }

  function syncCategoryEditorFields() {
    const selectedId = $("#editCategorySelect").val();
    const category = findCategory(selectedId);
    const disabled = !category;

    $("#editCategoryId, #editCategoryName, #deleteCategoryBtn, #categoryEditForm button[type='submit']").prop("disabled", disabled);

    if (!category) {
      $("#editCategoryId").val("");
      $("#editCategoryName").val("");
      validateUniqueAdminIdentifiers();
      return;
    }

    $("#editCategoryId").val(category.id);
    $("#editCategoryName").val(category.name);
    validateUniqueAdminIdentifiers();
  }

  function syncProductEditorFields() {
    const selectedCode = $("#editProductSelect").val();
    const product = findProduct(selectedCode);
    const disabled = !product;

    $("#editProductTitle, #editProductAuthor, #editProductCode, #editProductCategory, #editProductDescription, #editProductPrice, #editProductStock, #editProductImageName, #deleteProductBtn, #productEditForm button[type='submit']").prop("disabled", disabled);

    if (!product) {
      $("#editProductTitle").val("");
      $("#editProductAuthor").val("");
      $("#editProductCode").val("");
      $("#editProductCategory").val("");
      $("#editProductDescription").val("");
      $("#editProductPrice").val("");
      $("#editProductStock").val("");
      $("#editProductImageName").val("");
      validateUniqueAdminIdentifiers();
      return;
    }

    $("#editProductTitle").val(product.titulo);
    $("#editProductAuthor").val(product.author || "");
    $("#editProductCode").val(product.code);
    $("#editProductCategory").val(product.categoryId);
    $("#editProductDescription").val(product.description);
    $("#editProductPrice").val(product.price.toFixed(2));
    $("#editProductStock").val(product.stock);
    $("#editProductImageName").val(extractImageFileName(product.image));
    validateUniqueAdminIdentifiers();
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
    validateUniqueAdminIdentifiers();
  }

  function openAndFocusCategory(categoryId) {
    if (!categoryId || !categoryIdExists(categoryId)) return;

    state.categoryVisibility[categoryId] = true;
    saveStateToStorage();
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
                  <p class="mb-1">Autor: <strong>${escapeHtml(product.author || "Autor desconocido")}</strong></p>
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

  function calculateCartUnits() {
    return Object.values(state.cart).reduce((acc, quantity) => acc + quantity, 0);
  }

  function renderCartBadge() {
    const totalUnits = calculateCartUnits();
    const $badge = $("#cartCountBadge");
    $badge.text(totalUnits);
    $badge.toggleClass("is-empty", totalUnits <= 0);
    $("#toggleCartBtn").attr(
      "aria-label",
      totalUnits > 0
        ? `Cesta con ${totalUnits} producto(s)`
        : "Cesta vacia"
    );
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
                <small>Autor: ${escapeHtml(product.author || "Autor desconocido")}</small><br>
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
    renderCartBadge();
  }

  function setCartVisibility(visible, shouldPersist = true) {
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

    if (shouldPersist) {
      saveStateToStorage();
    }
  }

  function clearOrderMessage() {
    const modalElement = document.getElementById("orderSuccessModal");
    const modalBody = document.getElementById("orderSuccessModalBody");

    if (modalBody) {
      modalBody.innerHTML = "";
    }

    if (modalElement && window.bootstrap?.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    }
  }

  function showOrderSuccessModal(summaryHtml) {
    const modalElement = document.getElementById("orderSuccessModal");
    const modalBody = document.getElementById("orderSuccessModalBody");
    if (!modalElement || !modalBody || !window.bootstrap?.Modal) return;

    modalBody.innerHTML = summaryHtml;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }

  function addToCart(code) {
    const product = findProduct(code);
    if (!product || product.stock <= 0) return;

    $(`button[data-code="${code}"]`).addClass('btn-success').text('¡Añadido!');
    setTimeout(() => {
      renderProducts();
    }, 800);

    product.stock -= 1;
    state.cart[code] = (state.cart[code] || 0) + 1;

    renderCart();
    saveStateToStorage();
    showToast(`"${product.titulo}" agregado a la cesta.`, { title: "Cesta", variant: "success" });
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
    saveStateToStorage();
  }

  async function placeOrder() {
    const total = calculateTotal();
    const totalUnits = calculateCartUnits();

    if (total <= 0) {
      showSystemMessage("Tu cesta está vacía. Agrega libros antes de pedir.", "warning");
      return;
    }

    const confirmed = await askForConfirmation({
      title: "Confirmar pedido",
      message: `¿Deseas realizar este pedido por un total de ${formatCurrency(total)}?`,
      confirmText: "Realizar pedido",
      confirmButtonClass: "btn-success"
    });

    if (!confirmed) {
      return;
    }

    const summaryHtml = `
        <div class="order-confirmation-card">
            <div class="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h4>¡Gracias por tu compra!</h4>
            <p class="small text-muted">Tu pedido en <strong>Entre Líneas</strong> ha sido procesado con éxito.</p>
            
            <div class="order-summary-box">
                <div class="order-summary-item">
                    <span>Libros adquiridos:</span>
                    <strong>${totalUnits}</strong>
                </div>
                <div class="order-summary-item">
                    <span>Total abonado:</span>
                    <strong class="text-success">${formatCurrency(total)}</strong>
                </div>
            </div>
            
            <p class="mt-3 mb-0 small italic">Recibirás un correo con los detalles del envío.</p>
        </div>
    `;

    state.cart = {};
    renderCart();
    saveStateToStorage();
    showOrderSuccessModal(summaryHtml);

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
    saveStateToStorage();
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
    showToast("Modo administrador activo.", { title: "Administracion", variant: "success" });
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
    saveStateToStorage();
    showAdminMessage(`Categoria "${rawName}" creada correctamente.`, false);
    showToast(`Categoria "${rawName}" creada.`, { title: "Administracion", variant: "success" });
    event.target.reset();
    validateUniqueAdminIdentifiers();
  }

  function addProduct(event) {
    event.preventDefault();

    const titulo = $("#productTitle").val().trim();
    const author = $("#productAuthor").val().trim();
    const code = $("#productCode").val().trim();
    const categoryId = $("#productCategory").val();
    const description = $("#productDescription").val().trim();
    const price = Number.parseFloat($("#productPrice").val());
    const stock = Number.parseInt($("#productStock").val(), 10);
    const imageName = $("#productImageName").val().trim();

    if (!titulo || !author || !code || !categoryId || !description || Number.isNaN(price) || Number.isNaN(stock)) {
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
      author,
      code,
      categoryId,
      description,
      price,
      stock,
      image: buildImagePath(imageName)
    });

    refreshAdminEditors(categoryId, code);
    renderProducts();
    saveStateToStorage();
    showAdminMessage(`Producto "${code}" agregado correctamente.`, false);
    showToast(`Producto "${code}" agregado.`, { title: "Administracion", variant: "success" });
    event.target.reset();
    validateUniqueAdminIdentifiers();
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
    saveStateToStorage();
    showAdminMessage(`Categoría "${nextCategoryName}" actualizada correctamente.`, false);
    showToast(`Categoria "${nextCategoryName}" actualizada.`, { title: "Administracion", variant: "success" });
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
    saveStateToStorage();
    showAdminMessage(`Categoría "${category.name}" eliminada correctamente.`, false);
    showToast(`Categoria "${category.name}" eliminada.`, { title: "Administracion", variant: "success" });
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
    const nextAuthor = $("#editProductAuthor").val().trim();
    const nextCode = $("#editProductCode").val().trim();
    const nextCategoryId = $("#editProductCategory").val();
    const nextDescription = $("#editProductDescription").val().trim();
    const nextPrice = Number.parseFloat($("#editProductPrice").val());
    const nextStock = Number.parseInt($("#editProductStock").val(), 10);
    const nextImageName = $("#editProductImageName").val().trim();

    if (!nextTitle || !nextAuthor || !nextCode || !nextCategoryId || !nextDescription || Number.isNaN(nextPrice) || Number.isNaN(nextStock)) {
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
    product.author = nextAuthor;
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
    saveStateToStorage();
    showAdminMessage(`Producto "${nextCode}" actualizado correctamente.`, false);
    showToast(`Producto "${nextCode}" actualizado.`, { title: "Administracion", variant: "success" });
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
    saveStateToStorage();
    showAdminMessage(`Producto "${product.code}" eliminado correctamente.`, false);
    showToast(`Producto "${product.code}" eliminado.`, { title: "Administracion", variant: "success" });
  }

  function bindEvents() {
    $("#productsContainer").on("click", ".add-to-cart", function onAddClick() {
      const code = $(this).data("code");
      addToCart(code);
    });

    $("#productsContainer").on("click", ".category-toggle", function onCategoryToggle() {
      const categoryId = $(this).data("category-id");
      const $products = $(this).next(".category-products");
      const $indicator = $(this).find(".toggle-indicator");
      const isOpen = state.categoryVisibility[categoryId] !== false;

      state.categoryVisibility[categoryId] = !isOpen;
      saveStateToStorage();

      $indicator.text(isOpen ? "+" : "-");

      $products.stop(true, true).slideToggle(450, "swing");
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
    $("#categoryId, #productCode, #editCategoryId, #editProductCode").on("input", validateUniqueAdminIdentifiers);
    $("#deleteCategoryBtn").on("click", deleteCategory);
    $("#productForm").on("submit", addProduct);
    $("#productEditForm").on("submit", updateProduct);
    $("#editProductSelect").on("change", syncProductEditorFields);
    $("#deleteProductBtn").on("click", deleteProduct);
    $("#categoryQuickNavBtn").on("click", function onCategoryQuickNavTriggerClick(event) {
      event.stopPropagation();
      const isOpen = $(".category-quick-nav").hasClass("is-open");
      setCategoryQuickNavOpen(!isOpen);
    });
    $("#categoryQuickNavMenu").on("click", ".category-fan-item", function onCategoryQuickNavItemClick() {
      const selectedCategoryId = $(this).data("category-id");
      buildCategoryQuickNav(selectedCategoryId);
      openAndFocusCategory(selectedCategoryId);
      setCategoryQuickNavOpen(false);
    });
    $(document).on("click", function onDocumentClick(event) {
      if ($(event.target).closest(".category-quick-nav").length > 0) return;
      setCategoryQuickNavOpen(false);
    });
    $(document).on("keydown", function onDocumentKeydown(event) {
      if (event.key === "Escape") {
        setCategoryQuickNavOpen(false);
      }
    });
    $("#catalogSearch").on("input", function onCatalogSearchInput() {
      state.catalogSearchQuery = $(this).val().trim();
      renderProducts();
      saveStateToStorage();
    });
    $("#catalogSort").on("change", function onCatalogSortChange() {
      state.catalogSortBy = $(this).val();
      renderProducts();
      saveStateToStorage();
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
    const loadedFromStorage = loadStateFromStorage();
    if (!loadedFromStorage) {
      bootstrapData();
      normalizeState();
    }
    saveStateToStorage();

    refreshAdminEditors();
    $("#catalogSearch").val(state.catalogSearchQuery);
    $("#catalogSort").val(state.catalogSortBy);
    renderProducts();
    renderCart();
    setCartVisibility(state.cartVisible, false);
    bindEvents();
  }

  $(init);
})();
