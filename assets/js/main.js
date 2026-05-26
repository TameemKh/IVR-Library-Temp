const scriptUrl = document.currentScript ? document.currentScript.src : "";

function getProjectRootUrl() {
  return new URL("../../", scriptUrl || window.location.href);
}

async function loadNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");

  if (!placeholder) {
    return;
  }

  const projectRoot = getProjectRootUrl();
  const navbarUrl = new URL("navbar.html", projectRoot);
  const response = await fetch(navbarUrl);

  if (!response.ok) {
    throw new Error(`Unable to load navbar from ${navbarUrl}`);
  }

  const template = document.createElement("template");
  template.innerHTML = await response.text();
  const navbar = template.content.firstElementChild;

  if (!navbar) {
    return;
  }

  navbar.querySelectorAll("[data-nav-link]").forEach(link => {
    link.href = new URL(link.dataset.navLink, projectRoot).href;
  });

  navbar.querySelectorAll("[data-nav-src]").forEach(asset => {
    asset.src = new URL(asset.dataset.navSrc, projectRoot).href;
  });

  placeholder.replaceWith(navbar);
}

function initNavbar() {

  const navDropdowns = document.querySelectorAll(".navbar .dropdown");

  navDropdowns.forEach(drop => {
    const btn = drop.querySelector(".dropbtn");
    const content = drop.querySelector(".dropdown-content");

    if (btn && content) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close all other nav dropdowns
        document.querySelectorAll(".navbar .dropdown-content").forEach(c => {
          if (c !== content) c.classList.remove("show");
        });

        // Toggle the clicked one
        content.classList.toggle("show");
      });
    }
  });

  const bars = document.querySelector('.bars');
  const sideMenu = document.getElementById('side-menu');

  if (bars && sideMenu) {
    bars.addEventListener('click', (event) => {
      event.stopPropagation();
      sideMenu.classList.toggle('show');
    });
  }

  const sideDropdowns = document.querySelectorAll(".side-dropdown");

  sideDropdowns.forEach(side => {
    const toggle = side.querySelector(".side-dropdown-toggle");
    const content = side.querySelector(".side-dropdown-content");

    if (toggle && content) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close all OTHER side dropdowns
        document.querySelectorAll(".side-dropdown-content").forEach(c => {
          if (c !== content) c.classList.remove("show");
        });

        // Toggle the clicked one
        content.classList.toggle("show");
      });
    }
  });


  document.addEventListener('click', (event) => {

    // Close NAV dropdowns
    document.querySelectorAll(".navbar .dropdown-content").forEach(c => {
      const parent = c.parentElement;
      const toggle = parent.querySelector(".dropbtn");

      if (!c.contains(event.target) && !toggle.contains(event.target)) {
        c.classList.remove("show");
      }
    });

    // Close SIDE dropdowns
    document.querySelectorAll(".side-dropdown-content").forEach(c => {
      const parent = c.parentElement;
      const toggle = parent.querySelector(".side-dropdown-toggle");

      if (!c.contains(event.target) && !toggle.contains(event.target)) {
        c.classList.remove("show");
      }
    });

    // Close side menu itself
    if (sideMenu && bars) {
      if (!sideMenu.contains(event.target) && !bars.contains(event.target)) {
        sideMenu.classList.remove("show");
      }
    }
  });

}

function initExternalLinks() {
  document.querySelectorAll('a.the_link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const url = this.getAttribute('href');
      window.open(url, '_blank', 'noopener,noreferrer');

      return false;
    }, true);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadNavbar();
  } catch (error) {
    console.error(error);
  }

  initNavbar();
  initExternalLinks();
});
