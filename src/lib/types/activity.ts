// ─── Activity Module Types ────────────────────────────────────────────────

export type ActivityAction = "CREATE" | "UPDATE" | "DELETE" | "GENERATE";
export type ActivityEntity = "TEMPLATE" | "COMPANY" | "CERTIFICATE";

export interface ActivityLog {
  id: string;
  created_at: string;
  user_name: string;
  user_id: string;
  action_type: ActivityAction;
  entity_type: ActivityEntity;
  entity_name: string;
  details?: any; // Para guardar el JSON con cambios previos/nuevos
}
