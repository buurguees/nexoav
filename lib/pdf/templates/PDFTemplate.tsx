import type { SalesDocumentData } from "../../mocks/salesDocumentsMocks";
import type { SalesDocumentLineData } from "../../mocks/salesDocumentLinesMocks";
import { createPdfInstance, downloadPdf, PdfDoc } from "../utils/pdfUtils";
import { fetchCompanySettings, fetchCompanyBanks, type CompanySettingsData, type CompanyBankData } from "../../mocks/companyMocks";

interface PdfHeaderInfo {
  documentTitle: string;
  showRectifiesInfo?: boolean; // Para rectificativas
  rectifiesDocumentNumber?: string; // Número de factura rectificada
}

interface PdfConfig {
  company: CompanySettingsData;
  banks: CompanyBankData[];
}

let cachedConfig: PdfConfig | null = null;

async function getPdfConfig(): Promise<PdfConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const [company, banks] = await Promise.all([
    fetchCompanySettings(),
    fetchCompanyBanks(true), // Solo cuentas visibles en facturas
  ]);

  cachedConfig = { company, banks };
  return cachedConfig;
}

function formatAddress(address?: { street?: string; city?: string; zip?: string; province?: string; country?: string }): string {
  if (!address) return "";
  const parts: string[] = [];
  if (address.street) parts.push(address.street);
  if (address.zip || address.city) {
    const cityPart = [address.zip, address.city].filter(Boolean).join(" ");
    if (cityPart) parts.push(cityPart);
  }
  if (address.province) parts.push(address.province);
  if (address.country) parts.push(address.country);
  return parts.join(", ");
}

function drawHeader(doc: PdfDoc, header: PdfHeaderInfo, docData: SalesDocumentData, config: PdfConfig) {
  const { company } = config;
  let y = 40;

  // Logo (si está disponible, se puede añadir más adelante con imágenes)
  // Por ahora, solo texto

  // Nombre de la empresa
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(company.trade_name || company.fiscal_name, 40, y);
  
  y += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(company.fiscal_name, 40, y);
  
  y += 10;
  if (company.address_fiscal) {
    const address = formatAddress(company.address_fiscal);
    if (address) {
      doc.text(address, 40, y);
      y += 10;
    }
  }
  
  if (company.phone) {
    doc.text(`Tel: ${company.phone}`, 40, y);
    y += 10;
  }
  
  if (company.email_contact) {
    doc.text(`Email: ${company.email_contact}`, 40, y);
    y += 10;
  }
  
  if (company.cif) {
    doc.text(`CIF: ${company.cif}`, 40, y);
  }

  // Información del documento (lado derecho)
  y = 40;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(header.documentTitle, 400, y, { align: "right" });
  
  y += 20;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Nº: ${docData.document_number}`, 400, y, { align: "right" });
  
  y += 15;
  const dateIssued = new Date(docData.date_issued).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Fecha: ${dateIssued}`, 400, y, { align: "right" });
  
  if (docData.date_due) {
    y += 15;
    const dateDue = new Date(docData.date_due).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Vencimiento: ${dateDue}`, 400, y, { align: "right" });
  }

  // Información de rectificación (si es rectificativa)
  if (header.showRectifiesInfo && header.rectifiesDocumentNumber) {
    y += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 0, 0); // Rojo para destacar
    doc.text(`Rectifica factura: ${header.rectifiesDocumentNumber}`, 400, y, { align: "right" });
    doc.setTextColor(0, 0, 0); // Restaurar color negro
  }

  // Datos del cliente (debajo del header de empresa)
  y = 120;
  const client = docData.client_snapshot;
  if (client) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", 40, y);
    
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(client.commercial_name || client.fiscal_name || "", 40, y);
    
    y += 12;
    if (client.vat_number) {
      doc.text(`CIF/NIF: ${client.vat_number}`, 40, y);
      y += 12;
    }
    
    if (client.address) {
      const clientAddress = formatAddress(client.address);
      if (clientAddress) {
        doc.text(clientAddress, 40, y);
        y += 12;
      }
    }
    
    if (client.phone) {
      doc.text(`Tel: ${client.phone}`, 40, y);
      y += 12;
    }
    
    if (client.email) {
      doc.text(`Email: ${client.email}`, 40, y);
    }
  }

  // Proyecto (si existe)
  if (docData.project_name) {
    y = 120;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Proyecto: ${docData.project_name}`, 400, y, { align: "right" });
    if (docData.project_ref) {
      y += 12;
      doc.text(`Ref: ${docData.project_ref}`, 400, y, { align: "right" });
    }
  }

  // Línea separadora
  y = 200;
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(40, y, 550, y);
}

