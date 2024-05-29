/*
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
*/

/*

import express from "express";
import { Readable } from "stream";
import OpenAI from "openai";
import * as PlayHT from "playht";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

// Initialize PlayHT
PlayHT.init({
  apiKey: process.env.PLAYHT_API_KEY, // Use environment variable for security
  userId: process.env.PLAYHT_USER_ID, // Use environment variable for security
});

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      const { prompt } = req.body;

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
          this.push(null);
        },
      });

      const audioStream = await PlayHT.stream(textStream);

      audioStream.on("data", (chunk) => {
        res.write(chunk);
      });

      audioStream.on("end", () => {
        res.end();
      });

      audioStream.on("error", (error) => {
        console.error("Failed to stream audio:", error);
        res.status(500).send("Failed to stream audio");
      });
    } catch (error) {
      console.error("Failed to stream audio:", error);
      res.status(500).send("Failed to stream audio");
    }
  });
};

export default setupAudioRoute;
*/

/* Working low latency
import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

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

      // Stream the text response from OpenAI's GPT-3
      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        stream: true,
      });

      let accumulatedText = "";

      // Function to process each chunk of text
      const processTextChunk = async (textChunk) => {
        accumulatedText += textChunk;
        const wordCount = accumulatedText.split(/\s+/).length;
        if (wordCount >= 3) {
          await generateAndStreamAudio(accumulatedText);
          accumulatedText = ""; // Reset the accumulated text
        }
      };

      // Function to generate and stream audio
      const generateAndStreamAudio = async (text) => {
        const textStream = new Readable({
          read() {
            this.push(text);
            this.push(null);
          }
        });

        const audioResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: text,
          output_format: "opus",
          stream: true,
        });

        audioResponse.body.on("data", (chunk) => {
          res.write(chunk);
          console.log("Audio Stream Chunk:", chunk);
        });

        audioResponse.body.on("end", () => {
          console.log("Audio chunk stream ended.");
        });

        audioResponse.body.on("error", (error) => {
          console.error("Failed to stream audio chunk:", error);
          if (!res.headersSent) {
            res.status(500).send("Failed to stream audio");
          }
        });
      };

      // Read and process text chunks from the GPT-3 response
      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      // Process any remaining text
      if (accumulatedText.length > 0) {
        await generateAndStreamAudio(accumulatedText);
      }

      if (!res.writableEnded) {
        res.end();
        console.log("Audio stream ended.");
      }

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

/* Working but latency is still high

import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

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

      let accumulatedText = "";
      let processingPromise = Promise.resolve();

      // Function to process each chunk of text
      const processTextChunk = async (textChunk) => {
        accumulatedText += textChunk;
        const wordCount = accumulatedText.split(/\s+/).length;
        if (wordCount >= 1) {
          const textToProcess = accumulatedText;
          accumulatedText = ""; // Reset the accumulated text
          
          // Chain the processing promises to ensure they run sequentially
          processingPromise = processingPromise.then(() => generateAndStreamAudio(textToProcess));
        }
      };

      // Function to generate and stream audio
      const generateAndStreamAudio = async (text) => {
        const textStream = new Readable({
          read() {
            this.push(text);
            this.push(null);
          }
        });

        const audioResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: text,
          output_format: "opus",
          stream: true,
        });

        audioResponse.body.on("data", (chunk) => {
          res.write(chunk);
          console.log("Audio Stream Chunk:", chunk);
        });

        return new Promise((resolve, reject) => {
          audioResponse.body.on("end", () => {
            console.log("Audio chunk stream ended.");
            resolve();
          });

          audioResponse.body.on("error", (error) => {
            console.error("Failed to stream audio chunk:", error);
            reject(error);
          });
        });
      };

      // Read and process text chunks from the GPT-3 response
      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      // Wait for any remaining processing to complete
      await processingPromise;

      if (!res.writableEnded) {
        res.end();
        console.log("Audio stream ended.");
      }

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

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map();

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).send("Prompt is required");
      }

      res.set({
        "Content-Type": "audio/ogg",
        "Transfer-Encoding": "chunked",
      });

      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        stream: true,
      });

      let accumulatedText = "";
      let processingPromise = Promise.resolve();

      const processTextChunk = async (textChunk) => {
        accumulatedText += textChunk;
        const words = accumulatedText.split(/\s+/);
        if (words.length >= 1) {
          const textToProcess = words.join(" ");
          accumulatedText = "";

          processingPromise = processingPromise.then(() => generateAndStreamAudio(textToProcess));
        }
      };

      const generateAndStreamAudio = async (text) => {
        if (cache.has(text)) {
          res.write(cache.get(text));
          return;
        }

        const audioResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: text,
          output_format: "opus",
          stream: true,
        });

        const audioData = [];
        for await (const chunk of audioResponse.body) {
          audioData.push(chunk);
          res.write(chunk);
        }

        const audioBuffer = Buffer.concat(audioData);
        cache.set(text, audioBuffer);
      };

      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      await processingPromise;

      if (!res.writableEnded) {
        res.end();
      }

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

import { Readable } from "stream";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const setupAudioRoute = (app) => {
  app.post("/audio", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).send("Prompt is required");
      }

      res.set({
        "Content-Type": "audio/ogg",
        "Transfer-Encoding": "chunked",
      });

      const chatGptResponseStream = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        stream: true,
        max_tokens: 50, // Limiting the number of tokens generated to reduce latency
      });

      let accumulatedText = "";
      let processingPromise = Promise.resolve();

      const processTextChunk = async (textChunk) => {
        accumulatedText += textChunk;
        const words = accumulatedText.split(/\s+/);

        if (words.length >= 1) {
          const textToProcess = words.splice(0, 1).join(" ");
          accumulatedText = words.join(" ");

          processingPromise = processingPromise.then(() =>
            generateAndStreamAudio(textToProcess)
          );
        }
      };

      const generateAndStreamAudio = async (text) => {
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

      for await (const part of chatGptResponseStream) {
        const textPart = part.choices[0]?.delta?.content || "";
        await processTextChunk(textPart);
      }

      await processingPromise;

      if (!res.writableEnded) {
        res.end();
      }
    } catch (error) {
      console.error("Failed to stream audio:", error);
      if (!res.headersSent) {
        res.status(500).send("Failed to stream audio");
      }
    }
  });
};

export default setupAudioRoute;
