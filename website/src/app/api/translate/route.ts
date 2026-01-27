import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a single prisma instance for reuse
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid text provided" },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // Check if translation already exists in cache
    try {
      const cachedTranslation = await prisma.translationCache.findUnique({
        where: { original_thai: trimmedText },
      });

      if (cachedTranslation) {
        return NextResponse.json({
          success: true,
          translation: cachedTranslation.translated_en,
          cached: true,
        });
      }
    } catch (dbError) {
      console.warn("Database cache lookup failed:", dbError);
      // Continue to translation if cache lookup fails
    }

    // If not cached, call Google Gemini API
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not configured in environment");
      console.log("Available env keys:", Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('API')));
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    console.log("✓ GOOGLE_API_KEY loaded successfully (length:", process.env.GOOGLE_API_KEY.length, ")");

    try {
      // Lazy-load Google Generative AI client only when needed
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      
      // Use gemini-pro which is available in free tier
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a professional HR translator. Translate the following Thai text to English. Maintain a professional, polite, and corporate tone. Translate ONLY the provided text, do not add explanations:

Thai: ${trimmedText}

English:`;

      const result = await model.generateContent(prompt);
      const translatedText = result.response.text().trim();

      if (!translatedText) {
        return NextResponse.json(
          { error: "Translation returned empty result" },
          { status: 500 }
        );
      }

      // Cache the translation
      try {
        await prisma.translationCache.create({
          data: {
            original_thai: trimmedText,
            translated_en: translatedText,
          },
        });
      } catch (cacheError) {
        console.warn("Failed to cache translation:", cacheError);
        // Still return the translation even if caching fails
      }

      return NextResponse.json({
        success: true,
        translation: translatedText,
        cached: false,
      });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      
      const errorMessage = 
        geminiError instanceof Error ? geminiError.message : "Translation service error";
      
      return NextResponse.json(
        { error: "Translation service unavailable", details: errorMessage },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Translation endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  try {
    await prisma.translationCache.count();
    return NextResponse.json(
      { status: "Translation service ready" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "Database unavailable" },
      { status: 503 }
    );
  }
}
