import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config()

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create a vector store file by attaching a file to a vector store
 */
export async function createVectorStoreFile(vectorStoreId, fileId) {
  const vectorStoreFile = await openai.beta.vectorStores.files.create(
    vectorStoreId,
    {
      file_id: fileId
    }
  );
  console.log(vectorStoreFile);
  /*
  Response
  {
    "id": "file-abc123",
    "object": "vector_store.file",
    "created_at": 1699061776,
    "usage_bytes": 1234,
    "vector_store_id": "vs_abcd",
    "status": "completed",
    "last_error": null
  }
  */
  return vectorStoreFile;
}

/**
 * List vector store files
 */
export async function listVectorStoreFiles(vectorStoreId) {
  const vectorStoreFiles = await openai.beta.vectorStores.files.list(vectorStoreId, {
    limit: 20, // Optional: Default is 20
    order: "desc", // Optional: Default is desc
  });
  console.log(vectorStoreFiles);
  /*
  Response
  {
    "object": "list",
    "data": [
      {
        "id": "file-abc123",
        "object": "vector_store.file",
        "created_at": 1699061776,
        "vector_store_id": "vs_abc123"
      },
      {
        "id": "file-abc456",
        "object": "vector_store.file",
        "created_at": 1699061776,
        "vector_store_id": "vs_abc123"
      }
    ],
    "first_id": "file-abc123",
    "last_id": "file-abc456",
    "has_more": false
  }
  */
  return vectorStoreFiles;
}

/**
 * Retrieve a vector store file
 */
export async function retrieveVectorStoreFile(vectorStoreId, fileId) {
  const vectorStoreFile = await openai.beta.vectorStores.files.retrieve(vectorStoreId, fileId);
  console.log(vectorStoreFile);
  /*
  Response
  {
    "id": "file-abc123",
    "object": "vector_store.file",
    "created_at": 1699061776,
    "vector_store_id": "vs_abcd",
    "status": "completed",
    "last_error": null
  }
  */
  return vectorStoreFile;
}

/**
 * Delete a vector store file
 */
export async function deleteVectorStoreFile(vectorStoreId, fileId) {
  const deletedVectorStoreFile = await openai.beta.vectorStores.files.del(vectorStoreId, fileId);
  console.log(deletedVectorStoreFile);
  /*
  Response
  {
    "id": "file-abc123",
    "object": "vector_store.file.deleted",
    "deleted": true
  }
  */
  return deletedVectorStoreFile;
}

