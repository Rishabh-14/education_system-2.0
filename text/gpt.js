// api.js
/*
import OpenAI from "openai";

// Initialize OpenAI with API Key
const openai = new OpenAI();

// Function to handle the GPT API call
export async function gptOnce(transcript) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: transcript },
      { role: "system", content: "You are a helpful assistant." },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
*/

// gpt-api.js
import OpenAI from "openai";

// Initialize OpenAI with API Key
const openai = new OpenAI();

export async function gptOnce(transcript) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: transcript },
      { role: "system", content: "You are a helpful assistant." },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
