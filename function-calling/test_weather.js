import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to get weather using OpenAI LLM
async function getCurrentWeather(location, unit = "fahrenheit") {
  // Create a prompt to get weather information
  const prompt = `Please provide the current weather for ${location} in ${unit}.`;

  // Send the prompt to the OpenAI model
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  });

  // Extract the model's response
  const weatherInfo = response.choices[0].message.content;
  return JSON.stringify({ location, weatherInfo });
}

// Test the getCurrentWeather function
async function testGetCurrentWeather() {
  try {
    const locations = ["San Francisco, CA", "Tokyo, Japan", "Paris, France"];
    for (const location of locations) {
      const weatherData = await getCurrentWeather(location, "fahrenheit");
      console.log(`Weather data for ${location}: ${weatherData}`);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Run the test
testGetCurrentWeather();
