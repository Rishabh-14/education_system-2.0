// tts/assistant.js
/*
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI();

export async function assist(type) {
  let assistant;
  if (type == "teacher") {
    assistant = await openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: "Math Tutor",
      instructions: `You are a ${type} . Write maths equations.`,
    });
  } else {
    assistant = await openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: "Math Tutor",
      instructions: `You are a ${type} . Ask questions regarding philosphy`,
    });
  }
  return assistant;
}
async function main(type, content) {
  const assistant = await assist(type);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
  });

  const stream = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    stream: true,
  });

  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const chunk = event.data.delta.content?.[0];
      if (chunk && "text" in chunk && chunk.text.value) {
        process.stdout.write(chunk.text.value);
      }
    }
  }

  console.log();
}

//main("teacher", "tell me a joke");
*/

// tts/assistant.js

/*
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createAssistant(role) {
  const instructions =
    role === "teacher"
      ? "You are a teacher. Provide educational content and ask relevant questions."
      : "You are a student. Ask questions and seek clarifications.";

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
*/

// tts/assistant.js

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createAssistant(role) {
  const instructions =
    role === "teacher"
      ? "You are a teacher. Provide educational content and ask relevant questions."
      : "You are a student. Tell me a joke.";

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
