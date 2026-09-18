export type SkinType = "Dry" | "Oily" | "Combination" | "Sensitive" | "Normal";
export type Concern = "Dryness" | "Acne" | "Sensitivity" | "Dullness" | "Texture" | "Redness" | "Pigmentation";

export type AnalysisResult = {
  observations: string[];
  confidence: "low" | "moderate" | "high";
  possibleCategories: string[];
  educationalExplanation: string;
  generalCareConsiderations: string[];
  professionalCareIndicators: string[];
  safetyWarnings: string[];
  selectedReferences: { id: string; name: string; reason: string }[];
  demoMode?: boolean;
};

export type JournalEntry = {
  id?: string;
  date: string;
  concern: string;
  notes: string;
  products: string;
  rating: number;
  imageRef?: string;
  createdAt?: string;
};

export type Remedy = {
  id: string;
  name: string;
  category: string;
  skinTypes: string[];
  concerns: string[];
  evidenceLevel: "Traditional use" | "Limited evidence" | "Moderate evidence" | "Evidence-supported soothing";
  traditionalUses: string[];
  bestFor: string[];
  avoidIf: string[];
  method: string;
  frequency: string;
  safety: string;
  notes: string;
  keywords: string[];
};

export type WeatherData = {
  temperature: number;
  humidity: number;
  weather: string;
  uvIndex?: number;
  airQuality?: number;
  source: "demo" | "api";
};

export type Provider = {
  id: string;
  name: string;
  address: string;
  distance?: string;
  phone?: string;
  openingHours?: string;
  website?: string;
  image?: string;
};

export type AuthUser = {
  uid: string;
  email: string;
  displayName?: string;
};
