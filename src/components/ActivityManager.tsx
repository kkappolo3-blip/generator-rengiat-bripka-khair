import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Database } from "lucide-react";
import type { Activity } from "@/lib/activityDatabase";

interface ActivityManagerProps {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
}

export function ActivityManager({ activities, setActivities }: ActivityManagerProps) {
  const [nama, setNama] = useState("");
  const [sasaran, setSasaran] = useState("");
  const [hasil, setHasil] = useState("");
  const [personel, setPersonel] = useState("1 Orang");

  const handleAdd = () => {
    if (!nama.trim() || !sasaran.trim() || !hasil.trim()) return;
    const newActivity: Activity = {
      nama: nama.trim(),
      sasaran: sasaran.trim(),
      hasil: hasil.trim(),
      personel: personel.trim(),
    };
    setActivities([...activities, newActivity]);
    setNama("");
    setSasaran("");
    setHasil("");
    setPersonel("1 Orang");
  };

  const handleRemove = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-primary" />
          Database Kegiatan ({activities.length} kegiatan)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border border-border rounded-lg p-4 bg-accent/30">
          <div className="space-y-1">
            <Label className="text-xs">Nama Kegiatan</Label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kegiatan..." className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sasaran</Label>
            <Input value={sasaran} onChange={(e) => setSasaran(e.target.value)} placeholder="Sasaran..." className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hasil</Label>
            <Input value={hasil} onChange={(e) => setHasil(e.target.value)} placeholder="Hasil yang dicapai..." className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Personel</Label>
            <Input value={personel} onChange={(e) => setPersonel(e.target.value)} placeholder="1 Orang" className="text-sm" />
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        {/* List */}
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-secondary">
                <th className="border border-border px-3 py-2 text-left">No</th>
                <th className="border border-border px-3 py-2 text-left">Kegiatan</th>
                <th className="border border-border px-3 py-2 text-left">Sasaran</th>
                <th className="border border-border px-3 py-2 text-left">Hasil</th>
                <th className="border border-border px-3 py-2 text-left">Personel</th>
                <th className="border border-border px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, idx) => (
                <tr key={idx} className="hover:bg-accent/50">
                  <td className="border border-border px-3 py-1.5 text-center">{idx + 1}</td>
                  <td className="border border-border px-3 py-1.5">{act.nama}</td>
                  <td className="border border-border px-3 py-1.5">{act.sasaran}</td>
                  <td className="border border-border px-3 py-1.5">{act.hasil}</td>
                  <td className="border border-border px-3 py-1.5">{act.personel}</td>
                  <td className="border border-border px-1 py-0.5 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(idx)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
