// src/data/artikel.ts
// ─── Sumber data artikel terpusat ─────────────────────────────────────────────
// Dipakai oleh: ArtikelCarousel, /artikel/index.astro, /artikel/[slug].astro

export interface ArtikelItem {
    slug: string;
    title: string;
    excerpt: string;       // Teks singkat untuk preview card
    content: string;       // HTML untuk halaman detail
    category: string;
    date: string;
    author: string;
    readTime: string;      // contoh: "5 menit"
    tags: string[];
    image: string;
}

export const allArtikel: ArtikelItem[] = [
    {
        slug: "transformasi-digital-ukm-indonesia",
        title: "Transformasi Digital UKM Indonesia: Peluang dan Tantangan di 2026",
        excerpt:
            "Lebih dari 64 juta UKM di Indonesia kini berada di persimpangan jalan. Mereka yang mampu beradaptasi dengan teknologi akan melaju jauh meninggalkan kompetitor.",
        content: `
      <p>Usaha Kecil dan Menengah (UKM) menyumbang lebih dari 60% PDB Indonesia dan menyerap hampir 97% tenaga kerja nasional. Namun, tingkat adopsi teknologi digital di segmen ini masih jauh tertinggal dibandingkan korporasi besar.</p>
      <h2>Mengapa Urgen?</h2>
      <p>Perubahan perilaku konsumen pasca-pandemi telah mempercepat perpindahan transaksi ke kanal digital. UKM yang tidak hadir secara online berisiko kehilangan segmen pasar yang semakin besar.</p>
      <h2>Langkah Konkret Memulai</h2>
      <p>Transformasi tidak harus mahal. Mulai dari hal sederhana: online presence melalui media sosial, sistem pembukuan digital, dan payment gateway. Dari sana, skalakan secara bertahap sesuai kapasitas bisnis.</p>
      <p>Kemitraan dengan konsultan yang tepat dapat mempercepat kurva pembelajaran dan menghindari jebakan transformasi yang gagal di tengah jalan.</p>
    `,
        category: "Bisnis",
        date: "25 Februari 2026",
        author: "Tim Annafilah",
        readTime: "5 menit",
        tags: ["UKM", "Digital", "Transformasi"],
        image: "/1351306.webp",
    },
    {
        slug: "strategi-branding-era-ai",
        title: "Strategi Branding di Era AI: Tetap Manusiawi di Tengah Otomasi",
        excerpt:
            "Ketika AI mampu membuat konten, desain, bahkan strategi pemasaran, apa yang membedakan brand Anda? Jawabannya: Keautentikan dan nilai manusia.",
        content: `
      <p>Kecerdasan buatan (AI) telah merevolusi cara brand berkomunikasi dengan audiensnya. Dari pembuatan konten otomatis hingga personalisasi iklan real-time, AI menawarkan efisiensi yang belum pernah ada sebelumnya.</p>
      <h2>Paradoks AI dalam Branding</h2>
      <p>Semakin banyak brand menggunakan AI, semakin tinggi nilai autentisitas manusia. Konsumen semakin pandai membedakan komunikasi yang "terasa robot" versus yang benar-benar datang dari manusia yang peduli.</p>
      <h2>Formula yang Berhasil</h2>
      <p>Gunakan AI untuk efisiensi operasional (scheduling, analitik, A/B testing), tetapi pertahankan sentuhan manusia pada storytelling, community engagement, dan nilai brand. Inilah kombinasi yang memenangkan loyalitas jangka panjang.</p>
    `,
        category: "Pemasaran",
        date: "20 Februari 2026",
        author: "Dewi Kusuma",
        readTime: "4 menit",
        tags: ["Branding", "AI", "Pemasaran"],
        image: "/323869.webp",
    },
    {
        slug: "keuangan-sehat-bisnis-kecil",
        title: "5 Prinsip Keuangan Sehat untuk Bisnis Kecil yang Ingin Tumbuh",
        excerpt:
            "Banyak bisnis kecil yang gulung tikar bukan karena produknya buruk, melainkan karena manajemen keuangannya lemah. Ini fondasi yang wajib dikuasai.",
        content: `
      <p>Studi menunjukkan bahwa 82% kegagalan bisnis kecil disebabkan oleh masalah arus kas. Bukan produk yang jelek, bukan pasar yang tidak ada—melainkan pengelolaan keuangan yang tidak sehat.</p>
      <h2>1. Pisahkan Keuangan Pribadi dan Bisnis</h2>
      <p>Ini adalah prinsip paling mendasar yang sering diabaikan. Rekening bisnis terpisah adalah fondasi dari laporan keuangan yang akurat.</p>
      <h2>2. Kelola Arus Kas, Bukan Hanya Profit</h2>
      <p>Bisnis bisa untung di atas kertas namun bangkrut karena tidak punya uang tunai. Proyeksi arus kas bulanan adalah alat terpenting yang harus Anda miliki.</p>
      <h2>3. Dana Darurat Bisnis</h2>
      <p>Sisihkan minimal 3-6 bulan biaya operasional sebagai cadangan. Ini yang membedakan bisnis yang survive dari guncangan versus yang langsung tutup.</p>
    `,
        category: "Keuangan",
        date: "15 Februari 2026",
        author: "Ahmad Fauzan",
        readTime: "6 menit",
        tags: ["Keuangan", "Bisnis", "Manajemen"],
        image: "/468739.webp",
    },
    {
        slug: "membangun-tim-hiring-pertama",
        title: "Panduan Membangun Tim: Cara Hiring Karyawan Pertama yang Tepat",
        excerpt:
            "Rekrutmen pertama adalah keputusan paling kritis dalam perjalanan sebuah bisnis. Salah pilih bisa menguras waktu, energi, dan modal yang sudah susah payah dibangun.",
        content: `
      <p>Momen seorang founder memutuskan untuk pertama kali merekrut karyawan adalah tonggak penting sekaligus penuh risiko. Hire terlalu cepat bisa menguras kas; hire terlalu lambat bisa menghambat pertumbuhan.</p>
      <h2>Kapan Waktu yang Tepat?</h2>
      <p>Rekrut ketika ada pekerjaan berulang yang memakan lebih dari 20% waktu Anda, dan bisnis sudah memiliki arus kas yang cukup untuk membayar gaji minimal 6 bulan ke depan.</p>
      <h2>Prioritaskan Culture Fit</h2>
      <p>Pada tahap awal, attitude dan kemauan belajar jauh lebih penting dari skill teknis. Skill bisa dilatih, karakter jauh lebih sulit diubah. Rekrut orang yang mau tumbuh bersama bisnis Anda.</p>
    `,
        category: "SDM",
        date: "10 Februari 2026",
        author: "Siti Rahayu",
        readTime: "7 menit",
        tags: ["SDM", "Rekrutmen", "Startup"],
        image: "/1351306.webp",
    },
    {
        slug: "supply-chain-resilience-2026",
        title: "Membangun Supply Chain yang Tangguh di Tengah Ketidakpastian Global",
        excerpt:
            "Gangguan rantai pasok global pasca-pandemi mengajarkan satu pelajaran berharga: bisnis yang bertahan adalah yang memiliki supply chain yang fleksibel dan terdiversifikasi.",
        content: `
      <p>Krisis global, perubahan regulasi, dan fluktuasi nilai tukar terus menjadi ancaman nyata bagi kelangsungan rantai pasok bisnis. Namun, setiap ancaman ini juga mengandung peluang bagi bisnis yang siap.</p>
      <h2>Diversifikasi Pemasok</h2>
      <p>Jangan bergantung pada satu atau dua pemasok utama. Bangun hubungan dengan minimal tiga pemasok alternatif untuk setiap komponen kritis dalam bisnis Anda.</p>
      <h2>Teknologi sebagai Buffer</h2>
      <p>Investasi pada sistem manajemen inventori berbasis cloud dan alat prediksi permintaan (demand forecasting) dapat memberikan visibilitas yang lebih baik dan memungkinkan respons yang lebih cepat terhadap gangguan.</p>
    `,
        category: "Operasional",
        date: "5 Februari 2026",
        author: "Budi Santoso",
        readTime: "5 menit",
        tags: ["Operasional", "Supply Chain", "Manajemen"],
        image: "/323869.webp",
    },
];

export function getArtikelBySlug(slug: string): ArtikelItem | undefined {
    return allArtikel.find((item) => item.slug === slug);
}
