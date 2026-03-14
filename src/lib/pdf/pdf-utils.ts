import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface PdfOptions {
  filename: string;
  margin?: number;
  scale?: number;
}

export async function generatePdf(
  element: HTMLElement,
  options: PdfOptions,
): Promise<void> {
  const { filename, margin = 10, scale = 2 } = options;

  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const contentWidthMm = A4_WIDTH_MM - margin * 2;
  const contentHeightMm = A4_HEIGHT_MM - margin * 2;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#FFFFFF",
    allowTaint: false,
  });

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pxPerMm = imgWidth / contentWidthMm;
  const pageHeightPx = contentHeightMm * pxPerMm;
  const totalPages = Math.ceil(imgHeight / pageHeightPx);

  const pdf = new jsPDF("p", "mm", "a4");

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = imgWidth;
    pageCanvas.height = Math.min(pageHeightPx, imgHeight - page * pageHeightPx);

    const ctx = pageCanvas.getContext("2d")!;
    ctx.drawImage(
      canvas,
      0,
      page * pageHeightPx,
      imgWidth,
      pageCanvas.height,
      0,
      0,
      imgWidth,
      pageCanvas.height,
    );

    const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.92);
    const sliceHeightMm = pageCanvas.height / pxPerMm;

    pdf.addImage(
      pageImgData,
      "JPEG",
      margin,
      margin,
      contentWidthMm,
      sliceHeightMm,
    );
  }

  pdf.save(filename);
}
