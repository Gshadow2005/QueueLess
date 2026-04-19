export type InstitutionType = "bank" | "government" | "utility";
export type InstitutionStatus = "open" | "busy" | "closed";

export interface Institution {
  id: number;
  name: string;
  type: InstitutionType;
  address: string;
  status: InstitutionStatus;
  serving: number;
  inQueue: number;
  waitPer: number;
}

export const INSTITUTION_ICONS: Record<InstitutionType, string> = {
  bank: "Building2",
  government: "Landmark",
  utility: "Zap",
};

export const TYPE_LABELS: Record<InstitutionType, string> = {
  bank: "Bank",
  government: "Government Office",
  utility: "Utility Provider",
};