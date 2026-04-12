import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Download, Undo2 } from "lucide-react";
import type { DailyEntry } from "@/lib/reportGenerator";

const BULAN_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

interface PreviewTableProps {
  entries: DailyEntry[];
  setEntries: (entries: DailyEntry[]) => void;
  onExport: () => void;
}

export function PreviewTable({ entries, setEntries, onExport }: PreviewTableProps) {
  const [history, setHistory] = useState<DailyEntry[][]>([]);

  const handleDelete = useCallback((id: string) => {
    setHistory((prev) => [...prev, entries]);
    setEntries(entries.filter((e) => e.id !== id));
  }, [entries, setEntries]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setEntries(prev);
  }, [history, setEntries]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-3 opacity-40" />
          <p>Belum ada data. Silakan generate data terlebih dahulu.</p>
        </CardContent>
      </Card>
    );
  }

  const month = entries[0].tanggal.getMonth() + 1;
  const year = entries[0].tanggal.getFullYear();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Preview: {BULAN_NAMES[month]} {year} ({entries.length} hari)
        </CardTitle>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleUndo} className="gap-1.5">
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
          )}
          <Button onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Word
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border px-3 py-2 text-left">Tanggal</th>
                <th className="border border-border px-3 py-2 text-left">Hari</th>
                <th className="border border-border px-3 py-2 text-left">Jam</th>
                <th className="border border-border px-3 py-2 text-left">Kegiatan</th>
                <th className="border border-border px-3 py-2 text-left">Sasaran</th>
                <th className="border border-border px-3 py-2 text-left">Hasil</th>
                <th className="border border-border px-3 py-2 text-left">Personel</th>
                <th className="border border-border px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) =>
                entry.kegiatan.map((k, kIdx) => (
                  <tr
                    key={`${entry.id}-${kIdx}`}
                    className={kIdx === 0 ? "border-t-2 border-border" : ""}
                  >
                    {kIdx === 0 && (
                      <>
                        <td className="border border-border px-3 py-1.5 font-medium bg-accent" rowSpan={entry.kegiatan.length}>
                          {entry.tanggal.getDate()}
                        </td>
                        <td className="border border-border px-3 py-1.5 bg-accent" rowSpan={entry.kegiatan.length}>
                          {entry.hari}
                        </td>
                      </>
                    )}
                    <td className="border border-border px-3 py-1.5 text-xs">{k.jam}</td>
                    <td className="border border-border px-3 py-1.5 text-xs">{k.nama}</td>
                    <td className="border border-border px-3 py-1.5 text-xs">{k.sasaran}</td>
                    <td className="border border-border px-3 py-1.5 text-xs">{k.hasil}</td>
                    <td className="border border-border px-3 py-1.5 text-xs">{k.personel}</td>
                    {kIdx === 0 && (
                      <td className="border border-border px-1 py-0.5 text-center" rowSpan={entry.kegiatan.length}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
