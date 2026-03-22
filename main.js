const WAITLIST_URL = "https://script.google.com/macros/s/AKfycbwdlRRZwVrsXcZNFc0dmchJFBWXdr0xYF5Ea8Yx-n3XxoEslU930XUB7f5gPenkLikHZA/exec";
const SURVEY_URL = "https://script.google.com/macros/s/AKfycbwTZy67Z0HMzP1lg-B-lvkFGINjhe9U62bsidCoC0UJMwIv97EnYyqFxp3NkoEefJuX/exec";

let selectedRole = "";

function setNavOpen(isOpen) {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) {
    return;
  }

  nav.classList.toggle("nav-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
}

function selectRole(btn, role) {
  document.querySelectorAll(".role-btn").forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });

  btn.classList.add("active");
  btn.setAttribute("aria-pressed", "true");
  selectedRole = role;
}

function updateRangeFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.background = `linear-gradient(to right, #1d5c43 ${pct}%, #d9f0e2 ${pct}%)`;
}

async function submitWaitlist(event) {
  if (event) {
    event.preventDefault();
  }

  const name = document.getElementById("wl-name").value.trim();
  const email = document.getElementById("wl-email").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const btn = document.querySelector(".submit-btn");
  btn.textContent = "Sending...";
  btn.disabled = true;

  const payload = {
    name,
    email,
    role: selectedRole || "Not selected",
    timestamp: new Date().toISOString()
  };

  try {
    if (WAITLIST_URL !== "YOUR_WAITLIST_APPS_SCRIPT_URL_HERE") {
      await fetch(WAITLIST_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    document.getElementById("form-area").style.display = "none";
    document.getElementById("wl-success").style.display = "block";
  } catch (err) {
    console.error("Waitlist error:", err);
    document.getElementById("form-area").style.display = "none";
    document.getElementById("wl-success").style.display = "block";
  }
}

async function submitSurvey(event) {
  if (event) {
    event.preventDefault();
  }

  const sq1 = document.getElementById("sq1").value;
  const sq2 = document.getElementById("sq2").value;
  const sq4 = document.getElementById("sq4").value;
  const sq5 = document.getElementById("sq5").value;
  const sq6 = document.getElementById("sq6").value;
  const features = Array.from(document.querySelectorAll(".checkbox-group input:checked"))
    .map((checkbox) => checkbox.value)
    .join(", ");

  if (!sq1 || !sq2) {
    alert("Please answer at least the first two questions.");
    return;
  }

  const surveyBtn = document.querySelector(".survey-submit");
  surveyBtn.textContent = "Sending...";
  surveyBtn.disabled = true;

  const payload = {
    frequency: sq1,
    region: sq2,
    features,
    guide_experience: sq4,
    price_willing: "\u20b1" + sq5 + "/mo",
    open_feedback: sq6,
    timestamp: new Date().toISOString()
  };

  try {
    if (SURVEY_URL !== "YOUR_SURVEY_APPS_SCRIPT_URL_HERE") {
      await fetch(SURVEY_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    document.getElementById("survey-success").style.display = "block";
    surveyBtn.textContent = "Submitted!";
    surveyBtn.style.background = "#89988e";
  } catch (err) {
    console.error("Survey error:", err);
    document.getElementById("survey-success").style.display = "block";
    surveyBtn.textContent = "Submitted!";
    surveyBtn.style.background = "#89988e";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const range = document.getElementById("sq5");

  if (range) {
    updateRangeFill(range);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("nav-open"));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      setNavOpen(false);
    }
  });
});
