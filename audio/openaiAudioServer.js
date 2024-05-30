<<<<<<< Updated upstream
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
=======
/* Working
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/tts', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Text input is required');
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,

    });

    const speechBuffer = Buffer.from(await mp3.arrayBuffer());
    const speechFilePath = path.resolve('./speech.mp3');
    
    // Save the MP3 file temporarily
    await fs.promises.writeFile(speechFilePath, speechBuffer);

    // Stream the MP3 file to the client
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
    });

    const readStream = fs.createReadStream(speechFilePath);
    readStream.pipe(res);

    readStream.on('end', () => {
      // Delete the temporary file after streaming
      fs.unlink(speechFilePath, (err) => {
        if (err) {
          console.error('Failed to delete temporary file:', err);
        }
      });
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).send('Failed to generate speech');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/

// Opus Working

/*
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/tts', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Text input is required');
  }

  try {
    const opus = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
      output_format: 'opus', // Specify OPUS format
    });

    const speechBuffer = Buffer.from(await opus.arrayBuffer());
    const speechFilePath = path.resolve('./speech.opus');

    // Save the OPUS file temporarily
    await fs.promises.writeFile(speechFilePath, speechBuffer);

    // Stream the OPUS file to the client
    res.set({
      'Content-Type': 'audio/ogg', // OPUS is often wrapped in Ogg containers
      'Content-Disposition': 'inline',
    });

    const readStream = fs.createReadStream(speechFilePath);
    readStream.pipe(res);

    readStream.on('end', () => {
      // Delete the temporary file after streaming
      fs.unlink(speechFilePath, (err) => {
        if (err) {
          console.error('Failed to delete temporary file:', err);
        }
      });
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).send('Failed to generate speech');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/


import express from "express";
import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).send("Prompt is required");
      }

      res.set({
        "Content-Type": "audio/ogg", // OPUS is often wrapped in Ogg containers
        "Transfer-Encoding": "chunked",
      });

      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        stream: true,
      });

      const [responseStream1, _] = chatGptResponseStream.tee();

      let textContent = "";
      for await (const part of responseStream1) {
        const contentPart = part.choices[0]?.delta?.content || "";
        textContent += contentPart;
        process.stdout.write(contentPart); // This will log the stream chunks to the console
      }

      if (textContent) {
        const audioResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: textContent,
          output_format: "opus",
        });

        const audioStream = audioResponse.body;

        audioStream.on("data", (chunk) => {
          res.write(chunk);
          console.log("Audio Stream Chunk:", chunk);
        });

        audioStream.on("end", () => {
          res.end();
          console.log("Audio stream ended.");
        });

        audioStream.on("error", (error) => {
          console.error("Failed to stream audio:", error);
          res.status(500).send("Failed to stream audio");
        });
      } else {
        res.status(500).send("Failed to generate text content");
      }

    } catch (error) {
      console.error("Failed to stream audio:", error);
      res.status(500).send("Failed to stream audio");
    }
  });
};

setupAudioRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


>>>>>>> Stashed changes