function drawLinesTable(doc: PdfDoc, lines: SalesDocumentLineData[], startY: number) {
  let y = startY;

  const drawHeaderRow = () => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(40, y - 8, 510, 16, "F"); // Fondo gris para header
    
    doc.text("Concepto", 50, y);
    doc.text("Cant.", 280, y, { align: "right" });
    doc.text("P. Unit.", 330, y, { align: "right" });
    doc.text("Dto%", 390, y, { align: "right" });
    doc.text("IVA%", 440, y, { align: "right" });
    doc.text("Importe", 520, y, { align: "right" });
    
    y += 12;
    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.line(40, y, 550, y);
    y += 8;
  };

  drawHeaderRow();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const drawGroupTitle = (title: string) => {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, 50, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
  };

  let currentGroup: SalesDocumentLineData["grouping_tag"] | null = null;
  let lineCount = 0;

  lines.forEach((line) => {
    if (currentGroup !== line.grouping_tag) {
      if (currentGroup !== null) {
        y += 4; // Espacio entre grupos
      }
      currentGroup = line.grouping_tag;
      drawGroupTitle(currentGroup);
    }

    if (y > 760) {
      doc.addPage();
      y = 60;
      drawHeaderRow();
    }

    // Alternar color de fondo para filas
    if (lineCount % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(40, y - 8, 510, 14, "F");
    }

    const concept = line.concept;
    const description = line.description;
    
    // Concepto (puede tener descripción)
    doc.setFontSize(9);
    doc.text(concept.substring(0, 50), 50, y);
    if (description && description.length > 0) {
      y += 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(description.substring(0, 60), 50, y);
      doc.setTextColor(0, 0, 0);
      y -= 10;
    }
    
    // Cantidad (puede ser negativa para rectificativas)
    const quantityColor = line.quantity < 0 ? [200, 0, 0] : [0, 0, 0];
    doc.setTextColor(quantityColor[0], quantityColor[1], quantityColor[2]);
    doc.text(line.quantity.toFixed(2), 280, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
    
    doc.text(line.unit_price.toFixed(2) + " €", 330, y, { align: "right" });
    doc.text(line.discount_percent.toFixed(1) + "%", 390, y, { align: "right" });
    doc.text(line.tax_percent.toFixed(1) + "%", 440, y, { align: "right" });
    
    // Total de línea (puede ser negativo para rectificativas)
    const totalColor = line.total_line < 0 ? [200, 0, 0] : [0, 0, 0];
    doc.setTextColor(totalColor[0], totalColor[1], totalColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(line.total_line.toFixed(2) + " €", 520, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    y += 14;
    lineCount++;
  });

  return y;
}

function drawTotals(
  doc: PdfDoc,
  docData: SalesDocumentData,
  startY: number
) {
  const totals = docData.totals_data;
  let y = startY + 20;

  // Resumen de IVA
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen IVA", 40, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  const breakdown = totals?.vat_breakdown || {};
  const keys = Object.keys(breakdown).sort((a, b) => parseFloat(b) - parseFloat(a));

  if (keys.length > 0) {
    keys.forEach((rate) => {
      const row = breakdown[rate];
      doc.text(`Base ${rate}%:`, 40, y);
      doc.text(`${row.base.toFixed(2)} €`, 150, y, { align: "right" });
      doc.text(`IVA: ${row.vat.toFixed(2)} €`, 260, y, { align: "right" });
      doc.text(`Total: ${row.total.toFixed(2)} €`, 360, y, { align: "right" });
      y += 12;
    });
  } else {
    // Si no hay desglose, mostrar totales generales
    const base = totals?.base_imponible ?? totals?.base ?? 0;
    const vat = totals?.total_vat ?? totals?.vat ?? 0;
    const total = totals?.total ?? base + vat;
    
    doc.text("Base imponible:", 40, y);
    doc.text(`${base.toFixed(2)} €`, 150, y, { align: "right" });
    y += 12;
    doc.text("IVA:", 40, y);
    doc.text(`${vat.toFixed(2)} €`, 150, y, { align: "right" });
    y += 12;
  }

  // Totales finales (lado derecho)
  y = startY + 20;
  const base = totals?.base_imponible ?? totals?.base ?? 0;
  const vat = totals?.total_vat ?? totals?.vat ?? 0;
  const total = totals?.total ?? base + vat;

  // Fondo para totales
  doc.setFillColor(240, 240, 240);
  doc.rect(360, y - 8, 190, 50, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Base imponible:", 370, y);
  doc.text(`${base.toFixed(2)} €`, 520, y, { align: "right" });
  
  y += 14;
  doc.text("IVA:", 370, y);
  doc.text(`${vat.toFixed(2)} €`, 520, y, { align: "right" });
  
  y += 16;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  
  // Color para totales negativos (rectificativas)
  const totalColor = total < 0 ? [200, 0, 0] : [0, 0, 0];
  doc.setTextColor(totalColor[0], totalColor[1], totalColor[2]);
  doc.text("TOTAL:", 370, y);
  doc.text(`${total.toFixed(2)} €`, 520, y, { align: "right" });
  doc.setTextColor(0, 0, 0);
}

function drawFooter(doc: PdfDoc, config: PdfConfig, pageNumber: number, totalPages: number) {
  const { company, banks } = config;
  const pageHeight = doc.internal.pageSize.height;
  let y = pageHeight - 80;

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(40, y, 550, y);
  y += 15;

  // Cuentas bancarias
  if (banks.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Datos bancarios:", 40, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    banks.forEach((bank) => {
      doc.text(`${bank.bank_name}: ${bank.iban}`, 40, y);
      if (bank.swift_bic) {
        doc.text(`SWIFT: ${bank.swift_bic}`, 250, y);
      }
      y += 10;
    });
    y += 5;
  }

  // Información de empresa
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  if (company.fiscal_name) {
    doc.text(company.fiscal_name, 40, y);
  }
  if (company.cif) {
    doc.text(`CIF: ${company.cif}`, 250, y);
  }
  if (company.address_fiscal) {
    const address = formatAddress(company.address_fiscal);
    if (address) {
      y += 8;
      doc.text(address, 40, y);
    }
  }

  // Número de página
  doc.text(`Página ${pageNumber} de ${totalPages}`, 500, y, { align: "right" });
  doc.setTextColor(0, 0, 0);
}

export async function generateSalesDocumentPdf(
  header: PdfHeaderInfo,
  docData: SalesDocumentData,
  lines: SalesDocumentLineData[],
  filename: string
): Promise<void> {
  const config = await getPdfConfig();
  const doc = createPdfInstance();
  
  // Calcular número de páginas aproximado
  const linesPerPage = 30;
  const estimatedPages = Math.max(1, Math.ceil(lines.length / linesPerPage) + 1);
  
  drawHeader(doc, header, docData, config);
  const afterTableY = drawLinesTable(doc, lines, 220);
  drawTotals(doc, docData, afterTableY);
  
  // Footer en cada página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, config, i, totalPages);
  }
  
  downloadPdf(doc, filename);
}
