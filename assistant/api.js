import { createAssistant } from "./assistants.js";
import { createThread } from "./threads.js";
import { createVectorStore } from "./vector_store.js";
import { createVectorStoreFile } from "./vector_store_files.js";
import { uploadFile } from "./uploadfiles.js";
import { createThreadMessages } from "./threads.js";
import { createRun } from "./runs.js";
import { retreiveRun } from "./runs.js";
import { listMessages } from "./messages.js";

async function vectorStarter(fileUpload) {
  const file = await uploadFile("movies.txt");
  const file_id = file.id;
  const vector_store = await createVectorStore(file_id);
  const vectorstore_id = vector_store[0].id;
  const assistant = await createAssistant(vectorstore_id);
  const assistant_id = assistant.id;
  const thread = await createThread();
  const thread_id = thread.id;
  const run = await createRun(thread_id, assistant_id);
  const run_id = run.id;

  const retrive_run = await retreiveRun(thread_id, run_id);
  const messages = listMessages(thread_id);
  console.log(messages);
}

async function test() {
  const file_id = await uploadFile("movies.txt");
  console.log(file_id);
  const vector_store = await createVectorStore(file_id);
  const vectorstore_id = vector_store.id;
  console.log(vectorstore_id);
  const assistant = await createAssistant(vectorstore_id);
  const assistant_id = assistant.id;
  console.log(assistant_id);
  const thread = await createThread();
  const thread_id = thread.id;
  console.log(thread_id);
  const run = await createRun(thread_id, assistant_id);
  const run_id = run.id;
  console.log(run_id);
  const retrive_run = await retreiveRun(thread_id, run_id);
  const messages = listMessages(thread_id);
}

test();

//vectorStarter();
