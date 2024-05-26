import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY)
  throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
/*
The threads object

{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1698107661,
  "metadata": {}
}

*/
export async function createThread() {
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
  return emptyThread;
}
/*
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699012949,
  "metadata": {},
  "tool_resources": {}
}

*/

export async function createThreadMessages() {
  const messageThread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "Hello, what is AI?",
      },
      {
        role: "user",
        content: "How does AI work? Explain it in simple terms.",
      },
    ],
  });

  console.log(messageThread);
  return messageThread;
}

/*
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {}
}

*/

export async function retrieveThread() {
  const myThread = await openai.beta.threads.retrieve("thread_abc123");

  console.log(myThread);
  return myThread;
}
/*
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {
    "code_interpreter": {
      "file_ids": []
    }
  }
}

*/

export async function modifyThread() {
  const updatedThread = await openai.beta.threads.update("thread_abc123", {
    metadata: { modified: "true", user: "abc123" },
  });

  console.log(updatedThread);
  return updatedThread;
}
/*
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {
    "modified": "true",
    "user": "abc123"
  },
  "tool_resources": {}
}

*/

export async function deleteThread() {
  const response = await openai.beta.threads.del("thread_abc123");

  console.log(response);
  return response;
}
/*
{
  "id": "thread_abc123",
  "object": "thread.deleted",
  "deleted": true
}

*/
