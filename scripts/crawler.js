#!/usr/bin/env node
/*
 * crawler.js — penarik data pasal.id (BUTUH TOKEN RESMI)
 * ---------------------------------------------------------------------------
 * Pasal.id menyajikan seluruh isinya lewat REST API /api/v1/* yang WAJIB
 * Bearer token. Tanpa token: 401. Skrip ini menghormati rate limit resmi:
 *   - laws   : 180/menit  -> jeda ~0.34s antar request
 *   - detail :  60/menit  -> jeda ~1.0s  antar request
 *
 * Cara pakai:
 *   1. Daftar akun gratis di https://pasal.id/akun, buat personal access token.
 *   2. Set env:  export PASAL_TOKEN="pasal_xxx"
 *   3. Jalankan: node crawler.js
 *
 * Hasil:  data/laws.json (metadata) + data/articles/<frbr>.json (isi pasal).
 * File itu bisa lo drop ke assets/js/data.js agar search clone ini jadi lengkap.
 *
 * DISCLAIMER: teks UU adalah domain publik. Yang ber-HKI adalah kurasi pasal.id.
 * Jangan hamburkan rate limit (biarkan jeda di bawah). Estimasi penuh
 * 161.969 peraturan ≈ 15 jam; 3,5 jt pasal ≈ 40+ hari.
 */

const fs = require("fs");
const path = require("path");
const TOKEN = process.env.PASAL_TOKEN;
const BASE = "https://pasal.id/api/v1";
const OUT = path.join(__dirname, "..", "data");

if (!TOKEN) {
  console.error("SET DULU: export PASAL_TOKEN='pasal_xxx'");
  process.exit(1);
}
fs.mkdirSync(path.join(OUT, "articles"), { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const auth = { Authorization: `Bearer ${TOKEN}` };

async function get(url, delay) {
  await sleep(delay);
  const res = await fetch(url, { headers: auth });
  if (res.status === 429) { console.warn("rate limit, tunggu 60s"); await sleep(60000); return get(url, delay); }
  if (!res.ok) { console.error("FAIL", res.status, url); return null; }
  return res.json();
}

(async () => {
  const types = ["UU","PP","PERPRES","PERMEN","PERDA","PERGUB","PERBUP","POJK","KEPPRES","PERMENKUMHAM"];
  let offset = 0, limit = 50, total = 0;
  const all = [];
  for (const type of types) {
    offset = 0;
    while (true) {
      const js = await get(`${BASE}/laws?type=${type}&limit=${limit}&offset=${offset}`, 340);
      if (!js || !js.laws) break;
      all.push(...js.laws);
      total += js.laws.length;
      console.log(`[${type}] offset=${offset} total=${js.laws.length}/${js.total}`);
      if (offset + limit >= js.total) break;
      offset += limit;
    }
  }
  fs.writeFileSync(path.join(OUT, "laws.json"), JSON.stringify(all, null, 1));
  console.log(`\nTersimpan ${all.length} metadata ke data/laws.json`);

  // tarik isi pasal per peraturan
  for (const law of all) {
    const fr = law.frbr_uri.replace(/^\//, "");
    const det = await get(`${BASE}/laws/${fr}`, 1000);
    if (!det) continue;
    fs.writeFileSync(path.join(OUT, "articles", fr.replace(/\//g, "_") + ".json"), JSON.stringify(det, null, 1));
  }
  console.log("Selesai tarik detail. Drop file ke assets/js/data.js untuk search lengkap.");
})();
