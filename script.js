(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Sticky header ---------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mobilePanel = document.getElementById("mobilePanel");

  function closeMobilePanel() {
    mobilePanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  function openMobilePanel() {
    mobilePanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }
  navToggle.addEventListener("click", function () {
    var isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) { closeMobilePanel(); } else { openMobilePanel(); }
  });
  mobilePanel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobilePanel);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMobilePanel(); }
  });

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Approach: active step on scroll ---------------- */
  var steps = document.querySelectorAll(".process-step");
  if ("IntersectionObserver" in window && steps.length) {
    var stepObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    steps.forEach(function (step) { stepObserver.observe(step); });
  } else {
    steps.forEach(function (step) { step.classList.add("is-active"); });
  }

  /* ---------------- Contact form (mailto fallback, no backend) ---------------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var ENQUIRY_EMAIL = "contact@invictushq.in";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var contact = form.contact.value.trim();
      var message = form.message.value.trim();

      var subject = "Business Enquiry from " + name + (company ? " (" + company + ")" : "");
      var bodyLines = [
        "Name: " + name,
        "Company: " + (company || "-"),
        "Phone / Email: " + contact,
        "",
        "Message:",
        message
      ];
      var body = bodyLines.join("\n");

      var mailto =
        "mailto:" + ENQUIRY_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      status.textContent = "Opening your email app to send this enquiry\u2026";
      window.location.href = mailto;
    });
  }
})();
