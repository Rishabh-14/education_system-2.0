import express from "express";
import { Readable } from "node:stream";
import OpenAI from "openai";
import * as PlayHT from "playht";
import dotenv from "dotenv"

dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

PlayHT.init({
  apiKey: process.env.PLAYHT_API_KEY, // Use environment variable for security
  userId: process.env.PLAYHT_USER_ID, // Use environment variable for security
});

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      const { prompt } = req.body; // Extract the prompt from the request body

      if (!prompt) {
        return res.status(400).send("Prompt is required");
      }

      res.set({
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      });

      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
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
