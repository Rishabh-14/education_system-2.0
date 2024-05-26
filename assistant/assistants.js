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
The assistants object

{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4-turbo",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}

*/
export async function createAssistant(vectorStoreId) {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name: "Math Tutor",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-turbo",
  });

  console.log(myAssistant);
  return myAssistant;
}

/*
    {
    "id": "asst_abc123",
    "object": "assistant",
    "created_at": 1698984975,
    "name": "Math Tutor",
    "description": null,
    "model": "gpt-4-turbo",
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "tools": [
        {
        "type": "code_interpreter"
        }
    ],
    "metadata": {},
    "top_p": 1.0,
    "temperature": 1.0,
    "response_format": "auto"
    }
*/

export async function createAssistantFile() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    name: "HR Helper",
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: {
        vector_store_ids: ["vs_123"],
      },
    },
    model: "gpt-4-turbo",
  });

  console.log(myAssistant);
  return myAssistant;
}

/*
    {
    "id": "asst_abc123",
    "object": "assistant",
    "created_at": 1699009403,
    "name": "HR Helper",
    "description": null,
    "model": "gpt-4-turbo",
    "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    "tools": [
        {
        "type": "file_search"
        }
    ],
    "tool_resources": {
        "file_search": {
        "vector_store_ids": ["vs_123"]
        }
    },
    "metadata": {},
    "top_p": 1.0,
    "temperature": 1.0,
    "response_format": "auto"
    }

  */
export async function listAssistant() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });

  console.log(myAssistants);
  return myAssistants;
}

/*
    {
    "object": "list",
    "data": [
        {
        "id": "asst_abc123",
        "object": "assistant",
        "created_at": 1698982736,
        "name": "Coding Tutor",
        "description": null,
        "model": "gpt-4-turbo",
        "instructions": "You are a helpful assistant designed to make me better at coding!",
        "tools": [],
        "tool_resources": {},
        "metadata": {},
        "top_p": 1.0,
        "temperature": 1.0,
        "response_format": "auto"
        },
        {
        "id": "asst_abc456",
        "object": "assistant",
        "created_at": 1698982718,
        "name": "My Assistant",
        "description": null,
        "model": "gpt-4-turbo",
        "instructions": "You are a helpful assistant designed to make me better at coding!",
        "tools": [],
        "tool_resources": {},
        "metadata": {},
        "top_p": 1.0,
        "temperature": 1.0,
        "response_format": "auto"
        },
        {
        "id": "asst_abc789",
        "object": "assistant",
        "created_at": 1698982643,
        "name": null,
        "description": null,
        "model": "gpt-4-turbo",
        "instructions": null,
        "tools": [],
        "tool_resources": {},
        "metadata": {},
        "top_p": 1.0,
        "temperature": 1.0,
        "response_format": "auto"
        }
    ],
    "first_id": "asst_abc123",
    "last_id": "asst_abc789",
    "has_more": false
    }
*/

export async function retrieveAssistant() {
  const myAssistant = await openai.beta.assistants.retrieve("asst_abc123");

  console.log(myAssistant);
  return myAssistant;
}

/*
    {
    "id": "asst_abc123",
    "object": "assistant",
    "created_at": 1699009709,
    "name": "HR Helper",
    "description": null,
    "model": "gpt-4-turbo",
    "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    "tools": [
        {
        "type": "file_search"
        }
    ],
    "metadata": {},
    "top_p": 1.0,
    "temperature": 1.0,
    "response_format": "auto"
    }

*/

export async function modifyAssistant() {
  const myUpdatedAssistant = await openai.beta.assistants.update(
    "asst_abc123",
    {
      instructions:
        "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      name: "HR Helper",
      tools: [{ type: "file_search" }],
      model: "gpt-4-turbo",
    }
  );

  console.log(myUpdatedAssistant);
}
/*
    {
    "id": "asst_abc123",
    "object": "assistant",
    "created_at": 1699009709,
    "name": "HR Helper",
    "description": null,
    "model": "gpt-4-turbo",
    "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    "tools": [
        {
        "type": "file_search"
        }
    ],
    "metadata": {},
    "top_p": 1.0,
    "temperature": 1.0,
    "response_format": "auto"
    }

*/
export async function deleteAssistant(assistant_id) {
  const response = await openai.beta.assistants.del(assistant_id);

  console.log(response);
}
/*
    {
    "id": "asst_abc123",
    "object": "assistant.deleted",
    "deleted": true
    }
*/
