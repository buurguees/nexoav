import type { SalesDocumentData } from "../../mocks/salesDocumentsMocks";
import type { SalesDocumentLineData } from "../../mocks/salesDocumentLinesMocks";
import { generateSalesDocumentPdf } from "../templates/PDFTemplate";

export async function generatePresupuestoPDF(
  presupuesto: SalesDocumentData,
  lines: SalesDocumentLineData[]
): Promise<void> {
  await generateSalesDocumentPdf(
    {
      documentTitle: "Presupuesto",
    },
    presupuesto,
    lines,
    `${presupuesto.document_number}.pdf`
  );
}


