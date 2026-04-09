// ─── Certificate Module Types ─────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  nit: string | null;
  logo_url: string | null;
  address: string | null;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  file_name: string;
  file_url: string | null;
  mapping: any;
}