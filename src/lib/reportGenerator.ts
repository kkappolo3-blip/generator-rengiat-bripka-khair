import { MANDATORY_ACTIVITY, getRandomActivities, type Activity } from "./activityDatabase";

export interface DailyEntry {
  id: string;
  tanggal: Date;
  hari: string;
  kegiatan: {
    jam: string;
    nama: string;
    sasaran: string;
    hasil: string;
    personel: string;
  }[];
}

const HARI_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const JAM_OPTIONS = [
  "08.00 - 09.00", "09.00 - 10.00", "10.00 - 11.00",
  "11.00 - 12.00", "13.00 - 14.00", "14.00 - 15.00", "15.00 - 16.00",
];

function getRandomJam(): string {
  return JAM_OPTIONS[Math.floor(Math.random() * JAM_OPTIONS.length)];
}

export function generateMonthlyData(month: number, year: number): DailyEntry[] {
  const entries: DailyEntry[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const randomActivities = getRandomActivities(3);
    const usedJams = new Set<string>();
    
    const kegiatan = [
      {
        jam: MANDATORY_ACTIVITY.jam,
        nama: MANDATORY_ACTIVITY.nama,
        sasaran: MANDATORY_ACTIVITY.sasaran,
        hasil: MANDATORY_ACTIVITY.hasil,
        personel: MANDATORY_ACTIVITY.personel,
      },
      ...randomActivities.map((act: Activity) => {
        let jam = getRandomJam();
        while (usedJams.has(jam)) jam = getRandomJam();
        usedJams.add(jam);
        return {
          jam,
          nama: act.nama,
          sasaran: act.sasaran,
          hasil: act.hasil,
          personel: act.personel,
        };
      }),
    ];

    entries.push({
      id: `${year}-${month}-${day}`,
      tanggal: date,
      hari: HARI_NAMES[dayOfWeek],
      kegiatan,
    });
  }

  return entries;
}
