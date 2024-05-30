import openai from "../config/openaiClient.js";

const createAssistant = async () => {
  return "asst_fiu9FIHvXmdJg4utCSGUoGEs"; // Replace with your actual assistant ID
};

const createThread = async (initialPrompt) => {
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: initialPrompt,
      },
    ],
  });
  console.log("thread id", thread.id);
  return thread.id;
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
