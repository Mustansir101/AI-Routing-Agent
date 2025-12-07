import { NextRequest, NextResponse } from "next/server";
import { getLLMRouting } from "@/app/services/MCP";
import { mcpRouter } from "@/app/services/MCP";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Please provide a 'query' field with your question." },
        { status: 400 }
      );
    }
    console.log(`[API] Received query: "${query}"`);

    // Send query to LLM to get routing instructions
    const { toolName, arguments: toolArgs } = await getLLMRouting(query);

    // MCP Router calls the appropriate tool
    const finalAnswer = await mcpRouter(toolName, toolArgs);

    return NextResponse.json({
      answer: finalAnswer,
    });
  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json(
      { error: error.message || "An error occurred processing your request." },
      { status: 500 }
    );
  }
}
