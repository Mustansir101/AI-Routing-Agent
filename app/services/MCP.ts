import { weatherTool } from "@/app/tools/Weather";
import { databaseTool } from "@/app/tools/Database";

// MCP Router
export async function mcpRouter(
  toolName: string,
  toolArguments: any
): Promise<string> {
  console.log(`[MCP Router] Routing to: ${toolName}`, toolArguments);

  switch (toolName) {
    case "weather_tool":
      return await weatherTool(toolArguments.location);

    case "database_tool":
      return await databaseTool(
        toolArguments.query_type,
        toolArguments.time_period,
        toolArguments.department
      );

    default:
      return "I'm sorry, I don't have the right tool to answer that question.";
  }
}

// LLM INTEGRATION using Gemini
export async function getLLMRouting(
  userQuery: string
): Promise<{ toolName: string; arguments: any }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const systemPrompt = `You are a routing assistant that analyzes user queries and determines which tool to use.

Available Tools:
1. weather_tool: Use this for questions about weather in any location
   - Parameters: location (string) - city name
   
2. database_tool: Use this for questions about employees, hiring, departments
   - Parameters: 
     - query_type (required): "count_all" | "count_recent" | "list_all" | "count_by_department"
     - time_period (optional): "last_week" | "last_month"
     - department (optional): department name

You must respond with ONLY a JSON object in this exact format:
{
  "toolName": "weather_tool" or "database_tool",
  "arguments": { ... parameters ... }
}

Examples:
User: "What's the weather in London?"
Response: {"toolName": "weather_tool", "arguments": {"location": "London"}}

User: "How many employees joined last month?"
Response: {"toolName": "database_tool", "arguments": {"query_type": "count_recent", "time_period": "last_month"}}

No explanations, just the JSON.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Query: ${userQuery}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 256,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!responseText) {
    throw new Error("Gemini did not provide a response");
  }

  // Clean up the response text (remove markdown formatting if present)
  let cleanedText = responseText.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.slice(7);
  }
  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.slice(3);
  }
  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(0, -3);
  }
  cleanedText = cleanedText.trim();

  try {
    const parsed = JSON.parse(cleanedText);
    return {
      toolName: parsed.toolName,
      arguments: parsed.arguments,
    };
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", cleanedText);
    throw new Error("Failed to parse routing instructions from Gemini");
  }
}
