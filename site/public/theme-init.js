(function () {
  try {
    var stored = localStorage.getItem("xbert-theme");
    var theme;
    if (stored === "light" || stored === "dark") {
      theme = stored;
    } else {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
