export type FaqItem = {
  question: string;
  answer: string;
};

export const landingFaqItems: FaqItem[] = [
  {
    question: "Apakah template ini benar-benar gratis?",
    answer: "Ya, 100% gratis dan selamanya begitu. Tidak ada versi premium, tidak ada paywall. Cukup unduh dan pakai.",
  },
  {
    question: "Apakah data karyawan saya aman?",
    answer: "Sepenuhnya aman. Template dibuat di memori server saat Anda klik unduh. Tidak ada data yang disimpan, tidak ada database, tidak ada tracking. File XLSX langsung ke perangkat Anda.",
  },
  {
    question: "Bisa dipakai di Google Sheets?",
    answer: "Ya, semua template kompatibel dengan Excel 2016+ dan Google Sheets. Cukup upload file XLSX ke Google Drive dan buka dengan Google Sheets.",
  },
  {
    question: "Apakah rumusnya sesuai regulasi Indonesia?",
    answer: "Ya. PPh21 menggunakan metode TER sesuai PP 58/2023. THR mengacu ke PP 78/2015. Template BPJS mengikuti tarif terbaru. Selalu verifikasi aturan resmi terbaru sebelum dipakai untuk payroll final.",
  },
  {
    question: "Saya bukan orang HR, bisa pakai?",
    answer: "Bisa. Template dirancang untuk owner UMKM, admin HR, dan finance yang mengelola payroll manual. Cukup isi data di baris contoh, rumus sudah jalan otomatis.",
  },
  {
    question: "Bagaimana cara mengubah parameter template?",
    answer: "Klik tombol 'Sesuaikan' pada template yang diinginkan. Atur parameter (nama perusahaan, tahun, hak cuti, dll) lalu klik 'Buat & Unduh'. File XLSX langsung terunduh dengan parameter Anda.",
  },
];
