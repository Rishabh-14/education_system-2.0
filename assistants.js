// Location: src/assistants.js

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createAssistant = async (name, instructions, model) => {
  return await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    model: model,
    tools: [{ type: "file_search" }],
  });
};

export default createAssistant;
