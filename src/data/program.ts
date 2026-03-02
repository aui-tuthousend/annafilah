// src/data/program.ts
// ─── Sumber data program terpusat (dummy) ─────────────────────────────────────
// Dipakai oleh: /program/index.astro, /program/[slug].astro

export interface ProgramItem {
    slug: string;
    name: string;
    image: string;
    description: string; // HTML
}

export const allProgram: ProgramItem[] = [
    {
        slug: "pemberdayaan-petani-mandiri",
        name: "Pemberdayaan Petani Mandiri",
        image: "/1351306.webp",
        description: `
<p>Program <strong>Pemberdayaan Petani Mandiri</strong> merupakan inisiatif unggulan Annafilah untuk meningkatkan kapasitas dan kesejahteraan petani kecil di Indonesia melalui pendampingan intensif, akses permodalan, dan penerapan teknologi pertanian modern.</p>
<h2>Tujuan Program</h2>
<p>Membangun ekosistem pertanian yang berkelanjutan di mana petani tidak hanya mampu memenuhi kebutuhan subsisten, tetapi juga berhasil memasarkan hasil panen secara efisien ke pasar yang lebih luas — termasuk pasar ekspor.</p>
<h2>Komponen Utama</h2>
<ul>
  <li>Pelatihan teknik budidaya berbasis Good Agricultural Practices (GAP)</li>
  <li>Fasilitasi akses KUR dan permodalan alternatif</li>
  <li>Pendampingan digitalisasi pencatatan usaha tani</li>
  <li>Koneksi ke platform agribisnis dan offtaker korporasi</li>
</ul>
<h2>Dampak yang Telah Dicapai</h2>
<p>Sejak diluncurkan, program ini telah menjangkau lebih dari <strong>2.500 petani</strong> di 12 kabupaten, dengan rata-rata peningkatan pendapatan sebesar <strong>45%</strong> dalam satu musim tanam.</p>
<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-slate-400">"Program ini benar-benar mengubah cara saya bertani. Sekarang saya punya akses ke pasar yang tidak pernah saya bayangkan sebelumnya." — Pak Sugino, Petani Binaan Magelang</blockquote>
        `,
    },
    {
        slug: "inkubasi-usaha-mikro",
        name: "Inkubasi Usaha Mikro",
        image: "/323869.webp",
        description: `
<p>Program <strong>Inkubasi Usaha Mikro</strong> dirancang untuk mendampingi pelaku usaha kecil dan mikro (UMK) dari tahap ideasi hingga bisnis yang siap scale-up. Melalui program ini, peserta mendapatkan mentoring, fasilitas, dan jaringan yang dibutuhkan untuk tumbuh.</p>
<h2>Siapa yang Bisa Bergabung?</h2>
<p>Program terbuka bagi pengusaha pemula maupun existing dengan omset di bawah Rp 300 juta per tahun, yang memiliki produk atau jasa dengan potensi pasar yang jelas.</p>
<h2>Apa yang Didapatkan?</h2>
<ul>
  <li>Mentoring 1-on-1 bersama praktisi bisnis berpengalaman</li>
  <li>Akses co-working space dan fasilitas produksi bersama</li>
  <li>Workshop pemasaran digital, keuangan, dan legalitas usaha</li>
  <li>Demo Day untuk presentasi ke investor dan buyer potensial</li>
</ul>
<h2>Rekam Jejak</h2>
<p>Lebih dari <strong>180 UMKM</strong> telah berhasil melewati program inkubasi selama 3 tahun terakhir, dengan tingkat keberlangsungan bisnis (<em>survival rate</em>) mencapai <strong>87%</strong>.</p>
        `,
    },
    {
        slug: "literasi-keuangan-desa",
        name: "Literasi Keuangan Desa",
        image: "/468739.webp",
        description: `
<p>Program <strong>Literasi Keuangan Desa</strong> hadir untuk menjawab tantangan rendahnya pemahaman keuangan di kalangan masyarakat pedesaan — sebuah akar masalah dari berbagai persoalan ekonomi yang terus berulang.</p>
<h2>Pendekatan Kami</h2>
<p>Kami menggunakan metode pembelajaran kontekstual dan partisipatif, di mana materi literasi keuangan disampaikan melalui bahasa dan contoh sehari-hari yang relevan dengan kehidupan masyarakat desa.</p>
<h2>Modul Program</h2>
<ul>
  <li>Dasar pengelolaan keuangan keluarga</li>
  <li>Menabung cerdas dan investasi sederhana</li>
  <li>Mengenal produk keuangan formal: tabungan, asuransi, kredit</li>
  <li>Perlindungan dari jeratan pinjol ilegal</li>
  <li>Perencanaan masa depan: pendidikan dan pensiun</li>
</ul>
<h2>Jangkauan</h2>
<p>Program ini telah menjangkau <strong>45 desa</strong> di 8 kabupaten, dengan total peserta lebih dari <strong>12.000 kepala keluarga</strong>.</p>
        `,
    },
    {
        slug: "digitalisasi-koperasi",
        name: "Digitalisasi Koperasi",
        image: "/1351306.webp",
        description: `
<p>Program <strong>Digitalisasi Koperasi</strong> bertujuan mentransformasi koperasi-koperasi tradisional agar mampu bersaing di era digital — melalui adopsi sistem manajemen modern, layanan keuangan digital, dan penguatan tata kelola.</p>
<h2>Mengapa Koperasi?</h2>
<p>Koperasi adalah tulang punggung ekonomi rakyat yang menyentuh jutaan anggota. Namun, banyak koperasi masih berjalan dengan sistem manual yang rentan terhadap kesalahan dan kurang transparan. Digitalisasi adalah kunci untuk membuka potensi mereka yang sesungguhnya.</p>
<h2>Solusi yang Kami Tawarkan</h2>
<ul>
  <li>Implementasi sistem informasi koperasi berbasis cloud</li>
  <li>Pelatihan admin dan pengurus koperasi</li>
  <li>Integrasi layanan pembayaran digital (e-wallet, QRIS)</li>
  <li>Dashboard keuangan real-time untuk pengurus dan anggota</li>
  <li>Pendampingan kepatuhan regulasi OJK</li>
</ul>
<h2>Hasil Nyata</h2>
<p>Koperasi yang bergabung dalam program ini rata-rata mencatat <strong>efisiensi administrasi 60%</strong> dan peningkatan kepercayaan anggota yang signifikan.</p>
        `,
    },
    {
        slug: "pelatihan-ekspor-umkm",
        name: "Pelatihan Ekspor UMKM",
        image: "/323869.webp",
        description: `
<p>Program <strong>Pelatihan Ekspor UMKM</strong> membuka pintu bagi pelaku usaha menengah dan kecil Indonesia untuk menembus pasar internasional — sebuah potensi yang selama ini belum tergarap maksimal karena keterbatasan pengetahuan dan jaringan.</p>
<h2>Target Peserta</h2>
<p>UMKM yang memiliki produk berpotensi ekspor (kerajinan, makanan olahan, tekstil, produk pertanian) namun belum memiliki pengalaman ekspor sebelumnya.</p>
<h2>Kurikulum Program</h2>
<ul>
  <li>Riset pasar dan pemilihan negara tujuan ekspor</li>
  <li>Standar internasional: sertifikasi, labeling, dan packaging</li>
  <li>Regulasi bea cukai dan dokumen ekspor</li>
  <li>Strategi pemasaran digital untuk pasar global (B2B marketplace)</li>
  <li>Negosiasi kontrak dan manajemen risiko ekspor</li>
</ul>
<h2>Success Stories</h2>
<p>Alumni program ini telah berhasil mengekspor produk ke <strong>14 negara</strong>, dengan total nilai ekspor kumulatif mencapai <strong>Rp 28 miliar</strong> dalam dua tahun pertama sejak program diluncurkan.</p>
<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-slate-400">"Dulu saya pikir ekspor itu hanya untuk perusahaan besar. Sekarang produk anyaman saya sudah sampai ke Jepang dan Belanda." — Ibu Ratna, Pengrajin Rotan Cirebon</blockquote>
        `,
    },
];

export function getProgramBySlug(slug: string): ProgramItem | undefined {
    return allProgram.find((item) => item.slug === slug);
}
