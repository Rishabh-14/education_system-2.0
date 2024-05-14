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

/*
const generateStory = (app) => {
  app.post("/generate-story", async (req, res) => {
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
*/
/*
const generateStory = (app) => {
    app.post("/generate-story", async (req, res) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "hi" },
            { role: "user", content: req.body.prompt },  // Use user's prompt from request body
          ],
          stream: false,  // Assuming non-stream for simplicity
        });
  
        res.json({ message: completion.choices[0].message.content });  // Send structured JSON response
      } catch (error) {
        console.error("Error generating story:", error);
        res.status(500).json({ message: "Failed to generate story", error: error.toString() });
      }
    });
  };
  
  export default generateStory;
*/

const generateAudioStory = (app) => {
    app.post("/generate-audio-story", async (req, res) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "hi" }, { role: "user", content: req.body.prompt }],
          stream: false,
        });
  
        const text = completion.choices[0].message.content;
  
        // Assuming you have a function to convert text to audio stream
        const audioStream = textToAudioStream(text); // This function needs to be implemented
  
        res.set({
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline",
        });
  
        audioStream.pipe(res); // Stream the audio directly to response
      } catch (error) {
        console.error("Error generating audio story:", error);
        res.status(500).json({ message: "Failed to generate audio story", error: error.toString() });
      }
    });
  };
  
  export default generateAudioStory;