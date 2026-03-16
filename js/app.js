"use strict";

(() => {
  const ADMIN_PASSWORD = "123456";
  const IMG_DIR = "img";
  const DEFAULT_IMAGE_FILE = "La-sombra-del-viento.jpg";
  const MAX_IMAGE_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;
  const STORAGE_KEY = "entrelineas-state-v1";
  const ADD_TO_CART_ICON = '<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(4 4)"><path d="m2.42575356.50254623 8.09559774-.00228586c.5209891-.00014706.9548019.39973175.9969972.91900932l.8938128 10.99973961c.0447299.5504704-.3652538 1.0329756-.9157242 1.0777056l-.0809907.0032851h-9.83555122c-.55228475 0-1-.4477152-1-1l.00294679-.076713.84614072-10.99745378c.0400765-.52088193.4743495-.92313949.99677087-.92328699z"/><path d="m9.5 4.5v.64527222c0 1.10456949-1.8954305 1.35472778-3 1.35472778s-3-.3954305-3-1.5v-.5"/></g></svg>';
  const CATEGORY_ICON_SVGS = Object.freeze({
    novela: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M5.12634 17C5.04271 17.6571 5 18.325 5 19V21M5.12634 17C6.03384 9.86861 11.7594 4 20 4L19 8H16L17 10L15 12H11L13 14L12 16H8L5.12634 17Z"></path> </g></svg>',
    ensayo: '<svg viewBox="-4 0 19 19" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M10.328 6.83a5.903 5.903 0 0 1-1.439 3.64 2.874 2.874 0 0 0-.584 1v1.037a.95.95 0 0 1-.95.95h-3.71a.95.95 0 0 1-.95-.95V11.47a2.876 2.876 0 0 0-.584-1A5.903 5.903 0 0 1 .67 6.83a4.83 4.83 0 0 1 9.28-1.878 4.796 4.796 0 0 1 .38 1.88zm-.95 0a3.878 3.878 0 0 0-7.756 0c0 2.363 2.023 3.409 2.023 4.64v1.037h3.71V11.47c0-1.231 2.023-2.277 2.023-4.64zM7.83 14.572a.475.475 0 0 1-.475.476h-3.71a.475.475 0 0 1 0-.95h3.71a.475.475 0 0 1 .475.474zm-.64 1.262a.238.238 0 0 1-.078.265 2.669 2.669 0 0 1-3.274 0 .237.237 0 0 1 .145-.425h2.983a.238.238 0 0 1 .225.16z"></path></g></svg>',
    infantil: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.24"><path d="M10.9391 5.49826C11.0902 5.1126 10.9001 4.67744 10.5144 4.5263C10.1288 4.37516 9.69362 4.56528 9.54248 4.95093L10.9391 5.49826ZM11.8058 9.56459L12.1694 8.90867L12.1687 8.90826L11.8058 9.56459ZM13.502 10.7516C13.9162 10.7509 14.2514 10.4146 14.2508 10.0004C14.2501 9.58617 13.9138 9.25093 13.4996 9.25159L13.502 10.7516ZM10.2408 5.22459L10.0531 4.49845L10.0517 4.49883L10.2408 5.22459ZM18.7648 10.1936L18.0404 10.3881C18.1005 10.6118 18.2606 10.7952 18.4742 10.885C18.6877 10.9748 18.9308 10.9608 19.1327 10.8472L18.7648 10.1936ZM20.6096 10.4908L20.0551 10.9958V10.9958L20.6096 10.4908ZM20.7332 12.3554L21.3496 12.7827V12.7827L20.7332 12.3554ZM18.9438 12.8936L19.2222 12.1972C19.0067 12.111 18.7635 12.1295 18.5635 12.2471C18.3635 12.3648 18.2292 12.5683 18.1998 12.7985L18.9438 12.8936ZM5.05677 12.8936L5.80072 12.7985C5.7713 12.5683 5.63701 12.3648 5.43702 12.2471C5.23702 12.1295 4.99384 12.111 4.77839 12.1972L5.05677 12.8936ZM3.2673 12.3554L2.65095 12.7827L2.65095 12.7827L3.2673 12.3554ZM3.39092 10.4908L3.94546 10.9958L3.94546 10.9958L3.39092 10.4908ZM5.23577 10.1936L4.86789 10.8472C5.06979 10.9608 5.31288 10.9748 5.52645 10.885C5.74003 10.7952 5.90011 10.6117 5.96015 10.388L5.23577 10.1936ZM9.54248 4.95093C8.76469 6.93559 9.57741 9.18941 11.4428 10.2209L12.1687 8.90826C10.9617 8.2408 10.4358 6.78245 10.9391 5.49826L9.54248 4.95093ZM11.4421 10.2205C12.0723 10.57 12.7813 10.7528 13.502 10.7516L13.4996 9.25159C13.0342 9.25234 12.5764 9.13431 12.1694 8.90867L11.4421 10.2205ZM10.4284 5.95074C13.7534 5.09153 17.1498 7.07144 18.0404 10.3881L19.4891 9.99908C18.385 5.88768 14.1748 3.43336 10.0531 4.49845L10.4284 5.95074ZM19.1327 10.8472C19.4372 10.6757 19.8198 10.7374 20.0551 10.9958L21.1642 9.98589C20.4583 9.21068 19.3105 9.02575 18.3969 9.54002L19.1327 10.8472ZM20.0551 10.9958C20.2904 11.2542 20.316 11.6409 20.1169 11.9281L21.3496 12.7827C21.947 11.9211 21.8701 10.7611 21.1642 9.98589L20.0551 10.9958ZM20.1169 11.9281C19.9178 12.2153 19.5467 12.3269 19.2222 12.1972L18.6654 13.59C19.6389 13.9792 20.7522 13.6443 21.3496 12.7827L20.1169 11.9281ZM18.1998 12.7985C17.801 15.9185 15.1457 18.256 12.0003 18.256V19.756C15.9006 19.756 19.1932 16.8575 19.6877 12.9887L18.1998 12.7985ZM12.0003 18.256C8.85488 18.256 6.19955 15.9185 5.80072 12.7985L4.31283 12.9887C4.80737 16.8575 8.09999 19.756 12.0003 19.756V18.256ZM4.77839 12.1972C4.45388 12.3269 4.08278 12.2153 3.88366 11.9281L2.65095 12.7827C3.24832 13.6443 4.36161 13.9792 5.33515 13.59L4.77839 12.1972ZM3.88366 11.9281C3.68453 11.6409 3.71017 11.2542 3.94546 10.9958L2.83637 9.98589C2.13048 10.7611 2.05358 11.9211 2.65095 12.7827L3.88366 11.9281ZM3.94546 10.9958C4.18076 10.7374 4.56334 10.6757 4.86789 10.8472L5.60365 9.54002C4.69 9.02575 3.54225 9.21068 2.83637 9.98589L3.94546 10.9958ZM5.96015 10.388C6.5438 8.21268 8.25047 6.51828 10.4299 5.95036L10.0517 4.49883C7.35024 5.20278 5.23482 7.30298 4.51139 9.99924L5.96015 10.388Z"></path> <path d="M9.00073 12.5016C8.72503 12.5016 8.50073 12.2773 8.50073 12.0016C8.50073 11.7259 8.72503 11.5016 9.00073 11.5016C9.27643 11.5016 9.50073 11.7259 9.50073 12.0016C9.50073 12.2773 9.27643 12.5016 9.00073 12.5016Z"></path> <path d="M9.00073 13.0016C8.44845 13.0016 8.00073 12.5539 8.00073 12.0016C8.00073 11.4493 8.44845 11.0016 9.00073 11.0016C9.55301 11.0016 10.0007 11.4493 10.0007 12.0016C10.0007 12.5539 9.55301 13.0016 9.00073 13.0016Z"></path> <path d="M15.0007 12.5016C14.725 12.5016 14.5007 12.2773 14.5007 12.0016C14.5007 11.7259 14.725 11.5016 15.0007 11.5016C15.2764 11.5016 15.5007 11.7259 15.5007 12.0016C15.5007 12.2773 15.2764 12.5016 15.0007 12.5016Z"></path> <path d="M15.0007 13.0016C14.4485 13.0016 14.0007 12.5539 14.0007 12.0016C14.0007 11.4493 14.4485 11.0016 15.0007 11.0016C15.553 11.0016 16.0007 11.4493 16.0007 12.0016C16.0007 12.5539 15.553 13.0016 15.0007 13.0016Z"></path> </g></svg>',
    fantasia: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"/></g></svg>',
    poesia: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M5 8h6v6H7l-2 2V8z"/><path d="M13 8h6v6h-4l-2 2V8z"/></g></svg>',
    historia: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.2"><path d="M20,3a1,1,0,0,0,0-2H4A1,1,0,0,0,4,3H5.049c.146,1.836.743,5.75,3.194,8-2.585,2.511-3.111,7.734-3.216,10H4a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2H18.973c-.105-2.264-.631-7.487-3.216-10,2.451-2.252,3.048-6.166,3.194-8Zm-6.42,7.126a1,1,0,0,0,.035,1.767c2.437,1.228,3.2,6.311,3.355,9.107H7.03c.151-2.8.918-7.879,3.355-9.107a1,1,0,0,0,.035-1.767C7.881,8.717,7.227,4.844,7.058,3h9.884C16.773,4.844,16.119,8.717,13.58,10.126ZM12,13s3,2.4,3,3.6V20H9V16.6C9,15.4,12,13,12,13Z"></path></g></svg>',
    default: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z"/><path d="M8 20h10"/></g></svg>'
  });
  const DEFAULT_CATEGORY_COLOR = "#266d51";
  const DEFAULT_CATEGORY_ICON = "default";

  const state = {
    categories: [],
    products: [],
    cart: {},
    cartVisible: true,
    categoryVisibility: {},
    catalogSearchQuery: "",
    catalogSortBy: "default"
  };
  const DESKTOP_LAYOUT_QUERY = "(min-width: 992px)";
  let confirmModalResolver = null;

  function buildImagePath(fileName) {
    const normalized = String(fileName || "").trim().replaceAll("\\", "/").replace(/^\/+/, "");
    if (!normalized) return `${IMG_DIR}/${DEFAULT_IMAGE_FILE}`;
    if (normalized.startsWith(`${IMG_DIR}/`)) return normalized;
    return `${IMG_DIR}/${normalized}`;
  }

  function isDataImageUrl(value) {
    return /^data:image\/[a-z0-9.+-]+;base64,/i.test(String(value || "").trim());
  }

  function resolveImageSource(source) {
    const normalized = String(source || "").trim();
    if (!normalized) return buildImagePath("");
    if (isDataImageUrl(normalized)) return normalized;
    return buildImagePath(normalized);
  }

  function bootstrapData() {
    state.categories = [
      { id: "novela", name: "Novela", color: "#2d6a4f", icon: "novela" },
      { id: "ensayo", name: "Ensayo", color: "#40916c", icon: "ensayo" },
      { id: "infantil", name: "Infantil", color: "#47a368", icon: "infantil" },
      { id: "fantasia", name: "Fantasia", color: "#52b765", icon: "fantasia" },
      { id: "poesia", name: "Poesia", color: "#5ab752", icon: "poesia" },
      { id: "historia", name: "Historia", color: "#77b752", icon: "historia" }
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
        .map((category) => {
          const normalizedId = category.id.trim().toLowerCase();
          const configuredIcon = typeof category.icon === "string"
            ? category.icon.trim().toLowerCase()
            : "";
          const fallbackIcon = CATEGORY_ICON_SVGS[normalizedId] ? normalizedId : DEFAULT_CATEGORY_ICON;

          return {
            id: normalizedId,
            name: category.name.trim(),
            color: normalizeHexColor(category.color),
            icon: CATEGORY_ICON_SVGS[configuredIcon] ? configuredIcon : fallbackIcon
          };
        })
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
            image: resolveImageSource(product.image)
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
    const snapshot = {
      categories: state.categories,
      products: state.products,
      cartVisible: state.cartVisible,
      categoryVisibility: state.categoryVisibility
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  function loadStateFromStorage() {
    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) return false;

      const parsedState = JSON.parse(rawState);
      if (!parsedState || typeof parsedState !== "object") return false;

      state.categories = parsedState.categories;
      state.products = parsedState.products;
      state.cartVisible = parsedState.cartVisible;
      state.categoryVisibility = parsedState.categoryVisibility;

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

  function normalizeHexColor(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(normalized) ? normalized : DEFAULT_CATEGORY_COLOR;
  }

  function parseHexColor(value) {
    const hex = normalizeHexColor(value);
    return {
      r: Number.parseInt(hex.slice(1, 3), 16),
      g: Number.parseInt(hex.slice(3, 5), 16),
      b: Number.parseInt(hex.slice(5, 7), 16)
    };
  }

  function clampRgb(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b]
      .map((channel) => clampRgb(channel).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function mixRgb(base, target, ratio) {
    return {
      r: base.r + (target.r - base.r) * ratio,
      g: base.g + (target.g - base.g) * ratio,
      b: base.b + (target.b - base.b) * ratio
    };
  }

  function buildCategoryGradient(color) {
    const base = parseHexColor(color);
    const darkStart = mixRgb(base, { r: 0, g: 0, b: 0 }, 0.18);
    const harmonicEnd = mixRgb(base, parseHexColor("#67a667"), 0.45);
    return `linear-gradient(120deg, ${rgbToHex(darkStart)} 0%, ${rgbToHex(harmonicEnd)} 100%)`;
  }

  function toCategoryClassName(categoryId) {
    const normalized = String(categoryId || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return normalized ? `cat-${normalized}` : "cat-default";
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

  function getCategoryIconMarkup(categoryOrId) {
    let key = "";
    if (categoryOrId && typeof categoryOrId === "object") {
      const category = categoryOrId;
      key = String(category.icon || category.id || "").trim().toLowerCase();
    } else {
      key = String(categoryOrId || "").trim().toLowerCase();
    }
    const svg = CATEGORY_ICON_SVGS[key] || CATEGORY_ICON_SVGS.default;
    return `<span class="category-icon" aria-hidden="true">${svg}</span>`;
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
          ${getCategoryIconMarkup(category)}
          <span class="category-item-label">${escapeHtml(category.name)}</span>
        </button>`)
      .join("");

    $menu.html(options);
    $trigger.prop("disabled", false);

    $triggerLabel.text("Categoría");
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
    const normalized = String(imagePath || "").trim();
    if (!normalized || isDataImageUrl(normalized)) return "";
    const normalizedPath = normalized.replaceAll("\\", "/");
    const prefix = `${IMG_DIR}/`;
    return normalizedPath.startsWith(prefix) ? normalizedPath.slice(prefix.length) : normalizedPath;
  }

  function readImageFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("MISSING_FILE"));
        return;
      }

      if (!String(file.type || "").toLowerCase().startsWith("image/")) {
        reject(new Error("INVALID_FILE_TYPE"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        if (!isDataImageUrl(result)) {
          reject(new Error("INVALID_DATA_URL"));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error("FILE_READ_ERROR"));
      reader.readAsDataURL(file);
    });
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

  function setCodeFieldLiveFeedback(inputSelector, iconSelector, hasValue, isDuplicate) {
    const $input = $(inputSelector);
    const $icon = $(iconSelector);

    $input.removeClass("is-valid");
    $icon
      .removeClass("bi-check-circle-fill bi-x-circle-fill text-success text-danger opacity-100")
      .addClass("opacity-0");

    if (!hasValue) return;

    if (isDuplicate) {
      $input.addClass("is-invalid");
      $icon
        .removeClass("opacity-0")
        .addClass("bi-x-circle-fill text-danger opacity-100");
      return;
    }

    $input.addClass("is-valid");
    $icon
      .removeClass("opacity-0")
      .addClass("bi-check-circle-fill text-success opacity-100");
  }

  function validateUniqueAdminIdentifiers() {
    const newCategoryId = $("#categoryId").val().trim().toLowerCase();
    const newCategoryDuplicate = Boolean(newCategoryId) && categoryIdExists(newCategoryId);
    const newCategoryName = $("#categoryName").val().trim();
    const newCategoryNameDuplicate = Boolean(newCategoryName) && categoryNameExists(newCategoryName);
    setInlineFieldError("#categoryId", "#categoryIdDuplicateError", newCategoryDuplicate ? "Ese identificador de categoria ya existe." : "");
    setInlineFieldError("#categoryName", "#categoryNameDuplicateError", newCategoryNameDuplicate ? "Ese nombre de categoria ya existe." : "");
    $("#categoryForm button[type='submit']").prop("disabled", newCategoryDuplicate || newCategoryNameDuplicate);

    const hasCategories = state.categories.length > 0;
    const newProductCode = $("#productCode").val().trim();
    const newProductDuplicate = Boolean(newProductCode) && productCodeExists(newProductCode);
    setInlineFieldError("#productCode", "#productCodeDuplicateError", newProductDuplicate ? "Ese codigo de producto ya existe." : "");
    setCodeFieldLiveFeedback("#productCode", "#productCodeStatusIcon", Boolean(newProductCode), newProductDuplicate);
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
    setCodeFieldLiveFeedback("#editProductCode", "#editProductCodeStatusIcon", Boolean(editProductCode), editProductDuplicate);
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

      let productsContentHtml = "";
      if (relatedProducts.length === 0) {
        productsContentHtml = '<p class="text-muted mb-1 category-empty-note">No hay productos en esta categoria.</p>';
      } else {
        productsContentHtml = relatedProducts
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

      const categoryClassName = toCategoryClassName(category.id);
      const categoryGradient = buildCategoryGradient(category.color);
      const categoryHtml = `
        <article class="category-card card shadow-sm mb-3 ${categoryClassName} layout-list" data-category-id="${escapeHtml(category.id)}" style="--category-grad:${escapeHtml(categoryGradient)};">
          <button type="button" class="category-header category-toggle" data-category-id="${escapeHtml(category.id)}">
            <span class="category-header-main">
              ${getCategoryIconMarkup(category)}
              <span>${escapeHtml(category.name)}</span>
            </span>
            <span class="toggle-indicator" aria-hidden="true">${isOpen ? "-" : "+"}</span>
          </button>
          <div class="category-products" style="display:${isOpen ? "block" : "none"};">
            <div class="category-products-track">
              ${productsContentHtml}
            </div>
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
    const $placeOrderBtn = $("#placeOrderBtn");
    const $clearCartBtn = $("#clearCartBtn");
    const $totalLabel = $(".cart-footer .total-label");
    const items = Object.entries(state.cart);
    const isEmpty = Object.keys(state.cart).length === 0;

    if (isEmpty) {
      $cartItems.html(`
      <div class="cart-empty-state">
        <i class="bi bi-cart-x fs-1 opacity-50"></i> <p class="mb-0">La cesta está vacía.</p>
      </div>`);
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
    $totalLabel.toggleClass("d-none", isEmpty);
    $("#placeOrderBtn").prop("disabled", isEmpty);
    $("#clearCartBtn").prop("disabled", isEmpty);
    renderCartBadge();
  }

  function isDesktopLayout() {
    return window.matchMedia(DESKTOP_LAYOUT_QUERY).matches;
  }

  function setCartVisibility(visible, shouldPersist = true, animate = true) {
    state.cartVisible = visible;
    const $layout = $("#catalogLayout");
    const $cartColumn = $("#cartColumn");
    const $productsColumn = $("#productsColumn");
    const $label = $("#toggleCartBtn .btn-label");

    if (visible) {
      $label.text("Ocultar cesta");
    } else {
      $label.text("Mostrar cesta");
    }

    if (isDesktopLayout()) {
      $cartColumn.removeClass("d-none");
      $productsColumn.removeClass("col-12").addClass("col-lg-8");
      $layout.toggleClass("cart-no-anim", !animate);
      $layout.toggleClass("cart-is-hidden", !visible);
      if (!animate) {
        window.requestAnimationFrame(() => {
          $layout.removeClass("cart-no-anim");
        });
      }
    } else if (visible) {
      $layout.removeClass("cart-is-hidden cart-no-anim");
      $cartColumn.removeClass("d-none");
      $productsColumn.removeClass("col-12").addClass("col-lg-8");
    } else {
      $layout.removeClass("cart-is-hidden cart-no-anim");
      $cartColumn.addClass("d-none");
      $productsColumn.removeClass("col-lg-8").addClass("col-12");
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
    $("#adminAccessForm")[0].reset();
    $("#adminAccessError").addClass("d-none");
    $("#adminAccessModal").modal('show');
  }

  function handleAdminAccessSubmit(event) {
    event.preventDefault();
    const password = $("#adminAccessPassword").val();

    if (password !== ADMIN_PASSWORD) {
      $("#adminAccessError").removeClass("d-none").text("Contrasena incorrecta.");
      $("#adminAccessPassword").trigger("focus").trigger("select");
      return;
    }

    const openAdminPanel = () => {
      showAdminMessage("Modo administrador activo.", false);
      showToast("Modo administrador activo.", { title: "Administracion", variant: "success" });
      const adminModalElement = document.getElementById("adminModal");
      const adminModal = bootstrap.Modal.getOrCreateInstance(adminModalElement);
      adminModal.show();
    };

    const accessModalElement = document.getElementById("adminAccessModal");
    if (accessModalElement) {
      accessModalElement.addEventListener("hidden.bs.modal", openAdminPanel, { once: true });
      const accessModal = bootstrap.Modal.getOrCreateInstance(accessModalElement);
      accessModal.hide();
      return;
    }
    openAdminPanel();
  }

  function categoryIdExists(id) {
    return state.categories.some((category) => category.id.toLowerCase() === id.toLowerCase());
  }

  function categoryNameExists(name) {
    const normalizedName = normalizeSearchText(name);
    return state.categories.some((category) => normalizeSearchText(category.name) === normalizedName);
  }

  function productCodeExists(code) {
    return state.products.some((product) => product.code.toLowerCase() === code.toLowerCase());
  }

  function addCategory(event) {
    event.preventDefault();
    const rawId = $("#categoryId").val().trim();
    const rawName = $("#categoryName").val().trim();
    const rawIcon = String($("#categoryIcon").val() || "").trim().toLowerCase();
    const normalizedId = rawId.toLowerCase();
    const normalizedIcon = CATEGORY_ICON_SVGS[rawIcon] ? rawIcon : DEFAULT_CATEGORY_ICON;

    if (!normalizedId || !rawName) {
      showAdminMessage("Debes completar identificador y nombre.", true);
      return;
    }

    if (categoryIdExists(normalizedId)) {
      showAdminMessage("Ese identificador de categoria ya existe.", true);
      return;
    }

    if (categoryNameExists(rawName)) {
      showAdminMessage("Ese nombre de categoria ya existe.", true);
      return;
    }

    state.categories.push({
      id: normalizedId,
      name: rawName,
      color: DEFAULT_CATEGORY_COLOR,
      icon: normalizedIcon
    });
    state.categoryVisibility[normalizedId] = true;
    refreshAdminEditors(normalizedId, $("#editProductSelect").val());
    renderProducts();
    saveStateToStorage();
    showAdminMessage(`Categoria "${rawName}" creada correctamente.`, false);
    showToast(`Categoria "${rawName}" creada.`, { title: "Administracion", variant: "success" });
    event.target.reset();
    validateUniqueAdminIdentifiers();
  }

  async function addProduct(event) {
    event.preventDefault();

    const titulo = $("#productTitle").val().trim();
    const author = $("#productAuthor").val().trim();
    const code = $("#productCode").val().trim();
    const categoryId = $("#productCategory").val();
    const description = $("#productDescription").val().trim();
    const price = Number.parseFloat($("#productPrice").val());
    const stock = Number.parseInt($("#productStock").val(), 10);
    const imageFile = document.getElementById("productImageFile")?.files?.[0] || null;

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

    let imageSource = buildImagePath("");
    if (imageFile) {
      if (imageFile.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
        showAdminMessage("La imagen seleccionada supera 2 MB. Elige una imagen mas liviana.", true);
        return;
      }

      try {
        imageSource = await readImageFileAsDataUrl(imageFile);
      } catch (error) {
        if (error && error.message === "INVALID_FILE_TYPE") {
          showAdminMessage("El archivo seleccionado debe ser una imagen valida.", true);
          return;
        }
        showAdminMessage("No se pudo leer la imagen seleccionada.", true);
        return;
      }
    }

    state.products.push({
      titulo,
      author,
      code,
      categoryId,
      description,
      price,
      stock,
      image: imageSource
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
    if (nextImageName) {
      product.image = resolveImageSource(nextImageName);
    } else if (!isDataImageUrl(product.image)) {
      product.image = buildImagePath("");
    }

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

  async function resetDataToDefaults() {
    const confirmed = await askForConfirmation({
      title: "Reiniciar datos",
      message: "Se restaurarán categorías, productos, stock, cesta y filtros al estado inicial. ¿Continuar?",
      confirmText: "Reiniciar datos",
      confirmButtonClass: "btn-warning"
    });

    if (!confirmed) {
      return;
    }

    bootstrapData();
    state.cartVisible = true;
    state.catalogSearchQuery = "";
    state.catalogSortBy = "default";
    normalizeState();

    refreshAdminEditors();
    $("#catalogSearch").val(state.catalogSearchQuery);
    $("#catalogSort").val(state.catalogSortBy);

    clearOrderMessage();
    renderProducts();
    renderCart();
    setCartVisibility(state.cartVisible, false, false);
    saveStateToStorage();

    showAdminMessage("Datos reiniciados a los valores precargados.", false);
    showToast("Datos reiniciados correctamente.", { title: "Administracion", variant: "success" });
    showSystemMessage("Se restauró la tienda al estado inicial.", "success");
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
    $("#adminAccessForm").on("submit", handleAdminAccessSubmit);
    $("#adminAccessPassword").on("input", function onAdminAccessPasswordInput() {
      $("#adminAccessError").addClass("d-none").text("");
    });
    $("#adminAccessModal").on("hidden.bs.modal", function onAdminAccessModalHidden() {
      const formElement = document.getElementById("adminAccessForm");
      if (formElement) formElement.reset();
      $("#adminAccessError").addClass("d-none").text("");
    });
    $("#categoryForm").on("submit", addCategory);
    $("#categoryEditForm").on("submit", updateCategory);
    $("#editCategorySelect").on("change", syncCategoryEditorFields);
    $("#categoryId, #categoryName, #productCode, #editCategoryId, #editProductCode").on("input", validateUniqueAdminIdentifiers);
    $("#deleteCategoryBtn").on("click", deleteCategory);
    $("#productForm").on("submit", addProduct);
    $("#productEditForm").on("submit", updateProduct);
    $("#editProductSelect").on("change", syncProductEditorFields);
    $("#deleteProductBtn").on("click", deleteProduct);
    $("#resetDataBtn").on("click", resetDataToDefaults);
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

    const desktopMediaQuery = window.matchMedia(DESKTOP_LAYOUT_QUERY);
    const handleDesktopLayoutChange = () => {
      setCartVisibility(state.cartVisible, false, false);
    };
    if (typeof desktopMediaQuery.addEventListener === "function") {
      desktopMediaQuery.addEventListener("change", handleDesktopLayoutChange);
    } else if (typeof desktopMediaQuery.addListener === "function") {
      desktopMediaQuery.addListener(handleDesktopLayoutChange);
    }
  }

  function init() {
    const loadedFromStorage = loadStateFromStorage();
    if (!loadedFromStorage) {
      bootstrapData();
      normalizeState();
    }

    Object.entries(state.cart).forEach(([code, quantity]) => {
      const product = findProduct(code);
      const parsedQuantity = Number.parseInt(quantity, 10);
      if (product && Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
        product.stock += parsedQuantity;
      }
    });
    state.cart = {};
    state.cartVisible = true;

    saveStateToStorage();

    refreshAdminEditors();
    $("#catalogSearch").val(state.catalogSearchQuery);
    $("#catalogSort").val(state.catalogSortBy);
    renderProducts();
    renderCart();
    setCartVisibility(true, false, false);
    bindEvents();
  }

  $(init);
})();