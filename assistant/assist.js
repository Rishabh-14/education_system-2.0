import OpenAI from 'openai';
import fs from 'fs';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});

(async () => {
  // Upload a CSV file
  const file = await openai.files.create({
    file: fs.createReadStream("revenue-forecast.csv"),
    purpose: "assistants",
  });

  // Create an Assistant with code_interpreter tool enabled
  const assistant = await openai.beta.assistants.create({
    name: "Data Visualizer",
    description: "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
    model: "gpt-4o",
    tools: [{"type": "code_interpreter"}],
    tool_resources: {
      "code_interpreter": {
        "file_ids": [file.id]
      }
    }
  });

  console.log('Assistant created:', assistant);

  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": "Create 3 data visualizations based on the trends in this file.",
        "attachments": [
          {
            file_id: file.id,
            tools: [{type: "code_interpreter"}]
          }
        ]
      }
    ]
  });

  console.log('Thread created:', thread);

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  console.log('Run created:', run);

  const runSteps = await openai.beta.threads.runs.getSteps(run.id);

  runSteps.forEach(step => {
    console.log('Step:', step);
  });

  const financialAssistant = await openai.beta.assistants.create({
    name: "Financial Analyst Assistant",
    instructions: "You are an expert financial analyst. Use your knowledge base to answer questions about audited financial statements.",
    model: "gpt-4o",
    tools: [{ type: "file_search" }],
  });

  const vectorStore = await openai.beta.vectorStores.create({
    name: "Financial Statements",
    file_ids: file.id,
  });

  await openai.beta.assistants.update(financialAssistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  console.log('Financial Analyst Assistant created:', financialAssistant);

})();
