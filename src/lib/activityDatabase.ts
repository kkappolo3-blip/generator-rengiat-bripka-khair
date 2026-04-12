export interface Activity {
  nama: string;
  sasaran: string;
  hasil: string;
  personel: string;
}

export const MANDATORY_ACTIVITY: Activity & { jam: string } = {
  nama: "Apel Pagi dan Anev Kinerja",
  sasaran: "Personel Polsek",
  hasil: "Terlaksananya apel pagi dan evaluasi kinerja",
  jam: "07.00 - 08.00",
  personel: "15 Orang",
};

export const ACTIVITY_DATABASE: Activity[] = [
  { nama: "Sambang Tokoh Masyarakat", sasaran: "Tokoh Masyarakat Desa", hasil: "Terjalinnya sinergitas antara Polri dan tokoh masyarakat", personel: "1 Orang" },
  { nama: "Pembinaan Pengamanan Swakarsa", sasaran: "Petugas Satpam/Linmas", hasil: "Meningkatnya kemampuan teknis pengamanan swakarsa", personel: "1 Orang" },
  { nama: "Sosialisasi Bahaya Narkoba", sasaran: "Remaja/Karang Taruna", hasil: "Tumbuhnya kesadaran masyarakat akan bahaya narkoba", personel: "1 Orang" },
  { nama: "Monitoring Program Ketahanan Pangan", sasaran: "Kelompok Tani", hasil: "Terdatanya perkembangan program ketahanan pangan", personel: "1 Orang" },
  { nama: "Pengecekan Kelengkapan Pos Kamling", sasaran: "Sarana Prasarana Pos Kamling", hasil: "Pos Kamling aktif dan berfungsi dengan baik", personel: "1 Orang" },
  { nama: "Problem Solving / Mediasi Warga", sasaran: "Warga yang berselisih", hasil: "Tercapainya kesepakatan damai antar warga", personel: "1 Orang" },
  { nama: "Sambang Kantor Desa/Kecamatan", sasaran: "Kepala Desa & Staf", hasil: "Sinkronisasi data dan informasi kamtibmas", personel: "1 Orang" },
  { nama: "Program Jumat Curhat", sasaran: "Jamaah Masjid", hasil: "Terserapnya keluhan dan aspirasi warga", personel: "1 Orang" },
  { nama: "Patroli Dialogis", sasaran: "Warga Pemukiman", hasil: "Terpantaunya situasi keamanan lingkungan", personel: "2 Orang" },
  { nama: "Pengamanan Kegiatan Masyarakat", sasaran: "Peserta Kegiatan", hasil: "Terjaminnya keamanan dan ketertiban kegiatan", personel: "2 Orang" },
  { nama: "Penyuluhan Hukum", sasaran: "Warga Desa", hasil: "Meningkatnya kesadaran hukum masyarakat", personel: "1 Orang" },
  { nama: "Pembinaan FKPM", sasaran: "Anggota FKPM", hasil: "Aktifnya forum kemitraan polisi dan masyarakat", personel: "1 Orang" },
  { nama: "Door to Door System (DDS)", sasaran: "Warga RT/RW", hasil: "Terjalinnya komunikasi yang baik dengan warga", personel: "1 Orang" },
  { nama: "Monitoring Tempat Hiburan Malam", sasaran: "Pemilik/Pengelola THM", hasil: "Terciptanya ketertiban di tempat hiburan", personel: "2 Orang" },
  { nama: "Edukasi Lalu Lintas", sasaran: "Pengguna Jalan", hasil: "Meningkatnya kesadaran tertib berlalu lintas", personel: "1 Orang" },
  { nama: "Sambang Sekolah", sasaran: "Siswa dan Guru", hasil: "Terciptanya lingkungan sekolah yang aman", personel: "1 Orang" },
  { nama: "Monitoring Rumah Ibadah", sasaran: "Pengurus Rumah Ibadah", hasil: "Terjaminnya keamanan tempat ibadah", personel: "1 Orang" },
  { nama: "Koordinasi dengan Babinsa", sasaran: "Babinsa Wilayah", hasil: "Sinkronisasi program kamtibmas dan hankam", personel: "1 Orang" },
];

export function getRandomActivities(count: number): Activity[] {
  const shuffled = [...ACTIVITY_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
