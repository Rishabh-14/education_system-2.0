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
async function main() {
  const assistant = await openai.beta.assistants.create({
    model: "gpt-4-1106-preview",
    name: "Math Tutor",
    instructions:
      "You are a personal math tutor. Write and run code to answer math questions.",
  });

  let assistantId = assistant.id;
  console.log("Created Assistant with Id: " + assistantId);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          '"I need to solve the equation `3x + 11 = 14`. Can you help me?"',
      },
    ],
  });

  let threadId = thread.id;
  console.log("Created thread with Id: " + threadId);

  const run = openai.beta.threads.runs
    .stream(threadId, {
      assistant_id: assistantId,
    })
    //Subscribe to streaming events and log them
    .on("event", (event) => console.log(event))
    .on("textDelta", (delta, snapshot) => console.log(snapshot))
    .on("messageDelta", (delta, snapshot) => console.log(snapshot))
    .on("run", (run) => console.log(run))
    .on("messageDelta", (delta, snapshot) => console.log(snapshot))
    .on("connect", () => console.log());
  const result = await run.finalRun();
  console.log("Run Result" + result);
}

main();
*/

/*
async function main() {
  const assistant = await openai.beta.assistants.create({
    model: "gpt-4-1106-preview",
    name: "Math Tutor",
    instructions:
      "You are a personal math tutor. Write and run code to answer math questions.",
  });

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          '"I need to solve the equation `3x + 11 = 14`. Can you help me?"',
      },
    ],
  });

  const stream = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    additional_instructions:
      "Please address the user as Jane Doe. The user has a premium account.",
    stream: true,
  });

  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const chunk = event.data.delta.content?.[0];
      if (chunk && "text" in chunk && chunk.text.value) {
        process.stdout.write(chunk.text.value);
      }
    }
  }

  console.log();
}

main();
*/

async function streamResponse(threadId, assistantId) {
  const stream = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    additional_instructions:
      "Please address the user as Jane Doe. The user has a premium account.",
    stream: true,
  });

  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const chunk = event.data.delta.content?.[0];
      if (chunk && "text" in chunk && chunk.text.value) {
        process.stdout.write(chunk.text.value);
      }
    }
  }

  console.log();
}

async function main() {
  /*
  const assistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo",
    name: "Teacher ",
    instructions:
      "You are a teacher who teaches in such immersive way students don't want to leave the class",
  });
  console.log("assistant id", assistant.id);
*/
  const assistant = { id: "asst_fiu9FIHvXmdJg4utCSGUoGEs" };
  /*
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          "I need to solve the equation `3x + 11 = 14`. Can you help me?",
      },
    ],
  });
  console.log("thread id", thread.id);
*/
  const thread = { id: "thread_dEUuuaFn9uTh5TWME0VgliYf" };
  // Stream the initial response
  console.log("Streaming initial response:");
  await streamResponse(thread.id, assistant.id);

  // Add a new message to the thread
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "what was my last question",
  });

  // Stream the response to the new message
  console.log("Streaming response to the new message:");
  await streamResponse(thread.id, assistant.id);
}

main();
