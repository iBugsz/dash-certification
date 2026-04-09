"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Company, Template } from "@/lib/certificates/types";
import { extractExcelData } from "@/lib/excel";
import * as Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
// @ts-ignore
import ImageModule from "docxtemplater-image-module-free";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

export function useCertificates() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isMapped, setIsMapped] = useState(false); 
  const [wordGenerated, setWordGenerated] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processWarning, setProcessWarning] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase.from("companies").select("*").eq("active", true).order("name");
      if (!error && data) setCompanies(data);
      setLoadingCompanies(false);
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    async function fetchTemplates() {
      setLoadingTemplates(true);
      const { data, error } = await supabase.from("templates").select("*").eq("company_id", selectedCompany?.id).eq("active", true).order("name");
      if (!error && data) setTemplates(data);
      setLoadingTemplates(false);
    }
    fetchTemplates();
  }, [selectedCompany]);

  const handleAnalyze = useCallback(async (imageFiles: Record<string, File>) => {
    if (!excelFile || !selectedTemplate) return;
    setIsProcessing(true);
    setProcessError(null);

    try {
      const { finalData } = await extractExcelData(excelFile, selectedTemplate.mapping);
      
      const imageData: Record<string, string> = {};
      for (const [tag, file] of Object.entries(imageFiles)) {
        if (file) {
          const cleanTag = tag.replace(/[^a-zA-Z0-9]/g, "").trim();
          imageData[cleanTag] = await fileToBase64(file);
        }
      }

      const mergedData = { ...finalData, ...imageData };
      const responseTemplate = await fetch(selectedTemplate.file_url!);
      const content = await responseTemplate.arrayBuffer();
      const zip = new PizZip(content);

      const imageOptions = {
        centered: true,
        getImage: (tagValue: string) => {
          if (!tagValue) return null;
          try {
            const binaryString = window.atob(tagValue);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
            return bytes.buffer;
          } catch (e) { return null; }
        },
        // ESTA ES LA CLAVE: 
        // Intentamos recuperar el tamaño del contenedor original de Word
        getSize: (img: any, tagValue: any, tagName: any) => {
          // Si quieres que sea EXACTO al tamaño que pusiste en el código anterior
          // pero viste que 600 era mucho, bájalo aquí a lo que mida tu celda.
          // Prueba con 540 (ancho estándar de una página A4 con márgenes)
          return [540, 300]; 
        },
      };

      const imageModule = new ImageModule(imageOptions);
      const DocxtemplaterLib: any = (Docxtemplater as any).default || Docxtemplater;
      
      const doc = new DocxtemplaterLib(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule],
        parser: (tag: string) => {
          return {
            get: (scope: any) => {
              const clean = tag.replace(/<[^>]+>/g, "").replace(/[^a-zA-Z0-9]/g, "").trim();
              return scope[clean];
            },
          };
        }
      });

      doc.render(mergedData);

      const generatedBlob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.officedocument.wordprocessingml.document",
      });

      setWordGenerated(generatedBlob);
      setIsMapped(true);

    } catch (err: any) {
      setProcessError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [excelFile, selectedTemplate]);

  const handleGenerate = useCallback(async () => {
    if (!wordGenerated) return;
    setIsProcessing(true);
    setProcessError(null);

    try {
      const formData = new FormData();
      const fileToSend = new File([wordGenerated], "final_document.docx", {
        type: "application/vnd.officedocument.wordprocessingml.document",
      });
      formData.append("file", fileToSend);

      const responseApi = await fetch("/api/convert-to-pdf", { 
        method: "POST", 
        body: formData 
      });

      if (!responseApi.ok) throw new Error("Error en conversión a PDF");

      const pdfBlob = await responseApi.blob();
      setPdfUrl(window.URL.createObjectURL(pdfBlob));
    } catch (err: any) {
      setProcessError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [wordGenerated]);

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Certificado_${selectedCompany?.name.replace(/\s+/g, "_")}.pdf`;
    link.click();
  }, [pdfUrl, selectedCompany]);

  return {
    excelFile, setExcelFile, companies, selectedCompany, setSelectedCompany,
    loadingCompanies, templates, selectedTemplate, setSelectedTemplate,
    loadingTemplates, isProcessing, isMapped, pdfUrl, processError, processWarning,
    isReady: !!(selectedCompany && selectedTemplate && excelFile),
    handleAnalyze, handleGenerate, handleDownload,
  };
}