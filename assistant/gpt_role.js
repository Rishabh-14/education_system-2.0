/*
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();


if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing or invalid.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  // Define the messages array
  const messages = [
    {
      role: "system",
      content: `this is a conversation between a teacher and multiple students. 
        In each conversation role would be given whether it is a teacher or a student. 
        Teacher and student answer alternatively.`,
    },
    {
      role: "user",
      content: `{role:teacher} here is your role tell me who you are.`,
    },
  ];

  // Add the new message to the messages array
  messages.push({
    role: "user",
    content: "{role:student} I am a student what are you",
  });

  // Make the API call with the defined messages
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  // Log the response
  console.log(completion.choices[0].message.content);
}

main();
*/

import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing or invalid.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to initialize the messages array
function initializeMessages() {
  const messages = [
    {
      role: "system",
      content: `this is a conversation between a teacher and multiple students. 
        In each conversation role would be given whether it is a teacher or a student. 
        Teacher and student answer alternatively.`,
    },
    {
      role: "user",
      content: `{role:teacher} here is your role tell me who you are.`,
    },
  ];
  return messages;
}

// Function to add a message to the messages array
function addMessage(messages, role, content) {
  messages.push({
    role: role,
    content: content,
  });
}

// Function to call the OpenAI API and get the completion
async function main() {
  // Initialize messages
  let messages = initializeMessages();

  // Add a new message
  addMessage(messages, "user", "{role:student} I am a student what are you");

  // Make the API call with the defined messages
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  // Log the response ID and the response content
  console.log("Response ID:", completion.id);

  // Log the response
  console.log(completion.choices[0].message.content);
}

main();
