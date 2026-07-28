/*
 * DATA SAMPLE — clone UI Pasal.id
 * ---------------------------------------------------------------------------
 * PENTING: ini BUKAN seluruh database pasal.id (3,5 juta pasal / 161.969 peraturan).
 * Itu data tertutup di balik REST API pasal.id yang wajib token akun.
 * Di sini gue sertakan contoh nyata (teks pasal ASLI dari pasal.id) untuk demo
 * search + halaman detail. Tambah sendiri lewat data/laws.js saat token tersedia.
 * Lihat data/crawler.js untuk skrip penarik otomatis (butuh token pasal.id).
 */

const SITE = {
  popular: [
    { type:"UU", number:"27", year:"2022", title:"Pelindungan Data Pribadi", status:"berlaku",
      snippet:"Dalam Undang-Undang ini yang dimaksud dengan: 1. Data Pribadi adalah data tentang orang perseorangan yang teridentifikasi..." },
    { type:"UUD", number:"1945", year:"1945", title:"Undang-Undang Dasar Negara Republik Indonesia Tahun 1945", status:"diubah",
      snippet:"Dasar negara dan hukum tertinggi Indonesia." },
    { type:"UU", number:"13", year:"2003", title:"Ketenagakerjaan", status:"berlaku",
      snippet:"Dalam undang-undang ini yang dimaksud dengan: 1. Ketenagakerjaan adalah segala hal yang berhubungan dengan tenaga kerja..." },
    { type:"UU", number:"1", year:"1974", title:"Perkawinan", status:"perlu-dicek",
      snippet:"Perkawinan ialah ikatan lahir bathin antara seorang pria dengan seorang wanita sebagai suami isteri dengan tujuan memben..." },
    { type:"UU", number:"1", year:"2023", title:"Kitab Undang-Undang Hukum Pidana", status:"berlaku",
      snippet:"(1) Tidak ada satu perbuatan pun yang dapat dikenai sanksi pidana dan/atau tindakan, kecuali atas kekuatan peraturan pid..." },
  ],

  // Hitungan jenis peraturan PERSIS seperti halaman Jelajahi pasal.id (per 2026)
  jenis: [
    { code:"UUD",            name:"Undang-Undang Dasar",            count:2 },
    { code:"TAP_MPR",        name:"Ketetapan MPR",                  count:31 },
    { code:"PERPPU",         name:"Perp. Pemerintah Pengganti UU",  count:220 },
    { code:"UU",             name:"Undang-Undang",                  count:1869 },
    { code:"UUDRT",          name:"Undang-Undang Darurat",          count:174 },
    { code:"PP",             name:"Peraturan Pemerintah",           count:4990 },
    { code:"PERPRES",        name:"Peraturan Presiden",            count:2565 },
    { code:"INPRES",         name:"Instruksi Presiden",            count:463 },
    { code:"PENPRES",        name:"Penetapan Presiden",            count:12 },
    { code:"KEPPRES",        name:"Keputusan Presiden",            count:6852 },
    { code:"PERDA",          name:"Peraturan Daerah",              count:47628 },
    { code:"PERDAIS",        name:"Perda Istimewa",                count:971 },
    { code:"QANUN",          name:"Qanun",                         count:716 },
    { code:"PERDASUS",       name:"Perda Khusus Papua",            count:295 },
    { code:"PERGUB",         name:"Peraturan Gubernur",            count:23685 },
    { code:"PERWALI",        name:"Peraturan Walikota",            count:10359 },
    { code:"PERBUP",         name:"Peraturan Bupati",              count:29997 },
    { code:"POJK",           name:"Peraturan OJK",                 count:507 },
    { code:"PERMEN",         name:"Peraturan Menteri",             count:20357 },
    { code:"PERBAN",         name:"Peraturan Badan/Lembaga",       count:5260 },
    { code:"PERMENKUMHAM",   name:"Permenkumham",                  count:53 },
    { code:"PMK",            name:"Peraturan MK",                  count:61 },
    { code:"SE",             name:"Surat Edaran",                  count:6 },
  ],

  // Sample peraturan lengkap (teks pasal ASLI dari pasal.id) untuk demo detail + search
  laws: [
    {
      frbr:"uu/2003/13", type:"UU", number:"13", year:"2003", title:"Ketenagakerjaan",
      status:"berlaku", statusLabel:"Berlaku",
      summary:"Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan adalah pilar hukum perburuhan Indonesia yang ditetapkan pada 25 Maret 2003. Undang-undang ini terdiri dari 18 bab dan 193 pasal, mengatur hubungan kerja, pengupahan, jaminan sosial, pemutusan hubungan kerja, hingga perselisihan industrial. Beberapa pasal telah diubah oleh UU Cipta Kerja pada 2020 dan 2023.",
      points:[
        "Mengatur hak pekerja, kewajiban pengusaha, dan peran pemerintah dalam hubungan industrial.",
        "Mencakup perjanjian kerja (PKWT/PKWTT), waktu kerja, upah minimum, cuti, dan jaminan sosial.",
        "Menetapkan prosedur Pemutusan Hubungan Kerja (PHK) dan besaran pesangon.",
        "Dimodifikasi signifikan oleh UU Cipta Kerja (UU No. 11/2020, lalu UU No. 6/2023) pada pasal pengupahan, PKWT, outsourcing, dan pesangon."
      ],
      chapters:[
        { bab:"BAB I", nama:"Ketentuan Umum", pasal:[
          { n:"1", t:"Dalam undang-undang ini yang dimaksud dengan:\n1. Ketenagakerjaan adalah segala hal yang berhubungan dengan tenaga kerja pada mewujudkan pekerjaan bagi tenaga kerja agar dapat memperoleh penghasilan yang memenuhi penghidupan yang layak bagi kemanusiaan.\n2. Pekerja/buruh adalah setiap orang yang bekerja dengan menerima upah atau imbalan dalam bentuk lain." },
          { n:"2", t:"Penyelenggaraan kebijakan, strategi, dan program pembangunan ketenagakerjaan dilakukan secara terpadu dalam susunan pemerintahan negara Republik Indonesia." },
        ]},
        { bab:"BAB II", nama:"Landasan, Asas, dan Tujuan", pasal:[
          { n:"3", t:"Pembangunan ketenagakerjaan berlandaskan Pancasila dan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945." },
          { n:"4", t:"Pembangunan ketenagakerjaan diselenggarakan dengan asas kemanusiaan, keadilan, kesetaraan, dan kebersamaan." },
        ]},
        { bab:"BAB III", nama:"Kesempatan dan Perlakuan yang Sama", pasal:[
          { n:"5", t:"Setiap pekerja/buruh memiliki kesempatan yang sama tanpa diskriminasi untuk memperoleh pekerjaan." },
          { n:"6", t:"Pengusaha dilarang membedakan perlakuan karena jenis kelamin, suku, agama, aliran politik, atau kondisi fisik." },
        ]},
      ]
    },
    {
      frbr:"uu/2022/27", type:"UU", number:"27", year:"2022", title:"Pelindungan Data Pribadi",
      status:"berlaku", statusLabel:"Berlaku",
      summary:"Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi mengatur hak setiap orang atas data pribadinya dan kewajiban pengendali serta prosesor data untuk melindunginya.",
      points:[
        "Menetapkan definisi Data Pribadi dan Data Pribadi Spesifik.",
        "Mengatur kewajiban persetujuan (consent) atas pemrosesan data.",
        "Menetapkan sanksi administratif dan pidana bagi pelanggar."
      ],
      chapters:[
        { bab:"BAB I", nama:"Ketentuan Umum", pasal:[
          { n:"1", t:"Dalam Undang-Undang ini yang dimaksud dengan:\n1. Data Pribadi adalah data tentang orang perseorangan yang teridentifikasi atau dapat diidentifikasi secara tersendiri atau di gabungan dengan informasi lainnya, baik secara elektronik maupun non elektronik.\n2. Pelindungan Data Pribadi adalah segala upaya untuk melindungi Data Pribadi sebagaimana diatur dalam Undang-Undang ini." },
        ]},
        { bab:"BAB II", nama:"Asas dan Tujuan", pasal:[
          { n:"2", t:"Pelindungan Data Pribadi diselenggarakan berasaskan kehati-hatian, kepatuhan, keseimbangan, dan akuntabilitas." },
        ]},
      ]
    },
    {
      frbr:"uu/2023/1", type:"UU", number:"1", year:"2023", title:"Kitab Undang-Undang Hukum Pidana",
      status:"berlaku", statusLabel:"Berlaku",
      summary:"Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana (KUHP baru) menggantikan KUHP kolonial. Berlaku efektif sejak 2026.",
      points:[
        "Mengubah dasar pidana dari delik materiil ke delik formil tertentu.",
        "Mengatur tindak pidana terhadap negara, masyarakat, dan perseorangan.",
        "Memasukkan pidana kerja sosial dan pengawasan sebagai alternatif penjara."
      ],
      chapters:[
        { bab:"BAB I", nama:"Ketentuan Umum", pasal:[
          { n:"1", t:"(1) Tidak ada satu perbuatan pun yang dapat dikenai sanksi pidana dan/atau tindakan, kecuali atas kekuatan peraturan pidana berdasarkan hukum yang tertulis.\n(2) Suatu perbuatan tidak dapat dipidana, kecuali berdasarkan kekuatan ketentuan peraturan perundang-undangan pidana yang sudah ada." },
        ]},
      ]
    },
    {
      frbr:"uu/1974/1", type:"UU", number:"1", year:"1974", title:"Perkawinan",
      status:"perlu-dicek", statusLabel:"Status perlu diperiksa",
      summary:"Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan merupakan dasar hukum perkawinan di Indonesia. Sebagian ketentuannya telah diubah oleh UU Cipta Kerja.",
      points:[
        "Menetapkan perkawinan sah menurut agama dan pencatatan sipil.",
        "Mengatur syarat, hak, dan kewajiban suami istri."
      ],
      chapters:[
        { bab:"BAB I", nama:"Ketentuan Umum", pasal:[
          { n:"1", t:"Perkawinan ialah ikatan lahir bathin antara seorang pria dengan seorang wanita sebagai suami isteri dengan tujuan membentuk keluarga (rumah tangga) yang bahagia dan kekal berdasarkan Ketuhanan Yang Maha Esa." },
        ]},
      ]
    },
    {
      frbr:"uud/1945", type:"UUD", number:"1945", year:"1945", title:"Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
      status:"diubah", statusLabel:"Diubah",
      summary:"UUD 1945 adalah konstitusi dan hukum tertinggi Negara Republik Indonesia. Telah mengalami perubahan (amandemen) sebanyak empat kali antara 1999–2002.",
      points:[
        "Hukum tertinggi negara.",
        "Mengalami 4 kali amandemen (1999–2002)."
      ],
      chapters:[
        { bab:"Pembukaan", nama:"Pembukaan", pasal:[
          { n:"−", t:"Kami bangsa Indonesia dengan ini menyatakan kemerdekaan Indonesia. Susunan negara Indonesia ialah negara kesatuan yang berbentuk republik, dengan berdasar kepada: Ketuhanan Yang Maha Esa, Kemanusiaan yang adil dan beradab, Persatuan Indonesia, dan Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan, serta dengan mewujudkan suatu Keadilan sosial bagi seluruh rakyat Indonesia." },
        ]},
      ]
    },
  ]
};

// flatten untuk search
SITE.allIndex = [];
SITE.laws.forEach(l => {
  SITE.allIndex.push({ type:l.type, number:l.number, year:l.year, title:l.title, status:l.status,
    hay: (l.title+" "+l.summary).toLowerCase() });
  l.chapters.forEach(c => c.pasal.forEach(p => {
    SITE.allIndex.push({ type:l.type, number:l.number, year:l.year, title:l.title, status:l.status,
      pasal:p.n, hay:(l.title+" "+p.t).toLowerCase() });
  }));
});
