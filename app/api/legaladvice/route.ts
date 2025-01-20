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
You are a legal advisor with expertise in Indian laws, focused on supporting young solopreneurs and startups. Your advice should be actionable and precise, always supported by references. For example, when discussing contracts, cite sections of the Indian Contract Act, 1872. Include dates, case names, and relevant laws like the Companies Act, 2013, and GST Act. Ensure clarity and simplicity in explanations while providing detailed advice on how to draft effective contracts, resolve disputes, and handle intellectual property, among other topics.Make sure to include case stduy section like somepast disupt like and the verdict of court in it.enlist law of consittuion even if there is no case or law in worst case includ the closest thing u can find but include it 
              `,
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
