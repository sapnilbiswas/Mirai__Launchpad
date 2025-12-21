document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- TAB ELEMENTS ---------------- */
  const registerTab = document.getElementById("register-tab");
  const loginTab = document.getElementById("login-tab");
  const form = document.querySelector(".lead-form");
  const submitBtn = form.querySelector(".submit-btn");

  /* ---------------- FORM GROUPS (BY ORDER) ---------------- */
  const formGroups = form.querySelectorAll(".form-group");

  const nameGroup = formGroups[0];
  const emailGroup = formGroups[1];
  const phoneGroup = formGroups[2];
  const otpGroup = formGroups[3];
  const yearGroup = formGroups[4];
  const streamGroup = formGroups[5];

  /* ---------------- INPUTS ---------------- */
  const nameInput = nameGroup.querySelector("input");
  const emailInput = emailGroup.querySelector("input");
  const phoneInput = phoneGroup.querySelector("input");
  const otpInput = otpGroup.querySelector("input");

  let isLoginMode = false;

  /* ---------------- NEW ELEMENTS ---------------- */
  const loginExtras = document.querySelector(".login-extras");
  const forgotPasswordLink = document.getElementById("forgot-password");
  const toggleAuthBtn = document.getElementById("toggle-auth-mode");

  /* ---------------- MODE SWITCH ---------------- */

  // Track specific login sub-mode
  let isLoginOtpMode = false;

  function updateLoginUi() {
    if (isLoginOtpMode) {
      otpInput.placeholder = "Enter OTP *";
      otpInput.type = "text"; // OTP is usually text/number
      toggleAuthBtn.textContent = "Login via Password";
      forgotPasswordLink.style.display = "none"; // Hide forgot password in OTP mode
    } else {
      otpInput.placeholder = "Enter Password *";
      otpInput.type = "password"; // Secure for password
      toggleAuthBtn.textContent = "Login via OTP";
      forgotPasswordLink.style.display = "block";
    }
  }

  function switchMode(login) {
    isLoginMode = login;

    if (login) {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      submitBtn.textContent = "LOG IN";

      // Hide registration-only fields
      nameGroup.style.display = "none";
      phoneGroup.style.display = "none";
      yearGroup.style.display = "none";
      streamGroup.style.display = "none";

      // Show login extras
      loginExtras.style.display = "flex";

      // Default to password mode on immediate switch
      isLoginOtpMode = false;
      updateLoginUi();

      otpInput.required = true;
      nameInput.required = false;
      phoneInput.required = false;

    }
    else {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      submitBtn.textContent = "APPLY NOW";

      // Show all fields
      nameGroup.style.display = "block";
      phoneGroup.style.display = "flex";
      yearGroup.style.display = "block";
      streamGroup.style.display = "block";

      // Hide login extras
      loginExtras.style.display = "none";

      otpInput.placeholder = "Enter OTP";
      otpInput.type = "text";
      otpInput.required = false;

      nameInput.required = true;
      phoneInput.required = true;
    }
  }

  // Toggle Auth Mode Listener
  toggleAuthBtn.addEventListener("click", () => {
    isLoginOtpMode = !isLoginOtpMode;
    updateLoginUi();
  });

  registerTab.addEventListener("click", () => switchMode(false));
  loginTab.addEventListener("click", () => switchMode(true));

  /* ---------------- FORM SUBMIT ---------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (isLoginMode) {
      if (!otpInput.value.trim()) {
        alert("Please enter your password");
        return;
      }

      alert(`Logged in successfully as ${email}`);
      form.reset();
    } else {
      if (phoneInput.value.trim().length < 10) {
        alert("Enter a valid mobile number");
        return;
      }

      alert("Application submitted successfully!");
      form.reset();
    }
  });

  /* ---------------- APPLY NOW SCROLL ---------------- */
  const applyButtons = document.querySelectorAll("button");

  applyButtons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes("apply")) {
      btn.addEventListener("click", (e) => {
        if (btn.type === "submit") return;

        e.preventDefault();
        document
          .querySelector(".hero-form-container")
          .scrollIntoView({ behavior: "smooth", block: "center" });

        emailInput.focus();
      });
    }
  });

});



/* =========================
   LIFE @ MIRAI – CAROUSEL
========================= */

const lifeSection = document.querySelector(".mirai-life-carousel");
const lifeTrack = document.querySelector(".mirai-life-track");

/* ---------- CURSOR FEEDBACK (DESKTOP UX) ---------- */
lifeSection.style.cursor = "grab";

lifeSection.addEventListener("mousedown", () => {
  lifeSection.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  lifeSection.style.cursor = "grab";
});


lifeSection.style.touchAction = "pan-y";

/* ---------- STATE ---------- */
let lifeDragging = false;
let lifeStartX = 0;
let lifeTranslateX = 0;
let lifeSpeed = 0.6;
let touchDragging = false;
let touchStartX = 0;

let isVideoPlaying = false;

