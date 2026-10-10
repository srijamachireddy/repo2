const CORRECT_PASSCODE = "1010";

const screens = [...document.querySelectorAll(".screen")];
const passcodeInput = document.querySelector("#passcode-input");
const passcodeMessage = document.querySelector("#passcode-message");
const pinDots = [...document.querySelectorAll(".pin-dot")];
const noModal = document.querySelector("#no-modal");
let passcode = "";

function showScreen(screenId) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen || !nextScreen.classList.contains("screen")) {
    throw new Error(`Unknown screen: ${screenId}`);
  }

  screens.forEach((screen) => {
    const isActive = screen === nextScreen;
    screen.hidden = !isActive;
    screen.classList.toggle("active", isActive);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updatePasscodeDisplay() {
  pinDots.forEach((dot, index) => dot.classList.toggle("filled", index < passcode.length));
  passcodeInput.value = passcode;
}

function submitPasscode() {
  if (passcode.length !== 4) return;

  if (passcode === CORRECT_PASSCODE) {
    passcodeMessage.textContent = "";
    showScreen("question-screen");
    return;
  }

  passcodeMessage.textContent = "Not quite! Try the special four numbers again.";
  passcode = "";
  updatePasscodeDisplay();
}

function addDigit(digit) {
  if (passcode.length >= 4) return;
  passcode += digit;
  passcodeMessage.textContent = "";
  updatePasscodeDisplay();
  if (passcode.length === 4) submitPasscode();
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (!button) return;

  const key = button.dataset.key;
  if (/^\d$/.test(key)) {
    addDigit(key);
  } else if (key === "*") {
    passcode = passcode.slice(0, -1);
    passcodeMessage.textContent = "";
    updatePasscodeDisplay();
  } else if (key === "#") {
    passcode = "";
    passcodeMessage.textContent = "";
    updatePasscodeDisplay();
  }
});

passcodeInput.addEventListener("input", () => {
  passcode = passcodeInput.value.replace(/\D/g, "").slice(0, 4);
  updatePasscodeDisplay();
  submitPasscode();
});

document.addEventListener("keydown", (event) => {
  if (document.querySelector("#passcode-screen").classList.contains("active")) {
    if (/^\d$/.test(event.key)) addDigit(event.key);
    if (event.key === "Backspace") {
      passcode = passcode.slice(0, -1);
      passcodeMessage.textContent = "";
      updatePasscodeDisplay();
    }
    if (event.key === "Escape") {
      passcode = "";
      passcodeMessage.textContent = "";
      updatePasscodeDisplay();
    }
  }

  if (event.key === "Escape" && !noModal.hidden) {
    noModal.hidden = true;
    document.querySelector("#no-button").focus();
  }
});

document.querySelector("#yes-button").addEventListener("click", () => showScreen("birthday-screen"));
document.querySelector("#no-button").addEventListener("click", () => {
  noModal.hidden = false;
  document.querySelector("#try-again").focus();
});
document.querySelector("#try-again").addEventListener("click", () => {
  noModal.hidden = true;
  document.querySelector("#no-button").focus();
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.querySelector("#flame-button").addEventListener("click", (event) => {
  const flame = event.currentTarget;
  document.querySelector(".cake-scene").classList.add("blown");
  flame.classList.add("extinguished");
  flame.disabled = true;
  flame.setAttribute("aria-label", "Candle blown out");
  document.querySelector("#cake-cracker").hidden = false;
  document.querySelector("#wish-message").textContent = "Wish made, Adi! May every bit of it come true. ✨";
  document.querySelector("#candle-next").hidden = false;
});

document.querySelectorAll(".gift-choice").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.gift));
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});

document.querySelector("#envelope-button").addEventListener("click", (event) => {
  const envelope = event.currentTarget;
  const isOpen = envelope.classList.toggle("open");
  envelope.setAttribute("aria-label", isOpen ? "Close your birthday letter" : "Open your birthday letter");
  document.querySelector("#love-letter").hidden = !isOpen;
  document.querySelector("#envelope-hint").textContent = isOpen ? "a little love, just for you ♡" : "tap the little heart to open";
});

document.querySelectorAll(".photo-frame img, .polaroid img").forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
  });
  image.addEventListener("load", () => {
    image.parentElement.querySelector(".photo-fallback").hidden = true;
  });
});
