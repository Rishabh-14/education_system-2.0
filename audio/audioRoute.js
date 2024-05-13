import express from "express";
import { Readable } from "node:stream";
import OpenAI from "openai";
import * as PlayHT from "playht";

// Initialize OpenAI
const openai = new OpenAI({
  organization: "org-wPE92Eb5Vy76wMJfsvEGXaDf",
  apiKey: "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",
});

// Initialize PlayHT
PlayHT.init({
  apiKey: "df4fbd04fd7144b389988fb2eaf041bf",
  userId: "pIrXpY8x7HXpxbATYZfR5HQgpLR2",
});

const setupAudioRoute = (app) => {
  app.get("/audio", async (req, res) => {
    try {
      res.set({
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      });

      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Tell me a joke." }],
        model: "gpt-3.5-turbo",
        stream: true,
      });

      const [responseStream1, _] = chatGptResponseStream.tee();

      const textStream = new Readable({
        async read() {
          for await (const part of responseStream1) {
            this.push(part.choices[0]?.delta?.content || "");
          }
          this.push(null); // Ensure to end the stream properly
        },
      });

      const audioStream = await PlayHT.stream(textStream);

      // Pipe PlayHT audio stream directly to the response
      audioStream.pipe(res);
    } catch (error) {
      console.error("Failed to stream audio:", error);
      res.status(500).send("Failed to stream audio");
    }
  });
};

export default setupAudioRoute;
