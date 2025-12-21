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



//   LIFE @ MIRAI – FINAL INFINITE CAROUSEL SCRIPT
const lifeSection = document.querySelector(".mirai-life-carousel");
const lifeTrack = document.querySelector(".mirai-life-track");

let lifeDragging = false;
let lifeStartX = 0;
let lifeTranslateX = 0;
let lifeSpeed = 0.6;

let isCarouselPaused = false;
let isVideoPlaying = false;

//   DUPLICATE CARDS FOR TRUE INFINITE LOOP
const lifeOriginalCards = [...lifeTrack.children];

// clone ONLY non-video cards
lifeOriginalCards.forEach(card => {
  if (!card.classList.contains("is-video")) {
    lifeTrack.appendChild(card.cloneNode(true));
  }
});

//   CALCULATE WIDTH OF ONE FULL SET & CACHE DIMENSIONS
let lifeTotalWidth = 0;
let cachedCardWidth = 220; // fallback

if (lifeOriginalCards.length > 0) {
  cachedCardWidth = lifeOriginalCards[0].offsetWidth;
  lifeOriginalCards.forEach(card => {
    const style = getComputedStyle(card);
    const gap = parseFloat(style.marginRight) || 28;
    lifeTotalWidth += card.offsetWidth + gap;
  });
}

//   START FROM CENTER (IMPORTANT)
lifeTranslateX = -lifeTotalWidth / 2;
lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;


//  WRAP LOGIC (BOTH DIRECTIONS)
function wrapLifeCarousel() {
  if (lifeTranslateX <= -lifeTotalWidth) {
    lifeTranslateX += lifeTotalWidth;
  }
  if (lifeTranslateX >= 0) {
    lifeTranslateX -= lifeTotalWidth;
  }
}

//  AUTO ANIMATION
let lastCenterCheck = 0;
const centerCheckInterval = 100; // Throttle layout reads to every 100ms

function updateCenterCard() {
  const now = Date.now();
  if (now - lastCenterCheck < centerCheckInterval) return;
  lastCenterCheck = now;

  const centerX = lifeSection.offsetWidth / 2;

  // Utilize live children collection
  const cards = lifeTrack.children;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    // Calculate center based on transform + offset
    // Visual Postion = currentTrackX + cardLeft + halfWidth
    const cardCenter = lifeTranslateX + card.offsetLeft + cachedCardWidth / 2;

    const isCentered = Math.abs(cardCenter - centerX) < (cachedCardWidth / 2);
    const hasClass = card.classList.contains("is-center");

    if (isCentered && !hasClass) card.classList.add("is-center");
    if (!isCentered && hasClass) card.classList.remove("is-center");
  }
}

function animateLifeCarousel() {
  if (!isCarouselPaused) {
    lifeTranslateX -= lifeSpeed;
    wrapLifeCarousel();
    lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;
    updateCenterCard();
  }
  requestAnimationFrame(animateLifeCarousel);
}
requestAnimationFrame(animateLifeCarousel);


//  MOUSE DRAG
lifeSection.addEventListener("mousedown", (e) => {
  lifeDragging = true;
  lifeStartX = e.clientX;
  lifeSection.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  lifeDragging = false;
  lifeSection.style.cursor = "default";
});

lifeSection.addEventListener("mousemove", (e) => {
  if (!lifeDragging) return;
  const delta = e.clientX - lifeStartX;
  lifeStartX = e.clientX;
  lifeTranslateX += delta;
  wrapLifeCarousel();
  lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;
});

//  TRACKPAD HORIZONTAL SCROLL ONLY
lifeSection.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    isCarouselPaused = true;
    lifeTranslateX -= e.deltaX;
    wrapLifeCarousel();
    lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;

    clearTimeout(lifeSection._scrollTimeout);
    lifeSection._scrollTimeout = setTimeout(() => {
      if (!isVideoPlaying) {
        isCarouselPaused = false;
      }
    }, 120);
  },
  { passive: false }
);


/* ================= VIDEO CONTROL (FACADE PATTERN) ================= */

const players = {};

// Delegate click listener for all video cards
lifeTrack.addEventListener("click", (e) => {
  const card = e.target.closest(".mirai-life-card.is-video");
  if (!card) return;

  // Stop propagation to avoid immediate 'click outside' triggers if any
  e.stopPropagation();

  const videoId = card.dataset.videoId;
  const facade = card.querySelector(".video-facade");
  const containerId = `player-${videoId}`;

  // 1. Initialize Player if not exists
  if (!players[videoId]) {
    if (facade) facade.style.display = "none";

    // Ensure the container exists
    if (document.getElementById(containerId)) {
      players[videoId] = new YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'rel': 0,
          'enablejsapi': 1
        },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    }
  } else {
    // 2. Already initialized? Toggle play/pause? 
    // Usually clicking the iframe handles this, but since we capture the click on the card wrapper...
    // Actually, pointer-events on the wrapper might block the iframe?
    // We set 'pointer-events: auto' on iframe in CSS when is-playing.
    // If iframe consumes click, this listener won't fire.
  }
});


function onPlayerStateChange(event) {
  const state = event.data;
  const iframe = event.target.getIframe();
  const card = iframe ? iframe.closest(".mirai-life-card") : null;

  if (state === YT.PlayerState.PLAYING) {
    isVideoPlaying = true;
    isCarouselPaused = true;
    if (card) card.classList.add("is-playing");
  } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
    isVideoPlaying = false;
    isCarouselPaused = false;
    if (card) card.classList.remove("is-playing");
  }
}

// Pause carousel on hover
lifeSection.addEventListener("mouseenter", () => {
  isCarouselPaused = true;
});

lifeSection.addEventListener("mouseleave", () => {
  if (!isVideoPlaying) {
    isCarouselPaused = false;
  }
});

// Global API Ready (required by YouTube API)
function onYouTubeIframeAPIReady() {
  // Players are initialized on demand (click)
}
