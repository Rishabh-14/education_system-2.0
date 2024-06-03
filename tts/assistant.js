// tts/assistant.js

import OpenAI from "openai";
import dotenv from "dotenv";
import { readFileAsync } from "./async_read.js";

dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createAssistant(role) {
  let additionalData = "";

  if (role === "teacher") {
    try {
      additionalData = await readFileAsync("./tts/Mr_Ranedeer.txt"); // Adjust the path as necessary
    } catch (err) {
      console.error("Failed to read teacher data:", err);
    }
  }

  const instructions =
    role === "teacher"
      ? `You are a teacher. Provide educational content and answer should be in a format "[teacher]: your speech.Use the following to enhance learning style ${additionalData}"`
      : `You are a student. repeat the last message just said and tell a joke about it by laughing and answer should be of format "[student] : your answer"`;

  const assistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo",
    name: `${role.charAt(0).toUpperCase() + role.slice(1)} Assistant`,
    instructions: instructions,
  });

  return assistant;
}

export async function generateResponse(assistant, conversationHistory, prompt) {
  const thread = await openai.beta.threads.create({
    messages: [...conversationHistory, { role: "user", content: prompt }],
  });

  const stream = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    stream: true,
  });

  let accumulatedText = "";
  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const chunk = event.data.delta.content?.[0];
      if (chunk && "text" in chunk && chunk.text.value) {
        accumulatedText += chunk.text.value;
      }
    }
  }

  conversationHistory.push({ role: "assistant", content: accumulatedText });
  return { accumulatedText, conversationHistory };
}
