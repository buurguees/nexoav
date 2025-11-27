import type { SalesDocumentData } from "../../mocks/salesDocumentsMocks";
import type { SalesDocumentLineData } from "../../mocks/salesDocumentLinesMocks";
import { generateSalesDocumentPdf } from "../templates/PDFTemplate";

export async function generateFacturaPDF(
  factura: SalesDocumentData,
  lines: SalesDocumentLineData[]
): Promise<void> {
  await generateSalesDocumentPdf(
    {
      documentTitle: "Factura",
    },
    factura,
    lines,
    `${factura.document_number}.pdf`
  );
}


