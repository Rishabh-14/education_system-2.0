// Import the necessary modules
import axios from "axios";

// Define your Groq API key and endpoint
const GROQ_API_KEY = "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";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function callGroqAPI(prompt) {
  try {
    const response = await axios.post(
      ENDPOINT,
      {
        model: "llama3-70b-8192", // Specify the model ID
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 100, // Specify the number of tokens you want in the response
        temperature: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Output the response from Groq API
    console.log("Groq API Response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error(
      "Error calling Groq API:",
      error.response ? error.response.data : error.message
    );
  }
}

// Example usage
const prompt = "What is the capital of France?";
callGroqAPI(prompt);
