import express from "express";
import bodyParser from "body-parser";
import { Readable } from "stream";
import dotenv from "dotenv";
import { createAssistant, generateResponse } from "../tts/assistant.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import OpenAI from "openai";

dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(bodyParser.json());

const assistants = {
  teacher: null,
  student: null,
};

const conversationHistories = new Map();

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Assistants
const initializeAssistants = async () => {
  assistants.teacher = await createAssistant("teacher");
  assistants.student = await createAssistant("student");
};

initializeAssistants();

// Function to write chat history to a text file
const writeHistoryToFile = async (userId, conversationHistory) => {
  try {
    const dirPath = path.join(__dirname, `../history`);
    const filePath = path.join(dirPath, `${userId}.txt`);

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    const historyText = conversationHistory
      .map((entry) => `${entry.role}: ${entry.content}`)
      .join("\n");

    await fs.writeFile(filePath, historyText, { flag: "a" });
  } catch (error) {
    console.error("Failed to write history to file:", error);
  }
};

// Setup audio route
const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      console.log("Request received:", req.body);

      const { userId, role, prompt } = req.body;

      if (!userId || !role || !prompt) {
        console.log("Missing userId, role, or prompt");
        return res.status(400).send("User ID, role, and prompt are required");
      }

      // Retrieve or initialize shared conversation history
      let conversationHistory = conversationHistories.get(userId);
      if (!conversationHistory) {
        conversationHistory = [];
        conversationHistories.set(userId, conversationHistory);
      }

      console.log(
        `Current conversation history for user ${userId}:`,
        conversationHistory
      );

      // Generate response using assistant and update shared conversation history
      const assistant = assistants[role];
      const { accumulatedText, conversationHistory: updatedHistory } =
        await generateResponse(assistant, conversationHistory, prompt);

      conversationHistories.set(userId, updatedHistory);

      console.log(
        `Updated conversation history for user ${userId}:`,
        updatedHistory
      );

      // Write updated history to file (non-blocking)
      writeHistoryToFile(userId, updatedHistory).catch(console.error);

      // Send the accumulated text back to the client
      res.json({ accumulatedText });
    } catch (error) {
      console.error("Failed to process request:", error);
      if (!res.headersSent) {
        res.status(500).send("Failed to process request");
      }
    }
  });

  app.post("/generate-audio", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).send("Text is required");
      }

      // Generate the audio from the accumulated text
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        output_format: "opus",
        stream: true,
      });

      res.set({
        "Content-Type": "audio/ogg", // OPUS is often wrapped in Ogg containers
        "Transfer-Encoding": "chunked",
      });

      audioResponse.body.on("data", (chunk) => {
        res.write(chunk);
        console.log("Audio Stream Chunk:", chunk);
      });

      audioResponse.body.on("end", () => {
        if (!res.writableEnded) {
          res.end();
          console.log("Audio stream ended.");
        }
      });

      audioResponse.body.on("error", (error) => {
        console.error("Failed to stream audio chunk:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to stream audio");
        }
      });
    } catch (error) {
      console.error("Failed to stream audio:", error);
      if (!res.headersSent) {
        res.status(500).send("Failed to stream audio");
      }
    }
  });
};

export default setupAudioRoute;
