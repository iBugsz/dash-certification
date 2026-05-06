import {
  Plus,
  Edit3,
  Trash2,
  FileCheck,
  Building2,
  LayoutTemplate,
  FileText,
} from "lucide-react";
import { ActivityAction, ActivityEntity } from "@/lib/types/activity";

export const entityIcons: Record<ActivityEntity | "DEFAULT", any> = {
  TEMPLATE: LayoutTemplate,
  COMPANY: Building2,
  CERTIFICATE: FileCheck,
  DEFAULT: FileText,
};

export const actionStyles: Record<ActivityAction, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  UPDATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  DELETE: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  GENERATE: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
};

export const actionIcons: Record<ActivityAction, any> = {
  CREATE: Plus,
  UPDATE: Edit3,
  DELETE: Trash2,
  GENERATE: FileCheck,
};
