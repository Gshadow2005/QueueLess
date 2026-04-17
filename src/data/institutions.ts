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

export const INSTITUTIONS: Institution[] = [
  { id: 1, name: "City Bank – Main Branch", type: "bank", address: "Divisoria, CDO", status: "open", serving: 20, inQueue: 15, waitPer: 2 },
  { id: 2, name: "PNB Limketkai", type: "bank", address: "Limketkai Center, CDO", status: "open", serving: 5, inQueue: 8, waitPer: 3 },
  { id: 3, name: "SSS CDO Branch", type: "government", address: "CM Recto Ave, CDO", status: "open", serving: 33, inQueue: 22, waitPer: 4 },
  { id: 4, name: "PhilHealth – CDO", type: "government", address: "Pabayo St, CDO", status: "busy", serving: 12, inQueue: 31, waitPer: 5 },
  { id: 5, name: "Meralco Payment Center", type: "utility", address: "Lapasan, CDO", status: "open", serving: 7, inQueue: 6, waitPer: 2 },
  { id: 6, name: "Maynilad Service Center", type: "utility", address: "Carmen, CDO", status: "closed", serving: 0, inQueue: 0, waitPer: 3 },
  { id: 7, name: "LTO CDO Extension", type: "government", address: "Bulua, CDO", status: "busy", serving: 44, inQueue: 18, waitPer: 6 },
  { id: 8, name: "RCBC – Cogon Branch", type: "bank", address: "Cogon Market, CDO", status: "open", serving: 9, inQueue: 4, waitPer: 2 },
];

export const INSTITUTION_ICONS: Record<InstitutionType, string> = {
  bank: "🏦",
  government: "🏛️",
  utility: "⚡",
};

export const TYPE_LABELS: Record<InstitutionType, string> = {
  bank: "Bank",
  government: "Government Office",
  utility: "Utility Provider",
};