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
  updated_at: string; // ← agrega esto
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
export type FieldType = "text" | "number" | "image";

// Define la interfaz una sola vez
export interface MappingField {
  type: FieldType;
  label: string;
  sheet?: string;
  cell?: string;
  format?: {
    case?: string;
  };
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
  homologation_type_id: string | null; // ← nuevo
  variables: Record<string, string> | null;
  mapping: Record<string, any> | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  company?: { id: string; name: string } | null;
  homologation_type?: { id: string; name: string } | null; // ← nuevo
}

export interface TemplateFormData {
  name: string;
  description: string;
  company_id: string;
  homologation_type_id: string; // ← nuevo
}

export const EMPTY_TEMPLATE_FORM: TemplateFormData = {
  name: "",
  description: "",
  company_id: "",
  homologation_type_id: "", // ← nuevo
};

// ─── HOMOLOGATION TYPES ──────────────────────────────────────────────────
export interface HomologationType {
  id: string;
  name: string;
  description: string | null;
  icon: string; // ← nuevo
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomologationTypeFormData {
  name: string;
  description: string;
  icon: string; // ← nuevo
}

export const EMPTY_HOMOLOGATION_FORM: HomologationTypeFormData = {
  name: "",
  description: "",
  icon: "FileQuestion", // ← nuevo
};

export interface Collection {
  id: string;
  name: string;
  user_id?: string;
  created_at?: string;
}

export interface CADBlock {
  id: string; // uuid gen_random_uuid()
  user_id: string | null; // uuid
  name: string; // text ('Sin nombre'::text)
  description: string | null; // text
  raw_vector_data: string | null; // text
  source_format: string; // text ('unknown'::text)
  tags: string[]; // text[] ('{}'::text[])
  thumbnail_svg: string | null; // text
  collection_id?: string | null; // El enlace a tu nueva tabla de colecciones
  created_at: string; // timestamptz (now())
  updated_at: string; // timestamptz (now())
}
