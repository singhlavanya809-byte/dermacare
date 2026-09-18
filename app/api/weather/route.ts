import { NextResponse } from "next/server";
import { getMockWeather } from "@/lib/api/mockWeather";

export async function GET() {
  if (!process.env.OPENWEATHER_API_KEY) {
    return NextResponse.json({ weather: getMockWeather(), demoMode: true });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=San%20Francisco&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("OpenWeather failed");
    }

    const data = await response.json();
    return NextResponse.json({
      weather: {
        temperature: Math.round(data.main?.temp || 0),
        humidity: data.main?.humidity || 0,
        weather: data.weather?.[0]?.main || "Clear",
        uvIndex: 5,
        airQuality: 42,
        source: "api",
      },
      demoMode: false,
    });
  } catch {
    return NextResponse.json({ weather: getMockWeather(), demoMode: true });
  }
}
