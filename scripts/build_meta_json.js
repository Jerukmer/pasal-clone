#!/usr/bin/env node
/*
 * build_meta_json.js — gabungkan semua metadata crawl jadi assets/data/metadata.json
 * Format minimal: [t,n,y,ti,s,f] = [type, number, year, title, status, frbr_uri]
 * Tujuannya ringan utk di-fetch browser (client-side search).
 */
const fs = require("fs");
const path = require("path");
const META = path.join(__dirname, "..", "data", "metadata");
const OUT = path.join(__dirname, "..", "assets", "data");
fs.mkdirSync(OUT, { recursive: true });

const files = fs.existsSync(META) ? fs.readdirSync(META).filter(f => f.endsWith(".json")) : [];
let all = [];
for (const f of files) {
  try {
    const arr = JSON.parse(fs.readFileSync(path.join(META, f), "utf8"));
    for (const l of arr) {
      all.push([l.type, l.number, l.year, l.title, l.status, l.frbr_uri.replace(/^\//, "")]);
    }
  } catch (e) { console.warn("skip", f); }
}
console.log("total laws:", all.length);
fs.writeFileSync(path.join(OUT, "metadata.json"), JSON.stringify(all));
console.log("written assets/data/metadata.json", (JSON.stringify(all).length/1024/1024).toFixed(2), "MB");
