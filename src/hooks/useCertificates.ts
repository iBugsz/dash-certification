"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Company, Template } from "@/lib/certificates/types";
import { extractExcelData } from "@/lib/excel";
import * as Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

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
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processWarning, setProcessWarning] = useState<string | null>(null);

  // Cargar Empresas
  useEffect(() => {
    async function fetchCompanies() {
      setLoadingCompanies(true);
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, nit, logo_url, address")
        .eq("active", true)
        .order("name");
      if (!error && data) setCompanies(data);
      setLoadingCompanies(false);
    }
    fetchCompanies();
  }, []);

  // Cargar Plantillas
  useEffect(() => {
    if (!selectedCompany) {
      setTemplates([]);
      setSelectedTemplate(null);
      return;
    }
    async function fetchTemplates() {
      setLoadingTemplates(true);
      setSelectedTemplate(null);
      setPdfUrl(null);
      setIsMapped(false);
      const { data, error } = await supabase
        .from("templates")
        .select("id, name, description, file_name, file_url, mapping")
        .eq("company_id", selectedCompany?.id)
        .eq("active", true)
        .order("name");
      if (!error && data) setTemplates(data);
      setLoadingTemplates(false);
    }
    fetchTemplates();
  }, [selectedCompany]);

  // Limpieza al cambiar archivos
  useEffect(() => {
    setIsMapped(false);
    setExtractedData(null);
    setPdfUrl(null);
    setProcessWarning(null);
    setProcessError(null);
  }, [excelFile, selectedTemplate]);

  // PASO 1: ANALIZAR (Coordenadas)
  const handleAnalyze = useCallback(async () => {
    if (!excelFile || !selectedTemplate) return;

    setIsProcessing(true);
    setProcessError(null);
    setProcessWarning(null);

    try {
      const mapping = selectedTemplate.mapping; 
      
      const { finalData, missingInExcel } = await extractExcelData(excelFile, mapping);

      setExtractedData(finalData); 

      const total = Object.keys(mapping).length;
      // Conteo robusto: que no sea null, undefined o string vacío
      const encontrados = Object.keys(finalData).filter(
        k => finalData[k] !== undefined && finalData[k] !== null && finalData[k] !== ""
      ).length;

      if (encontrados === total) {
        setProcessWarning(`✅ ¡Perfecto! Se leyeron las celdas ${Object.values(mapping).map((m: any) => m.cell.toUpperCase()).join(", ")} con éxito.`);
      } else {
        const vacias = Object.keys(mapping).filter(tag => !finalData[tag]);
        setProcessWarning(`⚠️ Atención: Solo se llenaron ${encontrados} de ${total}. Las variables [${vacias.join(", ")}] están vacías o no existen en el Excel.`);
      }

      setIsMapped(true);
    } catch (err: any) {
      setProcessError("Error crítico al leer el Excel. Verifica que el archivo no esté protegido.");
    } finally {
      setIsProcessing(false);
    }
  }, [excelFile, selectedTemplate]);

  // PASO 2: GENERAR PDF
  const handleGenerate = useCallback(async () => {
    if (!extractedData || !selectedTemplate || !isMapped) return;

    setIsProcessing(true);
    setProcessError(null);

    try {
      if (!selectedTemplate.file_url) {
        throw new Error("La plantilla seleccionada no tiene una URL de archivo válida.");
      }
      const responseTemplate = await fetch(selectedTemplate.file_url);
      if (!responseTemplate.ok) throw new Error("No se pudo conectar con el servidor de plantillas.");
      const content = await responseTemplate.arrayBuffer();
      const zip = new PizZip(content);
      
      // 1. Limpieza XML Manual (Para etiquetas cortadas)
      try {
        const xmlPath = "word/document.xml";
        if (zip.files[xmlPath]) {
          let xmlContent = zip.files[xmlPath].asText();
          xmlContent = xmlContent
            .replace(/<w:t>\{<\/w:t><w:t>\{<\/w:t>/g, '{{')
            .replace(/<w:t>\}<\/w:t><w:t>\}<\/w:t>/g, '}}')
            .replace(/<w:t>\{\{<\/w:t>/g, '{{')
            .replace(/<w:t>\}\}<\/w:t>/g, '}}');
          zip.file(xmlPath, xmlContent);
        }
      } catch (e) { console.warn("Limpieza omitida"); }
      
      const DocxtemplaterLib: any = (Docxtemplater as any).default || Docxtemplater;
      
      let doc;
      try {
        // 2. Intentar crear la instancia
        doc = new DocxtemplaterLib(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part: any) => part.name ? `[Falta: ${part.name}]` : ""
        });
      } catch (e: any) {
        // --- AQUÍ ESTÁ EL TRUCO PARA SABER QUÉ PASA ---
        if (e.properties && e.properties.errors) {
          console.error("ERRORES DETECTADOS EN EL WORD:", e.properties.errors);
          const detail = e.properties.errors.map((err: any) => err.properties.explanation).join(" | ");
          throw new Error(`Error en etiquetas del Word: ${detail}`);
        }
        throw e;
      }

      // 3. Renderizado
      doc.render(extractedData);

      // 4. Generación y API
      const wordBlob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.officedocument.wordprocessingml.document",
      });

      const formData = new FormData();
      formData.append("file", wordBlob, "doc.docx");

      const responseApi = await fetch("/api/convert-to-pdf", {
        method: "POST",
        body: formData,
      });

      // Línea ~173, reemplaza el throw por esto:
      if (!responseApi.ok) {
        const errorBody = await responseApi.json().catch(() => ({}));
        console.error("Adobe API error:", responseApi.status, errorBody);
        throw new Error(errorBody.error ?? `Error ${responseApi.status} en la API de Adobe`);
      }

      const pdfBlob = await responseApi.blob();
      setPdfUrl(window.URL.createObjectURL(pdfBlob));

    } catch (err: any) {
      console.error("ERROR CRÍTICO:", err);
      // Mostramos el mensaje detallado en el banner rojo de tu UI
      setProcessError(err.message || "Error al procesar el documento.");
    } finally {
      setIsProcessing(false);
    }
  }, [extractedData, selectedTemplate, isMapped]);

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Certificado_${selectedCompany?.name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, selectedCompany]);

  return {
    excelFile, setExcelFile, companies, selectedCompany, setSelectedCompany,
    loadingCompanies, templates, selectedTemplate, setSelectedTemplate,
    loadingTemplates, isProcessing, isMapped, pdfUrl, processError, processWarning,
    isReady: !!(selectedCompany && selectedTemplate && excelFile),
    handleAnalyze, handleGenerate, handleDownload,
  };
}