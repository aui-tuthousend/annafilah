// src/data/news.ts
// ─── Sumber data berita terpusat ─────────────────────────────────────────────
// Dipakai oleh: NewsCarousel, /berita/index.astro, /berita/[slug].astro

export interface NewsItem {
    slug: string;
    title: string;
    excerpt: string;
    content: string;       // HTML atau teks panjang untuk halaman detail
    category: string;
    date: string;
    location: string;
    image: string;
}

export const allNews: NewsItem[] = [
    {
        slug: "kemitraan-strategis-2026",
        title: "Annafilah Resmikan Kemitraan Strategis dengan 5 Perusahaan Nasional",
        excerpt: "Langkah besar dalam memperluas jaringan bisnis dan memberikan lebih banyak solusi inovatif bagi klien di seluruh Indonesia.",
        content: `
      <p>Yayasan Annafilah resmi menandatangani perjanjian kemitraan strategis dengan lima perusahaan nasional terkemuka dalam sebuah acara yang berlangsung di Jakarta Convention Center.</p>
      <p>Kemitraan ini mencakup berbagai bidang, mulai dari pengembangan kapasitas SDM, penyediaan layanan logistik terpadu, hingga kolaborasi dalam program pemberdayaan masyarakat di berbagai wilayah Indonesia.</p>
      <p>"Ini adalah langkah konkret kami untuk memperluas dampak positif bagi lebih banyak pihak," ujar Direktur Utama Annafilah dalam sambutannya.</p>
    `,
        category: "Kemitraan",
        date: "24 Februari 2026",
        location: "Jakarta",
        image: "/1351306.webp",
    },
    {
        slug: "platform-digital-v2",
        title: "Inovasi Teknologi: Platform Digital Annafilah Kini Hadir Versi 2.0",
        excerpt: "Dilengkapi dengan fitur-fitur canggih berbasis AI untuk membantu bisnis Anda tumbuh lebih cepat dan efisien di era digital.",
        content: `
      <p>Annafilah dengan bangga meluncurkan Platform Digital versi 2.0, sebuah lompatan besar dalam ekosistem layanan digital yang kami tawarkan kepada seluruh mitra dan klien.</p>
      <p>Platform baru ini hadir dengan antarmuka yang lebih intuitif, sistem pelaporan real-time, serta integrasi teknologi kecerdasan buatan (AI) yang memungkinkan analisis data lebih akurat dan efisien.</p>
      <p>Peluncuran ini merupakan bagian dari komitmen Annafilah untuk terus berinovasi demi melayani klien dengan standar terbaik.</p>
    `,
        category: "Teknologi",
        date: "20 Februari 2026",
        location: "Bandung",
        image: "/323869.webp",
    },
    {
        slug: "penghargaan-best-business-partner-2025",
        title: "Annafilah Raih Penghargaan Best Business Partner 2025",
        excerpt: "Penghargaan bergengsi ini diraih atas dedikasi kami dalam memberikan layanan terbaik dan menciptakan hasil nyata bagi setiap klien.",
        content: `
      <p>Dalam ajang penghargaan tahunan Indonesian Business Excellence Awards 2025, Yayasan Annafilah berhasil meraih gelar "Best Business Partner of the Year", sebuah penghargaan yang diberikan kepada organisasi yang dinilai memberikan dampak terbaik bagi mitra bisnis mereka.</p>
      <p>Penghargaan ini merupakan bukti nyata dari konsistensi Annafilah dalam menjaga kepercayaan lebih dari 200 klien aktif di seluruh Indonesia.</p>
    `,
        category: "Penghargaan",
        date: "15 Februari 2026",
        location: "Surabaya",
        image: "/468739.webp",
    },
    {
        slug: "workshop-nasional-strategi-digital",
        title: "Workshop Nasional: Strategi Bisnis di Era Transformasi Digital",
        excerpt: "Annafilah menyelenggarakan workshop eksklusif yang mempertemukan ratusan pemimpin bisnis untuk berbagi wawasan dan strategi terkini.",
        content: `
      <p>Annafilah sukses menyelenggarakan Workshop Nasional bertajuk "Strategi Bisnis di Era Transformasi Digital" yang dihadiri oleh lebih dari 300 pemimpin bisnis, pengusaha, dan profesional dari berbagai sektor industri.</p>
      <p>Workshop ini menghadirkan pembicara-pembicara terkemuka yang berbagi wawasan tentang tren terkini, tantangan, dan peluang bisnis di era digital. Peserta juga mendapatkan kesempatan untuk berjejaring dan berkolaborasi secara langsung.</p>
    `,
        category: "Event",
        date: "10 Februari 2026",
        location: "Yogyakarta",
        image: "/1351306.webp",
    },
    {
        slug: "ekspansi-5-kota-baru",
        title: "Ekspansi Layanan: Annafilah Kini Hadir di 5 Kota Baru",
        excerpt: "Memperluas jangkauan layanan kami ke Medan, Makassar, Balikpapan, Denpasar, dan Surabaya untuk melayani lebih banyak klien.",
        content: `
      <p>Sebagai bagian dari rencana ekspansi nasional, Yayasan Annafilah resmi membuka kantor perwakilan di lima kota besar: Medan, Makassar, Balikpapan, Denpasar, dan Surabaya.</p>
      <p>Langkah ini didorong oleh meningkatnya permintaan layanan dari berbagai daerah di luar Pulau Jawa, sekaligus memperkuat komitmen Annafilah untuk hadir lebih dekat kepada klien dan komunitas yang membutuhkan.</p>
    `,
        category: "Ekspansi",
        date: "5 Februari 2026",
        location: "Nasional",
        image: "/323869.webp",
    },
    {
        slug: "laporan-tahunan-2025",
        title: "Laporan Tahunan 2025: Pertumbuhan 200% dalam Satu Tahun",
        excerpt: "Review pencapaian luar biasa Annafilah sepanjang 2025, mulai dari pertumbuhan klien, pendapatan, hingga dampak positif bagi ekosistem bisnis.",
        content: `
      <p>Yayasan Annafilah dengan bangga mempublikasikan Laporan Tahunan 2025, yang mencatat pertumbuhan luar biasa di semua lini bisnis dan area dampak sosial.</p>
      <p>Sepanjang tahun 2025, Annafilah berhasil menambah lebih dari 120 klien baru, meningkatkan pendapatan hingga 200% dibandingkan tahun sebelumnya, sekaligus memperluas jangkauan program pemberdayaan ke 15 kabupaten baru.</p>
      <p>Laporan ini menjadi refleksi dan fondasi untuk target yang lebih ambisius di tahun 2026.</p>
    `,
        category: "Laporan",
        date: "1 Februari 2026",
        location: "Jakarta",
        image: "/468739.webp",
    },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
    return allNews.find((item) => item.slug === slug);
}
