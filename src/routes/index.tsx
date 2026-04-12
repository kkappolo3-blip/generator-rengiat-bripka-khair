import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, Zap, Shield } from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PreviewTable } from "@/components/PreviewTable";
import { ActivityManager } from "@/components/ActivityManager";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { generateMonthlyData, type DailyEntry } from "@/lib/reportGenerator";
import { exportToDocx } from "@/lib/exportDocx";
import { DEFAULT_ACTIVITIES, type Activity } from "@/lib/activityDatabase";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Generator Laporan Kegiatan Harian Bhabinkamtibmas" },
      { name: "description", content: "Aplikasi generator laporan kegiatan harian Bhabinkamtibmas otomatis dengan export ke Word (.docx)" },
    ],
  }),
});

const BULAN_OPTIONS = [
  { value: "1", label: "Januari" }, { value: "2", label: "Februari" },
  { value: "3", label: "Maret" }, { value: "4", label: "April" },
  { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
  { value: "7", label: "Juli" }, { value: "8", label: "Agustus" },
  { value: "9", label: "September" }, { value: "10", label: "Oktober" },
  { value: "11", label: "November" }, { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

function Index() {
  // Settings with localStorage
  const [resorList, setResorList] = useLocalStorage("resorList", ["GORONTALO UTARA"]);
  const [selectedResor, setSelectedResor] = useLocalStorage("selectedResor", "GORONTALO UTARA");
  const [sektorList, setSektorList] = useLocalStorage("sektorList", ["TOLINGGULA"]);
  const [selectedSektor, setSelectedSektor] = useLocalStorage("selectedSektor", "TOLINGGULA");
  const [unitKerjaList, setUnitKerjaList] = useLocalStorage("unitKerjaList", ["POLSEK TOLINGGULA"]);
  const [selectedUnitKerja, setSelectedUnitKerja] = useLocalStorage("selectedUnitKerja", "POLSEK TOLINGGULA");
  const [jabatanList, setJabatanList] = useLocalStorage("jabatanList", ["KANIT BINMAS"]);
  const [selectedJabatan, setSelectedJabatan] = useLocalStorage("selectedJabatan", "KANIT BINMAS");
  const [pangkatList, setPangkatList] = useLocalStorage("pangkatList", ["BRIPKA"]);
  const [selectedPangkat, setSelectedPangkat] = useLocalStorage("selectedPangkat", "BRIPKA");
  const [nrpList, setNrpList] = useLocalStorage("nrpList", ["12345678"]);
  const [selectedNrp, setSelectedNrp] = useLocalStorage("selectedNrp", "12345678");
  const [namaList, setNamaList] = useLocalStorage("namaList", ["MOHAMAD KHAIR"]);
  const [selectedNama, setSelectedNama] = useLocalStorage("selectedNama", "MOHAMAD KHAIR");

  // Activity database
  const [activities, setActivities] = useLocalStorage<Activity[]>("activityDatabase", DEFAULT_ACTIVITIES);

  // Generator state
  const [bulan, setBulan] = useState(String(new Date().getMonth() + 1));
  const [tahun, setTahun] = useState(String(currentYear));
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  const handleGenerate = () => {
    const data = generateMonthlyData(Number(bulan), Number(tahun), activities);
    setEntries(data);
  };

  const handleExport = () => {
    if (entries.length === 0) return;
    exportToDocx(entries, {
      resor: selectedResor,
      sektor: selectedSektor,
      unitKerja: selectedUnitKerja,
      jabatan: selectedJabatan,
      pangkat: selectedPangkat,
      nrp: selectedNrp,
      nama: selectedNama,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Generator Laporan Kegiatan Harian</h1>
              <p className="text-sm text-muted-foreground">Bhabinkamtibmas — Otomatis & Cepat</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <SettingsPanel
          resorList={resorList} setResorList={setResorList}
          selectedResor={selectedResor} setSelectedResor={setSelectedResor}
          sektorList={sektorList} setSektorList={setSektorList}
          selectedSektor={selectedSektor} setSelectedSektor={setSelectedSektor}
          unitKerjaList={unitKerjaList} setUnitKerjaList={setUnitKerjaList}
          selectedUnitKerja={selectedUnitKerja} setSelectedUnitKerja={setSelectedUnitKerja}
          jabatanList={jabatanList} setJabatanList={setJabatanList}
          selectedJabatan={selectedJabatan} setSelectedJabatan={setSelectedJabatan}
          pangkatList={pangkatList} setPangkatList={setPangkatList}
          selectedPangkat={selectedPangkat} setSelectedPangkat={setSelectedPangkat}
          nrpList={nrpList} setNrpList={setNrpList}
          selectedNrp={selectedNrp} setSelectedNrp={setSelectedNrp}
          namaList={namaList} setNamaList={setNamaList}
          selectedNama={selectedNama} setSelectedNama={setSelectedNama}
        />

        <ActivityManager activities={activities} setActivities={setActivities} />

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Generate Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Bulan</Label>
                <Select value={bulan} onValueChange={setBulan}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BULAN_OPTIONS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select value={tahun} onValueChange={setTahun}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAHUN_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} className="gap-2">
                <Zap className="h-4 w-4" />
                Generate Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <PreviewTable entries={entries} setEntries={setEntries} onExport={handleExport} />
      </main>
    </div>
  );
}
