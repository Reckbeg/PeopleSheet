export type TemplateCategory =
  | "Attendance"
  | "Leave"
  | "Tax"
  | "Compensation"
  | "Employee"
  | "Performance"
  | "HR";

export type TemplateSlug =
  | "attendance-tracker"
  | "leave-tracker"
  | "pph21-tax-calculator"
  | "thr-tracker"
  | "bpjs-tracker"
  | "performance-review"
  | "employee-master-data"
  | "overtime-tracker"
  | "turnover-tracker";

export type PreviewData = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
};

export type CustomField = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "month" | "year";
  default: string | number;
  options?: string[];
  placeholder?: string;
};

export type CustomizationConfig = {
  fields: CustomField[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TemplateProduct = {
  slug: TemplateSlug;
  name: string;
  category: TemplateCategory;
  summary: string;
  detail: string;
  fileName: string;
  downloadLabel: string;
  sheets: string[];
  features: string[];
  preview: string[];
  previewSheets: { name: string; description: string }[];
  operationalNotes: string[];
  useCase: string;
  teamSize: string;
  previewData: PreviewData;
  customizations?: CustomizationConfig;
  faq: FaqItem[];
};

const currentMonthDefault = "__current_month__";

export function getDefaultMonthValue(date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

export function getCustomFieldDefaultValue(field: CustomField, date = new Date()): string | number {
  if (field.type === "month" && field.default === currentMonthDefault) {
    return getDefaultMonthValue(date);
  }

  return field.default;
}

export const templates: TemplateProduct[] = [
  {
    slug: "attendance-tracker",
    name: "Attendance Tracker Template",
    category: "Attendance",
    summary: "Matriks presensi bulanan dengan tanggal otomatis dan penanda akhir pekan.",
    detail:
      "Template presensi yang ringan untuk tim yang masih mengelola status harian di Excel atau Google Sheets.",
    fileName: "peoplesheet-attendance-tracker.xlsx",
    downloadLabel: "Unduh template presensi",
    sheets: ["Setup", "Monthly Tracker", "Summary"],
    features: [
      "Kolom tanggal bulanan dibuat otomatis",
      "Sorotan akhir pekan",
      "Pilihan status untuk hadir, cuti, sakit, alpha, libur nasional, dan libur",
      "Rekap jumlah status presensi bulanan",
    ],
    preview: [
      "Ubah bulan sekali di Setup dan header tracker akan menyesuaikan.",
      "Kolom akhir pekan disorot agar lebih mudah dipindai.",
      "Tab Summary menghitung status presensi umum per karyawan.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Pemilih bulan — ubah sekali, semua tanggal ikut terbarui",
      },
      {
        name: "Monthly Tracker",
        description: "Matriks 31 kolom dengan dropdown status per hari",
      },
      {
        name: "Summary",
        description: "Jumlah status per karyawan berbasis COUNTIF",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Kolom akhir pekan otomatis disorot warna amber",
      "Validasi dropdown di setiap sel status",
      "Ubah bulan di Setup — header tanggal mengikuti otomatis",
      "Cocok untuk tim shift maupun tim kantor",
    ],
    useCase: "Pencatatan presensi harian di spreadsheet bersama",
    teamSize: "5–50 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "month",
          label: "Bulan",
          type: "month",
          default: currentMonthDefault,
        },
      ],
    },
    previewData: {
      title: "Tracker Bulanan — Mei 2026",
      headers: ["Karyawan", "Divisi", "01", "02", "03", "04", "05", "06", "07"],
      rows: [
        ["Dina Prasetya", "Operasional", "Hadir", "Hadir", "Libur", "Libur", "Hadir", "Hadir", "Hadir"],
        ["Rafi Mahendra", "HR", "Hadir", "Hadir", "Libur", "Libur", "Cuti", "Hadir", "Hadir"],
        ["Sari Wulandari", "Keuangan", "Sakit", "Hadir", "Libur", "Libur", "Hadir", "Hadir", "Sakit"],
        ["Budi Santoso", "Operasional", "Hadir", "Hadir", "Libur", "Libur", "Hadir", "Hadir", "Hadir"],
        ["Maya Anggraini", "Keuangan", "Hadir", "Hadir", "Libur", "Libur", "Hadir", "Hadir", "Hadir"],
      ],
    },
    faq: [
      {
        question: "Apakah template ini kompatibel dengan Google Sheets?",
        answer: "Ya, file XLSX bisa dibuka langsung di Google Sheets. Semua rumus dan dropdown tetap berfungsi.",
      },
      {
        question: "Bulan apa saja yang bisa dipilih?",
        answer: "Semua bulan. Cukup ubah bulan di sheet Setup dan header tanggal otomatis menyesuaikan.",
      },
      {
        question: "Berapa karyawan yang bisa dicatat?",
        answer: "Template dirancang untuk 5-50 karyawan. Bisa ditambah baris manual kalau tim lebih besar.",
      },
    ],
  },
  {
    slug: "leave-tracker",
    name: "Leave Tracker Template",
    category: "Leave",
    summary: "Template sederhana untuk saldo dan penggunaan cuti tahunan.",
    detail:
      "Template cuti yang fokus untuk memantau hak cuti tahunan, penggunaan yang disetujui, dan sisa saldo tanpa perlu HRIS.",
    fileName: "peoplesheet-leave-tracker.xlsx",
    downloadLabel: "Unduh template cuti",
    sheets: ["Setup", "Leave Balance", "Leave Usage"],
    features: [
      "Hak cuti tahunan dan sisa saldo",
      "Log penggunaan cuti dengan rumus operasional",
      "Rekap cuti tahunan yang disetujui",
      "Struktur sederhana untuk tim UMKM Indonesia",
    ],
    preview: [
      "Sheet saldo menyatukan saldo awal, hak cuti tahunan, hari terpakai, dan sisa hari.",
      "Sheet penggunaan menghitung durasi cuti pada hari kerja.",
      "Cuti tahunan yang disetujui otomatis masuk ke saldo karyawan.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tahun dan hak cuti tahunan default",
      },
      {
        name: "Leave Balance",
        description: "Saldo awal, hak, terpakai, dan sisa",
      },
      {
        name: "Leave Usage",
        description: "Pengajuan cuti dengan rumus NETWORKDAYS dan dropdown status",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Rumus NETWORKDAYS menghitung hari kerja saja",
      "Dropdown status: Direncanakan, Menunggu, Disetujui, Ditolak, Dibatalkan",
      "Cuti tahunan yang disetujui otomatis masuk ke saldo melalui SUMIFS",
      "Mendukung berbagai jenis cuti (tahunan, sakit, tanpa upah)",
    ],
    useCase: "Pemantauan saldo cuti tahunan tanpa sistem khusus",
    teamSize: "5–50 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "year",
          label: "Tahun",
          type: "year",
          default: 2026,
        },
        {
          key: "annualEntitlement",
          label: "Hak cuti tahunan (hari)",
          type: "number",
          default: 12,
        },
      ],
    },
    previewData: {
      title: "Saldo Cuti",
      headers: [
        "Karyawan",
        "Divisi",
        "Saldo Awal",
        "Hak Cuti",
        "Terpakai",
        "Sisa",
      ],
      rows: [
        ["Dina Prasetya", "Operasional", 0, 12, 3, 9],
        ["Rafi Mahendra", "HR", 2, 12, 1, 13],
        ["Sari Wulandari", "Keuangan", 0, 12, 4, 8],
        ["Budi Santoso", "Operasional", 1, 12, 2, 11],
        ["Maya Anggraini", "Keuangan", 0, 12, 0, 12],
      ],
    },
    faq: [
      {
        question: "Bagaimana cara menghitung cuti prorata?",
        answer: "Isi tanggal masuk karyawan di sheet Leave Usage. Rumus NETWORKDAYS otomatis menghitung hari kerja antara tanggal mulai dan selesai cuti.",
      },
      {
        question: "Apakah bisa menambah jenis cuti selain tahunan?",
        answer: "Bisa. Dropdown status mendukung cuti tahunan, sakit, dan tanpa upah. Anda bisa menyesuaikan label di sheet Setup.",
      },
      {
        question: "Bagaimana saldo cuti terupdate?",
        answer: "Saldo otomatis berkurang saat Anda mencatat cuti dengan status 'Disetujui' di sheet Leave Usage melalui rumus SUMIFS.",
      },
    ],
  },
  {
    slug: "pph21-tax-calculator",
    name: "PPh21 Tax Calculator",
    category: "Tax",
    summary: "Kalkulator PPh21 bulanan dengan metode TER (Tarif Efektif Rata-rata) sesuai PP 58/2023.",
    detail:
      "Hitung potongan pajak PPh21 bulanan untuk setiap karyawan menggunakan metode TER, potongan BPJS, dan pilihan status PTKP (TK/0 sampai K/3).",
    fileName: "peoplesheet-pph21-tax-calculator.xlsx",
    downloadLabel: "Unduh template pajak",
    sheets: ["Setup", "TER", "Employee Tax", "Summary"],
    features: [
      "Metode TER (Tarif Efektif Rata-rata) sesuai PP 58/2023",
      "3 kategori TER berdasarkan status PTKP (A, B, C)",
      "Tabel tarif TER bulanan lengkap per kategori dan braket penghasilan",
      "Dropdown status PTKP (TK/0 sampai K/3)",
      "Rumus PPh21 bulanan Januari-November berdasarkan penghasilan bruto",
      "Catatan masa pajak terakhir untuk rekonsiliasi Pasal 17",
    ],
    preview: [
      "Atur tahun pajak dan pilih status PTKP per karyawan di Setup.",
      "Sheet TER berisi tabel tarif efektif rata-rata lengkap per kategori.",
      "Sheet Employee Tax menghitung PPh21 bulanan Januari-November menggunakan rumus TER.",
      "Sheet Summary menunjukkan estimasi pemotongan Januari-November per karyawan.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tahun pajak, metode TER, status PTKP, jumlah PTKP, pemetaan kategori TER",
      },
      {
        name: "TER",
        description: "Tabel tarif efektif rata-rata per kategori (A, B, C) sesuai PP 58/2023",
      },
      {
        name: "Employee Tax",
        description: "Gaji bruto bulanan, status PTKP, kategori TER, tarif TER, PPh21 bulanan",
      },
      {
        name: "Summary",
        description: "Estimasi pemotongan Januari-November per karyawan dengan tarif efektif",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Menggunakan metode TER sesuai PP 58/2023 (berlaku sejak 2024)",
      "Dropdown status PTKP (TK/0 sampai K/3) untuk kemudahan pengisian",
      "Format mata uang Rupiah sudah diterapkan",
      "Catatan: TER berlaku untuk masa pajak selain masa pajak terakhir. Rekonsiliasi masa terakhir tetap menggunakan Pasal 17.",
      "Disclaimer: template ini alat bantu operasional, bukan nasihat pajak atau hukum.",
    ],
    useCase: "Perhitungan potongan PPh21 bulanan untuk payroll",
    teamSize: "5–100 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "taxYear",
          label: "Tahun pajak",
          type: "year",
          default: 2026,
        },
      ],
    },
    previewData: {
      title: "Perhitungan PPh21 — TER",
      headers: [
        "Karyawan",
        "Divisi",
        "Gaji Bruto/Bln",
        "PTKP",
        "Kategori TER",
        "Tarif TER",
        "PPh21 Jan-Nov",
      ],
      rows: [
        ["Dina Prasetya", "Operasional", 7500000, "TK/0", "A", "1,25%", 93750],
        ["Rafi Mahendra", "HR", 12000000, "K/1", "B", "3%", 360000],
        ["Sari Wulandari", "Keuangan", 6800000, "K/0", "A", "1,25%", 85000],
        ["Budi Santoso", "Operasional", 5500000, "TK/0", "A", "0,25%", 13750],
        ["Maya Anggraini", "Keuangan", 6200000, "K/0", "A", "0,75%", 46500],
      ],
    },
    faq: [
      {
        question: "Apakah template ini sesuai regulasi terbaru?",
        answer: "Ya. Menggunakan metode TER sesuai PP 58/2023 yang berlaku sejak Januari 2024. Selalu verifikasi aturan resmi terbaru.",
      },
      {
        question: "Bagaimana cara memilih kategori TER yang tepat?",
        answer: "Kategori ditentukan otomatis berdasarkan status PTKP. Kategori A untuk TK/0 dan K/0, B untuk K/1 dan K/2, C untuk K/3.",
      },
      {
        question: "Apakah bisa dipakai untuk payroll final?",
        answer: "Template ini alat bantu operasional. Untuk payroll final, selalu verifikasi perhitungan dengan aturan DJP terbaru atau konsultan pajak.",
      },
    ],
  },
  {
    slug: "thr-tracker",
    name: "THR Tracker",
    category: "Compensation",
    summary: "Lacak kelayakan, perhitungan, dan status pembayaran THR.",
    detail:
      "Kelola pencairan THR untuk hari raya keagamaan. Otomatis menghitung THR prorata untuk karyawan dengan masa kerja kurang dari 12 bulan.",
    fileName: "peoplesheet-thr-tracker.xlsx",
    downloadLabel: "Unduh template THR",
    sheets: ["Setup", "THR Calculation", "Summary"],
    features: [
      "Kelayakan THR berdasarkan masa kerja (min 12 bulan)",
      "Rumus THR proporsional untuk masa kerja lebih pendek",
      "Pelacakan status pembayaran (Menunggu/Dibayar)",
      "Rekap per divisi dan total pencairan",
    ],
    preview: [
      "Atur tahun THR dan referensi hari raya keagamaan di Setup.",
      "Sheet THR Calculation otomatis menentukan kelayakan dan jumlah berdasarkan masa kerja.",
      "Sheet Summary menunjukkan total pencairan per divisi.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tahun THR, aturan kelayakan, referensi hari raya keagamaan",
      },
      {
        name: "THR Calculation",
        description: "Cek kelayakan, jumlah THR, status pembayaran per karyawan",
      },
      {
        name: "Summary",
        description: "Total pencairan THR per divisi",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "THR proporsional untuk karyawan dengan masa kerja di bawah 12 bulan",
      "Dropdown status pembayaran (Menunggu, Dibayar)",
      "Format mata uang Rupiah sudah diterapkan",
      "Sesuai PP 78/2015 tentang pedoman THR",
      "Disclaimer: template ini alat bantu operasional, bukan nasihat hukum ketenagakerjaan.",
    ],
    useCase: "Pemantauan pencairan THR sebelum hari raya keagamaan",
    teamSize: "5–200 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "thrYear",
          label: "Periode THR",
          type: "year",
          default: 2026,
        },
      ],
    },
    previewData: {
      title: "Perhitungan THR",
      headers: [
        "Karyawan",
        "Divisi",
        "Tgl Masuk",
        "Masa Kerja (bln)",
        "Gaji Pokok",
        "Jumlah THR",
        "Status",
      ],
      rows: [
        ["Dina Prasetya", "Operasional", "01 Mar 2024", 26, 7500000, 7500000, "Dibayar"],
        ["Rafi Mahendra", "HR", "15 Jun 2023", 35, 12000000, 12000000, "Dibayar"],
        ["Sari Wulandari", "Keuangan", "01 Jan 2025", 16, 6800000, 6800000, "Menunggu"],
        ["Budi Santoso", "Operasional", "10 Nov 2025", 6, 5500000, 2750000, "Menunggu"],
        ["Maya Anggraini", "Keuangan", "01 Sep 2024", 20, 6200000, 6200000, "Dibayar"],
      ],
    },
    faq: [
      {
        question: "Kapan THR harus dibayar?",
        answer: "Sesuai PP 78/2015, THR harus dibayar paling lambat 7 hari sebelum hari raya keagamaan karyawan.",
      },
      {
        question: "Bagaimana THR untuk karyawan baru?",
        answer: "Karyawan dengan masa kerja 12 bulan atau lebih mendapat THR penuh. Di bawah 12 bulan, THR dihitung secara prorata.",
      },
      {
        question: "Bisakah status pembayaran dilacak?",
        answer: "Ya, sheet THR Calculation memiliki dropdown status (Menunggu/Dibayar) untuk melacak pencairan per karyawan.",
      },
    ],
  },
  {
    slug: "bpjs-tracker",
    name: "BPJS Contributions Tracker",
    category: "Compensation",
    summary: "Hitung iuran BPJS Kesehatan dan Ketenagakerjaan untuk karyawan dan perusahaan.",
    detail:
      "Pantau seluruh iuran BPJS (JHT, JP, JKK, JKM, dan BPJS Kesehatan) untuk porsi karyawan dan perusahaan dengan tarif yang dapat diatur di Setup.",
    fileName: "peoplesheet-bpjs-tracker.xlsx",
    downloadLabel: "Unduh template BPJS",
    sheets: ["Setup", "BPJS Contributions", "Summary"],
    features: [
      "Tarif iuran yang dapat diatur di sheet Setup",
      "Perhitungan iuran karyawan dan perusahaan melalui rumus",
      "5 komponen BPJS lengkap (JHT, JP, JKK, JKM, BPJS Kesehatan)",
      "Total biaya perusahaan per karyawan",
    ],
    preview: [
      "Atur tarif iuran sekali di Setup — semua rumus merujuk ke sana.",
      "Sheet BPJS Contributions menghitung iuran karyawan dan perusahaan per komponen.",
      "Sheet Summary menunjukkan total biaya perusahaan per karyawan dan total keseluruhan.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tahun, semua tarif iuran BPJS (karyawan + perusahaan)",
      },
      {
        name: "BPJS Contributions",
        description: "Rincian semua komponen BPJS per karyawan",
      },
      {
        name: "Summary",
        description: "Total biaya karyawan dan perusahaan per karyawan",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Semua tarif dapat diatur di Setup — rumus otomatis menyesuaikan",
      "Mencakup JHT, JP, JKK, JKM, dan BPJS Kesehatan",
      "Format mata uang Rupiah sudah diterapkan",
      "Sesuai regulasi BPJS Indonesia terkini",
      "Disclaimer: verifikasi tarif iuran terbaru sebelum dipakai untuk payroll resmi.",
    ],
    useCase: "Perhitungan iuran BPJS bulanan untuk payroll",
    teamSize: "5–200 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "year",
          label: "Tahun",
          type: "year",
          default: 2026,
        },
      ],
    },
    previewData: {
      title: "Iuran BPJS",
      headers: [
        "Karyawan",
        "Divisi",
        "Gaji Kotor",
        "JHT Kary",
        "JP Kary",
        "Kes Kary",
        "Total Kary",
        "Total Prsh",
      ],
      rows: [
        ["Dina Prasetya", "Operasional", 7500000, 150000, 75000, 75000, 300000, 768000],
        ["Rafi Mahendra", "HR", 12000000, 240000, 110863, 120000, 470863, 1210526],
        ["Sari Wulandari", "Keuangan", 6800000, 136000, 68000, 68000, 272000, 696320],
        ["Budi Santoso", "Operasional", 5500000, 110000, 55000, 55000, 220000, 563200],
        ["Maya Anggraini", "Keuangan", 6200000, 124000, 62000, 62000, 248000, 634880],
      ],
    },
    faq: [
      {
        question: "Apakah tarif BPJS bisa diubah?",
        answer: "Ya, semua tarif iuran bisa diatur di sheet Setup. Rumus di sheet BPJS Contributions otomatis menyesuaikan.",
      },
      {
        question: "BPJS apa saja yang dicakup?",
        answer: "Lengkap: JHT, JP, JKK, JKM, dan BPJS Kesehatan. Masing-masing terpisah untuk porsi karyawan dan perusahaan.",
      },
      {
        question: "Apakah tarif sudah sesuai regulasi terbaru?",
        answer: "Template menggunakan tarif standar Indonesia. Selalu verifikasi tarif iuran terbaru di bpjs-kesehatan.go.id sebelum dipakai untuk payroll resmi.",
      },
    ],
  },
  {
    slug: "performance-review",
    name: "Performance Review Template",
    category: "Performance",
    summary: "Evaluasi kinerja terstruktur dengan penilaian KPI, rumus rating, dan ringkasan.",
    detail:
      "Evaluasi karyawan pada 5 kategori KPI dengan total skor dan label rating otomatis. Sheet Summary merekap hasil per divisi.",
    fileName: "peoplesheet-performance-review.xlsx",
    downloadLabel: "Unduh template kinerja",
    sheets: ["Setup", "Review Form", "Summary"],
    features: [
      "5 kategori KPI dengan penilaian 1–5",
      "Rumus otomatis total skor dan label penilaian",
      "Validasi data pada input skor",
      "Rekap dengan rata-rata per divisi",
    ],
    preview: [
      "Atur periode evaluasi dan skala penilaian di Setup.",
      "Sheet Review Form menilai setiap karyawan dari Kualitas, Produktivitas, Kerja Tim, Inisiatif, dan Komunikasi.",
      "Sheet Summary menggabungkan semua karyawan dengan rating akhir dan rata-rata per divisi.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Periode evaluasi, skala penilaian, label penilaian",
      },
      {
        name: "Review Form",
        description: "Skor KPI per karyawan, total, dan label penilaian",
      },
      {
        name: "Summary",
        description: "Semua karyawan dengan penilaian dan rata-rata per divisi",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Validasi skor: hanya 1–5 yang diperbolehkan",
      "Label penilaian otomatis dari total skor",
      "Cocok untuk tim dengan siklus evaluasi terstruktur",
      "Kategori KPI yang bisa disesuaikan dengan kerangka perusahaan Anda",
    ],
    useCase: "Evaluasi dan penilaian kinerja berkala",
    teamSize: "5–100 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "reviewPeriod",
          label: "Periode Evaluasi",
          type: "text",
          default: "H1 2026",
          placeholder: "Contoh: H2 2026",
        },
      ],
    },
    previewData: {
      title: "Evaluasi Kinerja — Semester 1 2026",
      headers: [
        "Karyawan",
        "Divisi",
        "Kualitas",
        "Produktivitas",
        "Kerja Tim",
        "Total",
        "Rating",
      ],
      rows: [
        ["Dina Prasetya", "Operasional", 4, 4, 5, 21, "Baik"],
        ["Rafi Mahendra", "HR", 5, 5, 4, 24, "Sangat Baik"],
        ["Sari Wulandari", "Keuangan", 3, 4, 4, 19, "Baik"],
        ["Budi Santoso", "Operasional", 4, 3, 3, 18, "Sesuai Ekspektasi"],
        ["Maya Anggraini", "Keuangan", 4, 4, 5, 22, "Baik"],
      ],
    },
    faq: [
      {
        question: "Kategori KPI apa saja yang dinilai?",
        answer: "5 kategori: Kualitas, Produktivitas, Kerja Tim, Inisiatif, dan Komunikasi. Setiap kategori dinilai 1-5.",
      },
      {
        question: "Bagaimana rating akhir dihitung?",
        answer: "Rumus otomatis menjumlahkan semua skor KPI dan memberikan label (Sangat Baik, Baik, Sesuai Ekspektasi, Perlu Perbaikan) berdasarkan rentang total.",
      },
      {
        question: "Bisakah kategori KPI diubah?",
        answer: "Ya, kolom KPI bisa disesuaikan dengan kerangka evaluasi perusahaan Anda. Cukup ganti nama kategori di header.",
      },
    ],
  },
  {
    slug: "employee-master-data",
    name: "Employee Master Data",
    category: "Employee",
    summary: "Informasi pribadi, kepegawaian, dan perbankan karyawan dalam satu tempat.",
    detail:
      "Direktori karyawan lengkap yang mencakup data pribadi, informasi kerja, rekening bank, dan identitas pemerintah. Sheet Statistics menyediakan rincian jumlah karyawan.",
    fileName: "peoplesheet-employee-master-data.xlsx",
    downloadLabel: "Unduh template data karyawan",
    sheets: ["Setup", "Employee Data", "Statistics"],
    features: [
      "Kolom data profil karyawan lengkap (17+ kolom)",
      "Dropdown tipe dan status kepegawaian",
      "Field nomor rekening, NPWP, dan BPJS",
      "Statistik dengan rumus COUNTIF untuk analisis jumlah karyawan",
    ],
    preview: [
      "Atur nama perusahaan dan tanggal data di Setup.",
      "Sheet Employee Data menyimpan data pribadi, kepegawaian, perbankan, dan identitas resmi.",
      "Sheet Statistics menyediakan jumlah karyawan per divisi, tipe, status, dan jenis kelamin.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Nama perusahaan, tanggal data",
      },
      {
        name: "Employee Data",
        description: "Profil karyawan lengkap dengan 17+ field per baris",
      },
      {
        name: "Statistics",
        description: "Rincian jumlah karyawan berbasis COUNTIF",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Dropdown untuk Jenis Kelamin, Tipe Kepegawaian, dan Status",
      "Kolom nomor NPWP dan BPJS untuk kepatuhan",
      "Statistik otomatis terupdate saat Anda menambah baris karyawan",
      "Gunakan file ini sebagai sumber data utama karyawan Anda",
    ],
    useCase: "Direktori dan data master karyawan terpusat",
    teamSize: "5–200 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
      ],
    },
    previewData: {
      title: "Data Karyawan",
      headers: [
        "No. Karyawan",
        "Nama",
        "Jenis Kelamin",
        "Divisi",
        "Posisi",
        "Tgl Masuk",
        "Tipe",
        "Status",
      ],
      rows: [
        ["EMP-001", "Dina Prasetya", "P", "Operasional", "Staf", "01 Mar 2024", "Tetap", "Aktif"],
        ["EMP-002", "Rafi Mahendra", "L", "HR", "Manajer", "15 Jun 2023", "Tetap", "Aktif"],
        ["EMP-003", "Sari Wulandari", "P", "Keuangan", "Analis", "01 Jan 2025", "Kontrak", "Aktif"],
        ["EMP-004", "Budi Santoso", "L", "Operasional", "Staf", "10 Nov 2025", "Kontrak", "Aktif"],
        ["EMP-005", "Maya Anggraini", "P", "Keuangan", "Supervisor", "01 Sep 2024", "Tetap", "Aktif"],
      ],
    },
    faq: [
      {
        question: "Data karyawan apa saja yang bisa disimpan?",
        answer: "17+ field: data pribadi, informasi kerja, rekening bank, NPWP, nomor BPJS, dan lainnya.",
      },
      {
        question: "Apakah ada statistik otomatis?",
        answer: "Ya, sheet Statistics menggunakan rumus COUNTIF untuk menampilkan jumlah karyawan per divisi, tipe, status, dan jenis kelamin.",
      },
      {
        question: "Bisa dipakai untuk compliance?",
        answer: "Template mencakup kolom NPWP dan BPJS untuk kepatuhan. Namun, selalu verifikasi data dengan sumber resmi.",
      },
    ],
  },
  {
    slug: "overtime-tracker",
    name: "Overtime Tracker",
    category: "Attendance",
    summary: "Lacak jam lembur dengan pengali tarif sesuai UU Ketenagakerjaan.",
    detail:
      "Catat lembur harian dengan perhitungan jam otomatis, pengali tarif sesuai hukum ketenagakerjaan Indonesia, dan rekap bulanan.",
    fileName: "peoplesheet-overtime-tracker.xlsx",
    downloadLabel: "Unduh template lembur",
    sheets: ["Setup", "Overtime Log", "Monthly Summary"],
    features: [
      "Tarif lembur sesuai UU Ketenagakerjaan",
      "Pengali tarif hari kerja, akhir pekan, dan hari libur",
      "Rumus otomatis jam dan bayaran lembur",
      "Rekap bulanan dengan rekap SUMIF",
    ],
    preview: [
      "Atur tarif lembur di Setup sesuai UU Ketenagakerjaan Indonesia.",
      "Sheet Overtime Log menghitung jam, menerapkan pengali tarif, dan menghitung bayaran lembur.",
      "Sheet Monthly Summary menggabungkan total jam dan bayaran per karyawan.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Bulan, pengali tarif lembur sesuai UU Ketenagakerjaan",
      },
      {
        name: "Overtime Log",
        description: "Entri lembur harian dengan bayaran otomatis",
      },
      {
        name: "Monthly Summary",
        description: "Total per karyawan berbasis SUMIF",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Pengali tarif sesuai UU 13/2003 (Ketenagakerjaan)",
      "Dropdown tipe hari (Hari Kerja, Akhir Pekan, Hari Libur)",
      "Dropdown status persetujuan",
      "Format mata uang Rupiah sudah diterapkan",
      "Disclaimer: verifikasi aturan lembur terbaru sebelum dipakai sebagai dasar kepatuhan.",
    ],
    useCase: "Pemantauan lembur dan perhitungan biaya bulanan",
    teamSize: "5–100 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "month",
          label: "Bulan",
          type: "month",
          default: currentMonthDefault,
        },
      ],
    },
    previewData: {
      title: "Log Lembur — Mei 2026",
      headers: [
        "Karyawan",
        "Tanggal",
        "Tipe Hari",
        "Jam",
        "Pengali",
        "Tarif/Jam",
        "Bayaran Lembur",
      ],
      rows: [
        ["Dina Prasetya", "05 May", "Hari Kerja", 2, 1.5, 42000, 126000],
        ["Sari Wulandari", "10 May", "Hari Kerja", 3, 1.5, 38000, 171000],
        ["Budi Santoso", "17 May", "Hari Kerja", 4, 1.5, 31000, 186000],
        ["Rafi Mahendra", "24 May", "Akhir Pekan", 4, 2.0, 67000, 536000],
        ["Maya Anggraini", "25 May", "Akhir Pekan", 2, 2.0, 35000, 140000],
      ],
    },
    faq: [
      {
        question: "Apakah pengali tarif lembur sesuai UU?",
        answer: "Ya. Mengikuti UU 13/2003 (Ketenagakerjaan): 1.5x hari kerja, 2x akhir pekan, dan pengali lebih tinggi untuk hari libur nasional.",
      },
      {
        question: "Bagaimana jam lembur dihitung?",
        answer: "Cukup isi jam mulai dan selesai. Rumus otomatis menghitung durasi lembur dalam jam desimal.",
      },
      {
        question: "Bisakah melihat total lembur bulanan?",
        answer: "Ya, sheet Monthly Summary merekap total jam dan bayaran lembur per karyawan menggunakan rumus SUMIF.",
      },
    ],
  },
  {
    slug: "turnover-tracker",
    name: "Turnover Tracker",
    category: "HR",
    summary: "Catat resign, lacak alasannya, dan hitung tingkat turnover per divisi.",
    detail:
      "Catat karyawan yang keluar dengan kategori alasan, catatan exit interview, dan status pengganti. Summary menyajikan metrik turnover berdasarkan divisi dan alasan.",
    fileName: "peoplesheet-turnover-tracker.xlsx",
    downloadLabel: "Unduh template turnover",
    sheets: ["Setup", "Resignation Log", "Summary"],
    features: [
      "Dropdown kategori alasan (6 kategori)",
      "Perhitungan masa kerja otomatis dari tanggal masuk hingga keluar",
      "Pelacakan status penggantian",
      "Rumus tingkat turnover per divisi",
    ],
    preview: [
      "Atur tahun dan daftar divisi di Setup.",
      "Sheet Resignation Log mencatat detail keluar, alasan, dan status penggantian.",
      "Sheet Summary menunjukkan jumlah turnover per divisi, per alasan, rata-rata masa kerja, dan tingkat turnover.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tahun, daftar divisi, referensi jumlah karyawan",
      },
      {
        name: "Resignation Log",
        description: "Detail keluar dengan rumus masa kerja dan dropdown alasan",
      },
      {
        name: "Summary",
        description: "Metrik turnover per divisi dan alasan",
      },
    ],
    operationalNotes: [
      "Kompatibel dengan Excel 2016+ dan Google Sheets",
      "Dropdown alasan: Gaji, Karir, Pribadi, Relokasi, Manajemen, Lainnya",
      "Masa kerja dihitung otomatis dalam bulan dari tanggal masuk hingga keluar",
      "Dropdown status penggantian: Kosong, Terisi, N/A",
      "Gunakan bersama data master karyawan untuk gambaran lengkap",
    ],
    useCase: "Pelacakan karyawan keluar dan analisis tren turnover",
    teamSize: "5–200 karyawan",
    customizations: {
      fields: [
        {
          key: "companyName",
          label: "Nama perusahaan",
          type: "text",
          default: "PT Contoh Indonesia",
          placeholder: "Contoh: PT Maju Jaya",
        },
        {
          key: "year",
          label: "Tahun",
          type: "year",
          default: 2026,
        },
      ],
    },
    previewData: {
      title: "Log Resign — 2026",
      headers: [
        "Karyawan",
        "Divisi",
        "Tgl Masuk",
        "Tgl Keluar",
        "Masa Kerja (bln)",
        "Alasan",
        "Penggantian",
      ],
      rows: [
        ["Andi Kurniawan", "Operasional", "15 Jan 2023", "28 Feb 2026", 37, "Karir", "Kosong"],
        ["Rina Sari", "Keuangan", "01 Aug 2024", "15 Mar 2026", 19, "Gaji", "Terisi"],
        ["Tono Widodo", "Operasional", "10 May 2025", "30 Apr 2026", 12, "Pribadi", "N/A"],
        ["Lestari Putri", "HR", "01 Dec 2023", "10 Jan 2026", 25, "Relokasi", "Terisi"],
        ["Hendra Wijaya", "Keuangan", "20 Mar 2024", "15 May 2026", 26, "Manajemen", "Kosong"],
      ],
    },
    faq: [
      {
        question: "Kategori alasan apa saja yang tersedia?",
        answer: "6 kategori dropdown: Gaji, Karir, Pribadi, Relokasi, Manajemen, dan Lainnya.",
      },
      {
        question: "Bagaimana masa kerja dihitung?",
        answer: "Rumus otomatis menghitung selisih antara tanggal masuk dan keluar dalam satuan bulan.",
      },
      {
        question: "Bisa melihat tingkat turnover per divisi?",
        answer: "Ya, sheet Summary menampilkan jumlah turnover per divisi, per alasan, rata-rata masa kerja, dan tingkat turnover.",
      },
    ],
  },
];

export const categories = Array.from(
  new Set(templates.map((template) => template.category)),
);

export function getTemplate(slug: string): TemplateProduct | undefined {
  return templates.find((template) => template.slug === slug);
}

export function getTemplateBySlug(slug: string): TemplateProduct | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return templates.map((t) => t.slug);
}
