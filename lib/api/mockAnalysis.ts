import type { AnalysisResult } from "@/types";

export function getMockAnalysis(): AnalysisResult {
  return {
    observations: [
      "A preliminary observation suggests a potentially dehydrated, mildly irritated skin surface.",
      "The overall appearance appears balanced but could benefit from barrier support and gentle hydration.",
    ],
    confidence: "moderate",
    possibleCategories: ["Dryness", "Sensitivity", "Barrier support needed"],
    educationalExplanation:
      "This demo result is based on a combination of the uploaded image and questionnaire context. It is intended to show how DermaSense may organize skin observations and educational guidance without making a medical diagnosis.",
    generalCareConsiderations: [
      "Use a gentle, non-stripping cleanser and barrier-supportive moisturizer.",
      "Aim for consistent hydration and avoid over-exfoliating while skin feels tight or reactive.",
      "Patch test new products before regular use, especially if you are sensitive.",
    ],
    professionalCareIndicators: [
      "Persistent redness, swelling, pain, or worsening irritation should be assessed by a qualified dermatologist.",
      "If you have a rash that is spreading, painful, or accompanied by fever, seek professional evaluation promptly.",
    ],
    safetyWarnings: [
      "DermaSense provides educational skin observations and general wellness information. It does not provide a medical diagnosis or replace professional medical advice.",
      "Demo Mode is for demonstration only and should not be treated as a real clinical assessment.",
    ],
    selectedReferences: [
      { id: "squalane-barrier", name: "Barrier-focused hydration", reason: "Supports gentle hydration and skin comfort." },
      { id: "ceramide-moisture", name: "Ceramide routine", reason: "Helpful for dryness and barrier support." },
    ],
    demoMode: true,
  };
}
