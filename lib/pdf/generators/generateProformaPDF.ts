import type { SalesDocumentData } from "../../mocks/salesDocumentsMocks";
import type { SalesDocumentLineData } from "../../mocks/salesDocumentLinesMocks";
import { generateSalesDocumentPdf } from "../templates/PDFTemplate";

export async function generateProformaPDF(
  proforma: SalesDocumentData,
  lines: SalesDocumentLineData[]
): Promise<void> {
  await generateSalesDocumentPdf(
    {
      documentTitle: "Proforma",
    },
    proforma,
    lines,
    `${proforma.document_number}.pdf`
  );
}


