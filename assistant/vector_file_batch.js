import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config()

/** OpenAI config */
if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create a vector store file batch
 */
export async function createVectorStoreFileBatch(vectorStoreId, fileIds) {
  const vectorStoreFileBatch = await openai.beta.vectorStores.fileBatches.create(
    vectorStoreId,
    {
      file_ids: fileIds
    }
  );
  console.log(vectorStoreFileBatch);
  /*
  Response
  {
    "id": "vsfb_abc123",
    "object": "vector_store.file_batch",
    "created_at": 1699061776,
    "vector_store_id": "vs_abc123",
    "status": "in_progress",
    "file_counts": {
      "in_progress": 1,
      "completed": 1,
      "failed": 0,
      "cancelled": 0,
      "total": 0,
    }
  }
  */
  return vectorStoreFileBatch;
}

/**
 * Retrieve a vector store file batch
 */
export async function retrieveVectorStoreFileBatch(vectorStoreId, batchId) {
  const vectorStoreFileBatch = await openai.beta.vectorStores.fileBatches.retrieve(
    vectorStoreId,
    batchId
  );
  console.log(vectorStoreFileBatch);
  /*
  Response
  {
    "id": "vsfb_abc123",
    "object": "vector_store.file_batch",
    "created_at": 1699061776,
    "vector_store_id": "vs_abc123",
    "status": "in_progress",
    "file_counts": {
      "in_progress": 1,
      "completed": 1,
      "failed": 0,
      "cancelled": 0,
      "total": 0,
    }
  }
  */
  return vectorStoreFileBatch;
}

/**
 * Cancel a vector store file batch
 */
export async function cancelVectorStoreFileBatch(vectorStoreId, batchId) {
  const cancelledVectorStoreFileBatch = await openai.beta.vectorStores.fileBatches.cancel(
    vectorStoreId,
    batchId
  );
  console.log(cancelledVectorStoreFileBatch);
  /*
  Response
  {
    "id": "vsfb_abc123",
    "object": "vector_store.file_batch",
    "created_at": 1699061776,
    "vector_store_id": "vs_abc123",
    "status": "cancelling",
    "file_counts": {
      "in_progress": 12,
      "completed": 3,
      "failed": 0,
      "cancelled": 0,
      "total": 15,
    }
  }
  */
  return cancelledVectorStoreFileBatch;
}

/**
 * List vector store files in a batch
 */
export async function listVectorStoreFilesInBatch(vectorStoreId, batchId) {
  const vectorStoreFiles = await openai.beta.vectorStores.fileBatches.listFiles(
    vectorStoreId,
    batchId,
    {
      limit: 20, // Optional: Default is 20
      order: "desc", // Optional: Default is desc
    }
  );
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


