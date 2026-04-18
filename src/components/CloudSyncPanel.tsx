import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Cloud, CloudUpload, CloudDownload, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Daftar semua key localStorage yang dibackup
const SYNCED_KEYS = [
  "resorList", "selectedResor",
  "sektorList", "selectedSektor",
  "unitKerjaList", "selectedUnitKerja",
  "jabatanList", "selectedJabatan",
  "pangkatList", "selectedPangkat",
  "nrpList", "selectedNrp",
  "namaList", "selectedNama",
  "activityDatabase",
];

function collectLocalData(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of SYNCED_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) {
      try { out[k] = JSON.parse(v); } catch { out[k] = v; }
    }
  }
  return out;
}

function applyLocalData(data: Record<string, unknown>) {
  for (const k of SYNCED_KEYS) {
    if (k in data) {
      localStorage.setItem(k, JSON.stringify(data[k]));
    }
  }
}

export function CloudSyncPanel() {
  const [cloudCode, setCloudCode] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cloudCode");
    if (saved) setCloudCode(saved);
    const ts = localStorage.getItem("cloudCodeLastSaved");
    if (ts) setLastSaved(ts);
  }, []);

  const persistCode = (code: string) => {
    setCloudCode(code);
    localStorage.setItem("cloudCode", code);
  };

  const validCode = cloudCode.trim().length >= 4;

  const handleSave = async () => {
    const code = cloudCode.trim();
    if (code.length < 4) {
      toast.error("Kode Cloud minimal 4 karakter");
      return;
    }
    setSaving(true);
    try {
      const data = collectLocalData();
      const { error } = await supabase
        .from("cloud_backups")
        .upsert({ cloud_code: code, data: data as never, updated_at: new Date().toISOString() });
      if (error) throw error;
      const ts = new Date().toLocaleString("id-ID");
      localStorage.setItem("cloudCodeLastSaved", ts);
      setLastSaved(ts);
      toast.success("Data berhasil disimpan ke Cloud");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan ke Cloud", { description: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    const code = cloudCode.trim();
    if (code.length < 4) {
      toast.error("Masukkan Kode Cloud dulu");
      return;
    }
    if (!confirm("Memuat dari Cloud akan MENIMPA semua data lokal saat ini. Lanjutkan?")) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cloud_backups")
        .select("data, updated_at")
        .eq("cloud_code", code)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error("Kode Cloud tidak ditemukan");
        return;
      }
      applyLocalData(data.data as Record<string, unknown>);
      const ts = new Date(data.updated_at).toLocaleString("id-ID");
      localStorage.setItem("cloudCodeLastSaved", ts);
      toast.success("Data berhasil dimuat. Halaman akan dimuat ulang...");
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat dari Cloud", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cloud className="h-5 w-5 text-primary" />
          Sinkronisasi Cloud (Opsional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Aplikasi tetap berjalan offline. Gunakan tombol di bawah untuk mencadangkan
          atau memulihkan data dari Cloud sehingga bisa diakses dari perangkat lain.
        </p>

        <div className="space-y-2">
          <Label htmlFor="cloud-code">Kode Cloud Anda</Label>
          <Input
            id="cloud-code"
            value={cloudCode}
            onChange={(e) => persistCode(e.target.value)}
            placeholder="Contoh: KHAIR-POLSEK-2025"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Buat sendiri kode unik & sulit ditebak. Gunakan kode yang sama di perangkat lain untuk memuat data.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={!validCode || saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
            Simpan ke Cloud
          </Button>
          <Button onClick={handleLoad} disabled={!validCode || loading} variant="outline" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}
            Muat dari Cloud
          </Button>
        </div>

        {lastSaved && (
          <p className="text-xs text-muted-foreground">
            Terakhir disinkronkan: <span className="font-medium text-foreground">{lastSaved}</span>
          </p>
        )}

        <div className="flex gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
          <p>
            <strong>Penting:</strong> Karena tidak ada login, siapapun yang tahu Kode Cloud Anda
            bisa membaca dan menimpa data. Jaga kerahasiaan kode dan gunakan kombinasi yang sulit ditebak.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
