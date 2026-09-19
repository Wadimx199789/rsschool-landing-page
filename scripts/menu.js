const EMPTY_MESSAGE = "Nothing here yet — try another category";
const MOBILE_WIDTH = 768;
const VISIBLE_CARDS_LIMIT = 4;

const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`);
const moreButton = document.querySelector(".menu__more");
const cards = document.querySelector(".cards");
const categories = document.querySelector(".categories");

let activeCategoryBtn = document.querySelector(".categories__button--active");
let countActiveCategoryCards = VISIBLE_CARDS_LIMIT;

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

categories.addEventListener("click", setActiveCategory);

mobileQuery.addEventListener("change", () => {
  countActiveCategoryCards = VISIBLE_CARDS_LIMIT;
  renderMenu();
});

moreButton.addEventListener("click", () => {
  countActiveCategoryCards += VISIBLE_CARDS_LIMIT;
  renderMenu();
});

renderMenu();
