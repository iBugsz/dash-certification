"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Company, CompanyFormData } from "@/lib/companies/types";
import { deleteOldLogo } from "@/lib/companies/utils";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("companies")
      .select("id, name, email, phone, logo_url, nit, active, created_at")
      .order("created_at", { ascending: false });
    setCompanies(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const saveCompany = async (
    form: CompanyFormData,
    editing: Company | null,
    onDone: () => void,
  ) => {
    if (!form.name.trim()) return;

    if (editing && editing.logo_url !== form.logo_url) {
      await deleteOldLogo(editing.logo_url);
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      logo_url: form.logo_url.trim() || null,
    };

    if (editing) {
      await supabase.from("companies").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("companies").insert(payload);
    }

    fetchCompanies();
    onDone();
  };

  const deleteCompany = async (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company?.logo_url) await deleteOldLogo(company.logo_url);
    await supabase.from("companies").delete().eq("id", id);
    fetchCompanies();
  };

  return { companies, loading, saveCompany, deleteCompany };
}
