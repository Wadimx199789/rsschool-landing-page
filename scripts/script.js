const THEME_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

const desktopQuery = window.matchMedia("(min-width: 769px)");
const themeSwitch = document.getElementById("theme-switch");
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};

const getThemeByBrowserSettings = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === DARK ? LIGHT : DARK);
};

const initTheme = () => {
  const theme = localStorage.getItem(THEME_KEY) || getThemeByBrowserSettings();

  document.documentElement.setAttribute("data-theme", theme);
  themeSwitch.checked = theme === DARK;
  themeSwitch.addEventListener("change", toggleTheme);
};

const toggleMenu = (isOpen) => {
  burger.classList.toggle("burger--open", isOpen);
  mobileMenu.classList.toggle("mobile-menu--open", isOpen);
  document.body.classList.toggle("is-locked", isOpen);
};

const initMobileMenu = () => {
  burger.addEventListener("click", () =>
    toggleMenu(!mobileMenu.classList.contains("mobile-menu--open")),
  );

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggleMenu(false);
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobileMenu.classList.contains("mobile-menu--open")
    ) {
      toggleMenu(false);
    }
  });
};

if (themeSwitch) {
  initTheme();
}

if (burger && mobileMenu) {
  initMobileMenu();
}
