import { NextResponse } from "next/server";
import { z } from "zod";
import { getMockAnalysis } from "@/lib/api/mockAnalysis";

const analyzeSchema = z.object({
  imageDataUrl: z.string().optional(),
  ageRange: z.string().min(1),
  skinType: z.string().min(1),
  mainConcern: z.string().min(1),
  duration: z.string().min(1),
  routine: z.string().min(1),
  sensitivities: z.string().min(1),
  products: z.string().min(1),
});

function extractJsonFromGemini(text: string) {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : JSON.parse(cleaned);
}

export async function POST(request: Request) {
  let requestBody: Record<string, unknown> = {};

  try {
    const body = (await request.json()) as Record<string, unknown> & { uid?: unknown };
    requestBody = (body ?? {}) as Record<string, unknown>;
    requestBody = Object.fromEntries(Object.entries(requestBody).filter(([key]) => key !== "uid"));
    const parsed = analyzeSchema.safeParse(requestBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the questionnaire before analyzing." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (!geminiKey) {
      const mockAnalysis = getMockAnalysis();
      return NextResponse.json({
        analysis: mockAnalysis,
        demoMode: true,
        message: "Demo Mode: GEMINI_API_KEY is not configured. This result is educational only.",
      });
    }

    const prompt = `
You are an educational skin wellness assistant.
Do not diagnose a disease, do not provide prescriptions, and do not claim certainty.
Return valid JSON only with this exact shape:
{
  "observations": string[],
  "confidence": "low" | "moderate" | "high",
  "possibleCategories": string[],
  "educationalExplanation": string,
  "generalCareConsiderations": string[],
  "professionalCareIndicators": string[],
  "safetyWarnings": string[],
  "selectedReferences": [{ "id": string, "name": string, "reason": string }]
}

User context:
- ageRange: ${parsed.data.ageRange}
- skinType: ${parsed.data.skinType}
- mainConcern: ${parsed.data.mainConcern}
- duration: ${parsed.data.duration}
- routine: ${parsed.data.routine}
- sensitivities: ${parsed.data.sensitivities}
- products: ${parsed.data.products}

Image information: ${parsed.data.imageDataUrl ? "An image was provided for visual review." : "No image was uploaded."}

Use cautious, empowering language such as preliminary observation, possible category, may be associated with, educational information, and consider consulting a qualified dermatologist.
`;

    const imagePart = parsed.data.imageDataUrl?.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
    const parts: Array<Record<string, unknown>> = [{ text: prompt }];
    if (imagePart) {
      parts.push({ inlineData: { mimeType: imagePart[1], data: imagePart[2] } });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const geminiData = await response.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("\n") || "{}";
    const analysis = extractJsonFromGemini(text);

    const result = {
      observations: Array.isArray(analysis.observations) ? analysis.observations : [],
      confidence: ["low", "moderate", "high"].includes(analysis.confidence) ? analysis.confidence : "low",
      possibleCategories: Array.isArray(analysis.possibleCategories) ? analysis.possibleCategories : [],
      educationalExplanation: typeof analysis.educationalExplanation === "string" ? analysis.educationalExplanation : "",
      generalCareConsiderations: Array.isArray(analysis.generalCareConsiderations) ? analysis.generalCareConsiderations : [],
      professionalCareIndicators: Array.isArray(analysis.professionalCareIndicators) ? analysis.professionalCareIndicators : [],
      safetyWarnings: Array.isArray(analysis.safetyWarnings) ? analysis.safetyWarnings : [],
      selectedReferences: Array.isArray(analysis.selectedReferences) ? analysis.selectedReferences : [],
      demoMode: false,
    };

    return NextResponse.json({ analysis: result, demoMode: false });
  } catch {
    const fallbackAnalysis = getMockAnalysis();
    return NextResponse.json(
      {
        error: "The AI analysis could not be completed. Please retry or switch to Demo Mode.",
        analysis: fallbackAnalysis,
        demoMode: true,
        message: "Demo Mode fallback triggered because the Gemini API was unavailable or the key is invalid.",
      },
      { status: 200 },
    );
  }
}
