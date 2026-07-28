#!/bin/bash
# finish.sh — pipeline akhir setelah metadata lengkap:
# 1. verifikasi 3 tipe kecil beres
# 2. tarik articles UU (1900) -> data/articles/UU/
# 3. rebuild index -> assets/js/data.js
# 4. commit + push ke repo
set -e
cd /c/Users/EMIS-07/pasal-clone || exit 1
export PATH="/c/Users/EMIS-07/hermes/node:$PATH"
export PASAL_TOKEN="pasal_mcp_83c57f29c3ff_3795ca3231bbdb675ae4b6bf9aa38a6371814247ed0ebc13"

echo "[1] Cek 3 tipe kecil..."
for t in PERDAIS QANUN PERDASUS; do
  n=$(grep -c frbr_uri "data/metadata/$t.json" 2>/dev/null || echo 0)
  echo "  $t: $n"
done

echo "[2] Tarik articles UU..."
STAGE=articles TYPES=UU node scripts/crawler.js

echo "[3] Rebuild index..."
node scripts/build_index.js

echo "[4] Push ke repo..."
git add -A
git commit -q -m "Update: full metadata crawl + UU articles + search index" || echo "  (nothing to commit)"
git push -u origin main 2>&1 | tail -3 || echo "  (push gagal, coba gh api)"

echo "SELESAI finish.sh"
