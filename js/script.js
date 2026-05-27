document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobile-nav");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  });

  burger?.addEventListener("click", () => {
    burger.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });

  document
    .querySelectorAll(".mobile-nav .nav-link, .mobile-nav .nav-btn")
    .forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileNav.classList.remove("open");
      });
    });

  const navLinks = document.querySelectorAll(
    '.nav-link[href^="#"], .mobile-nav .nav-link[href^="#"]',
  );
  const setActiveNav = () => {
    const scrollY = window.scrollY + 120;
    navLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (!section) return;
      link.classList.toggle(
        "active",
        scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight,
      );
    });
  };
  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");

      const savedGroup = target;
      try {
        localStorage.setItem("selected_group", savedGroup);
      } catch (e) {}
    });
  });

  try {
    const saved = localStorage.getItem("selected_group");
    if (saved) {
      const btn = document.querySelector(`.tab-btn[data-tab="${saved}"]`);
      if (btn) btn.click();
    }
  } catch (e) {}

  document.querySelectorAll(".spec-more-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".spec-card");
      const details = card.querySelector(".spec-details");
      const isOpen = details.classList.toggle("open");
      btn.innerHTML = isOpen
        ? 'Скрыть <span class="btn-arrow">↑</span>'
        : 'Подробнее <span class="btn-arrow">→</span>';
    });
  });

  const form = document.getElementById("feedback-form");
  const formWrap = document.getElementById("form-wrap");
  const formSuccess = document.getElementById("form-success");

  const validate = (field, errorId, check) => {
    const error = document.getElementById(errorId);
    const valid = check(field.value.trim());
    field.classList.toggle("error", !valid);
    error.classList.toggle("show", !valid);
    return valid;
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameField = document.getElementById("f-name");
    const emailField = document.getElementById("f-email");
    const msgField = document.getElementById("f-message");

    const vName = validate(nameField, "err-name", (v) => v.length >= 2);
    const vEmail = validate(emailField, "err-email", (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    );
    const vMsg = validate(msgField, "err-msg", (v) => v.length >= 10);

    if (!vName || !vEmail || !vMsg) return;

    const message = {
      id: Date.now(),
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      message: msgField.value.trim(),
      date: new Date().toLocaleString("ru-RU"),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("feedback_messages") || "[]",
      );
      existing.push(message);
      localStorage.setItem("feedback_messages", JSON.stringify(existing));
    } catch (err) {}

    formWrap.style.display = "none";
    formSuccess.classList.add("show");
  });

  const statNums = document.querySelectorAll("[data-count]");
  const animateCounts = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const step = 16;
      let current = 0;
      const increment = end / (duration / step);
      const tick = () => {
        current = Math.min(current + increment, end);
        el.textContent = Math.round(current) + suffix;
        if (current < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  };

  const countObserver = new IntersectionObserver(animateCounts, {
    threshold: 0.5,
  });
  statNums.forEach((el) => countObserver.observe(el));

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
