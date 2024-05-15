import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

// Load environment variables
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createAssistant() {
    return await openai.beta.assistants.create({
        name: "Financial Analyst Assistant",
        instructions: "You are an expert financial analyst. Use your knowledge base to answer questions about audited financial statements.",
        model: "gpt-4o",
        tools: [{ type: "file_search" }]
    });
}

async function createVectorStore(filePaths) {
    const fileStreams = filePaths.map(filePath => {
        try {
            return fs.createReadStream(filePath);
        } catch (error) {
            console.error("Error reading file at path:", filePath, error);
            return null;
        }
    }).filter(stream => stream !== null);

    if (fileStreams.length === 0) {
        console.error("No valid file streams available. Check file paths and permissions.");
        return null;
    }

    try {
        const vectorStore = await openai.beta.vectorStores.create({
            name: "Financial Statement"
        });
        await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams);
        return vectorStore.id;
    } catch (error) {
        console.error("Failed to upload files to vector store:", error);
        return null;
    }
}

async function updateAssistantWithVectorStore(assistantId, vectorStoreId) {
    if (!vectorStoreId) {
        console.error('No vectorStoreId provided to updateAssistantWithVectorStore.');
        return;
    }
    await openai.beta.assistants.update(assistantId, {
        tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } }
    });
}

async function createThreadWithFile(file, query) {
    const uploadedFile = await openai.files.create({
        file: fs.createReadStream(file),
        purpose: "assistants"
    });

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: query,
                attachments: [{ file_id: uploadedFile.id, tools: [{ type: "file_search" }] }]
            }
        ]
    });
    return thread.id;
}

async function runThread(threadId, assistantId) {
    const stream = openai.beta.threads.runs
        .stream(threadId, { assistant_id: assistantId })
        .on("textCreated", () => console.log("Assistant >"))
        .on("toolCallCreated", (event) => console.log("Assistant " + event.type))
        .on("messageDone", async (event) => {
            if (event.content[0].type === "text") {
                const { text } = event.content[0];
                const { annotations } = text;
                const citations = [];
                let index = 0;
                for (let annotation of annotations) {
                    text.value = text.value.replace(annotation.text, "[" + index + "]");
                    const { file_citation } = annotation;
                    if (file_citation) {
                        const citedFile = await openai.files.retrieve(file_citation.file_id);
                        citations.push("[" + index + "]" + citedFile.filename);
                    }
                    index++;
                }
                console.log(text.value);
                console.log(citations.join("\n"));
            }
        });
}

async function main() {
    const assistant = await createAssistant();
    const vectorStoreId = await createVectorStore(["/mnt/c/Users/Rishabh/OneDrive/Desktop/github/education-server/file_search/scrimba.txt"]);
    if (!vectorStoreId) {
        console.error('Failed to create vector store, stopping execution.');
        return; // Stop execution if vector store creation failed
    }
    await updateAssistantWithVectorStore(assistant.id, vectorStoreId);
    const threadId = await createThreadWithFile("edgar/aapl-10k.pdf", "How many shares of AAPL were outstanding at the end of October 2023?");
    await runThread(threadId, assistant.id);
}

main();
