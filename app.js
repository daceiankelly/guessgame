const MAX_LIVES = 10;
const STORAGE_KEY = "offline-guesser-state-v1";

const ESRB_ORDER = ["EC", "E", "E10+", "T", "M", "AO"];

const GENRE_ICONS = {
  "Point-and-click": { glyph: "\u{1F5B1}\u{FE0F}", label: "Point&Click" },
  Fighting: { glyph: "\u{1F94A}", label: "Fighting" },
  Shooter: { glyph: "\u{1F52B}", label: "Shooter" },
  Music: { glyph: "\u{1F3B5}", label: "Music" },
  Platform: { glyph: "\u{1FA9C}", label: "Platform" },
  Puzzle: { glyph: "\u{1F9E9}", label: "Puzzle" },
  Racing: { glyph: "\u{1F3CE}\u{FE0F}", label: "Racing" },
  "Real Time Strategy (RTS)": { glyph: "\u{23F1}\u{FE0F}", label: "RTS" },
  "Role-playing (RPG)": { glyph: "\u{1F5E1}\u{FE0F}", label: "RPG" },
  Simulator: { glyph: "\u{1F6E0}\u{FE0F}", label: "Sim" },
  Sport: { glyph: "\u{26BD}", label: "Sport" },
  Strategy: { glyph: "\u{265F}\u{FE0F}", label: "Strategy" },
  "Turn-based strategy (TBS)": { glyph: "\u{1F501}", label: "TBS" },
  Tactical: { glyph: "\u{1F9ED}", label: "Tactical" },
  "Hack and slash/Beat 'em up": { glyph: "\u{2694}\u{FE0F}", label: "Beat'emUp" },
  "Quiz/Trivia": { glyph: "\u{2753}", label: "Quiz" },
  Pinball: { glyph: "\u{1F3B1}", label: "Pinball" },
  Adventure: { glyph: "\u{1F9F3}", label: "Adventure" },
  Indie: { glyph: "\u{1F4A1}", label: "Indie" },
  Arcade: { glyph: "\u{1F579}\u{FE0F}", label: "Arcade" },
  "Visual Novel": { glyph: "\u{1F4D6}", label: "VN" },
  "Card & Board Game": { glyph: "\u{1F0CF}", label: "Card/Board" },
  MOBA: { glyph: "\u{1F310}", label: "MOBA" },
};

const THEME_ICONS = {
  Action: { glyph: "\u{2694}\u{FE0F}", label: "Action" },
  Fantasy: { glyph: "\u{1F9D9}", label: "Fantasy" },
  "Science fiction": { glyph: "\u{1F680}", label: "Sci-Fi" },
  Horror: { glyph: "\u{1F47B}", label: "Horror" },
  Thriller: { glyph: "\u{1F52A}", label: "Thriller" },
  Survival: { glyph: "\u{1F3D5}\u{FE0F}", label: "Survival" },
  Historical: { glyph: "\u{1F3DB}\u{FE0F}", label: "Historical" },
  Stealth: { glyph: "\u{1F977}", label: "Stealth" },
  Comedy: { glyph: "\u{1F602}", label: "Comedy" },
  Business: { glyph: "\u{1F4BC}", label: "Business" },
  Drama: { glyph: "\u{1F3AD}", label: "Drama" },
  "Non-fiction": { glyph: "\u{1F4F0}", label: "Non-fiction" },
  Sandbox: { glyph: "\u{1F3D6}\u{FE0F}", label: "Sandbox" },
  Educational: { glyph: "\u{1F393}", label: "Educational" },
  Kids: { glyph: "\u{1F9F8}", label: "Kids" },
  "Open world": { glyph: "\u{1F5FA}\u{FE0F}", label: "Open world" },
  Warfare: { glyph: "\u{1F4A3}", label: "Warfare" },
  Party: { glyph: "\u{1F389}", label: "Party" },
  "4X (explore, expand, exploit, and exterminate)": { glyph: "\u{1F30C}", label: "4X" },
  Erotic: { glyph: "\u{1F51E}", label: "Erotic" },
  Mystery: { glyph: "\u{1F50D}", label: "Mystery" },
  Romance: { glyph: "\u{1F497}", label: "Romance" },
};

const MODE_ICONS = {
  "Single player": { glyph: "\u{1F9CD}", label: "Single" },
  Multiplayer: { glyph: "\u{1F465}", label: "Multi" },
  "Co-operative": { glyph: "\u{1F91D}", label: "Co-op" },
  "Split screen": { glyph: "\u{1F5A5}\u{FE0F}", label: "Split" },
  "Massively Multiplayer Online (MMO)": { glyph: "\u{1F310}", label: "MMO" },
  "Battle Royale": { glyph: "\u{1F3C6}", label: "BR" },
};

