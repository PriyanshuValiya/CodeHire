const { GoogleGenerativeAI } = require("@google/generative-ai");

// const safetySettings = [
//   {
//     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//     threshold: HarmBlockThreshold.BLOCK_NONE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//     threshold: HarmBlockThreshold.BLOCK_NONE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//     threshold: HarmBlockThreshold.BLOCK_NONE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//     threshold: HarmBlockThreshold.BLOCK_NONE,
//   },
// ];

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY2;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // systemInstruction: instructions,
  // safetySettings,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({ generationConfig });
