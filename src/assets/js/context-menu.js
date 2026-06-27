document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("context-menu");
  if (!menu) return;

  let currentTarget = null;

  function showMenu(x, y, target) {
    currentTarget = target;
    menu.hidden = false;

    const rect = menu.getBoundingClientRect();
    const menuWidth = rect.width || 200;
    const menuHeight = rect.height || 240;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x;
    let top = y;

    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8;
    }

    if (top + menuHeight > viewportHeight - 8) {
      top = viewportHeight - menuHeight - 8;
    }

    if (left < 8) left = 8;
    if (top < 8) top = 8;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function hideMenu() {
    menu.hidden = true;
    currentTarget = null;
  }

  function getSelectedText() {
    return window.getSelection ? window.getSelection().toString().trim() : "";
  }

  document.addEventListener("contextmenu", (e) => {
    // 如果你想给某些区域保留原生菜单，可加 data-native-menu
    if (e.target.closest("[data-native-menu]")) return;

    e.preventDefault();
    showMenu(e.clientX, e.clientY, e.target);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#context-menu")) {
      hideMenu();
    }
  });

  document.addEventListener("scroll", hideMenu, true);
  window.addEventListener("resize", hideMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideMenu();
  });

  menu.addEventListener("click", async (e) => {
    const item = e.target.closest(".context-menu__item");
    if (!item) return;

    if (item.classList.contains("context-menu__item--disabled")) {
      hideMenu();
      return;
    }

    const action = item.dataset.action;

    switch (action) {
      case "copy-text": {
        const selectedText = getSelectedText();

        if (!selectedText) {
          item.textContent = "No Text Selected";
          setTimeout(() => {
            item.textContent = "Copy Text";
          }, 900);
          hideMenu();
          return;
        }

        try {
          await navigator.clipboard.writeText(selectedText);
          item.textContent = "Copied";
        } catch (err) {
          item.textContent = "Copy Failed";
        }

        setTimeout(() => {
          item.textContent = "Copy Text";
        }, 900);

        break;
      }

      case "go-home": {
        window.location.href = "/";
        break;
      }

      case "back-top": {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        break;
      }

      case "print-page": {
        window.print();
        break;
      }

      default:
        break;
    }

    hideMenu();
  });
});