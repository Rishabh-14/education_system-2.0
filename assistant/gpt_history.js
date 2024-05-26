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

// Example usage
const chatId = "chatcmpl-9T4GEG1ivDOwREw78fNtXZvDhc72c";
const userMessage = "How do I retrieve the whole conversation?";
const userRole = "Student"; // You can change this to "Teacher" if needed

// Get response from OpenAI
getResponse(userMessage, chatId, userRole).then((assistantResponse) => {
  // Print the response
  console.log(assistantResponse);

  // Check the updated conversation history for the chat ID
  console.log(conversationHistories[chatId]);
});
