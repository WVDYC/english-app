# Copilot / Agent instructions for english-app

This is a tiny client-side single-file web app for storing and reviewing English words in the browser using localStorage. Keep changes minimal and local-first: there are no build tools, bundlers, or tests in this repo.

Key facts (read before changing code)
- Single-page app: UI in `index.html`, behavior in `app.js`, styles in `style.css`.
- Persistent storage: `app.js` reads/writes one localStorage key `my_words_v1` (see `const KEY` in `app.js`).
- No module system: `app.js` is loaded via a plain `<script>` tag; do not assume imports/exports.
- `Sever.py` is present but empty; the app runs by opening `index.html` or serving the folder with a static server.

Big-picture behavior
- Add screen (`#screenAdd`) — inputs: `#enInput`, `#ruInput`, `#exInput`; `#addBtn` validates `en`+`ru`, deduplicates via `normalizeEn()` and then `saveWords()`.
- Cards screen (`#screenCards`) — shows `#cardEn`, reveal `#cardRu` via `#showBtn`, navigation via `#prevBtn`/`#nextBtn`, swipe support implemented for touch devices.
- List screen (`#screenList`) — `#searchInput` filters `words` and renders entries into `#listBox`; delete button removes by normalized English key.

Common tasks & examples
- Run locally: open `index.html` in a browser. If you need an HTTP server, run from the repo root:

  python -m http.server 8000

- Inspect storage: in browser console run `localStorage.getItem('my_words_v1')`.
- Programmatically add a test word in console:

  let w = [{en:'bread',ru:'хлеб',ex:'I eat bread.',createdAt:Date.now()}];
  localStorage.setItem('my_words_v1', JSON.stringify(w));
  location.reload();

Important conventions & patterns
- Avoid changing DOM IDs — `app.js` binds directly to elements by id (e.g. `cardEn`, `listBox`).
- Use existing helpers: `loadWords()`, `saveWords(words)`, `normalizeEn(s)` and `escapeHtml(s)` instead of reimplementing storage/normalization.
- Deduplication: compare `.toLowerCase().trim()` via `normalizeEn()` — keep that behavior when editing add/delete logic.
- Sanitization: UI uses `escapeHtml()` before inserting text into list items; preserve this to avoid XSS when adding markup.

Debugging tips
- Use browser DevTools console for quick checks: `words = JSON.parse(localStorage.getItem('my_words_v1')||'[]')`.
- To reproduce card navigation bugs, seed several items and use `#shuffleBtn`, `#prevBtn`, `#nextBtn` UI or call `renderCard()` from console.

What to watch out for
- This repo is intentionally simple — do not introduce a build pipeline or ES module syntax without discussing scope first.
- `Sever.py` is empty — if a server is needed, prefer using `python -m http.server` unless a user requests a custom server implementation.

Files to inspect when working on features/bugs
- `app.js` — core logic (DOM bindings, storage, rendering). Primary file to edit.
- `index.html` — DOM structure and IDs.
- `style.css` — visual layout; changes may require small DOM tweaks.
- `Sever.py` — currently unused/empty; mention before implementing server-side code.

If unclear or you need more context, ask: which browser targets, desire to add tests, or whether a server should be implemented in `Sever.py`.

-- end --
