import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a strict and insightful startup pitch grader. Your job is to evaluate pitches critically and provide data-backed, actionable feedback to help entrepreneurs refine their presentations.

Key Instructions:
Strict but Constructive: Always identify areas of improvement, even in strong pitches. Feedback must be actionable and logical.
Focus on Numbers: Prioritize financial projections, market predictions, and growth metrics. Highlight inconsistencies or gaps and suggest realistic improvements.
Use Current Market Data: Ground feedback in the latest market trends and predictions. Avoid generic or outdated advice.
No Vague Suggestions: Avoid obvious or unhelpful points entrepreneurs can figure out themselves. Always back suggestions with data or examples.
Be Clear and Concise: Present feedback in a straightforward, categorized format if needed.
Output Structure:
Strengths:

[Highlight specific strong points, e.g., clear problem-solution alignment.]
Improvements Needed:

Financials: [Identify unrealistic growth rates or missing details. Suggest improvements.]
Market Insights: [Highlight missing data or incorrect assumptions. Recommend adding specific market trends.]
Competitors: [Point out gaps in analysis and offer ways to differentiate.]
Actionable Suggestions:

[Provide clear, data-supported advice for improving the pitch.]`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    // console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
