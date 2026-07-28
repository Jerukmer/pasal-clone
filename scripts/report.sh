#!/bin/bash
# Laporan progres crawler pasal.id — dijalankan cron tiap 2 menit
cd /c/Users/EMIS-07/pasal-clone/data/metadata 2>/dev/null || { echo "NO DIR"; exit 0; }

TS=$(date '+%H:%M:%S')
TOTAL=$(grep -ho frbr_uri *.json 2>/dev/null | wc -l)
PCT=$(( TOTAL * 100 / 161969 ))

pm=$(grep -c frbr_uri PERMEN.json 2>/dev/null || echo 0)
pw=$(grep -c frbr_uri PERWALI.json 2>/dev/null || echo 0)
pb=$(grep -c frbr_uri PERBAN.json 2>/dev/null || echo 0)
pj=$(grep -c frbr_uri POJK.json 2>/dev/null || echo 0)
pmk=$(grep -c frbr_uri PMK.json 2>/dev/null || echo 0)
se=$(grep -c frbr_uri SE.json 2>/dev/null || echo 0)
pk=$(grep -c frbr_uri PERMENKUMHAM.json 2>/dev/null || echo 0)
pd=$(grep -c frbr_uri PERDA.json 2>/dev/null || echo 0)
pbu=$(grep -c frbr_uri PERBUP.json 2>/dev/null || echo 0)

# cek PID dari file marker
ST="MATI"
if [ -f /c/Users/EMIS-07/pasal-clone/data/crawler.pid ]; then
  PID=$(cat /c/Users/EMIS-07/pasal-clone/data/crawler.pid)
  if kill -0 "$PID" 2>/dev/null; then ST="JALAN (pid $PID)"; else ST="MATI (pid $PID hilang)"; fi
fi

echo "=== PASAL.ID CRAWL $TS ==="
echo "TOTAL: $TOTAL / 161.969 ($PCT%)"
echo "PERMEN:$pm PERWALI:$pw PERBAN:$pb POJK:$pj PMK:$pmk SE:$se PKUMHAM:$pk"
echo "PERDA(stuck):$pd PERBUP(stuck):$pbu"
echo "CRAWLER: $ST"
