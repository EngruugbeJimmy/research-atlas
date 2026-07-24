import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  try {
    const models = await ai.models.list();

    return NextResponse.json(models);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}