const PLATFORM_RULES = [
  [/nintendo switch/i, "\u{1F3AE}", "Switch"],
  [/\bwii\b/i, "\u{1F3AE}", "Wii"],
  [/nintendo|famicom|game boy|gamecube|virtual boy|satellaview|super nes|\bnes\b|\bsnes\b/i, "\u{1F3AE}", "Nintendo"],
  [/windows|\bdos\b|microsoft/i, "\u{1F5A5}\u{FE0F}", "PC"],
  [/\bmac\b/i, "\u{1F34F}", "Mac"],
  [/linux/i, "\u{1F427}", "Linux"],
  [/ios|iphone|ipad|visionos/i, "\u{1F4F1}", "iOS"],
  [/android/i, "\u{1F4F1}", "Android"],
  [/oculus|quest|vr\b|virtual reality|daydream|gear vr/i, "\u{1F97D}", "VR"],
  [/sega|genesis|dreamcast|saturn|game gear|master system|32x/i, "\u{1F3AE}", "Sega"],
  [/atari/i, "\u{1F579}\u{FE0F}", "Atari"],
  [/arcade|neo geo/i, "\u{1F579}\u{FE0F}", "Arcade"],
  [/commodore|amiga/i, "\u{1F4BB}", "Commodore"],
  [/web browser/i, "\u{1F310}", "Browser"],
];

// PlayStation/Xbox get their own generation-specific label instead of a
// single generic bucket - "PS4" vs "PS5" is a genuinely useful clue for
// narrowing down release year, whereas a flat "PlayStation" isn't.
function playstationLabel(name) {
  if (/vr2/i.test(name)) return "PS VR2";
  if (/\bvr\b/i.test(name)) return "PS VR";
  if (/vita/i.test(name)) return "PS Vita";
  if (/portable|\bpsp\b/i.test(name)) return "PSP";
  const m = name.match(/playstation\s*(\d)/i);
  if (m) return "PS" + m[1];
  return "PS1";
}

function xboxLabel(name) {
  if (/series/i.test(name)) return "Xbox Series";
  const m = name.match(/xbox\s*(\d+)/i);
  if (m) return "Xbox " + m[1];
  if (/\bone\b/i.test(name)) return "Xbox One";
  return "Xbox";
}

function getPlatformIcon(name) {
  if (/playstation|\bps\d\b|\bvita\b|\bpsp\b/i.test(name)) {
    return { glyph: "\u{1F3AE}", label: playstationLabel(name) };
  }
  if (/xbox/i.test(name)) {
    return { glyph: "\u{1F3AE}", label: xboxLabel(name) };
  }
  for (const [re, glyph, label] of PLATFORM_RULES) {
    if (re.test(name)) return { glyph, label };
  }
  return { glyph: "\u{1F579}\u{FE0F}", label: name.length > 10 ? name.slice(0, 9) + "…" : name };
}

function lookupIcon(kind, name) {
  const map = kind === "genre" ? GENRE_ICONS : kind === "theme" ? THEME_ICONS : MODE_ICONS;
  if (kind === "platform") return getPlatformIcon(name);
  return map[name] || { glyph: "❓", label: name.length > 10 ? name.slice(0, 9) + "…" : name };
}

let ALL_GAMES = [];
let target = null;
let guesses = [];
let over = false;

// "Action" (a theme) and "Adventure" (a genre) are so common across the
// whole catalog that they crowd out more specific, useful clues. When the
// matching switches are off, strip them out of both the guess and target
// lists before comparing - not just visually, but from the actual clue
// logic itself, so a more distinctive tag gets a chance to show instead.
function themesFor(g) {
  return els.switchAction.checked ? g.themes : g.themes.filter((t) => t !== "Action");
}
function genresFor(g) {
  return els.switchAdventure.checked ? g.genres : g.genres.filter((x) => x !== "Adventure");
}

// The daily target is only ever picked from well-known, reasonably recent
// games - a small popularity-ranked slice of the full (guessable) catalog.
const MIN_TARGET_YEAR = 1991;
const TARGET_POOL_SIZE = 2000;
let targetPoolCache = null;

function popularityScore(g) {
  return (g.ratingCount || 0) + (g.criticRatingCount || 0) * 10;
}

function getTargetPool() {
  if (targetPoolCache) return targetPoolCache;
  const eligible = ALL_GAMES.filter((g) => g.year != null && g.year >= MIN_TARGET_YEAR);
  const pool = eligible.length ? eligible : ALL_GAMES;
  const sorted = [...pool].sort((a, b) => popularityScore(b) - popularityScore(a));
  targetPoolCache = sorted.slice(0, Math.min(TARGET_POOL_SIZE, sorted.length));
  return targetPoolCache;
}

const CLUE_UNLOCK_ATTEMPTS = 5;
let clueUsed = false;
let clueReveal = null; // { key, label }

const CATEGORIES = [
  { key: "platforms", label: "Platforms" },
  { key: "genres", label: "Genres" },
  { key: "themes", label: "Themes" },
  { key: "year", label: "Release year" },
  { key: "esrb", label: "ESRB" },
  { key: "modes", label: "Game mode" },
  { key: "perspectives", label: "Perspective" },
  { key: "engines", label: "Engine" },
  { key: "devpub", label: "Developer / Publisher" },
  { key: "saga", label: "Saga / Franchise" },
];

