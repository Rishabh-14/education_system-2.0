/*

// audio/openaaiAudioServer.js

import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

const setupAudioRoute = (app) => {
  // Store conversation history in memory (consider a more persistent storage for production)
  const conversationHistories = new Map();

  app.post("/audio", async (req, res) => {
    try {
      console.log("Request received:", req.body);

      const { userId, prompt } = req.body;

      if (!userId || !prompt) {
        console.log("Missing userId or prompt");
        return res.status(400).send("User ID and prompt are required");
      }

      // Retrieve or initialize conversation history for the user
      const conversationHistory = conversationHistories.get(userId) || [];

      // Add the new prompt to the conversation history
      conversationHistory.push({ role: "user", content: prompt });

      res.set({
        "Content-Type": "audio/ogg", // OPUS is often wrapped in Ogg containers
        "Transfer-Encoding": "chunked",
      });

      // Stream the text response from OpenAI's GPT-3
      const chatGptResponseStream = await openai.chat.completions.create({
        messages: conversationHistory,
        model: "gpt-3.5-turbo",
        stream: true,
      });

      let accumulatedText = "";

      // Function to process each chunk of text
      const processTextChunk = async (textChunk) => {
        if (!textChunk || textChunk.trim().length === 0) {
          return;
        }
        accumulatedText += textChunk;
      };

      // Read and process text chunks from the GPT-3 response
      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      if (accumulatedText.length === 0) {
        throw new Error("No valid text content generated");
      }

      // Add the response to the conversation history
      conversationHistory.push({ role: "assistant", content: accumulatedText });
      // Save updated conversation history back to the map
      conversationHistories.set(userId, conversationHistory);

      // Generate the audio from the accumulated text
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: accumulatedText,
        output_format: "opus",
        stream: true,
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
*/

/*
import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

const setupAudioRoute = (app) => {
  // Store conversation history in memory (consider a more persistent storage for production)
  const conversationHistories = {
    teacher: new Map(),
    student: new Map(),
  };

  app.post("/audio", async (req, res) => {
    try {
      console.log("Request received:", req.body);

      const { userId, role, prompt } = req.body;

      if (!userId || !role || !prompt) {
        console.log("Missing userId, role, or prompt");
        return res.status(400).send("User ID, role, and prompt are required");
      }

      // Retrieve or initialize conversation history for the user based on role
      const conversationHistory = conversationHistories[role].get(userId) || [];

      // Add the new prompt to the conversation history
      conversationHistory.push({ role: "user", content: prompt });

      res.set({
        "Content-Type": "audio/ogg", // OPUS is often wrapped in Ogg containers
        "Transfer-Encoding": "chunked",
      });

      // Stream the text response from OpenAI's GPT-3
      const chatGptResponseStream = await openai.chat.completions.create({
        messages: conversationHistory,
        model: "gpt-3.5-turbo",
        stream: true,
      });

      let accumulatedText = "";

      // Function to process each chunk of text
      const processTextChunk = async (textChunk) => {
        if (!textChunk || textChunk.trim().length === 0) {
          return;
        }
        accumulatedText += textChunk;
      };

      // Read and process text chunks from the GPT-3 response
      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      if (accumulatedText.length === 0) {
        throw new Error("No valid text content generated");
      }

      // Add the response to the conversation history
      conversationHistory.push({ role: "assistant", content: accumulatedText });
      // Save updated conversation history back to the map
      conversationHistories[role].set(userId, conversationHistory);

      // Generate the audio from the accumulated text
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: accumulatedText,
        output_format: "opus",
        stream: true,
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
*/

// audio/openaaiAudioServer.js

import express from "express";
import bodyParser from "body-parser";
import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";
import { createAssistant, generateResponse } from "../tts/assistant.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

const app = express();
app.use(bodyParser.json());

const assistants = {
  teacher: null,
  student: null,
};

const conversationHistories = {
  teacher: new Map(),
  student: new Map(),
};

const initializeAssistants = async () => {
  assistants.teacher = await createAssistant("teacher");
  assistants.student = await createAssistant("student");
};

initializeAssistants();

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      console.log("Request received:", req.body);

      const { userId, role, prompt } = req.body;

      if (!userId || !role || !prompt) {
        console.log("Missing userId, role, or prompt");
        return res.status(400).send("User ID, role, and prompt are required");
      }

      // Retrieve or initialize conversation history for the user based on role
      const conversationHistory = conversationHistories[role].get(userId) || [];

      // Generate response using assistant and update conversation history
      const assistant = assistants[role];
      const { accumulatedText, conversationHistory: updatedHistory } =
        await generateResponse(assistant, conversationHistory, prompt);

      conversationHistories[role].set(userId, updatedHistory);

      // Generate the audio from the accumulated text
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: accumulatedText,
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
