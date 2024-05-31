/*
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI();

const functions = [
  {
    name: "list",
    description:
      "list queries books by genre, and returns a list of names of books",
    parameters: {
      type: "object",
      properties: {
        genre: {
          type: "string",
          enum: ["mystery", "nonfiction", "memoir", "romance", "historical"],
        },
      },
    },
  },
  {
    name: "search",
    description:
      "search queries books by their name and returns a list of book names and their ids",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    },
  },
  {
    name: "get",
    description:
      "get returns a book's detailed information based on the id of the book. Note that this does not accept names, and only IDs, which you can get by using search.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
  },
];

async function callFunction(function_call) {
  const args = JSON.parse(function_call.arguments);
  switch (function_call.name) {
    case "list":
      return await list(args["genre"]);
    case "search":
      return await search(args["name"]);
    case "get":
      return await get(args["id"]);
    default:
      throw new Error("No function found");
  }
}

async function main() {
  const messages = [
    {
      role: "system",
      content:
        "Please use our book database, which you can access using functions to answer the following questions.",
    },
    {
      role: "user",
      content:
        "I really enjoyed reading To Kill a Mockingbird, could you recommend me a book that is similar and tell me why?",
    },
  ];
  console.log(messages[0]);
  console.log(messages[1]);
  console.log();

  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      functions: functions,
    });

    const message = completion.choices[0].message;
    messages.push(message);
    console.log(message);

    // If there is no function call, we're done and can exit this loop
    if (!message.function_call) {
      return;
    }

    // If there is a function call, we generate a new message with the role 'function'.
    const result = await callFunction(message.function_call);
    const newMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };
    messages.push(newMessage);

    console.log(newMessage);
    console.log();
  }
}

const db = [
  {
    id: "a1",
    name: "To Kill a Mockingbird",
    genre: "historical",
    description: `Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.`,
  },
  {
    id: "a2",
    name: "All the Light We Cannot See",
    genre: "historical",
    description: `In a mining town in Germany, Werner Pfennig, an orphan, grows up with his younger sister, enchanted by a crude radio they find that brings them news and stories from places they have never seen or imagined. Werner becomes an expert at building and fixing these crucial new instruments and is enlisted to use his talent to track down the resistance. Deftly interweaving the lives of Marie-Laure and Werner, Doerr illuminates the ways, against all odds, people try to be good to one another.`,
  },
  {
    id: "a3",
    name: "Where the Crawdads Sing",
    genre: "historical",
    description: `For years, rumors of the “Marsh Girl” haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.

But Kya is not what they say. A born naturalist with just one day of school, she takes life's lessons from the land, learning the real ways of the world from the dishonest signals of fireflies. But while she has the skills to live in solitude forever, the time comes when she yearns to be touched and loved. Drawn to two young men from town, who are each intrigued by her wild beauty, Kya opens herself to a new and startling world—until the unthinkable happens.`,
  },
];

async function list(genre) {
  return db
    .filter((item) => item.genre === genre)
    .map((item) => ({ name: item.name, id: item.id }));
}

async function search(name) {
  return db
    .filter((item) => item.name.includes(name))
    .map((item) => ({ name: item.name, id: item.id }));
}

async function get(id) {
  return db.find((item) => item.id === id);
}

main();
*/

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI();

// Define the available functions with their descriptions and parameters
const availableFunctions = [
  {
    name: "listBooksByGenre",
    description:
      "List books by genre, returning a list of book names and their IDs",
    parameters: {
      type: "object",
      properties: {
        genre: {
          type: "string",
          enum: ["mystery", "nonfiction", "memoir", "romance", "historical"],
        },
      },
    },
  },
  {
    name: "searchBooksByName",
    description:
      "Search books by name and return a list of book names and their IDs",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    },
  },
  {
    name: "getBookDetails",
    description: "Get a book's detailed information based on the book's ID",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
  },
];

// Function to call the appropriate function based on the function name
async function executeFunction(functionCall) {
  const args = JSON.parse(functionCall.arguments);
  switch (functionCall.name) {
    case "listBooksByGenre":
      return await listBooksByGenre(args.genre);
    case "searchBooksByName":
      return await searchBooksByName(args.name);
    case "getBookDetails":
      return await getBookDetails(args.id);
    default:
      throw new Error("Function not found");
  }
}

// Main function to handle chat interactions
async function main() {
  const initialMessages = [
    {
      role: "system",
      content:
        "Use our book database to answer the following questions using the available functions.",
    },
    {
      role: "user",
      content:
        'I really enjoyed reading "To Kill a Mockingbird". Could you recommend me a similar book and tell me why?',
    },
  ];

  const messages = [...initialMessages];
  console.log(initialMessages[0]);
  console.log(initialMessages[1]);
  console.log();

  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      functions: availableFunctions,
    });

    const message = completion.choices[0].message;
    messages.push(message);
    console.log(message);

    // Exit the loop if there is no function call
    if (!message.function_call) {
      return;
    }

    // Execute the function call and generate a new message with the function result
    const result = await executeFunction(message.function_call);
    const newMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };
    messages.push(newMessage);

    console.log(newMessage);
    console.log();
  }
}

// Database of books
const bookDatabase = [
  {
    id: "a1",
    name: "To Kill a Mockingbird",
    genre: "historical",
    description: `Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" explores the roots of human behavior - innocence and experience, kindness and cruelty, love and hatred, humor and pathos. It is regarded as a masterpiece of American literature.`,
  },
  {
    id: "a2",
    name: "All the Light We Cannot See",
    genre: "historical",
    description: `In a mining town in Germany, Werner Pfennig, an orphan, grows up with his younger sister, enchanted by a crude radio that brings them news and stories. Werner becomes an expert at building and fixing these instruments and is enlisted to track down the resistance.`,
  },
  {
    id: "a3",
    name: "Where the Crawdads Sing",
    genre: "historical",
    description: `Rumors of the “Marsh Girl” haunt Barkley Cove. Kya Clark, barefoot and wild, is unfit for polite society. When Chase Andrews is found dead, locals suspect her. Kya takes life's lessons from the land, learning the real ways of the world.`,
  },
];

// List books by genre
async function listBooksByGenre(genre) {
  return bookDatabase
    .filter((book) => book.genre === genre)
    .map((book) => ({ name: book.name, id: book.id }));
}

// Search books by name
async function searchBooksByName(name) {
  return bookDatabase
    .filter((book) => book.name.includes(name))
    .map((book) => ({ name: book.name, id: book.id }));
}

// Get book details by ID
async function getBookDetails(id) {
  return bookDatabase.find((book) => book.id === id);
}

// Run the main function
main();
