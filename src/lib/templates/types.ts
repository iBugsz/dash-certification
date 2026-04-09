export interface MappingField {
  label: string;
  type: "text" | "image"; // Así controlas que solo sean estos dos
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_url: string | null;
  // PROPIEDADES NUEVAS PARA PREVIEW:
  preview_url: string | null;
  has_preview: boolean; 
  // -----------------------------
  company_id: string | null;
  variables: Record<string, string> | null;
  mapping: Record<string, any> | null; 
  active: boolean;
  created_at: string;
  updated_at: string;
  company?: { id: string; name: string } | null;
}

export interface TemplateFormData {
  name: string;
  description: string;
  company_id: string;
}

export const EMPTY_TEMPLATE_FORM: TemplateFormData = {
  name: "",
  description: "",
  company_id: "",
};