const els = {
  status: document.getElementById("statusLine"),
  lives: document.getElementById("livesRow"),
  search: document.getElementById("searchInput"),
  suggestions: document.getElementById("suggestions"),
  guessBtn: document.getElementById("guessBtn"),
  table: document.getElementById("guessTable").querySelector("tbody"),
  banner: document.getElementById("banner"),
  nextReset: document.getElementById("nextReset"),
  searchRow: document.getElementById("searchRow"),
  confettiCanvas: document.getElementById("confettiCanvas"),
  winCelebration: document.getElementById("winCelebration"),
  winCelebrationGame: document.getElementById("winCelebrationGame"),
  clueBtn: document.getElementById("clueBtn"),
  clueLabel: document.getElementById("clueLabel"),
  clueReveal: document.getElementById("clueReveal"),
  helpToggle: document.getElementById("helpToggle"),
  displayToggle: document.getElementById("displayToggle"),
  helpPanel: document.getElementById("helpPanel"),
  displayPanel: document.getElementById("displayPanel"),
  switchSummary: document.getElementById("switchSummary"),
  switchAdventure: document.getElementById("switchAdventure"),
  switchAction: document.getElementById("switchAction"),
};

async function decompressGzipBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  return JSON.parse(text);
}

async function init() {
  if (typeof GAMES_DATA_GZ_B64 !== "undefined") {
    // Loaded via <script src="games.gz.js"> - a gzip+base64 blob decoded
    // client-side with DecompressionStream, much smaller on disk than the
    // raw JSON. Needs a fairly recent browser (Chrome/Edge 80+, Firefox
    // 113+, Safari 16.4+).
    try {
      ALL_GAMES = await decompressGzipBase64(GAMES_DATA_GZ_B64);
    } catch (e) {
      els.status.textContent =
        "Could not decompress game data - your browser may not support DecompressionStream. Try a recent Chrome, Edge, or Firefox.";
      return;
    }
  } else if (typeof GAMES_DATA !== "undefined") {
    // Loaded via <script src="games.js">, the uncompressed fallback.
    ALL_GAMES = GAMES_DATA;
  } else {
    // Fallback for anyone serving this over http:// without either file.
    try {
      const res = await fetch("./games.json");
      if (!res.ok) throw new Error("not ok");
      ALL_GAMES = await res.json();
    } catch (e) {
      els.status.textContent =
        "No game data found. Run fetch_igdb.py first to generate games.js.";
      return;
    }
  }

  if (!ALL_GAMES.length) {
    els.status.textContent =
      "Game data is empty. Run fetch_igdb.py first to generate games.js.";
    return;
  }

  els.status.textContent = `${ALL_GAMES.length.toLocaleString()} games loaded.`;

  els.search.addEventListener("input", onSearchInput);
  els.search.addEventListener("keydown", onSearchKeydown);
  els.guessBtn.addEventListener("click", submitGuess);
  els.clueBtn.addEventListener("click", useClue);
  els.helpToggle.addEventListener("click", () => toggleUtilityPanel("help"));
  els.displayToggle.addEventListener("click", () => toggleUtilityPanel("display"));
  els.switchSummary.addEventListener("change", onDisplaySwitchChange);
  els.switchAdventure.addEventListener("change", onDisplaySwitchChange);
  els.switchAction.addEventListener("change", onDisplaySwitchChange);
  restoreDisplaySwitches();

  restoreOrStartDaily();
  render();
  tickCountdown();
  setInterval(tickCountdown, 1000);

  document.addEventListener("click", (e) => {
    if (!els.suggestions.contains(e.target) && e.target !== els.search) {
      els.suggestions.innerHTML = "";
    }
  });
}

// A plain char-code rolling hash on a date string like "2026-9-28" barely
// changes between consecutive days (most characters are identical, only
// the last digit or two differ), so the resulting index only shifted by a
// tiny, predictable amount day to day - and since the game list is sorted
// alphabetically, that meant near-identical picks (e.g. two days in a row
// both landing on titles starting with "Chr..."). Hashing an integer day
// count through a proper avalanche mixer (Murmur3's finalizer) instead
// means adjacent days produce wildly different, decorrelated results
// regardless of how the array happens to be ordered.
function mix32(x) {
  x = x >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = (x ^ (x >>> 16)) >>> 0;
  return x;
}

function dailySeedIndex(n) {
  const d = new Date();
  const daysSinceEpoch = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return mix32(daysSinceEpoch) % n;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function restoreOrStartDaily() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (e) {
    saved = null;
  }

  if (saved && saved.day === todayKey()) {
    target = ALL_GAMES.find((g) => g.id === saved.targetId);
    guesses = (saved.guessIds || [])
      .map((id) => ALL_GAMES.find((g) => g.id === id))
      .filter(Boolean);
    over = !!saved.over;
    clueUsed = !!saved.clueUsed;
    clueReveal = saved.clueReveal || null;
    if (target) return;
  }

  startDaily();
}

function startDaily() {
  const pool = getTargetPool();
  target = pool[dailySeedIndex(pool.length)];
  guesses = [];
  over = false;
  clueUsed = false;
  clueReveal = null;
  saveState();
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      day: todayKey(),
      targetId: target.id,
      guessIds: guesses.map((g) => g.id),
      over,
      clueUsed,
      clueReveal,
    })
  );
}

