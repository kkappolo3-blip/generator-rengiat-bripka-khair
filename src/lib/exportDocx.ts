import type { DailyEntry } from "./reportGenerator";

interface ExportSettings {
  resor: string;
  sektor: string;
  unitKerja: string;
  jabatan: string;
  pangkat: string;
  nrp: string;
  nama: string;
}

const BULAN_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatTanggal(d: Date): string {
  return `${d.getDate()} ${BULAN_NAMES[d.getMonth() + 1]} ${d.getFullYear()}`;
}

export async function exportToDocx(entries: DailyEntry[], settings: ExportSettings) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, WidthType, BorderStyle, PageBreak,
  } = await import("docx");

  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  function createCell(text: string, width: number, opts?: { bold?: boolean; alignment?: (typeof AlignmentType)["CENTER"] }) {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      children: [new Paragraph({
        alignment: opts?.alignment || AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, size: 20, font: "Arial", bold: opts?.bold })],
      })],
    });
  }

  function buildPage(entry: DailyEntry, isLast: boolean) {
    const elements: (typeof Paragraph extends new (...args: infer _) => infer R ? R : never)[] = [];

    const kopLines = [
      "KEPOLISIAN NEGARA REPUBLIK INDONESIA",
      `RESOR ${settings.resor}`,
      `SEKTOR ${settings.sektor}`,
    ];
    for (const line of kopLines) {
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: line, bold: true, size: 24, font: "Arial" })],
      }));
    }

    elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({
        text: `RENCANA KEGIATAN HARIAN ${settings.unitKerja}`,
        bold: true, underline: {}, size: 24, font: "Arial",
      })],
    }));

    const headerRow = new TableRow({
      children: [
        createCell("NO", 600, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("JAM", 1200, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("HARI", 1000, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("BENTUK KEGIATAN", 2400, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("SASARAN", 1800, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("HASIL YANG DICAPAI", 2200, { bold: true, alignment: AlignmentType.CENTER }),
        createCell("KUAT PERSONEL", 1160, { bold: true, alignment: AlignmentType.CENTER }),
      ],
    });

    const dataRows = entry.kegiatan.map((k, idx) => new TableRow({
      children: [
        createCell(String(idx + 1), 600, { alignment: AlignmentType.CENTER }),
        createCell(k.jam, 1200, { alignment: AlignmentType.CENTER }),
        createCell(idx === 0 ? entry.hari : "", 1000, { alignment: AlignmentType.CENTER }),
        createCell(k.nama, 2400),
        createCell(k.sasaran, 1800),
        createCell(k.hasil, 2200),
        createCell(k.personel, 1160, { alignment: AlignmentType.CENTER }),
      ],
    }));

    elements.push(new Table({
      width: { size: 10360, type: WidthType.DXA },
      columnWidths: [600, 1200, 1000, 2400, 1800, 2200, 1160],
      rows: [headerRow, ...dataRows],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);

    elements.push(new Paragraph({ spacing: { before: 400 }, children: [] }));
    elements.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `Tolinggula, ${formatTanggal(entry.tanggal)}`, size: 22, font: "Arial" })],
    }));
    elements.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 40 },
      children: [new TextRun({ text: settings.jabatan, size: 22, font: "Arial" })],
    }));
    elements.push(new Paragraph({ spacing: { before: 600 }, children: [] }));
    elements.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `${settings.pangkat} ${settings.nama}`, bold: true, underline: {}, size: 22, font: "Arial" })],
    }));
    elements.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 40 },
      children: [new TextRun({ text: `NRP. ${settings.nrp}`, size: 20, font: "Arial" })],
    }));

    if (!isLast) {
      elements.push(new Paragraph({ children: [new PageBreak()] }));
    }

    return elements;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allChildren: any[] = [];
  entries.forEach((entry, idx) => {
    allChildren.push(...buildPage(entry, idx === entries.length - 1));
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: undefined },
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: allChildren,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const month = entries[0].tanggal.getMonth() + 1;
  const year = entries[0].tanggal.getFullYear();
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan_Kegiatan_Harian_${BULAN_NAMES[month]}_${year}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
