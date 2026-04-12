import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Settings } from "lucide-react";

interface SettingsPanelProps {
  resorList: string[];
  setResorList: (v: string[]) => void;
  selectedResor: string;
  setSelectedResor: (v: string) => void;
  sektorList: string[];
  setSektorList: (v: string[]) => void;
  selectedSektor: string;
  setSelectedSektor: (v: string) => void;
  unitKerjaList: string[];
  setUnitKerjaList: (v: string[]) => void;
  selectedUnitKerja: string;
  setSelectedUnitKerja: (v: string) => void;
  jabatanList: string[];
  setJabatanList: (v: string[]) => void;
  selectedJabatan: string;
  setSelectedJabatan: (v: string) => void;
  pangkatList: string[];
  setPangkatList: (v: string[]) => void;
  selectedPangkat: string;
  setSelectedPangkat: (v: string) => void;
  nrpList: string[];
  setNrpList: (v: string[]) => void;
  selectedNrp: string;
  setSelectedNrp: (v: string) => void;
  namaList: string[];
  setNamaList: (v: string[]) => void;
  selectedNama: string;
  setSelectedNama: (v: string) => void;
}

function DropdownWithAdd({
  label,
  items,
  setItems,
  selected,
  setSelected,
  uppercase = true,
}: {
  label: string;
  items: string[];
  setItems: (v: string[]) => void;
  selected: string;
  setSelected: (v: string) => void;
  uppercase?: boolean;
}) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    const trimmed = uppercase ? newItem.trim().toUpperCase() : newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      const updated = [...items, trimmed];
      setItems(updated);
      setSelected(trimmed);
      setNewItem("");
    }
  };

  const handleRemove = (item: string) => {
    const updated = items.filter((i) => i !== item);
    setItems(updated);
    if (selected === item && updated.length > 0) setSelected(updated[0]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Tambah ${label.toLowerCase()}...`}
          className="text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button size="sm" onClick={handleAdd} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {item}
              <button onClick={() => handleRemove(item)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export { DropdownWithAdd };

export function SettingsPanel(props: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-primary" />
          Pengaturan Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Kop Surat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DropdownWithAdd
            label="Resor"
            items={props.resorList}
            setItems={props.setResorList}
            selected={props.selectedResor}
            setSelected={props.setSelectedResor}
          />
          <DropdownWithAdd
            label="Sektor"
            items={props.sektorList}
            setItems={props.setSektorList}
            selected={props.selectedSektor}
            setSelected={props.setSelectedSektor}
          />
          <DropdownWithAdd
            label="Unit Kerja"
            items={props.unitKerjaList}
            setItems={props.setUnitKerjaList}
            selected={props.selectedUnitKerja}
            setSelected={props.setSelectedUnitKerja}
          />
        </div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Pejabat Tanda Tangan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DropdownWithAdd
            label="Jabatan"
            items={props.jabatanList}
            setItems={props.setJabatanList}
            selected={props.selectedJabatan}
            setSelected={props.setSelectedJabatan}
          />
          <DropdownWithAdd
            label="Pangkat"
            items={props.pangkatList}
            setItems={props.setPangkatList}
            selected={props.selectedPangkat}
            setSelected={props.setSelectedPangkat}
          />
          <DropdownWithAdd
            label="Nama"
            items={props.namaList}
            setItems={props.setNamaList}
            selected={props.selectedNama}
            setSelected={props.setSelectedNama}
          />
          <DropdownWithAdd
            label="NRP"
            items={props.nrpList}
            setItems={props.setNrpList}
            selected={props.selectedNrp}
            setSelected={props.setSelectedNrp}
            uppercase={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