function onSearchInput() {
  const q = els.search.value.trim().toLowerCase();
  els.suggestions.innerHTML = "";
  if (!q || over) return;

  const guessedIds = new Set(guesses.map((g) => g.id));
  const matches = ALL_GAMES.filter(
    (g) => !guessedIds.has(g.id) && g.name.toLowerCase().includes(q)
  )
    .sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      const aStarts = an.startsWith(q) ? 0 : 1;
      const bStarts = bn.startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      if (an.length !== bn.length) return an.length - bn.length;
      return an.localeCompare(bn);
    })
    .slice(0, 40);

  for (const g of matches) {
    const div = document.createElement("div");
    div.textContent = g.year ? `${g.name} (${g.year})` : g.name;
    div.dataset.id = g.id;
    div.addEventListener("click", () => {
      els.search.value = g.name;
      els.search.dataset.selectedId = g.id;
      els.suggestions.innerHTML = "";
    });
    els.suggestions.appendChild(div);
  }
}

function onSearchKeydown(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitGuess();
  }
}

function submitGuess() {
  if (over) return;
  const typed = els.search.value.trim();
  if (!typed) return;

  let picked = null;
  const selectedId = els.search.dataset.selectedId;
  if (selectedId) {
    picked = ALL_GAMES.find((g) => String(g.id) === String(selectedId));
  }
  if (!picked || picked.name !== typed) {
    picked = ALL_GAMES.find(
      (g) => g.name.toLowerCase() === typed.toLowerCase()
    );
  }
  if (!picked) {
    els.status.textContent = "Pick a game from the suggestion list.";
    return;
  }
  if (guesses.some((g) => g.id === picked.id)) {
    els.status.textContent = "Already guessed that one.";
    return;
  }

  guesses.unshift(picked);
  els.search.value = "";
  delete els.search.dataset.selectedId;
  els.suggestions.innerHTML = "";

  if (picked.id === target.id) {
    over = true;
    els.status.textContent = "";
    celebrateWin(picked);
  } else if (livesUsed() >= MAX_LIVES) {
    over = true;
    celebrateLose();
  }

  saveState();
  render(picked.id);
}

function setEquals(a, b) {
  if (a.length !== b.length) return false;
  const sb = new Set(b);
  return a.every((x) => sb.has(x));
}

function compareList(guessArr, targetArr) {
  if (guessArr.length === 0 && targetArr.length === 0) {
    return { state: "na", items: [] };
  }
  const hits = guessArr.filter((x) => targetArr.includes(x));
  let state;
  if (hits.length === 0) state = "red";
  else if (setEquals(guessArr, targetArr)) state = "green";
  else state = "yellow";
  return {
    state,
    items: guessArr.map((x) => ({ name: x, hit: targetArr.includes(x) })),
  };
}

function compareYear(guessYear, targetYear) {
  if (guessYear == null || targetYear == null) {
    return { state: "na", text: "?", arrow: null };
  }
  if (guessYear === targetYear) {
    return { state: "green", text: String(guessYear), arrow: null };
  }
  const diff = Math.abs(guessYear - targetYear);
  const state = diff <= 5 ? "yellow" : "red";
  const arrow = guessYear < targetYear ? "up" : "down";
  return { state, text: String(guessYear), arrow };
}

function computeYearRangeSummary() {
  let lower = null; // target.year is strictly greater than this
  let upper = null; // target.year is strictly less than this
  let exact = null;

  for (const g of guesses) {
    if (g.year == null) continue;
    if (g.year === target.year) {
      exact = g.year;
      break;
    }
    if (g.year < target.year) {
      lower = lower == null ? g.year : Math.max(lower, g.year);
    } else {
      upper = upper == null ? g.year : Math.min(upper, g.year);
    }
  }

  if (exact != null) {
    return { state: "green", text: String(exact), arrow: null };
  }
  if (lower != null && upper != null) {
    return { state: "yellow", text: `${lower}-${upper}`, arrow: null };
  }
  // The target pool never goes earlier than MIN_TARGET_YEAR, so that's a
  // safe floor to pair with an upper bound even with no lower guess yet.
  if (upper != null) {
    return { state: "yellow", text: `${MIN_TARGET_YEAR}-${upper}`, arrow: null };
  }
  if (lower != null) {
    return { state: "yellow", text: `> ${lower}`, arrow: null };
  }
  return { state: "na", text: "?", arrow: null };
}

function compareEsrb(guessRank, targetRank, guessLabel) {
  if (guessRank == null || targetRank == null) {
    return { state: "na", text: guessLabel || "?", arrow: null };
  }
  if (guessRank === targetRank) {
    return { state: "green", text: guessLabel, arrow: null };
  }
  const diff = Math.abs(guessRank - targetRank);
  const state = diff <= 1 ? "yellow" : "red";
  const arrow = guessRank < targetRank ? "up" : "down";
  return { state, text: guessLabel, arrow };
}

