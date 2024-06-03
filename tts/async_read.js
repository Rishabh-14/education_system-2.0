// tts/async_read.js
import fs from "fs/promises";

export async function readFileAsync(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading the file:", err);
    throw err;
  }
}
