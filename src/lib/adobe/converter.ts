import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  CreatePDFJob,
  CreatePDFResult,
} from "@adobe/pdfservices-node-sdk";
import { Readable } from "stream";

export const convertWordToPdf = async (wordBuffer: Buffer): Promise<Buffer> => {
  const credentials = new ServicePrincipalCredentials({
    clientId: process.env.ADOBE_CLIENT_ID!,
    clientSecret: process.env.ADOBE_CLIENT_SECRET!,
  });

  const pdfServices = new PDFServices({ credentials });

  // Subir el Word que ya viene con los datos inyectados por tu sistema
  const inputAsset = await pdfServices.upload({
    readStream: Readable.from(wordBuffer),
    mimeType: MimeType.DOCX,
  });

  // Solo convertir (CreatePDF)
  const job = new CreatePDFJob({ inputAsset });

  const pollingURL = await pdfServices.submit({ job });
  const result = await pdfServices.getJobResult({
    pollingURL,
    resultType: CreatePDFResult,
  });

  const resultAsset = result.result?.asset;
  if (!resultAsset) throw new Error("Adobe no devolvió el PDF.");

  const streamAsset = await pdfServices.getContent({ asset: resultAsset });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    streamAsset.readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    streamAsset.readStream.on("end", () => resolve(Buffer.concat(chunks)));
    streamAsset.readStream.on("error", reject);
  });
};