import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY)
  throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are the best coder that returns only code nothing else. there should be no comments(``` ```) only the function and its functin call and no mention of python",
      },
      {
        role: "user",
        content: `${prompt}`,
      },
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message.content);
}

main("matrix multiplication");
