
const KEY = "my_words_v1";

function loadWords() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveWords(words) {
  localStorage.setItem(KEY, JSON.stringify(words));
}


let words = loadWords();
let cardIndex = 0;

const tabAdd = document.getElementById("tabAdd");
const tabCards = document.getElementById("tabCards");
const tabList = document.getElementById("tabList");
const tabGame = document.getElementById("tabGame");

const screenAdd = document.getElementById("screenAdd");
const screenCards = document.getElementById("screenCards");
const screenList = document.getElementById("screenList");
const screenGame = document.getElementById("screenGame");

function setActiveTab(which) {
  // reset
  [tabAdd, tabCards, tabList, tabGame].forEach(t => t.classList.remove("active"));
  [screenAdd, screenCards, screenList, screenGame
  ].forEach(s => s.classList.add("hidden"));

  if (which === "add") {
    tabAdd.classList.add("active");
    screenAdd.classList.remove("hidden");
  } else if (which === "cards") {
    tabCards.classList.add("active");
    screenCards.classList.remove("hidden");
    renderCard();
  } else if (which === "list") {
    tabList.classList.add("active");
    screenList.classList.remove("hidden");
    renderList();
  } else if (which === "game") {
    tabGame.classList.add("active");
    screenGame.classList.remove("hidden");
  }

}

tabAdd.addEventListener("click", () => setActiveTab("add"));
tabCards.addEventListener("click", () => setActiveTab("cards"));
tabList.addEventListener("click", () => setActiveTab("list"));
tabGame.addEventListener("click", () => setActiveTab("game"));


const enInput = document.getElementById("enInput");
const ruInput = document.getElementById("ruInput");
const exInput = document.getElementById("exInput");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const hint = document.getElementById("hint");

function showHint(text) {
  hint.textContent = text;
  setTimeout(() => {
    if (hint.textContent === text) hint.textContent = "";
  }, 1600);
}

function normalizeEn(s) {
  return s.trim().toLowerCase();
}

addBtn.addEventListener("click", () => {
  const en = enInput.value.trim();
  const ru = ruInput.value.trim();
  const ex = exInput.value.trim();

  if (!en || !ru) {
    showHint("Write English + translation.");
    return;
  }

  const enKey = normalizeEn(en);
  const exists = words.some(w => normalizeEn(w.en) === enKey);

  if (exists) {
    showHint("This word already exists (duplicate).");
    return;
  }

  words.push({ en, ru, ex, createdAt: Date.now() });
  saveWords(words);

  enInput.value = "";
  ruInput.value = "";
  exInput.value = "";
  showHint("Added ");

 
  cardIndex = Math.max(0, words.length - 1);
});

clearAllBtn.addEventListener("click", () => {
  if (!confirm("Delete all words?")) return;
  words = [];
  saveWords(words);
  cardIndex = 0;
  showHint("Cleared ");
});


[enInput, ruInput, exInput].forEach(inp => {
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
});


const cardCounter = document.getElementById("cardCounter");
const cardEn = document.getElementById("cardEn");
const cardRu = document.getElementById("cardRu");
const cardEx = document.getElementById("cardEx");
const trBox = document.getElementById("trBox");

const showBtn = document.getElementById("showBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

function renderCard() {
  if (words.length === 0) {
    cardCounter.textContent = "0 / 0";
    cardEn.textContent = "No words ";
    cardRu.textContent = "";
    cardEx.textContent = "";
    trBox.classList.add("hidden");
    return;
  }

  if (cardIndex < 0) cardIndex = 0;
  if (cardIndex >= words.length) cardIndex = 0;

  const w = words[cardIndex];
  cardCounter.textContent = `${cardIndex + 1} / ${words.length}`;
  cardEn.textContent = w.en;
  cardRu.textContent = w.ru;
  cardEx.textContent = w.ex ? w.ex : "";
  trBox.classList.add("hidden");
}

showBtn.addEventListener("click", () => {
  if (words.length === 0) return;
  trBox.classList.toggle("hidden");
});

prevBtn.addEventListener("click", () => {
  if (words.length === 0) return;
  cardIndex = (cardIndex - 1 + words.length) % words.length;
  renderCard();
});

nextBtn.addEventListener("click", () => {
  if (words.length === 0) return;
  cardIndex = (cardIndex + 1) % words.length;
  renderCard();
});

shuffleBtn.addEventListener("click", () => {
  if (words.length < 2) return;


  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  saveWords(words);
  cardIndex = 0;
  renderCard();
});


let touchX = null;
screenCards.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
}, { passive: true });

screenCards.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;

  if (Math.abs(dx) < 40) return;
  if (dx < 0) nextBtn.click(); else prevBtn.click();
}, { passive: true });


const searchInput = document.getElementById("searchInput");
const listBox = document.getElementById("listBox");
const countBadge = document.getElementById("countBadge");

function renderList() {
  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = words.filter(w => {
    const en = (w.en || "").toLowerCase();
    const ru = (w.ru || "").toLowerCase();
    return en.includes(q) || ru.includes(q);
  });

  countBadge.textContent = String(filtered.length);
  listBox.innerHTML = "";

  if (filtered.length === 0) {
    listBox.innerHTML = `<div class="item">No words found.</div>`;
    return;
  }

  filtered.forEach((w) => {
    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <div class="itemTop">
        <div>
          <div class="itemEn">${escapeHtml(w.en)}</div>
          <div class="itemRu">${escapeHtml(w.ru)}</div>
        </div>
        <button class="delBtn">Delete</button>
      </div>
      ${w.ex ? `<div class="itemEx">${escapeHtml(w.ex)}</div>` : ``}
    `;

  
    item.querySelector(".delBtn").addEventListener("click", () => {
      const enKey = normalizeEn(w.en);
      words = words.filter(x => normalizeEn(x.en) !== enKey);
      saveWords(words);
      if (cardIndex >= words.length) cardIndex = 0;
      renderList();
    });

    listBox.appendChild(item);
  });
}

searchInput.addEventListener("input", renderList);


function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


setActiveTab("add");
