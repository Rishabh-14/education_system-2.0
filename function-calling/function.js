import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { EventEmitter } from "events"; // Ensure to import EventEmitter
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize the OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  // Define and create the assistant
  const assistant = await client.beta.assistants.create({
    model: "gpt-4o",
    instructions:
      "You are a weather bot. Use the provided functions to answer questions.",
    tools: [
      {
        type: "function",
        function: {
          name: "getCurrentTemperature",
          description: "Get the current temperature for a specific location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g., San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["Celsius", "Fahrenheit"],
                description:
                  "The temperature unit to use. Infer this from the user's location.",
              },
            },
            required: ["location", "unit"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getRainProbability",
          description: "Get the probability of rain for a specific location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g., San Francisco, CA",
              },
            },
            required: ["location"],
          },
        },
      },
    ],
  });

  const thread = await client.beta.threads.create();
  const message = await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "What's the weather in San Francisco today and the likelihood it'll rain?",
  });

  class EventHandler extends EventEmitter {
    constructor(client) {
      super();
      this.client = client;
    }

    async onEvent(event) {
      try {
        console.log(event);
        if (event.event === "thread.run.requires_action") {
          await this.handleRequiresAction(event.data, event.data.id, event.data.thread_id);
        }
      } catch (error) {
        console.error("Error handling event:", error);
      }
    }

    async handleRequiresAction(data, runId, threadId) {
      try {
        const toolOutputs = data.required_action.submit_tool_outputs.tool_calls.map((toolCall) => {
          if (toolCall.function.name === "getCurrentTemperature") {
            return {
              tool_call_id: toolCall.id,
              output: "57",
            };
          } else if (toolCall.function.name === "getRainProbability") {
            return {
              tool_call_id: toolCall.id,
              output: "0.06",
            };
          }
        });
        await this.submitToolOutputs(toolOutputs, runId, threadId);
      } catch (error) {
        console.error("Error processing required action:", error);
      }
    }

    async submitToolOutputs(toolOutputs, runId, threadId) {
      try {
        const stream = this.client.beta.threads.runs.submitToolOutputsStream(
          threadId,
          runId,
          { tool_outputs: toolOutputs },
        );
        for await (const event of stream) {
          this.emit("event", event);
        }
      } catch (error) {
        console.error("Error submitting tool outputs:", error);
      }
    }
  }

  const eventHandler = new EventHandler(client);
  eventHandler.on("event", eventHandler.onEvent.bind(eventHandler));

  const stream = await client.beta.threads.runs.stream(
    thread.id,
    { assistant_id: assistant.id },
    eventHandler,
  );

  for await (const event of stream) {
    eventHandler.emit("event", event);
  }
}

main().catch(console.error);
