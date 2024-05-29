/*
import { createAssistant } from "./assistants.js";
import { createThread } from "./threads.js";
import { createVectorStore } from "./vector_store.js";
import { createVectorStoreFile } from "./vector_store_files.js";
import { uploadFile } from "./uploadfiles.js";
import { createThreadMessages } from "./threads.js";
import { createRun } from "./runs.js";
import { retreiveRun } from "./runs.js"; // Assuming 'retreiveRun' is the correct export
import { listMessages } from "./messages.js";

async function vectorStarter(fileUpload) {
  try {
    const file = await uploadFile("movies.txt");
    const file_id = file.id;
    console.log("File uploaded:", file_id);

    const vector_store = await createVectorStore(file_id);
    const vectorstore_id = vector_store.id;
    console.log("Vector store created:", vectorstore_id);

    const assistant = await createAssistant(vectorstore_id);
    const assistant_id = assistant.id;
    console.log("Assistant created:", assistant_id);

    const thread = await createThread();
    const thread_id = thread.id;
    console.log("Thread created:", thread_id);

    const run = await createRun(thread_id, assistant_id);
    const run_id = run.id;
    console.log("Run created:", run_id);

    const retrieved_run = await retreiveRun(thread_id, run_id); // Use the correct function name
    console.log("Run retrieved:", retrieved_run);

    const messages = await listMessages(thread_id);
    console.log("Messages:", messages);
  } catch (error) {
    console.error("Error in vectorStarter:", error);
  }
}

async function test() {
  try {
    const file = await uploadFile("movies.txt");
    console.log("File uploaded:", file.id);

    const vector_store = await createVectorStore(file.id);
    console.log("Vector store created:", vector_store.id);

    const assistant = await createAssistant(vector_store.id);
    console.log("Assistant created:", assistant.id);

    const thread = await createThread();
    console.log("Thread created:", thread.id);

    const run = await createRun(thread.id, assistant.id);
    console.log("Run created:", run.id);

    const retrieved_run = await retreiveRun(thread.id, run.id); // Use the correct function name
    console.log("Run retrieved:", retrieved_run);

    const messages = await listMessages(thread.id);
    console.log("Messages:", messages);
  } catch (error) {
    console.error("Error in test:", error);
  }
}

// Uncomment to run the test function
// test();

vectorStarter();
*/

/*
// Save the original console.log function
const originalConsoleLog = console.log;

// Override console.log to disable it
console.log = function () {};

import { createAssistant } from "./assistants.js";
import { createThread } from "./threads.js";
import { createVectorStore } from "./vector_store.js";
import { createVectorStoreFile } from "./vector_store_files.js";
import { uploadFile } from "./uploadfiles.js";
import { createThreadMessages } from "./threads.js";
import { createRun } from "./runs.js";
import { retreiveRun } from "./runs.js"; // Assuming 'retreiveRun' is the correct export
import { listMessages } from "./messages.js";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function vectorStarter(fileUpload) {
  try {
    const file = await uploadFile("movies.txt");
    const file_id = file.id;
    //console.log("File uploaded:", file_id);

    const vector_store = await createVectorStore(file_id);
    const vectorstore_id = vector_store.id;
    //console.log("Vector store created:", vectorstore_id);

    const assistant = await createAssistant(vectorstore_id);
    const assistant_id = assistant.id;
    //console.log("Assistant created:", assistant_id);

    const thread = await createThread();
    const thread_id = thread.id;
    //console.log("Thread created:", thread_id);

    const run = await createRun(thread_id, assistant_id);
    const run_id = run.id;
    //console.log("Run created:", run_id);

    const retrieved_run = await retreiveRun(thread_id, run_id); // Use the correct function name
    //console.log("Run retrieved:", retrieved_run);

    await sleep(2000); // Add a 2-second delay

    const messages = await listMessages(thread_id);
    //console.log("Messages:", JSON.stringify(messages, null, 2));
    originalConsoleLog("Messages:", JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Error in vectorStarter:", error);
  }
}

// Uncomment to run the test function
// test();

vectorStarter();
*/
// Save the original console.log function
const originalConsoleLog = console.log;

// Override console.log to disable it
console.log = function () {};

import { createAssistant } from "./assistants.js";
import { createThread } from "./threads.js";
import { createVectorStore } from "./vector_store.js";
import { createVectorStoreFile } from "./vector_store_files.js";
import { uploadFile } from "./uploadfiles.js";
import { createThreadMessages } from "./threads.js";
import { createRun } from "./runs.js";
import { retreiveRun } from "./runs.js"; // Assuming 'retreiveRun' is the correct export
import { listMessages } from "./messages.js";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function vectorStarter(fileUpload) {
  try {
    const file = await uploadFile("movies.txt");
    const file_id = file.id;

    const vector_store = await createVectorStore(file_id);
    const vectorstore_id = vector_store.id;

    const assistant = await createAssistant(vectorstore_id);
    const assistant_id = assistant.id;

    const thread = await createThread();
    const thread_id = thread.id;

    const run = await createRun(thread_id, assistant_id);
    const run_id = run.id;

    await retreiveRun(thread_id, run_id); // Use the correct function name

    // Start the timer to calculate response time
    const startTime = Date.now();

    // Periodically check for new messages
    let messages = [];
    let attempts = 0;
    while (messages.length === 0 && attempts < 50) {
      // Limit attempts to avoid infinite loop
      attempts++;
      await sleep(100); // Wait for 100 milliseconds before checking again
      messages = await listMessages(thread_id);
    }

    // Calculate the response time
    const responseTime = Date.now() - startTime;

    // Display the messages and response time
    originalConsoleLog("Messages:", JSON.stringify(messages, null, 2));
    originalConsoleLog("Response Time:", responseTime, "ms");
    originalConsoleLog("Attempts:", attempts);
  } catch (error) {
    console.error("Error in vectorStarter:", error);
  }
}

// Uncomment to run the function
vectorStarter();
