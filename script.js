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


//   DUPLICATE CARDS FOR TRUE INFINITE LOOP

const lifeOriginalCards = [...lifeTrack.children];

// clone ONLY non-video cards
lifeOriginalCards.forEach(card => {
  if (!card.classList.contains("is-video")) {
    lifeTrack.appendChild(card.cloneNode(true));
  }
});

//   CALCULATE WIDTH OF ONE FULL SET

let lifeTotalWidth = 0;
lifeOriginalCards.forEach(card => {
  const style = getComputedStyle(card);
  const gap = parseFloat(style.marginRight) || 28;
  lifeTotalWidth += card.offsetWidth + gap;
});


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


function updateCenterCard() {
  const cards = document.querySelectorAll(".mirai-life-card");
  const centerX = lifeSection.offsetWidth / 2;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;

    card.classList.toggle(
      "is-center",
      Math.abs(cardCenter - centerX) < rect.width / 2
    );
  });
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


//  MOUSE DRAG (NO CURSOR CHANGE)

lifeSection.addEventListener("mousedown", (e) => {
  lifeDragging = true;
  lifeStartX = e.clientX;
});

window.addEventListener("mouseup", () => {
  lifeDragging = false;
});

lifeSection.addEventListener("mousemove", (e) => {
  if (!lifeDragging) return;
  const delta = e.clientX - lifeStartX;
  lifeStartX = e.clientX;
  lifeTranslateX += delta;
  wrapLifeCarousel();
});

//  TRACKPAD HORIZONTAL SCROLL ONLY
lifeSection.addEventListener(
  "wheel",
  (e) => {
    // Only care about horizontal trackpad scroll
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();

    // Pause auto animation while user scrolls
    isCarouselPaused = true;

    lifeTranslateX -= e.deltaX;
    wrapLifeCarousel();
    lifeTrack.style.transform = `translateX(${lifeTranslateX}px)`;

    // Resume animation shortly after scroll ends
    clearTimeout(lifeSection._scrollTimeout);
    lifeSection._scrollTimeout = setTimeout(() => {
      if (!isVideoPlaying) {
        isCarouselPaused = false;
      }
    }, 120);
  },
  { passive: false }
);


/* ================= VIDEO CONTROL ================= */

let activeVideoCard = null;

let isCarouselPaused = false;   // ← ADD THIS LINE

let isVideoPlaying = false;

let activePlayer = null;
const players = {};

requestAnimationFrame(animateLifeCarousel);
function stopVideo(card) {
  const iframe = card.querySelector("iframe");
  const videoId = card.dataset.videoId;
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
  card.classList.remove("is-playing");
}


function onYouTubeIframeAPIReady() {
  document.querySelectorAll(".mirai-life-card.is-video").forEach(card => {
    const videoId = card.dataset.videoId;
    const iframe = card.querySelector("iframe");
    const iframeId = iframe.id;

    card.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!players[videoId]) {
        players[videoId] = new YT.Player(iframe.id, {
          events: {
            onStateChange: handleVideoState
          }
        });
      }

      players[videoId].playVideo();
      activePlayer = players[videoId];
    });
  });
}

function handleVideoState(event) {
  const card = event.target.getIframe().closest(".mirai-life-card");

  if (event.data === YT.PlayerState.PLAYING) {
    isVideoPlaying = true;
    isCarouselPaused = true;
    card.classList.add("is-playing");
  }

  if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    isVideoPlaying = false;
    isCarouselPaused = false;
    card.classList.remove("is-playing");
  }
}

document.addEventListener("click", (e) => {
  const clickedVideo = e.target.closest(".mirai-life-card.is-video");

  // Clicked outside any video card
  if (!clickedVideo && activePlayer) {
    activePlayer.pauseVideo();
    isVideoPlaying = false;
    isCarouselPaused = false;

    document
      .querySelectorAll(".mirai-life-card.is-playing")
      .forEach(card => card.classList.remove("is-playing"));
  }
});


lifeSection.addEventListener("mouseenter", () => {
  isCarouselPaused = true;
});

lifeSection.addEventListener("mouseleave", () => {
  // Resume ONLY if no video is playing
  if (!isVideoPlaying) {
    isCarouselPaused = false;
  }
});

document.addEventListener("click", (e) => {
  const clickedVideo = e.target.closest(".mirai-life-card.is-video");

  if (!clickedVideo && activePlayer) {
    activePlayer.pauseVideo();
    isCarouselPaused = false;
    activePlayer = null;

    document
      .querySelectorAll(".mirai-life-card.is-playing")
      .forEach(card => card.classList.remove("is-playing"));
  }
});


const carousel = document.querySelector(".mirai-life-carousel");

carousel.addEventListener("mouseenter", () => {
  isCarouselPaused = true;
});

carousel.addEventListener("mouseleave", () => {
  // resume only if no video is playing
  if (!activePlayer) {
    isCarouselPaused = false;
  }
});


const videoObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const iframe = entry.target;
      if (!iframe.src) {
        iframe.src = iframe.dataset.src; // 🔥 async load
      }

      observer.unobserve(iframe); // load only once
    });
  },
  {
    root: document.querySelector(".mirai-life-carousel"),
    rootMargin: "300px", // preload before visible
    threshold: 0.1
  }
);

// Observe ONLY video iframes
document.querySelectorAll(".mirai-life-card.is-video iframe")
  .forEach(iframe => videoObserver.observe(iframe));
