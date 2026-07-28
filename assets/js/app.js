/* SPA router + search engine client-side untuk clone Pasal.id */
(function () {
  const app = document.getElementById("app");
  const navLinks = document.querySelectorAll(".nav-links a, .nav-right a");

  function setActive(hash) {
    navLinks.forEach(a => {
      const h = a.getAttribute("href");
      a.classList.toggle("active", h === hash);
    });
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
          <p>Hukum Indonesia, terbuka untuk semua. Clone UI — data sample (bukan seluruh database resmi).</p>
        </div>
        <div class="foot-col">
          <h4>Produk</h4>
          <a href="#/cari">Cari</a>
          <a href="#/jelajahi">Jelajahi</a>
          <a href="#/api">API</a>
          <a href="#/jelajahi">Hubungkan AI</a>
        </div>
        <div class="foot-col">
          <h4>Tentang</h4>
          <a href="#/api">Tentang Pasal.id</a>
          <a href="#/api">Tim Kami</a>
          <a href="#/api">Kebijakan Editorial</a>
        </div>
        <div class="foot-col">
          <h4>Legal</h4>
          <a href="#/api">Kebijakan Privasi</a>
          <a href="#/api">Ketentuan Layanan</a>
          <a href="#/api">Penilaian Dampak</a>
        </div>
      </div>
      <div class="wrap foot-bottom">Clone UI Pasal.id — teks hukum domain publik · desain milik pasal.id</div>
    </footer>`;
  }

  function home() {
    const pop = SITE.popular.map(p => `
      <a class="card" href="#/peraturan/${p.type}/${p.year}/${p.number}">
        <div class="tag">
          <span class="pill">${p.type}</span>
          <span class="status ${p.status === 'berlaku' ? '' : (p.status === 'diubah' ? 'amended' : 'needs-check')}">${p.status === 'berlaku' ? 'Berlaku' : (p.status === 'diubah' ? 'Diubah' : 'Status perlu diperiksa')}</span>
        </div>
        <h3>UU Nomor ${p.number} Tahun ${p.year} tentang ${p.title}</h3>
        <p>${p.snippet}</p>
      </a>`).join("");

    const jenis = SITE.jenis.map(j => `
      <a class="jenis" href="#/jelajahi">
        <span class="code">${j.code}</span>
        <span class="count">${j.count.toLocaleString("id-ID")}</span>
        <span class="name">${j.name}</span>
      </a>`).join("");

    return `
    <section class="hero">
      <div class="wrap">
        <h1>Temukan pasal yang Anda butuhkan</h1>
        <p class="sub"><em class="em">Hukum Indonesia, terbuka untuk semua</em></p>
        <form class="searchbar" onsubmit="return goSearch(event)">
          <input id="q" type="text" placeholder="Cari peraturan…" autocomplete="off" />
          <button type="submit">Cari</button>
        </form>
        <div class="try">Coba cari:
          <a href="#/cari?q=uud%201945">uud 1945</a>,
          <a href="#/cari?q=hak%20pekerja%20kontrak">hak pekerja kontrak</a>,
          <a href="#/cari?q=perlindungan%20konsumen">perlindungan konsumen</a>,
          <a href="#/cari?q=pidana%20korupsi">pidana korupsi</a>
        </div>
      </div>
    </section>

    <section class="wrap">
      <div class="stats">
        <div class="stat"><div class="num">161.969</div><div class="lab">Peraturan</div></div>
        <div class="stat"><div class="num">3.556.624</div><div class="lab">Pasal terstruktur</div></div>
        <div class="stat"><div class="num">100%</div><div class="lab">Gratis untuk semua</div></div>
      </div>
    </section>

    <section class="wrap block">
      <div class="section-head"><div><div class="eyebrow">PALING SERING DIAKSES</div><h2>Peraturan Populer</h2></div></div>
      <div class="popular-grid">${pop}</div>
    </section>

    <section class="wrap block">
      <div class="section-head"><div><div class="eyebrow">DATABASE</div><h2>Jelajahi Berdasarkan Jenis</h2></div>
        <a class="btn btn-green-soft" href="#/jelajahi">Lihat semua jenis peraturan</a></div>
      <div class="jenis-grid">${jenis}</div>
    </section>

    <section class="wrap block">
      <div class="section-head"><div><div class="eyebrow">UNTUK DEVELOPER</div><h2>Hubungkan AI via MCP</h2></div></div>
      <div class="dev-grid">
        <div class="dev-card">
          <h3>MCP Server</h3>
          <p style="font-size:14px;color:var(--ink-mute)">Akses hukum Indonesia langsung dari AI agent Anda.</p>
          <button class="copy-btn" onclick="copyText('mcp::pasal')">Salin</button>
          <div class="codebox"><span class="c"># tambahkan ke config MCP agent Anda</span>\nmcpServers.pasal = { url: "https://pasal.id/mcp" }</div>
          <a class="link" href="#/api">Panduan lengkap →</a>
        </div>
        <div class="dev-card">
          <h3>REST API</h3>
          <p style="font-size:14px;color:var(--ink-mute)">Endpoint pencarian & metadata peraturan.</p>
          <button class="copy-btn" onclick="copyText('https://pasal.id/api/v1')">Salin</button>
          <div class="codebox">GET https://pasal.id/api/v1/search?q=...</div>
          <a class="link" href="#/api">Dokumentasi API →</a>
        </div>
      </div>
    </section>

    <section class="wrap">
      <div class="cta">
        <h2>Hukum yang mudah diakses adalah hak setiap warga</h2>
        <a class="btn btn-white" href="#/cari">Cari Sekarang</a>
      </div>
    </section>`;
  }

  function jelajahi() {
    const jenis = SITE.jenis.map(j => `
      <a class="jenis" href="#/cari?q=${encodeURIComponent(j.name)}">
        <span class="code">${j.code}</span>
        <span class="count">${j.count.toLocaleString("id-ID")}</span>
        <span class="name">${j.name}</span>
      </a>`).join("");
    return `
    <section class="doc-head"><div class="wrap">
      <div class="crumb">Beranda / Jelajahi Peraturan</div>
      <h1>Jelajahi Peraturan</h1>
      <p class="meta">Telusuri berbagai jenis peraturan Indonesia — UU, PP, Perpres, Permen, dan lainnya. Teks lengkap terstruktur per pasal, gratis dan terbuka.</p>
    </div></section>
    <section class="wrap block"><div class="jenis-grid">${jenis}</div></section>`;
  }

  function api() {
    const types = SITE.jenis.map(j => `<code>${j.code}</code>`).join(", ");
    return `
    <section class="doc-head"><div class="wrap">
      <div class="crumb">Beranda / API</div>
      <h1>API Hukum Indonesia — Dokumentasi REST</h1>
      <p class="meta">API REST gratis untuk pencarian hukum Indonesia. Memerlukan token akses (daftar akun gratis di pasal.id).</p>
    </div></section>
    <section class="wrap block">
      <div class="dev-grid">
        <div class="dev-card">
          <h3>GET /api/v1/search</h3>
          <div class="codebox">curl -H "Authorization: Bearer &lt;token&gt;" \\\n  "https://pasal.id/api/v1/search?q=upah+minimum"</div>
          <p style="font-size:14px;color:var(--ink-mute)">Cari peraturan berdasarkan kata kunci. Parameter: <code>q</code> (wajib), <code>type</code>, <code>limit</code> (max 20).</p>
        </div>
        <div class="dev-card">
          <h3>GET /api/v1/laws</h3>
          <div class="codebox">curl -H "Authorization: Bearer &lt;token&gt;" \\\n  "https://pasal.id/api/v1/laws?type=UU&year=2003"</div>
          <p style="font-size:14px;color:var(--ink-mute)">Daftar peraturan dengan filter jenis, tahun, status. Paginasi: <code>limit</code> (max 50), <code>offset</code>.</p>
        </div>
      </div>
      <div class="dev-card" style="margin-top:20px">
        <h3>Kode Jenis Peraturan</h3>
        <p style="font-size:14px;color:var(--ink-mute);line-height:2">${types}</p>
        <h3 style="margin-top:16px">Rate Limit</h3>
        <p style="font-size:14px;color:var(--ink-mute)">search: 60/menit · laws: 180/menit · detail: 60/menit.</p>
      </div>
    </section>`;
  }

  function search(q) {
    q = (q || "").toLowerCase().trim();
    let hits;
    if (!q) {
      hits = SITE.allIndex.slice(0, 12);
    } else {
      hits = SITE.allIndex.filter(x => x.hay.includes(q));
    }
    const res = hits.map(h => {
      const fr = `${h.type}/${h.year}/${h.number}`;
      const label = h.pasal ? `Pasal ${h.pasal}` : "Peraturan";
      return `<a class="result" href="#/peraturan/${fr}">
        <div class="r-type">${h.type} ${h.number}/${h.year} · ${label}</div>
        <h3>UU Nomor ${h.number} Tahun ${h.year} tentang ${h.title}</h3>
        <p>${h.pasal ? "Lihat pasal " + h.pasal : h.title}</p>
      </a>`;
    }).join("");
    return `
    <section class="search-hero"><div class="wrap">
      <h1>Cari Peraturan</h1>
      <p>${q ? `Hasil untuk "<b>${q}</b>" — ${hits.length} ditemukan (dari data sample)` : "Masukkan kata kunci untuk mencari (data sample)"}</p>
      <form class="searchbar" style="margin-top:20px" onsubmit="return goSearch(event)">
        <input id="q" type="text" placeholder="Cari peraturan…" value="${q}" autocomplete="off" />
        <button type="submit">Cari</button>
      </form>
    </div></section>
    <section class="wrap"><div class="results">${res || '<p style="color:var(--ink-mute)">Tidak ada hasil pada data sample. Tambahkan data lewat assets/js/data.js</p>'}</div></section>`;
  }

  function detail(type, year, num) {
    const law = SITE.laws.find(l => l.type === type && l.year === year && l.number === num);
    if (!law) {
      return `<section class="doc-head"><div class="wrap"><h1>Peraturan tidak ditemukan</h1>
        <p class="meta">Data sample belum memuat ${type} ${num}/${year}. Tambahkan di assets/js/data.js.</p>
        <p style="margin-top:16px"><a class="btn btn-primary" href="#/jelajahi">Kembali</a></p></div></section>`;
    }
    const toc = law.chapters.map(c => {
      const ps = c.pasal.map(p => `<a class="pasal-link" href="#/peraturan/${law.type}/${law.year}/${law.number}#p${p.n}">Pasal ${p.n}</a>`).join("");
      return `<details open><summary>${c.bab} ${c.nama}</summary>${ps}</details>`;
    }).join("");
    const body = law.chapters.map(c => {
      const arts = c.pasal.map(p => `<div class="article" id="p${p.n}"><h3>Pasal ${p.n}</h3><p>${p.t.replace(/\n/g, "<br>")}</p></div>`).join("");
      return arts;
    }).join("");
    return `
    <section class="doc-head"><div class="wrap">
      <div class="crumb">Beranda / ${law.type} / ${law.type} Nomor ${law.number} Tahun ${law.year}</div>
      <h1>${law.type} Nomor ${law.number} Tahun ${law.year} — ${law.title}</h1>
      <p class="meta">${law.type} Nomor ${law.number} Tahun ${law.year} tentang ${law.title.toUpperCase()}</p>
    </div></section>
    <section class="wrap">
      <div class="summary">
        <h2>Ringkasan singkat</h2>
        <p style="font-size:14px;color:var(--ink-soft);margin:8px 0 12px">${law.summary}</p>
        <h3 style="font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:var(--green)">Poin Utama</h3>
        <ul>${law.points.map(p => `<li>${p}</li>`).join("")}</ul>
      </div>
      <div class="section-head"><div><div class="eyebrow">DAFTAR ISI</div><h2>${law.chapters.length} Bab</h2></div></div>
      <div class="toc">${toc}</div>
      <div style="margin-top:24px">${body}</div>
      <p style="margin-top:24px;font-size:13px;color:var(--ink-mute)">⚠ Clone UI — teks pasal diambil dari pasal.id sebagai sample. Bukan versi resmi beranotasi.</p>
    </section>`;
  }

  function render() {
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
    else if (path.startsWith("peraturan/")) {
      const [, type, year, num] = path.split("/");
      view = detail(type, year, num);
    } else view = home();

    app.innerHTML = header() + `<main>${view}</main>` + footer();
    window.scrollTo(0, 0);
  }

  window.goSearch = function (e) {
    e.preventDefault();
    const v = document.getElementById("q").value;
    location.hash = "#/cari?q=" + encodeURIComponent(v);
    return false;
  };
  window.copyText = function (t) {
    navigator.clipboard && navigator.clipboard.writeText(t);
  };

  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
})();
