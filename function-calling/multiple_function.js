import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to get dummy weather data using OpenAI LLM
async function getWeather(location, unit = "fahrenheit") {
  // Create a prompt to generate dummy weather data
  const prompt = `Provide a simple, concise dummy weather report for ${location} in ${unit}. Format the response as follows:
- **City, Country**: Temperature in ${unit === "celsius" ? "°C" : "°F"}`;

  // Send the prompt to the OpenAI model
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant that provides dummy weather reports for testing purposes." },
      { role: "user", content: prompt },
    ],
  });

  // Extract the model's response
  const weatherInfo = response.choices[0].message.content.trim();
  return JSON.stringify({ location, weatherInfo });
}

// Function to initialize messages
function initializeMessages() {
  return [
    { role: "user", content: "What's the weather like in San Francisco, Tokyo, and Paris?" },
  ];
}

// Function to define tools
function defineTools() {
  return [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];
}

// Function to send initial request to OpenAI
async function sendInitialRequest(openai, messages, tools) {
  return openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    tools: tools,
    tool_choice: "auto", // auto is default, but we'll be explicit
  });
}

// Function to process tool calls
async function processToolCalls(responseMessage, availableFunctions) {
  const toolCalls = responseMessage.tool_calls;
  if (toolCalls) {
    const toolMessages = await handleToolCalls(toolCalls, availableFunctions);
    return toolMessages;
  }
  return [];
}

// Function to handle tool calls
async function handleToolCalls(toolCalls, availableFunctions) {
  const messages = [];
  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;
    const functionToCall = availableFunctions[functionName];
    const functionArgs = JSON.parse(toolCall.function.arguments);
    const functionResponse = await functionToCall(functionArgs.location, functionArgs.unit);
    messages.push({
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: functionResponse,
    });
  }
  return messages;
}

// Function to send follow-up request to OpenAI with tool responses
async function sendFollowUpRequest(openai, messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
  });
  return response.choices;
}

// Run the conversation
async function runConversation() {
  const messages = initializeMessages();
  const tools = defineTools();

  // Step 1: Send initial request to OpenAI
  const initialResponse = await sendInitialRequest(openai, messages, tools);
  const responseMessage = initialResponse.choices[0].message;

  // Step 2: Check and process tool calls if any
  const availableFunctions = { get_current_weather: getWeather };
  const toolMessages = await processToolCalls(responseMessage, availableFunctions);

  // Step 3: If tool calls were made, send follow-up request with tool responses
  if (toolMessages.length > 0) {
    messages.push(responseMessage, ...toolMessages);
    const finalResponse = await sendFollowUpRequest(openai, messages);
    return finalResponse;
  }

  return initialResponse.choices;
}

// Main execution
runConversation().then(console.log).catch(console.error);
