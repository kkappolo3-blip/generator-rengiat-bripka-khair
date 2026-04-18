
User wants:
- Keep app working offline (localStorage tetap jadi sumber utama)
- Tambah tombol "Simpan ke Cloud" untuk backup ke database
- Tambah tombol "Muat dari Cloud" untuk restore dari database
- TANPA login — jadi perlu identifier lain (kode/PIN buatan user) supaya data tidak tercampur antar user

Strategi tanpa login:
User membuat **Kode Cloud** sendiri (misal "KHAIR-2025"). Kode ini disimpan di localStorage. Saat klik Simpan → semua data dikirim ke Cloud dengan kode tsb sebagai key. Saat klik Muat → masukkan kode → data ditarik dari Cloud.

⚠️ Catatan keamanan penting: tanpa login, siapapun yang tahu Kode Cloud bisa baca/timpa data. Karena ini cuma data daftar nama/aktivitas (bukan rahasia kritis), trade-off ini wajar — tapi user harus diberitahu agar pakai kode yang sulit ditebak.

# Rencana Implementasi

## 1. Aktifkan Lovable Cloud
Backend Supabase otomatis tersedia.

## 2. Buat tabel database
Satu tabel `cloud_backups`:
- `cloud_code` (text, primary key) — kode unik buatan user
- `data` (jsonb) — berisi semua settings + activities
- `updated_at` (timestamptz)

RLS: karena tanpa login, akses publik dengan policy "siapa saja bisa SELECT/INSERT/UPDATE berdasarkan cloud_code". Risiko diterima karena tanpa auth.

## 3. Komponen baru: `CloudSyncPanel.tsx`
Card baru di atas SettingsPanel berisi:
- Input "Kode Cloud Anda" (disimpan di localStorage key `cloudCode`)
- Tombol **Simpan ke Cloud** — upload semua data (resorList, sektorList, …, activities, semua selected*)
- Tombol **Muat dari Cloud** — download data, overwrite localStorage, reload halaman
- Indikator status: "Terakhir disimpan: …"
- Peringatan: "Jaga kerahasiaan kode Anda. Siapapun yang tahu kode bisa akses data."

## 4. Logic sync
- **Simpan**: kumpulkan semua nilai dari localStorage → upsert ke `cloud_backups` by `cloud_code`
- **Muat**: select by `cloud_code` → tulis ulang semua key localStorage → `window.location.reload()` agar UI refresh

## 5. Tetap offline-first
Tidak ada perubahan pada `useLocalStorage` — app tetap baca/tulis localStorage seperti biasa. Cloud hanya manual via tombol.

## Struktur file yang berubah
```text
src/
├── components/
│   └── CloudSyncPanel.tsx          (baru)
├── integrations/supabase/          (auto-generated saat enable Cloud)
└── routes/index.tsx                (tambah <CloudSyncPanel /> di atas SettingsPanel)
```

## Catatan untuk user (non-teknis)
- Data tetap jalan offline seperti sekarang
- Anda buat sendiri "Kode Cloud" (contoh: `KHAIR-POLSEK-2025`)
- Klik **Simpan ke Cloud** kapanpun ingin backup
- Di perangkat lain: masukkan kode yang sama → klik **Muat dari Cloud** → data muncul
- ⚠️ Karena tanpa login, jangan share kode ke orang lain
