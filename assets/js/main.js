(() => {
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  };
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 600) closeMenu(); });
  }

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--scroll", max > 0 ? window.scrollY / max : 0);
  };
  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { updateScroll(); queued = false; });
  }, { passive: true });
  updateScroll();

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, active) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      active.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
  items.forEach((item, index) => {
    item.style.transitionDelay = (index % 3) * 70 + "ms";
    observer.observe(item);
  });
})();