/* SPA router + search client-side (fetch metadata.json dari Vercel CDN) */
(function () {
  const app = document.getElementById("app");
  const navLinks = document.querySelectorAll(".nav-links a, .nav-right a");
  let META = [];

  async function loadMeta() {
    if (META.length) return;
    const res = await fetch("assets/data/metadata.json.gz");
    const buf = await res.arrayBuffer();
    // decompress gzip di browser
    const ds = new DecompressionStream("gzip");
    const stream = new Response(buf).body.pipeThrough(ds);
    const ab = await new Response(stream).arrayBuffer();
    META = JSON.parse(new TextDecoder().decode(ab));
  }

  function setActive(hash) {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
  }
  function header() {
    return `
    <header class="site">
      <div class="wrap nav">
        <a href="#/" class="brand">Pasal<span class="dot">.id</span></a>
        <nav class="nav-links">
          <a href="#/cari">Cari</a>
          <a href="#/jelajahi">Jelajahi</a>
          <a href="#/api">API</a>
        </nav>
        <div class="nav-right">
          <a href="#/" class="lang">ID</a>
          <a href="#/jelajahi" class="btn btn-primary">Hubungkan AI</a>
        </div>
      </div>
    </header>`;
  }
  function footer() {
    return `
    <footer class="site">
      <div class="wrap foot-grid">
        <div class="foot-brand">
          <div class="brand">Pasal<span class="dot">.id</span></div>
          <p>Clone UI Pasal.id — ${META.length ? META.length.toLocaleString("id-ID") : "..."} peraturan terindeks. Data dari pasal.id API.</p>
        </div>
        <div class="foot-col"><h4>Produk</h4><a href="#/cari">Cari</a><a href="#/jelajahi">Jelajahi</a><a href="#/api">API</a></div>
        <div class="foot-col"><h4>Tentang</h4><a href="#/api">Tentang</a><a href="#/api">Tim</a><a href="#/api">Editorial</a></div>
        <div class="foot-col"><h4>Legal</h4><a href="#/api">Privasi</a><a href="#/api">Layanan</a><a href="#/api">Dampak</a></div>
      </div>
      <div class="wrap foot-bottom">Clone UI Pasal.id — teks hukum domain publik · desain milik pasal.id</div>
    </footer>`;
  }

  function home() {
    const stats = [
      ["161.969", "Peraturan"],
      ["…", "Terindeks"],
      ["100%", "Gratis"]
    ].map(s => `<div class="stat"><div class="num">${s[0]}</div><div class="lab">${s[1]}</div></div>`).join("");
    return `
    <section class="hero"><div class="wrap">
      <h1>Temukan pasal yang Anda butuhkan</h1>
      <p class="sub"><em class="em">Hukum Indonesia, terbuka untuk semua</em></p>
      <form class="searchbar" onsubmit="return goSearch(event)">
        <input id="q" type="text" placeholder="Cari peraturan… (judul / nomor / tahun)" autocomplete="off" />
        <button type="submit">Cari</button>
      </form>
      <div class="try">Coba: <a href="#/cari?q=uud%201945">uud 1945</a>, <a href="#/cari?q=ketenagakerjaan">ketenagakerjaan</a>, <a href="#/cari?q=perlindungan%20konsumen">perlindungan konsumen</a></div>
    </div></section>
    <section class="wrap"><div class="stats">${stats}</div></section>
    <section class="wrap block">
      <div class="section-head"><div><div class="eyebrow">PALING SERING DIAKSES</div><h2>Peraturan Populer</h2></div></div>
      <div class="popular-grid" id="popular"><p style="color:var(--ink-mute)">Memuat indeks peraturan…</p></div>
    </section>
    <section class="wrap block">
      <div class="section-head"><div><div class="eyebrow">DATABASE</div><h2>Jelajahi Berdasarkan Jenis</h2></div><a class="btn btn-green-soft" href="#/jelajahi">Lihat semua jenis</a></div>
      <div class="jenis-grid" id="jenis"><p style="color:var(--ink-mute)">Memuat…</p></div>
    </section>
    <section class="wrap"><div class="cta"><h2>Hukum yang mudah diakses adalah hak setiap warga</h2><a class="btn btn-white" href="#/cari">Cari Sekarang</a></div></section>`;
  }

  function jelajahi() {
    const counts = {};
    META.forEach(m => { counts[m[0]] = (counts[m[0]] || 0) + 1; });
    const order = ["UU","PP","PERPRES","PERMEN","PERDA","PERGUB","PERBUP","POJK","KEPPRES","PERMENKUMHAM","INPRES","PERDAIS","QANUN","PERDASUS","PERBAN","PENPRES","PERPUU","UUD","TAP_MPR","UUDRT","PMK","SE","PERWALI"];
    const items = order.filter(t => counts[t]).map(t => `<a class="jenis" href="#/cari?q=${encodeURIComponent(t)}"><span class="code">${t}</span><span class="count">${counts[t].toLocaleString("id-ID")}</span><span class="name">${t}</span></a>`).join("");
    return `<section class="doc-head"><div class="wrap"><div class="crumb">Beranda / Jelajahi</div><h1>Jelajahi Peraturan</h1><p class="meta">${META.length.toLocaleString("id-ID")} peraturan terindeks dari pasal.id.</p></div></section><section class="wrap block"><div class="jenis-grid">${items}</div></section>`;
  }

  function api() {
    return `<section class="doc-head"><div class="wrap"><div class="crumb">Beranda / API</div><h1>API Hukum Indonesia — Dokumentasi REST</h1><p class="meta">Source data: pasal.id/api/v1 (butuh token resmi).</p></div></section>
    <section class="wrap block"><div class="dev-grid">
      <div class="dev-card"><h3>GET /api/v1/search</h3><div class="codebox">curl -H "Authorization: Bearer &lt;token&gt;" \\\n  "https://pasal.id/api/v1/search?q=upah+minimum"</div></div>
      <div class="dev-card"><h3>GET /api/v1/laws</h3><div class="codebox">curl -H "Authorization: Bearer &lt;token&gt;" \\\n  "https://pasal.id/api/v1/laws?type=UU&year=2003"</div></div>
    </div></section>`;
  }

  function search(q) {
    q = (q || "").toLowerCase().trim();
    let hits;
    if (!q) hits = META.slice(0, 20);
    else hits = META.filter(m => (m[3] + " " + m[0] + " " + m[1] + " " + m[2]).toLowerCase().includes(q)).slice(0, 50);
    const res = hits.map(m => `<a class="result" href="https://pasal.id/${m[5]}" target="_blank" rel="noopener">
      <div class="r-type">${m[0]} ${m[1]}/${m[2]}</div>
      <h3>${m[0]} Nomor ${m[1]} Tahun ${m[2]} tentang ${m[3]}</h3>
      <p>Status: ${m[4]} · buka di pasal.id</p></a>`).join("");
    return `<section class="search-hero"><div class="wrap"><h1>Cari Peraturan</h1>
      <p>${q ? `Hasil untuk "<b>${q}</b>" — ${hits.length} ditemukan (dari ${META.length.toLocaleString("id-ID")})` : "Masukkan kata kunci"}</p>
      <form class="searchbar" style="margin-top:20px" onsubmit="return goSearch(event)"><input id="q" type="text" placeholder="Cari peraturan…" value="${q}" /><button type="submit">Cari</button></form>
    </div></section><section class="wrap"><div class="results">${res || '<p style="color:var(--ink-mute)">Tidak ada hasil.</p>'}</div></section>`;
  }

  async function render() {
    const hash = location.hash || "#/";
    const path = hash.replace("#/", "").split("?")[0];
    const qs = hash.split("?")[1] || "";
    const params = new URLSearchParams(qs);
    let view = "";
    setActive("#/" + (path.split("/")[0] || ""));
    if (path === "" || path === "/") view = home();
    else if (path === "jelajahi") view = jelajahi();
    else if (path === "api") view = api();
    else if (path === "cari") view = search(params.get("q"));
    else view = home();
    app.innerHTML = header() + `<main>${view}</main>` + footer();

    // populate home async
    if (path === "" || path === "/") {
      try {
        await loadMeta();
        const tot = document.querySelector(".stat .num:nth-child(1)") || document.querySelectorAll(".stat .num")[1];
        const statNums = document.querySelectorAll(".stat .num");
        if (statNums[1]) statNums[1].textContent = META.length.toLocaleString("id-ID");
        const pop = META.filter(m => ["UU","UUD"].includes(m[0])).slice(0, 6)
          .map(m => `<a class="card" href="https://pasal.id/${m[5]}" target="_blank" rel="noopener"><div class="tag"><span class="pill">${m[0]}</span><span class="status">${m[4]}</span></div><h3>${m[0]} Nomor ${m[1]} Tahun ${m[2]} tentang ${m[3]}</h3></a>`).join("");
        const el = document.getElementById("popular"); if (el) el.innerHTML = pop || '<p style="color:var(--ink-mute)">Memuat…</p>';
        const counts = {}; META.forEach(m => counts[m[0]] = (counts[m[0]]||0)+1);
        const jz = Object.entries(counts).slice(0, 24).map(([t,c]) => `<a class="jenis" href="#/cari?q=${encodeURIComponent(t)}"><span class="code">${t}</span><span class="count">${c.toLocaleString("id-ID")}</span><span class="name">${t}</span></a>`).join("");
        const jel = document.getElementById("jenis"); if (jel) jel.innerHTML = jz || '<p style="color:var(--ink-mute)">Memuat…</p>';
      } catch (e) { console.warn("meta load failed", e); const el=document.getElementById("popular"); if(el) el.innerHTML='<p style="color:#9a5b5b">Gagal memuat indeks. Coba refresh.</p>'; }
    }
    window.scrollTo(0, 0);
  }

  window.goSearch = function (e) { e.preventDefault(); const v = document.getElementById("q").value; location.hash = "#/cari?q=" + encodeURIComponent(v); return false; };
  window.copyText = t => navigator.clipboard && navigator.clipboard.writeText(t);
  window.addEventListener("hashchange", render);
  if (document.readyState !== "loading") render(); else document.addEventListener("DOMContentLoaded", render);
})();
