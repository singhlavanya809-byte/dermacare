export async function analyzeSkin(payload: Record<string, unknown>) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Analysis failed");
  }

  return response.json();
}

export async function getWeather() {
  const response = await fetch("/api/weather");
  if (!response.ok) throw new Error("Unable to load weather data");
  return response.json();
}

