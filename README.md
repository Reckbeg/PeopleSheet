# PeopleSheet

Template spreadsheet HR siap pakai untuk tim Indonesia.

PeopleSheet adalah perpustakaan template HR yang ringan dan mengutamakan privasi. Tidak perlu database karyawan. Tidak perlu login. Tidak perlu HRIS. Cukup download file XLSX yang sudah jadi dan isi dengan data Anda sendiri.

## Template

9 template HR lengkap, masing-masing dengan data contoh, rumus, dan validasi dropdown:

| Template | Sheet | Deskripsi |
|----------|-------|-----------|
| Attendance Tracker | 3 | Matriks presensi bulanan dengan tanggal otomatis dan sorotan akhir pekan |
| Leave Tracker | 3 | Hak cuti tahunan, log penggunaan, rumus saldo |
| PPh21 Tax Calculator | 4 | Kalkulator pajak penghasilan dengan tarif progresif dan status PTKP |
| THR Tracker | 3 | Kelayakan, perhitungan, dan status pembayaran THR |
| BPJS Tracker | 3 | Iuran BPJS Kesehatan dan Ketenagakerjaan untuk karyawan dan perusahaan |
| Performance Review | 3 | Evaluasi kinerja dengan penilaian KPI dan rating otomatis |
| Employee Master Data | 3 | Data pribadi, kepegawaian, dan karyawan dalam satu tempat |
| Overtime Tracker | 3 | Jam lembur dengan pengali tarif sesuai UU Ketenagakerjaan |
| Turnover Tracker | 3 | Catat resign, lacak alasan, hitung tingkat turnover per divisi |

## Fitur

- 🎨 **Semi-Customization** — Sesuaikan template sebelum download (tahun, hak cuti, periode THR, dll)
- 🇮🇩 **Bahasa Indonesia** — Semua UI dan konten dalam bahasa Indonesia untuk UMKM
- 🔒 **Privacy-first** — Template dibuat di memori server. Tidak ada data yang disimpan atau dikirim.
- 📊 **Spreadsheet-native** — Setiap template dirancang untuk Excel dan Google Sheets.
- 💼 **Konteks Indonesia** — Format Rupiah, tarif PPh21, iuran BPJS, cuti tahunan.
- ♿ **Aksesibel** — Focus trap, aria labels, navigasi keyboard
- 🧪 **Tested** — 7 unit test untuk semua template

## Customization

Setiap template mendukung kustomisasi sebelum download:

- **Attendance Tracker** — Nama perusahaan, bulan
- **Leave Tracker** — Tahun, hak cuti tahunan default
- **PPh21 Tax Calculator** — Tahun pajak
- **THR Tracker** — Tahun THR
- **BPJS Tracker** — Tahun
- **Performance Review** — Periode evaluasi
- **Employee Master Data** — Nama perusahaan
- **Overtime Tracker** — Bulan
- **Turnover Tracker** — Tahun

Cukup klik "Sesuaikan" pada template, atur parameter, lalu klik "Buat & Unduh".

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ExcelJS untuk generasi XLSX
- Vitest untuk testing

## Quick Start

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Tidak perlu environment variables.

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm test           # Vitest (7 tests)
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                         → Landing page (Indonesian)
│   └── templates/[slug]/
│       └── download/route.ts            → XLSX download API (accepts customization params)
├── components/
│   ├── customize-modal.tsx              → Customization modal (focus trap, accessibility)
│   ├── download-button.tsx              → Download button with error handling
│   └── spreadsheet-preview.tsx          → Preview table component
└── lib/
    ├── templates.ts                     → Template catalog + customization configs
    ├── templates.test.ts                → Unit tests (7)
    └── xlsx/
        └── templates.ts                 → ExcelJS workbook builders (all 9 templates)
```

## Filosofi

- **Privasi di atas segalanya** — Tidak ada database, tidak ada tracking, tidak ada akun.
- **Spreadsheet adalah source of truth** — Data karyawan tetap di tangan Anda.
- **Praktis untuk HR Indonesia** — Format Rupiah, regulasi lokal, konteks UMKM.
- **Terbuka dan gratis** — Open-source, gratis selamanya.

## License

MIT — Made with 🐱 for Indonesian HR teams