function compareSaga(guessG, targetG) {
  const sagaMatch = !!guessG.saga && guessG.saga === targetG.saga;
  const franchiseMatch =
    !!guessG.franchise && guessG.franchise === targetG.franchise;

  if (!guessG.saga && !guessG.franchise) {
    return { state: "red", text: "Wrong Franchise & Saga" };
  }
  if (sagaMatch && franchiseMatch) {
    return { state: "green", text: guessG.saga || guessG.franchise };
  }
  if (sagaMatch || franchiseMatch) {
    return {
      state: "yellow",
      text: sagaMatch ? "Correct Saga, Wrong Franchise" : "Correct Franchise, Wrong Saga",
    };
  }
  return { state: "red", text: guessG.saga || guessG.franchise || "Wrong Franchise & Saga" };
}

function compareDevPub(guessG, targetG) {
  const guessDevs = guessG.developers;
  const guessPubs = guessG.publishers;

  if (guessDevs.length === 0 && guessPubs.length === 0) {
    return { state: "red", text: "Wrong Developer & Publisher" };
  }

  const devMatch = guessDevs.some((d) => targetG.developers.includes(d));
  const pubMatch = guessPubs.some((p) => targetG.publishers.includes(p));

  if (devMatch && pubMatch) {
    const names = Array.from(
      new Set([
        ...guessDevs.filter((d) => targetG.developers.includes(d)),
        ...guessPubs.filter((p) => targetG.publishers.includes(p)),
      ])
    );
    return { state: "green", text: names.join(", ") };
  }
  if (devMatch || pubMatch) {
    return {
      state: "yellow",
      text: devMatch ? "Correct Developer, Wrong Publisher" : "Correct Publisher, Wrong Developer",
    };
  }
  return {
    state: "red",
    text: [...guessDevs, ...guessPubs].join(", ") || "Wrong Developer & Publisher",
  };
}

function categoryStateForGuess(key, g) {
  switch (key) {
    case "platforms":
      return compareList(g.platforms, target.platforms).state;
    case "genres":
      return compareList(genresFor(g), genresFor(target)).state;
    case "themes":
      return compareList(themesFor(g), themesFor(target)).state;
    case "modes":
      return compareList(g.modes, target.modes).state;
    case "perspectives":
      return compareList(g.perspectives, target.perspectives).state;
    case "engines":
      return compareList(g.engines, target.engines).state;
    case "devpub":
      return compareDevPub(g, target).state;
    case "year":
      return compareYear(g.year, target.year).state;
    case "esrb":
      return compareEsrb(g.esrbRank, target.esrbRank, g.esrb || "—").state;
    case "saga":
      return compareSaga(g, target).state;
    default:
      return "red";
  }
}

function categorySolvedByGuesses(key) {
  return guesses.some((g) => categoryStateForGuess(key, g) === "green");
}

function formatCategoryValue(key) {
  switch (key) {
    case "platforms":
      return target.platforms.length ? target.platforms.join(", ") : "No data";
    case "genres": {
      const g = genresFor(target);
      return g.length ? g.join(", ") : "No data";
    }
    case "themes": {
      const t = themesFor(target);
      return t.length ? t.join(", ") : "No data";
    }
    case "modes":
      return target.modes.length ? target.modes.join(", ") : "No data";
    case "perspectives":
      return target.perspectives.length ? target.perspectives.join(", ") : "No data";
    case "engines":
      return target.engines.length ? target.engines.join(", ") : "No data";
    case "devpub": {
      const all = [...target.developers, ...target.publishers];
      return all.length ? all.join(", ") : "No data";
    }
    case "year":
      return target.year != null ? String(target.year) : "No data";
    case "esrb":
      return target.esrb || "No data";
    case "saga":
      return target.saga || target.franchise || "No data";
    default:
      return "—";
  }
}

function useClue() {
  if (clueUsed || over) return;
  if (guesses.length < CLUE_UNLOCK_ATTEMPTS) return;

  const unsolved = CATEGORIES.filter((c) => !categorySolvedByGuesses(c.key));
  if (unsolved.length === 0) return;

  const pick = unsolved[Math.floor(Math.random() * unsolved.length)];
  clueReveal = { key: pick.key, label: pick.label };
  clueUsed = true;

  if (livesUsed() >= MAX_LIVES) {
    over = true;
    celebrateLose();
  }

  saveState();
  render();
}

function listCell(cmp) {
  const td = document.createElement("td");
  td.className = "cell-" + cmp.state;
  if (cmp.items.length === 0) {
    td.textContent = "—";
    return td;
  }
  for (const item of cmp.items) {
    const span = document.createElement("span");
    span.className = "chip" + (item.hit ? " hit" : "");
    span.textContent = item.name;
    td.appendChild(span);
  }
  return td;
}

