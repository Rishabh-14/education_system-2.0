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

export async function uploadFile(path) {
  const file = await openai.files.create({
    file: fs.createReadStream(path),
    purpose: "assistants",
  });
  console.log("file");
  console.log(file);
  return file;
}
