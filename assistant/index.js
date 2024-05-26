import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config()

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistId = "asst_ucVhXTMZWDeFkSKMDotILfIv";
const threadId = "thread_Rb3jeBRfqU6HupD8OXMJtSrN";

// Upload a file with an "assistants" purpose
async function uploadFile(){
  const file = await openai.files.create({
    file: fs.createReadStream("movies.txt"),
    purpose: "assistants",
  });
  console.log("file")
  console.log(file)
  return file.id;
}

async function createVectorStore(){
  const file_id = await uploadFile()
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Support FAQ",
    file_ids: [file_id]
  });
  console.log("vector store")
  console.log(vectorStore);
  return vectorStore.id;
}

// Create Movie Expert Assistant
async function createAssistant() {
  const vector_id = await createVectorStore();
  const myAssistant = await openai.beta.assistants.create({
    instructions: "You are great at recommending movies. When asked a question, use the information in the provided file to form a friendly response. If you cannot find the answer in the file, do your best to infer what the answer should be.",
    name: "Movie Expert",
    tools: [{ type: "file_search" }],
    model: "gpt-4-1106-preview",
    tool_resources: {
      file_search: {
        vector_store_ids: [vector_id]
      }
    },
  });

  console.log(myAssistant);
}
//createAssistant()
async function createThread(){
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
}

async function createMessage(){
  const threadMessages = await openai.beta.threads.messages.create(
    threadId,
    { role: "user", content: "Can you reccoment a comedy" }
  );

  console.log(threadMessages.content[0].text);
}

async function createRun(){
  const run = await openai.beta.threads.runs.create(
    threadId,
    { assistant_id: assistId }
  );

  console.log(run);
}

async function retreiveRun(){
  const run = await openai.beta.threads.runs.create(
    threadId,
    { assistant_id: assistId }
  );

  console.log(run.status);
}

async function listMessages(){
  const threadMessages = await openai.beta.threads.messages.list(
    threadId
  );

  console.log(threadMessages.data[1].content[0].text.value);
}

//createMessage()
//createRun()
//retreiveRun()
listMessages()