import data from "@/data/derma-care.json";
import type { Remedy } from "@/types";

const remedies = (data as { remedies: Remedy[] }).remedies;

export function getAllRemedies(): Remedy[] {
  return remedies;
}

export function getRemedyById(id: string): Remedy | undefined {
  return remedies.find((remedy) => remedy.id === id);
}

export function searchRemedies(query: string): Remedy[] {
  const q = query.trim().toLowerCase();
  if (!q) return remedies;

  return remedies.filter((remedy) => {
    const haystack = [
      remedy.name,
      remedy.category,
      remedy.notes,
      remedy.method,
      remedy.safety,
      remedy.keywords.join(" "),
      remedy.concerns.join(" "),
      remedy.bestFor.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function filterBySkinType(skinType: string): Remedy[] {
  if (!skinType) return remedies;
  return remedies.filter((remedy) =>
    remedy.skinTypes.includes(skinType) || remedy.skinTypes.includes("All"),
  );
}

export function filterByConcern(concern: string): Remedy[] {
  if (!concern) return remedies;
  return remedies.filter((remedy) =>
    remedy.concerns.some((item) => item.toLowerCase() === concern.toLowerCase()),
  );
}

export function getCompatibleRemedies(context: {
  skinType?: string;
  concern?: string;
  knownSensitivities?: string[];
  allergies?: string[];
  activeIrritation?: boolean;
  brokenSkin?: boolean;
  severeDermatitis?: boolean;
  infection?: boolean;
  openWounds?: boolean;
} = {}): Remedy[] {
  const {
    skinType,
    concern,
    knownSensitivities = [],
    allergies = [],
    activeIrritation,
    brokenSkin,
    severeDermatitis,
    infection,
    openWounds,
  } = context;

  return remedies.filter((remedy) => {
    const matchesSkin = skinType ? remedy.skinTypes.includes(skinType) || remedy.skinTypes.includes("All") : true;
    const matchesConcern = concern ? remedy.concerns.some((item) => item.toLowerCase() === concern.toLowerCase()) : true;
    const hasSensitivityConflict = knownSensitivities.some((s) =>
      remedy.keywords.some((k) => k.toLowerCase().includes(s.toLowerCase())) ||
      remedy.avoidIf.some((a) => a.toLowerCase().includes(s.toLowerCase())),
    );
    const hasAllergyConflict = allergies.some((a) =>
      remedy.keywords.some((k) => k.toLowerCase().includes(a.toLowerCase())) ||
      remedy.notes.toLowerCase().includes(a.toLowerCase()),
    );
    const unsafeSkinState = activeIrritation || brokenSkin || severeDermatitis || infection || openWounds;

    return matchesSkin && matchesConcern && !hasSensitivityConflict && !hasAllergyConflict && !unsafeSkinState;
  });
}

export function isRemedySafe(remedy: Remedy, context: {
  knownSensitivities?: string[];
  allergies?: string[];
  activeIrritation?: boolean;
  brokenSkin?: boolean;
  severeDermatitis?: boolean;
  infection?: boolean;
  openWounds?: boolean;
  skinType?: string;
} = {}): boolean {
  const blocked = ["lemon juice", "baking soda", "toothpaste", "undiluted essential oils", "abrasive scrubs"];
  const text = `${remedy.name} ${remedy.notes} ${remedy.method} ${remedy.safety}`.toLowerCase();

  if (blocked.some((item) => text.includes(item))) {
    return false;
  }

  if (
    context.activeIrritation ||
    context.brokenSkin ||
    context.severeDermatitis ||
    context.infection ||
    context.openWounds
  ) {
    return false;
  }

  if (context.knownSensitivities?.length && remedy.avoidIf.some((item) => item.toLowerCase().includes("sensitivity"))) {
    return false;
  }

  return true;
}

export function getSafetyWarnings(remedy: Remedy, context: {
  knownSensitivities?: string[];
  allergies?: string[];
  activeIrritation?: boolean;
  brokenSkin?: boolean;
  severeDermatitis?: boolean;
  infection?: boolean;
  openWounds?: boolean;
} = {}): string[] {
  const warnings = [...remedy.avoidIf];

  if (remedy.frequency.toLowerCase().includes("not recommended")) {
    warnings.push("Not recommended for active treatment.");
  }

  if (remedy.evidenceLevel === "Limited evidence" || remedy.evidenceLevel === "Traditional use") {
    warnings.push(remedy.evidenceLevel === "Limited evidence" ? "Limited evidence" : "Traditional use");
  }

  if (context.activeIrritation || context.brokenSkin || context.severeDermatitis || context.infection || context.openWounds) {
    warnings.push("Do not apply to broken, infected, or severely irritated skin. Seek professional advice if appropriate.");
  }

  if (remedy.name.toLowerCase().includes("lemon") || remedy.name.toLowerCase().includes("baking") || remedy.name.toLowerCase().includes("toothpaste")) {
    warnings.push("This ingredient is not recommended for facial DIY use.");
  }

  return warnings;
}
