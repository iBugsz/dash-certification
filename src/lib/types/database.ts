// src/lib/types/database.ts

// ─── COMPANIES ───────────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  nit: string | null;
  active: boolean;
  created_at: string;
}

export interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  logo_url: string;
}

export const EMPTY_FORM: CompanyFormData = {
  name: "",
  email: "",
  phone: "",
  logo_url: "",
};

// ─── TEMPLATES ───────────────────────────────────────────────────────────
export interface MappingField {
  label: string;
  type: "text" | "image";
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_url: string | null;
  preview_url: string | null;
  has_preview: boolean;
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