/* ---------- DUPLICATE NON-VIDEO CARDS ---------- */
const originalCards = [...lifeTrack.children];

// duplicate entire set ONCE
originalCards.forEach(card => {
  lifeTrack.appendChild(card.cloneNode(true));
});

/* ---------- CALCULATE WIDTH ---------- */
let totalWidth = 0;

originalCards.forEach(card => {
  const styles = getComputedStyle(card);
  const gap = parseFloat(styles.marginRight) || 28;
  totalWidth += card.getBoundingClientRect().width + gap;
});

/* ---------- START FROM CENTER ---------- */
lifeTranslateX = -totalWidth / 2;
lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;

/* ---------- WRAP LOGIC ---------- */
function wrapCarousel() {
  if (lifeTranslateX <= -totalWidth) lifeTranslateX += totalWidth;
  if (lifeTranslateX >= 0) lifeTranslateX -= totalWidth;
}

/* ---------- AUTO ANIMATION ---------- */
function animateCarousel() {
  if (!isVideoPlaying) {
    lifeTranslateX -= lifeSpeed;
    wrapCarousel();
    lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;
  }
  requestAnimationFrame(animateCarousel);
}

requestAnimationFrame(animateCarousel);

/* ---------- DRAG SUPPORT ---------- */
lifeSection.addEventListener("mousedown", e => {
  lifeDragging = true;
  lifeStartX = e.clientX;
});

window.addEventListener("mouseup", () => {
  lifeDragging = false;
});


lifeSection.addEventListener("mousemove", e => {
  if (!lifeDragging) return;

  const delta = e.clientX - lifeStartX;
  lifeStartX = e.clientX;
  lifeTranslateX += delta;
  wrapCarousel();
  lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;
});



/* ---------- TOUCH DRAG SUPPORT (ANDROID / iOS) ---------- */

lifeSection.addEventListener("touchstart", (e) => {
  touchDragging = true;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

lifeSection.addEventListener("touchmove", (e) => {
  if (!touchDragging) return;

  const currentX = e.touches[0].clientX;
  const delta = currentX - touchStartX;
  touchStartX = currentX;

  lifeTranslateX += delta;
  wrapCarousel();
  lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;

  // 🔥 stop vertical scroll ONLY while swiping horizontally
  e.preventDefault();
}, { passive: false });

lifeSection.addEventListener("touchend", () => {
  touchDragging = false;
});


/* ---------- TRACKPAD HORIZONTAL SCROLL ---------- */
lifeSection.addEventListener(
  "wheel",
  e => {
    if (isVideoPlaying) {
      e.preventDefault();
      return;
    }
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();
    lifeTranslateX -= e.deltaX;
    wrapCarousel();
    lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;
  },
  { passive: false }
);

/* =========================
   VIDEO LOGIC (CLEAN)
========================= */

function resetVideoCard(card) {
  const iframe = card.querySelector("iframe");
  iframe.src = "";              // fully stop video
  card.classList.remove("is-playing");
  isVideoPlaying = false;       // 🔥 carousel resumes automatically
}

/* ---------- PLAY VIDEO ---------- */
document.querySelectorAll(".mirai-life-card.is-video").forEach(card => {
  const thumb = card.querySelector(".video-thumb");

  // ✅ If this is a YouTube-only card, DO NOTHING
  if (card.classList.contains("youtube-only")) return;

  const iframe = card.querySelector("iframe");

  thumb.addEventListener("click", e => {
    e.stopPropagation();

    if (card.classList.contains("is-playing")) return;

    // Stop any other video
    document
      .querySelectorAll(".mirai-life-card.is-playing")
      .forEach(c => resetVideoCard(c));

    card.classList.add("is-playing");
    isVideoPlaying = true;

    iframe.src = iframe.dataset.src + "&autoplay=1";
  });
});


/* ---------- CLICK OUTSIDE → RESET ---------- */
document.addEventListener("click", e => {
  if (!e.target.closest(".mirai-life-card.is-video")) {
    document
      .querySelectorAll(".mirai-life-card.is-playing")
      .forEach(card => resetVideoCard(card));
  }
});

/* ---------- RESET WHEN CARD LEAVES VIEW ---------- */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && entry.target.classList.contains("is-playing")) {
        resetVideoCard(entry.target);
      }
    });
  },
  {
    root: lifeSection,
    threshold: 0.25
  }
);

document
  .querySelectorAll(".mirai-life-card.is-video")
  .forEach(card => observer.observe(card));



/*  LAZY LOAD */

document.addEventListener("DOMContentLoaded", () => {
  const lazyBgs = document.querySelectorAll(".lazy-bg");

  if (!lazyBgs.length) return;

  const bgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        observer.unobserve(el);
      }
    });
  }, {
    rootMargin: "200px"
  });

  lazyBgs.forEach(bg => bgObserver.observe(bg));
});

function onYouTubeIframeAPIReady() {
}
document.querySelectorAll(".mirai-life-card.is-video iframe")
  .forEach(iframe => videoObserver.observe(iframe));