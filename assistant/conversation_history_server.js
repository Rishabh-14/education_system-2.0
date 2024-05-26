import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing or invalid.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize an object to store conversation histories
const conversationHistories = {};

const app = express();
app.use(bodyParser.json());

// Function to get response from OpenAI API
async function getResponse(prompt, chatId, role) {
  // Retrieve the conversation history for the given chat ID
  const conversationHistory = conversationHistories[chatId] || [];

  // Concatenate the conversation history and the new prompt
  const fullPrompt = conversationHistory
    .concat(`${role}: ${prompt}`)
    .join("\n");

  const messages = [
    {
      role: "system",
      content:
        "This is a conversation between a teacher and a student. The teacher and student answer alternatively.",
    },
    { role: "user", content: fullPrompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or any model you are using
    messages: messages,
  });

  // Extract the assistant's response
  const assistantResponse = response.choices[0].message.content;

  // Update the conversation history for the given chat ID
  conversationHistories[chatId] = conversationHistory.concat(
    `${role}: ${prompt}`,
    `Assistant: ${assistantResponse}`
  );

  return assistantResponse;
}

// Endpoint to send a message and get a response
app.post("/chat", async (req, res) => {
  const { chatId, message, role } = req.body;

  if (!chatId || !message || !role) {
    return res.status(400).send("chatId, message, and role are required.");
  }

  try {
    const response = await getResponse(message, chatId, role);
    res.json({ response, conversationHistory: conversationHistories[chatId] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
