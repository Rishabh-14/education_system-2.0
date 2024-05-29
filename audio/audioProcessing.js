import { Readable } from "stream";
import openai from "./config/openaiClient.js";

const generateAndStreamAudio = async (text, res) => {
  if (!text.trim()) return;

  const textStream = new Readable({
    read() {
      this.push(text);
      this.push(null);
    },
  });

  const audioResponse = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
    output_format: "opus",
    stream: true,
  });

  return new Promise((resolve, reject) => {
    audioResponse.body.on("data", (chunk) => {
      res.write(chunk);
      console.log("Audio Stream Chunk:", chunk);
    });

    audioResponse.body.on("end", resolve);
    audioResponse.body.on("error", reject);
  });
};

export { generateAndStreamAudio };
