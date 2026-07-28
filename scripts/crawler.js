#!/usr/bin/env node
/*
 * crawler.js v2 — penarik data pasal.id (token resmi), RESUMABLE
 * ---------------------------------------------------------------------------
 * Stage 1: metadata semua jenis → data/metadata/<TYPE>.json  (rate 180/mnt)
 * Stage 2: isi pasal per law untuk tipe terpilih → data/articles/<TYPE>/<frbr>.json (rate 60/mnt)
 *
 * Resumable: skip file yang sudah ada. Bisa di-stop & di-retry aman.
 *
 * Env:
 *   PASAL_TOKEN   (wajib)
 *   STAGE         metadata | articles | all   (default: all)
 *   TYPES         comma list, misal UU,PP,PERPRES  (default: semua jenis di SITE)
 *   LIMIT_PER     max law per tipe utk tes (kosong = unlimited)
 */

const fs = require("fs");
const path = require("path");
const TOKEN = process.env.PASAL_TOKEN;
const BASE = "https://pasal.id/api/v1";
const ROOT = __dirname;
const META_DIR = path.join(ROOT, "..", "data", "metadata");
const ART_DIR = path.join(ROOT, "..", "data", "articles");
const STAGE = process.env.STAGE || "all";
const TYPES_ENV = process.env.TYPES || "";
const LIMIT_PER = process.env.LIMIT_PER ? parseInt(process.env.LIMIT_PER) : 0;

const ALL_TYPES = ["UUD","TAP_MPR","PERPPU","UU","UUDRT","PP","PERPRES","INPRES","PENPRES",
  "KEPPRES","PERDA","PERDAIS","QANUN","PERDASUS","PERGUB","PERWALI","PERBUP","POJK",
  "PERMEN","PERBAN","PERMENKUMHAM","PMK","SE"];
const TYPES = TYPES_ENV ? TYPES_ENV.split(",").map(s=>s.trim()) : ALL_TYPES;

if (!TOKEN) { console.error("SET DULU: export PASAL_TOKEN='pasal_xxx'"); process.exit(1); }
fs.mkdirSync(META_DIR, { recursive: true });
fs.mkdirSync(ART_DIR, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const auth = { Authorization: `Bearer ${TOKEN}` };

async function get(url, delay) {
  await sleep(delay);
  const res = await fetch(url, { headers: auth });
  if (res.status === 429) {
    // exponential backoff: 60s -> 120s -> 240s -> 480s (cap), lalu ulang
    let backoff = 60000;
    while (true) {
      console.warn(`  [429] rate limit, tunggu ${backoff/1000}s`);
      await sleep(backoff);
      const r2 = await fetch(url, { headers: auth });
      if (r2.status !== 429) {
        if (r2.status === 401) { console.error("  [401] TOKEN INVALID — stop."); process.exit(2); }
        if (!r2.ok) { console.error("  FAIL", r2.status, url); return null; }
        return r2.json();
      }
      backoff = Math.min(backoff * 2, 480000);
    }
  }
  if (res.status === 401) { console.error("  [401] TOKEN INVALID/EXPIRED — stop."); process.exit(2); }
  if (!res.ok) { console.error("  FAIL", res.status, url); return null; }
  return res.json();
}

function loadMeta(type) {
  const f = path.join(META_DIR, type + ".json");
  if (fs.existsSync(f)) { try { return JSON.parse(fs.readFileSync(f,"utf8")); } catch(e){ return []; } }
  return [];
}
function saveMeta(type, arr) {
  fs.writeFileSync(path.join(META_DIR, type + ".json"), JSON.stringify(arr, null, 1));
}

async function stageMetadata() {
  for (const type of TYPES) {
    await sleep(120000); // cooldown 2 menit tiap ganti tipe biar token recovery
    let existing = loadMeta(type);
    let existingFr = new Set(existing.map(l => l.frbr_uri));
    let offset = existing.length;
    let fetched = 0, total = null;
    console.log(`\n[TYPE ${type}] existing=${existing.length}`);
    while (true) {
      const js = await get(`${BASE}/laws?type=${type}&limit=50&offset=${offset}`, 2000);
      if (!js || !js.laws) break;
      total = js.total;
      const fresh = js.laws.filter(l => !existingFr.has(l.frbr_uri));
      existing.push(...fresh);
      existingFr = new Set(existing.map(l=>l.frbr_uri));
      offset += js.laws.length;
      fetched += fresh.length;
      if (fetched % 200 === 0 || offset >= total) saveMeta(type, existing);
      console.log(`  ${type}: ${existing.length}/${total}`);
      if (offset >= total) break;
      if (LIMIT_PER && existing.length >= LIMIT_PER) { console.log("  (LIMIT_PER cap)"); break; }
    }
    saveMeta(type, existing);
    console.log(`[DONE ${type}] total=${existing.length}`);
  }
}

async function stageArticles() {
  for (const type of TYPES) {
    const meta = loadMeta(type);
    if (!meta.length) { console.log(`[SKIP ${type}] no metadata`); continue; }
    const tdir = path.join(ART_DIR, type);
    fs.mkdirSync(tdir, { recursive: true });
    let done = 0;
    for (const law of meta) {
      if (LIMIT_PER && done >= LIMIT_PER) break;
      const fr = law.frbr_uri.replace(/^\//, "").replace(/\//g, "_");
      const out = path.join(tdir, fr + ".json");
      if (fs.existsSync(out)) { done++; continue; }
      const det = await get(`${BASE}/laws/${law.frbr_uri.replace(/^\//,"")}`, 1000);
      if (!det) continue;
      fs.writeFileSync(out, JSON.stringify(det, null, 1));
      done++;
      if (done % 50 === 0) console.log(`  ${type} articles: ${done}/${meta.length}`);
    }
    console.log(`[DONE articles ${type}] ${done}`);
  }
}

(async () => {
  if (STAGE === "metadata" || STAGE === "all") await stageMetadata();
  if (STAGE === "articles" || STAGE === "all") await stageArticles();
  console.log("\nSELESAI.");
})();
