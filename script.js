(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.getElementById("siteHeader");

  /* ---------------- Sticky header + reading progress ---------------- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updateScrollUI() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", scrollTop > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, scrollTop / max * 100) : 0) + "%";
  }
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });

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
    navToggle.getAttribute("aria-expanded") === "true" ? closeMobilePanel() : openMobilePanel();
  });
  mobilePanel.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMobilePanel); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMobilePanel(); });

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -7% 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add("is-visible"); });

  /* ---------------- Approach: active step + animated line ---------------- */
  var process = document.getElementById("process");
  var steps = document.querySelectorAll(".process-step");
  if (process && !reduceMotion && "IntersectionObserver" in window) {
    var processObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) process.classList.add("is-animated");
      });
    }, { threshold: 0.35 });
    processObserver.observe(process);
  } else if (process) process.classList.add("is-animated");

  if ("IntersectionObserver" in window && steps.length) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("is-active");
      });
    }, { threshold: 0.6 });
    steps.forEach(function (step) { stepObserver.observe(step); });
  } else steps.forEach(function (step) { step.classList.add("is-active"); });

  /* ---------------- Hero word choreography ---------------- */
  var headline = document.querySelector(".hero-headline");
  if (headline && !reduceMotion) {
    var text = headline.textContent.trim();
    headline.setAttribute("aria-label", text);
    headline.innerHTML = text.split(/(\s+)/).map(function (part, i) {
      if (/^\s+$/.test(part)) return part;
      return '<span class="hero-word" aria-hidden="true" style="animation-delay:' + (0.06 * i) + 's">' + part + '</span>';
    }).join("");
  }

  /* ---------------- Section index rail ---------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  if (sections.length && window.innerWidth > 900) {
    var rail = document.createElement("div");
    rail.className = "section-index";
    rail.setAttribute("aria-hidden", "true");
    sections.forEach(function () { rail.appendChild(document.createElement("span")); });
    document.body.appendChild(rail);
    var markers = rail.querySelectorAll("span");
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = sections.indexOf(entry.target);
          markers.forEach(function (m, i) { m.classList.toggle("active", i === index); });
        }
      });
    }, { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------------- Mouse spotlight + hero parallax ---------------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var hero = document.querySelector(".hero");
    var cards = document.querySelectorAll(".product-card, .wwd-card");
    var raf = null;
    var pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.addEventListener("pointermove", function (e) {
      pointer.x = e.clientX; pointer.y = e.clientY;
      document.documentElement.style.setProperty("--mx", (e.clientX / window.innerWidth * 100) + "%");
      document.documentElement.style.setProperty("--my", (e.clientY / window.innerHeight * 100) + "%");
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", (e.clientX - r.left) + "px");
        card.style.setProperty("--spot-y", (e.clientY - r.top) + "px");
      });
      if (!hero || raf) return;
      raf = requestAnimationFrame(function () {
        var x = (pointer.x / window.innerWidth - .5);
        var y = (pointer.y / window.innerHeight - .5);
        var network = hero.querySelector(".hero-network");
        if (network) network.style.transform = "translate(" + (x * 12) + "px," + (y * 8) + "px) scale(1.04)";
        raf = null;
      });
    }, { passive: true });

    /* Subtle 3D product-card tilt */
    document.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = "perspective(900px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 7) + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------------- Active navigation ---------------- */
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if ("IntersectionObserver" in window && navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-current", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------------- Contact form (Google Apps Script) ---------------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxeL4Rx6AD2EJfdSpF1PUAfPOo6TUdTpyTVu3NfnPBvLlSAPanmTOpeLc8B0peZXPbIoQ/exec";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      var submitButton = form.querySelector('button[type="submit"]');
      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var contact = form.contact.value.trim();
      var message = form.message.value.trim();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = "Sending…";
      }

      if (status) {
        status.textContent = "Sending your message…";
        status.className = "form-status is-loading";
      }

      var payload = {
        name: name,
        company: company,
        contact: contact,
        message: message,
        source: window.location.hostname || "invictushq.in",
        page: window.location.href,
        submittedAt: new Date().toISOString()
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      })
      .then(function () {
        if (status) {
          status.textContent = "✓ Thank you. Your message has been sent to Invictus Enterprises. We will contact you Shortly.";
          status.className = "form-status is-success";
        }
        form.reset();
      })
      .catch(function () {
        if (status) {
          status.textContent = "We couldn't send your message right now. Please try again or contact us directly.";
          status.className = "form-status is-error";
        }
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || "Write to Us";
        }
      });
    });
  }

})();
