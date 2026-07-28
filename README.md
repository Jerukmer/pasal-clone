# Pasal.id Clone (UI + Konten Statis + Search Demo)

Clone persis tampilan **[pasal.id](https://pasal.id)** — database hukum Indonesia
terbuka. Repo ini berisi **UI + konten statis + search engine client-side** yang
berjalan sebagai static site (GitHub Pages).

## ⚠ Status data: SAMPLE, bukan seluruh database

pasal.id menyajikan **3,5 juta pasal / 161.969 peraturan** lewat REST API
`/api/v1/*` yang **wajib Bearer token akun**. Tanpa token → `401`. Maka:

- ✅ **Yang di-clone persis:** desain, layout, palet warna, tipografi, struktur
  halaman (home / jelajahi / api / cari / detail peraturan), dan hitungan jenis
  peraturan.
- ✅ **Sample teks ASLI** dari pasal.id (UU 13/2003, 27/2022, 1/2023, 1/1974,
  UUD 1945) agar search + halaman detail benar-benar jalan.
- ❌ **Belum ada** seluruh 3,5 juta pasal. Itu butuh token resmi + crawler
  (lihat `scripts/crawler.js`).

## Cara jalan lokal

Buka `index.html` langsung di browser, atau:

```bash
python3 -m http.server 8080
# buka http://localhost:8080
```

## Tambah data sendiri

Edit `assets/js/data.js` → array `SITE.laws`. Setiap entri:

```js
{ frbr, type, number, year, title, status, statusLabel,
  summary, points:[...], chapters:[{ bab, nama, pasal:[{n, t}] }] }
```

## Tarik data utuh (butuh token pasal.id)

```bash
export PASAL_TOKEN="pasal_xxx"   # dari https://pasal.id/akun
node scripts/crawler.js           # hormati rate limit: ~15 jam untuk metadata
```

Hasil: `data/laws.json` + `data/articles/*.json`. Drop ke `assets/js/data.js`
agar search menjadi lengkap.

## Deploy (GitHub Pages)

Repo ini static murni. Enable **Settings → Pages → Source: main / root**.
Akses di `https://<user>.github.io/<repo>/`.

## Lisensi

Teks hukum = **domain publik**. Desain & kurasi milik pasal.id — clone ini untuk
pembelajaran/replika, bukan pengganti resmi.