function iconListCell(cmp, kind) {
  const td = document.createElement("td");
  td.className = "cell-" + cmp.state;
  if (cmp.items.length === 0) {
    td.textContent = "—";
    return td;
  }
  const wrap = document.createElement("div");
  wrap.className = "icon-cell";
  for (const item of cmp.items) {
    const info = lookupIcon(kind, item.name);
    const box = document.createElement("div");
    box.className = "icon-item" + (item.hit ? " hit" : "");
    box.title = item.name;
    box.dataset.value = item.name;

    const glyph = document.createElement("span");
    glyph.className = "icon-glyph";
    glyph.textContent = info.glyph;

    const label = document.createElement("span");
    label.className = "icon-label";
    label.textContent = info.label;

    box.appendChild(glyph);
    box.appendChild(label);
    wrap.appendChild(box);
  }
  td.appendChild(wrap);
  return td;
}

function scalarCell(cmp) {
  const td = document.createElement("td");
  td.className = "cell-" + cmp.state;

  if (!cmp.arrow) {
    td.textContent = cmp.text;
    return td;
  }

  // Whole cell gets clipped into an arrow silhouette via CSS (the real
  // site's technique), with the text on top in its own stacking layer.
  td.classList.add("arrow-" + cmp.arrow);
  const textSpan = document.createElement("span");
  textSpan.className = "cell-text";
  textSpan.textContent = cmp.text;
  td.appendChild(textSpan);
  return td;
}

function toggleUtilityPanel(which) {
  const helpOpen = els.helpToggle.getAttribute("aria-expanded") === "true";
  const displayOpen = els.displayToggle.getAttribute("aria-expanded") === "true";
  const openHelp = which === "help" ? !helpOpen : false;
  const openDisplay = which === "display" ? !displayOpen : false;

  els.helpToggle.setAttribute("aria-expanded", String(openHelp));
  els.displayToggle.setAttribute("aria-expanded", String(openDisplay));
  els.helpPanel.hidden = !openHelp;
  els.displayPanel.hidden = !openDisplay;
}

const DISPLAY_SWITCH_KEY = "offline-guesser-display-switches-v1";

function restoreDisplaySwitches() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(DISPLAY_SWITCH_KEY) || "null");
  } catch (e) {
    saved = null;
  }
  // Default all three on (matches the HTML's checked attributes) unless
  // the player has explicitly changed them before.
  if (saved) {
    els.switchSummary.checked = !!saved.summary;
    els.switchAdventure.checked = !!saved.adventure;
    els.switchAction.checked = !!saved.action;
  }
}

function onDisplaySwitchChange() {
  localStorage.setItem(
    DISPLAY_SWITCH_KEY,
    JSON.stringify({
      summary: els.switchSummary.checked,
      adventure: els.switchAdventure.checked,
      action: els.switchAction.checked,
    })
  );
  render();
}

