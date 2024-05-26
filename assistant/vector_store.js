import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/** OpenAI config */
if (!process.env.OPENAI_API_KEY)
  throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create a vector store
 */
export async function createVectorStore(file_id) {
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Support FAQ",
    file_ids: [file_id],
  });
  console.log(vectorStore);
  /*
  Response
  {
    "id": "vs_abc123",
    "object": "vector_store",
    "created_at": 1699061776,
    "name": "Support FAQ",
    "bytes": 139920,
    "file_counts": {
      "in_progress": 0,
      "completed": 3,
      "failed": 0,
      "cancelled": 0,
      "total": 3
    }
  }
  */
  return vectorStore;
}

/**
 * List vector stores
 */
export async function listVectorStores() {
  const vectorStores = await openai.beta.vectorStores.list({
    limit: 20, // Optional: Default is 20
    order: "desc", // Optional: Default is desc
  });
  console.log(vectorStores);
  /*
  Response
  {
    "object": "list",
    "data": [
      {
        "id": "vs_abc123",
        "object": "vector_store",
        "created_at": 1699061776,
        "name": "Support FAQ",
        "bytes": 139920,
        "file_counts": {
          "in_progress": 0,
          "completed": 3,
          "failed": 0,
          "cancelled": 0,
          "total": 3
        }
      },
      {
        "id": "vs_abc456",
        "object": "vector_store",
        "created_at": 1699061776,
        "name": "Support FAQ v2",
        "bytes": 139920,
        "file_counts": {
          "in_progress": 0,
          "completed": 3,
          "failed": 0,
          "cancelled": 0,
          "total": 3
        }
      }
    ],
    "first_id": "vs_abc123",
    "last_id": "vs_abc456",
    "has_more": false
  }
  */
  return vectorStores;
}

/**
 * Retrieve a vector store
 */
export async function retrieveVectorStore(vectorStoreId) {
  const vectorStore = await openai.beta.vectorStores.retrieve(vectorStoreId);
  console.log(vectorStore);
  /*
  Response
  {
    "id": "vs_abc123",
    "object": "vector_store",
    "created_at": 1699061776,
    "name": "Support FAQ",
    "bytes": 139920,
    "file_counts": {
      "in_progress": 0,
      "completed": 3,
      "failed": 0,
      "cancelled": 0,
      "total": 3
    }
  }
  */
  return vectorStore;
}

/**
 * Modify a vector store
 */
export async function modifyVectorStore(vectorStoreId, newName) {
  const vectorStore = await openai.beta.vectorStores.update(vectorStoreId, {
    name: newName,
    metadata: { key: "value" }, // Example metadata
  });
  console.log(vectorStore);
  /*
  Response
  {
    "id": "vs_abc123",
    "object": "vector_store",
    "created_at": 1699061776,
    "name": "Support FAQ",
    "bytes": 139920,
    "file_counts": {
      "in_progress": 0,
      "completed": 3,
      "failed": 0,
      "cancelled": 0,
      "total": 3
    }
  }
  */
  return vectorStore;
}

/**
 * Delete a vector store
 */
export async function deleteVectorStore(vectorStoreId) {
  const deletedVectorStore = await openai.beta.vectorStores.del(vectorStoreId);
  console.log(deletedVectorStore);
  /*
  Response
  {
    "id": "vs_abc123",
    "object": "vector_store.deleted",
    "deleted": true
  }
  */
  return deletedVectorStore;
}
