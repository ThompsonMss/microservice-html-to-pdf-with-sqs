import htmlToPDF from 'html-pdf-node';
import request from "request-promise-native";

const defaultOptions = {
  format: 'A4',
  printBackground: true,
  landscape: true,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
};

export async function executarGerarPDF (link, opcoes = {}) {

  // Fazendo o download do HTML.
  let pdfBuffer = await request.get({ uri: link, encoding: null });

  const html = { content: pdfBuffer };
  const opcoesFinal = { ...defaultOptions, ...opcoes };

  const pdf = await htmlToPDF.generatePdf(html, opcoesFinal).then();
  return pdf;

}