function buildSummaryRow() {
  const tr = document.createElement("tr");
  tr.className = "summary-row";

  const nameTd = document.createElement("td");
  nameTd.className = "name-cell";
  nameTd.textContent = "Summary";
  tr.appendChild(nameTd);

  const listSummary = (values, kind) => {
    const targetList = values.target;
    const hits = new Set();
    let sawYellow = false;
    let sawGreen = false;
    let sawAnyGuess = false;
    for (const g of guesses) {
      const guessList = values.pick(g);
      if (guessList.length === 0 && targetList.length === 0) continue;
      sawAnyGuess = true;
      const cmp = compareList(guessList, targetList);
      if (cmp.state === "green") sawGreen = true;
      if (cmp.state === "yellow") sawYellow = true;
      for (const item of cmp.items) {
        if (item.hit) hits.add(item.name);
      }
    }
    const state = sawGreen ? "green" : sawYellow ? "yellow" : sawAnyGuess ? "red" : "na";
    const confirmed = Array.from(hits);
    // "+ more possible" only makes sense once something is confirmed but
    // not everything yet (yellow) - red means nothing matches at all, so
    // there's no partial info to hint at.
    const hasMore = state === "yellow" && confirmed.length < targetList.length;
    return kind === "icon"
      ? { state, items: confirmed.map((name) => ({ name, hit: true })), hasMore }
      : { state, text: confirmed.length ? confirmed.join(", ") : "", hasMore };
  };

  const iconSummaryCell = (summary, kind, greenOnly) => {
    const td = document.createElement("td");
    td.className = "cell-" + summary.state;
    // Platforms/Themes are noisy enough that partial (yellow) info isn't
    // worth showing - only reveal them once fully confirmed.
    const items = greenOnly && summary.state !== "green" ? [] : summary.items;
    if (items.length === 0) {
      // Red already communicates "no match" via color - no need for a
      // placeholder "?" on top of it too.
      td.textContent = summary.state === "na" ? "—" : "";
      return td;
    }
    const wrap = document.createElement("div");
    wrap.className = "icon-cell";
    for (const item of items) {
      const info = lookupIcon(kind, item.name);
      const box = document.createElement("div");
      box.className = "icon-item hit";
      box.title = item.name;
      box.dataset.value = item.name;
      const glyph = document.createElement("span");
      glyph.className = "icon-glyph";
      glyph.textContent = info.glyph;
      const label = document.createElement("span");
      label.className = "icon-label";
      label.textContent = info.label;
      box.appendChild(glyph);
      box.appendChild(label);
      wrap.appendChild(box);
    }
    if (summary.hasMore) {
      const more = document.createElement("div");
      more.className = "summary-more";
      more.textContent = "+ more possible";
      wrap.appendChild(more);
    }
    td.appendChild(wrap);
    return td;
  };

  const textSummaryCell = (summary) => {
    const td = document.createElement("td");
    td.className = "cell-" + summary.state;
    td.textContent = summary.text || (summary.state === "na" ? "—" : "");
    if (summary.hasMore) {
      const more = document.createElement("div");
      more.className = "summary-more";
      more.textContent = "+ more possible";
      td.appendChild(more);
    }
    return td;
  };

  // A used clue fully reveals one category regardless of what the guesses
  // so far have shown, so it always wins over the guess-derived aggregate.
  const cluedKey = clueReveal ? clueReveal.key : null;
  const listOrClue = (values, kind, key) => {
    if (cluedKey === key) {
      const items = values.target.map((name) => ({ name, hit: true }));
      return kind === "icon"
        ? { state: "green", items, hasMore: false }
        : { state: "green", text: values.target.length ? values.target.join(", ") : "No data", hasMore: false };
    }
    return listSummary(values, kind);
  };

  tr.appendChild(
    iconSummaryCell(
      listOrClue({ pick: (g) => g.platforms, target: target.platforms }, "icon", "platforms"),
      "platform",
      true
    )
  );
  tr.appendChild(
    iconSummaryCell(
      listOrClue({ pick: (g) => genresFor(g), target: genresFor(target) }, "icon", "genres"),
      "genre"
    )
  );
  tr.appendChild(
    iconSummaryCell(
      listOrClue({ pick: (g) => themesFor(g), target: themesFor(target) }, "icon", "themes"),
      "theme",
      true
    )
  );

  // Year narrows down across ALL guesses into a range, since each one
  // tells you which side of it the target falls on; ESRB takes the best
  // (green > yellow > red) state seen across all guesses too.
  if (cluedKey === "year") {
    tr.appendChild(scalarCell({ state: "green", text: formatCategoryValue("year"), arrow: null }));
  } else {
    tr.appendChild(scalarCell(computeYearRangeSummary()));
  }
  if (cluedKey === "esrb") {
    tr.appendChild(scalarCell({ state: "green", text: formatCategoryValue("esrb"), arrow: null }));
  } else {
    // Best state seen across ALL guesses, not just the latest one - a
    // yellow (close) guess earlier on shouldn't get buried by a later
    // guess that happened to be way off.
    let esrbState = "na";
    let esrbCmp = null;
    for (const g of guesses) {
      const cmp = compareEsrb(g.esrbRank, target.esrbRank, g.esrb || "—");
      if (cmp.state === "na") continue;
      if (cmp.state === "green") {
        esrbState = "green";
        esrbCmp = cmp;
        break;
      }
      if (cmp.state === "yellow") {
        esrbState = "yellow";
        esrbCmp = cmp;
      } else if (cmp.state === "red" && esrbState !== "yellow") {
        esrbState = "red";
        esrbCmp = cmp;
      }
    }
    tr.appendChild(scalarCell(esrbCmp || { state: "na", text: "?", arrow: null }));
  }

  tr.appendChild(
    iconSummaryCell(
      listOrClue({ pick: (g) => g.modes, target: target.modes }, "icon", "modes"),
      "mode"
    )
  );
  tr.appendChild(
    textSummaryCell(
      listOrClue({ pick: (g) => g.perspectives, target: target.perspectives }, "text", "perspectives")
    )
  );
  tr.appendChild(
    textSummaryCell(listOrClue({ pick: (g) => g.engines, target: target.engines }, "text", "engines"))
  );
  tr.appendChild(
    textSummaryCell(
      listOrClue(
        {
          pick: (g) => [...g.developers, ...g.publishers],
          target: [...target.developers, ...target.publishers],
        },
        "text",
        "devpub"
      )
    )
  );

  const sagaTd = document.createElement("td");
  if (cluedKey === "saga") {
    sagaTd.className = "cell-green";
    sagaTd.textContent = formatCategoryValue("saga");
  } else {
    let sagaState = "na";
    for (const g of guesses) {
      const cmp = compareSaga(g, target);
      if (cmp.state === "green") {
        sagaState = "green";
        break;
      }
      if (cmp.state === "yellow") sagaState = "yellow";
      else if (cmp.state === "red" && sagaState === "na") sagaState = "red";
    }
    sagaTd.className = "cell-" + sagaState;
    sagaTd.textContent =
      sagaState === "green" ? target.saga || target.franchise || "—" : sagaState === "na" ? "—" : "";
  }
  tr.appendChild(sagaTd);

  return tr;
}

const WIN_CONFETTI_COLORS = ["#e63711", "#3771f8", "#d7ab19", "#008000", "#ffffff", "#ff69b4"];

function launchConfetti(colors, options) {
  const outlined = !!(options && options.outline);
  const count = (options && options.count) || 180;
  const durationMs = (options && options.durationMs) || 4000;

  const canvas = els.confettiCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.hidden = false;

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.6,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 2.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
    });
  }

  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      if (outlined) {
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }
    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.hidden = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}

