const words = [
  { en: "opportunity", ru: "возможность", ex: "I have an opportunity to learn programming." },
  { en: "significant", ru: "значительный", ex: "This is a significant step for my future." },
  { en: "reduce", ru: "уменьшать", ex: "I want to reduce sugar in my diet." },
  { en: "achieve", ru: "достигать", ex: "I want to achieve my goals." },
  { en: "require", ru: "требовать", ex: "Learning requires practice every day." },
];

let index = Number(localStorage.getItem("idx") || 0);
let known = JSON.parse(localStorage.getItem("known") || "[]");

const elWord = document.getElementById("word");
const elTr = document.getElementById("tr");
const elEx = document.getElementById("ex");
const elTranslation = document.getElementById("translation");
const elProgress = document.getElementById("progressText");

const showBtn = document.getElementById("showBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const resetBtn = document.getElementById("resetBtn");

function clampIndex() {
  if (index < 0) index = 0;
  if (index >= words.length) index = 0;
}

function updateProgress() {
  elProgress.textContent = `${known.length} / ${words.length}`;
}

function render() {
  clampIndex();
  const w = words[index];
  elWord.textContent = w.en;
  elTr.textContent = w.ru;
  elEx.textContent = w.ex;
  elTranslation.classList.add("hidden");
  updateProgress();
}

showBtn.addEventListener("click", () => {
  elTranslation.classList.toggle("hidden");
});

yesBtn.addEventListener("click", () => {
  const id = words[index].en;
  if (!known.includes(id)) known.push(id);
  localStorage.setItem("known", JSON.stringify(known));
  index = (index + 1) % words.length;
  localStorage.setItem("idx", String(index));
  render();
});

noBtn.addEventListener("click", () => {
  
  index = (index + 1) % words.length;
  localStorage.setItem("idx", String(index));
  render();
});

resetBtn.addEventListener("click", () => {
  known = [];
  index = 0;
  localStorage.setItem("known", JSON.stringify(known));
  localStorage.setItem("idx", String(index));
  render();
});

render();
