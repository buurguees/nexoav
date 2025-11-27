import { jsPDF } from "jspdf";

export type PdfDoc = jsPDF;

export function createPdfInstance(): PdfDoc {
  return new jsPDF({
    unit: "pt",
    format: "a4",
  });
}

export function downloadPdf(doc: PdfDoc, filename: string) {
  // En navegadores, jsPDF gestiona la descarga directamente
  doc.save(filename);
}