function celebrateWin(game) {
  launchConfetti(WIN_CONFETTI_COLORS, { count: 220, durationMs: 4500 });

  els.winCelebrationGame.textContent = game.year ? `${game.name} (${game.year})` : game.name;
  els.winCelebration.hidden = false;
  requestAnimationFrame(() => els.winCelebration.classList.add("show"));

  setTimeout(() => {
    els.winCelebration.classList.remove("show");
    setTimeout(() => {
      els.winCelebration.hidden = true;
    }, 300);
  }, 4500);
}

function celebrateLose() {
  // Black confetti needs a faint outline or it's invisible against the
  // near-black page background.
  launchConfetti(["#000000", "#111111"], { count: 200, durationMs: 4000, outline: true });
}

function render(revealGuessId) {
  renderLives();
  renderBanner();
  els.table.innerHTML = "";

  if (els.switchSummary.checked && guesses.length > 0) {
    els.table.appendChild(buildSummaryRow());
  }

  for (const g of guesses) {
    const tr = document.createElement("tr");
    const revealing = g.id === revealGuessId;
    let col = 0;
    const add = (td) => {
      if (revealing) {
        td.classList.add("cell-reveal");
        td.style.animationDelay = col * 0.25 + "s";
      }
      col++;
      tr.appendChild(td);
    };

    const nameTd = document.createElement("td");
    nameTd.className = "name-cell";
    nameTd.textContent = g.year ? `${g.name} (${g.year})` : g.name;
    add(nameTd);

    add(iconListCell(compareList(g.platforms, target.platforms), "platform"));
    add(iconListCell(compareList(genresFor(g), genresFor(target)), "genre"));
    add(iconListCell(compareList(themesFor(g), themesFor(target)), "theme"));
    add(scalarCell(compareYear(g.year, target.year)));
    add(scalarCell(compareEsrb(g.esrbRank, target.esrbRank, g.esrb || "—")));
    add(iconListCell(compareList(g.modes, target.modes), "mode"));
    add(listCell(compareList(g.perspectives, target.perspectives)));
    add(listCell(compareList(g.engines, target.engines)));
    add(scalarCell(compareDevPub(g, target)));
    add(scalarCell(compareSaga(g, target)));

    els.table.appendChild(tr);
  }

  els.guessBtn.disabled = over;
  els.search.disabled = over;
  els.searchRow.hidden = over;
  updateClueUi();
}

function updateClueUi() {
  if (clueUsed || over) {
    els.clueBtn.disabled = true;
    els.clueLabel.textContent = clueUsed ? "Clue used" : "Clue";
  } else {
    const remaining = Math.max(0, CLUE_UNLOCK_ATTEMPTS - guesses.length);
    if (remaining > 0) {
      els.clueBtn.disabled = true;
      els.clueLabel.textContent = `Clue in ${remaining} attempt${remaining === 1 ? "" : "s"}`;
    } else {
      els.clueBtn.disabled = false;
      els.clueLabel.textContent = "Use clue (-1 life)";
    }
  }

  if (clueReveal && !over) {
    els.clueReveal.hidden = false;
    els.clueReveal.textContent = `Clue: ${clueReveal.label} — ${formatCategoryValue(clueReveal.key)}`;
  } else {
    els.clueReveal.hidden = true;
    els.clueReveal.textContent = "";
  }
}

function livesUsed() {
  return guesses.length + (clueUsed ? 1 : 0);
}

function renderLives() {
  const used = livesUsed();
  const remaining = Math.max(0, MAX_LIVES - used);
  els.lives.innerHTML = "";
  for (let i = 0; i < MAX_LIVES; i++) {
    const span = document.createElement("span");
    // Hearts drain from the end, so the ones you've already spent fall
    // off the tail instead of the front.
    span.className = "heart" + (i >= remaining ? " spent" : "");
    span.textContent = "♥";
    els.lives.appendChild(span);
  }
  els.status.textContent = over
    ? ""
    : `${remaining} guess${remaining === 1 ? "" : "es"} left`;
}

function msUntilNextLocalMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next - now;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function tickCountdown() {
  if (!els.nextReset) return;
  const remainingMs = msUntilNextLocalMidnight();
  els.nextReset.textContent = formatCountdown(remainingMs);
  if (remainingMs <= 0) {
    // Crossed into a new day - the daily target changes, so just reload
    // the state for "today" rather than leaving a stale target on screen.
    restoreOrStartDaily();
    render();
  }
}

function renderBanner() {
  els.banner.className = "banner";
  if (!over) {
    els.banner.textContent = "";
    return;
  }
  const won = guesses.length > 0 && guesses[0].id === target.id;
  els.banner.classList.add("show", won ? "win" : "lose");
  const label = target.year ? `${target.name} (${target.year})` : target.name;
  els.banner.textContent = won
    ? `Correct! It was ${label}.`
    : `Out of guesses. It was ${label}.`;
}

// Called last, after every const/let/function above has been declared, so
// nothing it triggers synchronously can hit a temporal-dead-zone error.
init();
