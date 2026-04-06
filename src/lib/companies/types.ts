export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
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