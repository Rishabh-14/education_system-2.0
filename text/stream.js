/*
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const generateStory = (app) => {
  app.post("/text", async (req, res) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "hi" },
          { role: "user", content: "tell me a " },
        ],
        stream: true,
      });

      //res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Type", "text/plain");

      let first = true;
      for await (const chunk of completion) {
        const content = chunk.choices[0].delta?.content;
        if (content) {
          // Ensure content is not undefined
          if (!first) {
            res.write(",");
          }
          first = false;
          // Send the current chunk as a JSON string
          res.write(JSON.stringify(content));
        }
      }

      res.end();
    } catch (error) {
      console.error("Error generating story:", error);
      // Check if headers have not been sent before trying to set status or send response
      if (!res.headersSent) {
        res.status(500).send("Failed to generate story");
      }
    }
  });
};

export default generateStory;
*/

import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const generateStory = (app) => {
  app.post("/text", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).send("Prompt is required");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "hi" },
          { role: "user", content: prompt },
        ],
        stream: true,
      });

      res.setHeader("Content-Type", "text/plain");

      let first = true;
      for await (const chunk of completion) {
        const content = chunk.choices[0].delta?.content;
        if (content) {
          if (!first) {
            res.write(",");
          }
          first = false;
          res.write(JSON.stringify(content));
        }
      }

      res.end();
    } catch (error) {
      console.error("Error generating story:", error);
      if (!res.headersSent) {
        res.status(500).send("Failed to generate story");
      }
    }
  });
};

export default generateStory;
