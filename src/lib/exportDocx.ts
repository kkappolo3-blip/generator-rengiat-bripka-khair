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

const HARI_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function formatTanggal(d: Date): string {
  return `${d.getDate()} ${BULAN_NAMES[d.getMonth() + 1]} ${d.getFullYear()}`;
}

function getWeekOfMonth(d: Date): number {
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const dayOfMonth = d.getDate();
  const firstDayOfWeek = firstDay.getDay();
  // Adjust so Monday = 0
  const adjustedFirst = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
  return Math.ceil((dayOfMonth + adjustedFirst) / 7);
}

export async function exportToDocx(entries: DailyEntry[], settings: ExportSettings) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, WidthType, BorderStyle, PageBreak,
  } = await import("docx");

  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

  function createCell(text: string, width: number, opts?: { bold?: boolean; alignment?: (typeof AlignmentType)["CENTER"] }) {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      children: [new Paragraph({
        alignment: opts?.alignment || AlignmentType.JUSTIFIED,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, size: 20, font: "Arial", bold: opts?.bold })],
      })],
    });
  }

  function buildPage(entry: DailyEntry, isLast: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elements: any[] = [];

    // --- KOP SURAT: Top-left, centered text within a box, underline at bottom ---
    const kopLines = [
      "KEPOLISIAN NEGARA REPUBLIK INDONESIA",
      `RESOR ${settings.resor}`,
      `SEKTOR ${settings.sektor}`,
    ];

    // Use a table to position kop at top-left with centered text inside
    const kopWidth = 5800; // Width enough for longest kop text
    const kopParagraphs = kopLines.map((line, i) => new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: i === kopLines.length - 1 ? 0 : 20 },
      children: [new TextRun({ text: line, bold: true, size: 24, font: "Arial" })],
    }));

    const kopBottomBorder = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
    const kopTable = new Table({
      width: { size: kopWidth, type: WidthType.DXA },
      columnWidths: [kopWidth],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: {
              top: noBorder, left: noBorder, right: noBorder,
              bottom: kopBottomBorder,
            },
            width: { size: kopWidth, type: WidthType.DXA },
            children: kopParagraphs,
          }),
        ],
      })],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    elements.push(kopTable);

    elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    // --- JUDUL ---
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({
        text: `RENCANA KEGIATAN ${settings.unitKerja}`,
        bold: true, underline: {}, size: 24, font: "Arial",
      })],
    }));

    // --- Hari/Tanggal & Minggu Ke ---
    const hari = HARI_NAMES[entry.tanggal.getDay()];
    const tanggalFormatted = `${String(entry.tanggal.getDate()).padStart(2, "0")} ${BULAN_NAMES[entry.tanggal.getMonth() + 1]} ${entry.tanggal.getFullYear()}`;
    const mingguKe = getWeekOfMonth(entry.tanggal);

    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({
        text: `Hari/Tanggal : ${hari}, ${tanggalFormatted}, Minggu Ke - ${mingguKe}`,
        italics: true, size: 22, font: "Arial",
      })],
    }));

    // --- TABEL (tanpa kolom HARI) ---
    const colWidths = [600, 1400, 2800, 2200, 2400, 1200];
    const headerRow = new TableRow({
      children: [
        createCell("NO", colWidths[0], { bold: true, alignment: AlignmentType.CENTER }),
        createCell("JAM", colWidths[1], { bold: true, alignment: AlignmentType.CENTER }),
        createCell("BENTUK KEGIATAN", colWidths[2], { bold: true, alignment: AlignmentType.CENTER }),
        createCell("SASARAN", colWidths[3], { bold: true, alignment: AlignmentType.CENTER }),
        createCell("HASIL YANG DICAPAI", colWidths[4], { bold: true, alignment: AlignmentType.CENTER }),
        createCell("KUAT PERSONEL", colWidths[5], { bold: true, alignment: AlignmentType.CENTER }),
      ],
    });

    const dataRows = entry.kegiatan.map((k, idx) => new TableRow({
      children: [
        createCell(String(idx + 1), colWidths[0], { alignment: AlignmentType.CENTER }),
        createCell(k.jam, colWidths[1], { alignment: AlignmentType.CENTER }),
        createCell(k.nama, colWidths[2]),
        createCell(k.sasaran, colWidths[3]),
        createCell(k.hasil, colWidths[4]),
        createCell(k.personel, colWidths[5], { alignment: AlignmentType.CENTER }),
      ],
    }));

    elements.push(new Table({
      width: { size: 10600, type: WidthType.DXA },
      columnWidths: colWidths,
      rows: [headerRow, ...dataRows],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);

    // --- TTD: Right-aligned ---
    elements.push(new Paragraph({ spacing: { before: 400 }, children: [] }));

    // Use a table with invisible borders to push TTD to the right
    const ttdWidth = 4000;
    const spacerWidth = 10600 - ttdWidth;

    const ttdTable = new Table({
      width: { size: 10600, type: WidthType.DXA },
      columnWidths: [spacerWidth, ttdWidth],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: spacerWidth, type: WidthType.DXA },
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            borders: noBorders,
            width: { size: ttdWidth, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `Tolinggula, ${formatTanggal(entry.tanggal)}`, size: 22, font: "Arial" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40 },
                children: [new TextRun({ text: settings.jabatan, size: 22, font: "Arial" })],
              }),
              new Paragraph({ spacing: { before: 600 }, children: [] }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${settings.pangkat} ${settings.nama}`, bold: true, underline: {}, size: 22, font: "Arial" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40 },
                children: [new TextRun({ text: `NRP. ${settings.nrp}`, size: 20, font: "Arial" })],
              }),
            ],
          }),
        ],
      })],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    elements.push(ttdTable);

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
