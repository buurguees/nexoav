import type { SalesDocumentData } from "../../mocks/salesDocumentsMocks";
import type { SalesDocumentLineData } from "../../mocks/salesDocumentLinesMocks";
import { fetchFacturaById } from "../../mocks/salesDocumentsMocks";
import { generateSalesDocumentPdf } from "../templates/PDFTemplate";

export async function generateRectificativaPDF(
  rectificativa: SalesDocumentData,
  lines: SalesDocumentLineData[]
): Promise<void> {
  // Obtener el número de la factura rectificada
  let rectifiesNumber: string | undefined;
  if (rectificativa.rectifies_document_id) {
    try {
      const facturaOriginal = await fetchFacturaById(rectificativa.rectifies_document_id);
      if (facturaOriginal) {
        rectifiesNumber = facturaOriginal.document_number;
      }
    } catch (error) {
      console.error("Error al obtener factura original:", error);
    }
  }

  await generateSalesDocumentPdf(
    {
      documentTitle: "FACTURA RECTIFICATIVA",
      showRectifiesInfo: true,
      rectifiesDocumentNumber: rectifiesNumber,
    },
    rectificativa,
    lines,
    `${rectificativa.document_number}.pdf`
  );
}


