
import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const getChat = (userName: string) => {
    const aiInstance = getAI();
    if (!chat) {
         chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Vera, a friendly and helpful personal voice assistant. You are speaking to a user named ${userName}. Keep your responses concise, conversational, and helpful. When asked to perform an action you cannot do (like playing music or controlling smart home devices), politely explain your limitation.`,
            },
        });
    }
    return chat;
}

export const getVeraResponse = async (
  prompt: string,
  history: any[],
  userName: string
): Promise<string> => {
  try {
    const chatInstance = getChat(userName);

    // If history is empty, this is a new conversation
    if (history.length === 0) {
        // Clear any old chat history on new conversation
        chat = null; 
        const freshChat = getChat(userName);
        const response = await freshChat.sendMessage({ message: prompt });
        return response.text;
    } else {
        const response = await chatInstance.sendMessage({ message: prompt });
        return response.text;
    }

  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "I'm having a little trouble connecting right now. Please try again in a moment.";
  }
};
