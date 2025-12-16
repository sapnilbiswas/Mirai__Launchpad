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

    /* ---------------- MODE SWITCH ---------------- */
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

            // OTP acts as password for login
            otpInput.placeholder = "Enter Password *";
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

            otpInput.placeholder = "Enter OTP";
            otpInput.required = false;

            nameInput.required = true;
            phoneInput.required = true;
        }
    }

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