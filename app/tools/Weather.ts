export function weatherTool(location: string): string {
  const weatherData: Record<string, { temp: number; condition: string }> = {
    london: { temp: 12, condition: "cloudy with light rain" },
    "san francisco": { temp: 18, condition: "clear skies" },
    "new york": { temp: 8, condition: "partly cloudy" },
    tokyo: { temp: 15, condition: "sunny" },
    paris: { temp: 10, condition: "overcast" },
  };

  const normalizedLocation = location.toLowerCase();

  const weather = weatherData[normalizedLocation] || {
    temp: null,
    condition: "",
  };

  if (weather.temp === null) {
    return `I'm sorry, I don't have weather data for ${location}.`;
  }
  return `The current weather in ${location} is ${weather.temp}°C with ${weather.condition}.`;
}