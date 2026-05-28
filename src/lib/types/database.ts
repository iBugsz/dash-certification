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
  updated_at: string;
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
// Define el tipo permitido
export type CaseFormat =
  | "none"
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "sentence";

export interface FieldFormat {
  case?: CaseFormat | string;
}

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "email"
  | "currency"
  | "image"
  | "unknown";

// Now the MappingField interface will work correctly:
export interface MappingField {
  type: FieldType;
  label: string;
  sheet?: string;
  cell?: string;
  format?: {
    case?: string;
  };
}

// 3. Interfaz del Template
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
  homologation_type_id: string | null;
  variables: Record<string, string> | null;
  mapping: Record<string, MappingField> | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  company?: { id: string; name: string } | null;
  homologation_type?: { id: string; name: string } | null;
}

// 4. Interfaz de formulario
export interface TemplateFormData {
  name: string;
  description: string;
  company_id: string;
  homologation_type_id: string;
  mapping: Record<string, MappingField>;
}

export const EMPTY_TEMPLATE_FORM: TemplateFormData = {
  name: "",
  description: "",
  company_id: "",
  homologation_type_id: "",
  mapping: {},
};

// ─── HOMOLOGATION TYPES ──────────────────────────────────────────────────
export interface HomologationType {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomologationTypeFormData {
  name: string;
  description: string;
  icon: string;
}

export const EMPTY_HOMOLOGATION_FORM: HomologationTypeFormData = {
  name: "",
  description: "",
  icon: "FileQuestion",
};

export interface Collection {
  id: string;
  name: string;
  user_id?: string;
  created_at?: string;
}

export interface CADBlock {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  raw_vector_data: string | null;
  source_format: string;
  tags: string[];
  thumbnail_svg: string | null;
  collection_id?: string | null;
  created_at: string;
  updated_at: string;
}
