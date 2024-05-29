import openai from "../config/openaiClient.js";

const createAssistant = async () => {
  // You can uncomment this block if you need to create a new assistant
  /*
  const assistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo",
    name: "Teacher",
    instructions:
      "You are a teacher who teaches in such immersive way students don't want to leave the class",
  });
  console.log("assistant id", assistant.id);
  return assistant.id;
  */
  return "asst_fiu9FIHvXmdJg4utCSGUoGEs"; // Replace with your actual assistant ID
};

const createThread = async () => {
  // You can uncomment this block if you need to create a new thread
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
  return thread.id;
  */
  return "thread_dEUuuaFn9uTh5TWME0VgliYf"; // Replace with your actual thread ID
};

const streamResponse = async (threadId, assistantId) => {
  const stream = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    additional_instructions:
      "Please address the user as Jane Doe. The user has a premium account.",
    stream: true,
  });

  let accumulatedText = "";

  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const chunk = event.data.delta.content?.[0];
      if (chunk && "text" in chunk && chunk.text.value) {
        accumulatedText += chunk.text.value;
        process.stdout.write(chunk.text.value);
      }
    }
  }

  console.log();
  return accumulatedText;
};

const addMessageToThread = async (threadId, content) => {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
};

export { createAssistant, createThread, streamResponse, addMessageToThread };
