"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Company, Template } from "@/lib/types/database";
import { extractExcelData } from "@/services/excel-service";
import { generateWordDocument, fileToBase64 } from "@/services/docx-service";
import { convertToPdf } from "@/services/pdf-service";

export function useCertificates() {
  // --- ESTADOS DE ARCHIVOS Y SELECCIÓN ---
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // --- ESTADOS DEL PROCESO ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMapped, setIsMapped] = useState(false);
  const [wordGenerated, setWordGenerated] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processWarning, setProcessWarning] = useState<string | null>(null);

  // --- CARGA DE DATOS (Supabase) ---
  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("active", true)
        .order("name");
      if (!error && data) setCompanies(data);
      setLoadingCompanies(false);
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      setTemplates([]);
      return;
    }
    async function fetchTemplates() {
      setLoadingTemplates(true);
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("company_id", selectedCompany?.id)
        .eq("active", true)
        .order("name");
      if (!error && data) setTemplates(data);
      setLoadingTemplates(false);
    }
    fetchTemplates();
  }, [selectedCompany]);

  // --- ACCIONES PRINCIPALES ---

  /**
   * PASO 1: Analiza el Excel y genera el documento Word en memoria
   */
  const handleAnalyze = useCallback(
    async (imageFiles: Record<string, File>) => {
      if (!excelFile || !selectedTemplate) return;
      setIsProcessing(true);
      setProcessError(null);

      try {
        // 1. Extraer datos del Excel usando el servicio
        const { finalData } = await extractExcelData(
          excelFile,
          selectedTemplate.mapping,
        );

        // 2. Convertir imágenes a Base64
        const imageData: Record<string, string> = {};
        for (const [tag, file] of Object.entries(imageFiles)) {
          if (file) {
            const cleanTag = tag.replace(/[^a-zA-Z0-9]/g, "").trim();
            imageData[cleanTag] = await fileToBase64(file);
          }
        }

        // 3. Generar el Word usando el servicio de DOCX
        const mergedData = { ...finalData, ...imageData };
        const generatedBlob = await generateWordDocument(
          selectedTemplate.file_url!,
          mergedData,
        );

        setWordGenerated(generatedBlob);
        setIsMapped(true);
      } catch (err: any) {
        setProcessError(err.message || "Error al procesar los documentos");
      } finally {
        setIsProcessing(false);
      }
    },
    [excelFile, selectedTemplate],
  );

  /**
   * PASO 2: Envía el Word generado al servidor para convertirlo a PDF
   */
  const handleGenerate = useCallback(async () => {
    if (!wordGenerated) return;
    setIsProcessing(true);
    setProcessError(null);

    try {
      // 1. Convertir a PDF usando el servicio (este servicio también registra la métrica)
      const pdfBlob = await convertToPdf(wordGenerated);

      // 2. Crear URL para visualización/descarga
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      setProcessError(err.message || "Error en la conversión a PDF");
    } finally {
      setIsProcessing(false);
    }
  }, [wordGenerated]);

  /**
   * PASO 3: Descarga el PDF final
   */
  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Certificado_${
      selectedCompany?.name.replace(/\s+/g, "_") || "Generado"
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, selectedCompany]);

  return {
    // Datos y Selección
    excelFile,
    setExcelFile,
    companies,
    selectedCompany,
    setSelectedCompany,
    loadingCompanies,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    loadingTemplates,

    // Estados de UI
    isProcessing,
    isMapped,
    pdfUrl,
    processError,
    processWarning,
    isReady: !!(selectedCompany && selectedTemplate && excelFile),
    wordGenerated,

    // Funciones
    handleAnalyze,
    handleGenerate,
    handleDownload,
    setIsMapped,
    setWordGenerated,
    setPdfUrl,
  };
}
