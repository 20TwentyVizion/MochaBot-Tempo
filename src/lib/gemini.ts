import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error(
    "Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file",
  );
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function chatWithGemini(message: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    throw error;
  }
}
