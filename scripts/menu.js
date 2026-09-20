const EMPTY_MESSAGE = "Nothing here yet — try another category";
const MODAL_NOTE =
  "The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.";
const MOBILE_WIDTH = 768;
const VISIBLE_CARDS_LIMIT = 4;

const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`);
const moreButton = document.querySelector(".menu__more");
const cards = document.querySelector(".cards");
const categories = document.querySelector(".categories");
const modal = document.querySelector(".modal");

let activeCategoryBtn = document.querySelector(".categories__button--active");
let countActiveCategoryCards = VISIBLE_CARDS_LIMIT;
let currentProduct = null;

const renderCard = ({ imageName, name, description, price }) => {
  return `<li class="card" data-name="${name}">
                <div class="card__box">
                  <img
                    class="card__image"
                    src="assets/images/menu/${imageName}.jpg"
                    alt="${name}"
                    loading="lazy"
                  />
                </div>
                <h3 class="card__title">${name}</h3>
                <p class="card__description">
                  ${description}
                </p>
                <span class="card__price">$${price}</span>
              </li>`;
};

const renderCards = (categoryProducts) => {
  if (!categoryProducts.length) {
    cards.innerHTML = `<li class="cards__empty">${EMPTY_MESSAGE}</li>`;

    return;
  }

  cards.innerHTML = categoryProducts.map(renderCard).join("");
};

const renderMenu = () => {
  const isFullListVisible = !mobileQuery.matches;
  const activeCategoryCards = getProductsByCategory(
    activeCategoryBtn.dataset.category,
  );
  const visibleCardsCount = isFullListVisible
    ? activeCategoryCards.length
    : countActiveCategoryCards;

  renderCards(activeCategoryCards.slice(0, visibleCardsCount));
  moreButton.classList.toggle(
    "menu__more--hidden",
    visibleCardsCount >= activeCategoryCards.length,
  );
};

const getProductsByCategory = (category) =>
  products.filter((product) => product.category === category);

const setActiveCategory = (event) => {
  const currentCategoryBtn = event.target.closest(".categories__button");

  if (!currentCategoryBtn) {
    return;
  }

  if (currentCategoryBtn !== activeCategoryBtn) {
    activeCategoryBtn.classList.remove("categories__button--active");
    currentCategoryBtn.classList.add("categories__button--active");
    activeCategoryBtn = currentCategoryBtn;
    countActiveCategoryCards = VISIBLE_CARDS_LIMIT;
    renderMenu();
  }
};

const renderOption = ({ type, badge, label, addPrice, isActive }) => `
                <li>
                  <button
                    class="option${isActive ? " option--active" : ""}"
                    type="button"
                    data-type="${type}"
                    data-add-price="${addPrice}"
                  >
                    <span class="option__badge">${badge}</span>
                    ${label}
                  </button>
                </li>`;

const renderSizes = (sizes) =>
  Object.keys(sizes)
    .map((key, index) =>
      renderOption({
        type: "size",
        badge: key.toUpperCase(),
        label: sizes[key].size,
        addPrice: sizes[key]["add-price"],
        isActive: index === 0,
      }),
    )
    .join("");

const renderAdditives = (additives) =>
  additives
    .map((additive, index) =>
      renderOption({
        type: "additive",
        badge: index + 1,
        label: additive.name,
        addPrice: additive["add-price"],
        isActive: false,
      }),
    )
    .join("");

const renderModal = (product) => {
  const sizes = renderSizes(product.sizes);
  const additives = renderAdditives(product.additives);

  const firstSize = Object.values(product.sizes)[0];
  const total = Number(product.price) + Number(firstSize["add-price"]);

  modal.innerHTML = `
          <div class="modal__inner">
            <img
              class="modal__image"
              src="assets/images/menu/${product.imageName}.jpg"
              alt="${product.name}"
            />
            <div class="modal__content">
              <h3 class="modal__title">${product.name}</h3>
              <p class="modal__description">${product.description}</p>
              <p class="modal__subtitle">Size</p>
              <ul class="modal__options">${sizes}</ul>
              <p class="modal__subtitle">Additives</p>
              <ul class="modal__options">${additives}</ul>
              <p class="modal__total">
                <span>Total:</span>
                <span class="modal__price">$${total.toFixed(2)}</span>
              </p>
              <p class="modal__note">
                <svg
                  class="modal__note-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M12 17v-6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                </svg>
                ${MODAL_NOTE}
              </p>
              <button class="modal__close" type="button">Close</button>
            </div>
          </div>`;
};

const getTotal = () => {
  const activeOptions = modal.querySelectorAll(".option--active");

  return [...activeOptions].reduce(
    (total, option) => total + Number(option.dataset.addPrice),
    Number(currentProduct.price),
  );
};

const updateTotal = () => {
  modal.querySelector(".modal__price").textContent = `$${getTotal().toFixed(2)}`;
};

const selectOption = (option) => {
  if (option.dataset.type === "size") {
    modal
      .querySelectorAll('[data-type="size"]')
      .forEach((sizeOption) =>
        sizeOption.classList.toggle("option--active", sizeOption === option),
      );
  } else {
    option.classList.toggle("option--active");
  }

  updateTotal();
};

const openModal = (event) => {
  const currentCard = event.target.closest(".card");

  if (!currentCard) {
    return;
  }

  currentProduct = products.find(
    (product) => product.name === currentCard.dataset.name,
  );

  renderModal(currentProduct);
  modal.showModal();
  document.body.classList.add("is-locked");
};

categories.addEventListener("click", setActiveCategory);

mobileQuery.addEventListener("change", () => {
  countActiveCategoryCards = VISIBLE_CARDS_LIMIT;
  renderMenu();
});

moreButton.addEventListener("click", () => {
  countActiveCategoryCards += VISIBLE_CARDS_LIMIT;
  renderMenu();
});

cards.addEventListener("click", openModal);

modal.addEventListener("click", (event) => {
  const option = event.target.closest(".option");

  if (option) {
    selectOption(option);

    return;
  }

  const isBackdropClick = event.target === modal;
  const isCloseClick = Boolean(event.target.closest(".modal__close"));

  if (isBackdropClick || isCloseClick) {
    modal.close();
  }
});

modal.addEventListener("close", () => {
  document.body.classList.remove("is-locked");
});

renderMenu();
