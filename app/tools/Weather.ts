export function weatherTool(location: string): string {
  const weatherData: Record<string, { temp: number; condition: string }> = {
    london: { temp: 12, condition: "cloudy with light rain" },
    "san francisco": { temp: 18, condition: "clear skies" },
    "new york": { temp: 8, condition: "partly cloudy" },
    tokyo: { temp: 15, condition: "sunny" },
    paris: { temp: 10, condition: "overcast" },
    dubai: { temp: 28, condition: "hot and sunny" },
    sydney: { temp: 24, condition: "breezy" },
    berlin: { temp: 5, condition: "cold and foggy" },
    mumbai: { temp: 32, condition: "humid" },
    moscow: { temp: -2, condition: "snowing" },
    rio: { temp: 30, condition: "tropical sun" },
    beijing: { temp: 4, condition: "hazy" },
    toronto: { temp: 0, condition: "freezing rain" },
    cairo: { temp: 22, condition: "sandstorm warning" },
    lagos: { temp: 26, condition: "scattered thunderstorms" },
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
