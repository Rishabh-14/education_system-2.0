import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI();

import util from "util";

// Define the tools
const tools = [
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
];

// Define the functions to handle tool calls
async function callTool(toolCall) {
  if (toolCall.type !== "function")
    throw new Error("Unexpected tool_call type: " + toolCall.type);
  const args = JSON.parse(toolCall.function.arguments);
  switch (toolCall.function.name) {
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

// Define the main function
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
  console.log();
  console.log(messages[1]);
  console.log();

  while (true) {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      tools: tools,
      stream: true,
    });

    let writeLine = lineRewriter();
    let message = {};
    for await (const chunk of stream) {
      message = messageReducer(message, chunk);
      writeLine(message);
    }
    console.log();
    messages.push(message);

    if (!message.tool_calls) {
      return;
    }

    for (const toolCall of message.tool_calls) {
      const result = await callTool(toolCall);
      const newMessage = {
        tool_call_id: toolCall.id,
        role: "tool",
        name: toolCall.function.name,
        content: JSON.stringify(result),
      };
      console.log(newMessage);
      messages.push(newMessage);
    }
    console.log();
  }
}

// Define the message reducer function
function messageReducer(previous, item) {
  const reduce = (acc, delta) => {
    acc = { ...acc };
    for (const [key, value] of Object.entries(delta)) {
      if (acc[key] === undefined || acc[key] === null) {
        acc[key] = value;
        if (Array.isArray(acc[key])) {
          for (const arr of acc[key]) {
            delete arr.index;
          }
        }
      } else if (typeof acc[key] === "string" && typeof value === "string") {
        acc[key] += value;
      } else if (typeof acc[key] === "number" && typeof value === "number") {
        acc[key] = value;
      } else if (Array.isArray(acc[key]) && Array.isArray(value)) {
        const accArray = acc[key];
        for (let i = 0; i < value.length; i++) {
          const { index, ...chunkTool } = value[i];
          if (index - accArray.length > 1) {
            throw new Error(
              `Error: An array has an empty value when tool_calls are constructed. tool_calls: ${accArray}; tool: ${value}`
            );
          }
          accArray[index] = reduce(accArray[index], chunkTool);
        }
      } else if (typeof acc[key] === "object" && typeof value === "object") {
        acc[key] = reduce(acc[key], value);
      }
    }
    return acc;
  };
  return reduce(previous, item.choices[0].delta);
}

// Define the line rewriter function
function lineRewriter() {
  let lastMessageLines = 0;
  return function write(value) {
    process.stdout.cursorTo(0);
    process.stdout.moveCursor(0, -lastMessageLines);

    const text = util.formatWithOptions(
      { colors: false, breakLength: Infinity, depth: 4 },
      value
    );
    const __LINE_BREAK_PLACE_HOLDER__ = "__LINE_BREAK_PLACE_HOLDER__";
    const lines = text
      .replaceAll("\\n", __LINE_BREAK_PLACE_HOLDER__)
      .split("\n")
      .map((line) => line.replaceAll(__LINE_BREAK_PLACE_HOLDER__, "\\n"));
    lastMessageLines = -1;
    for (const line of lines) {
      const lineLength = line.length;
      lastMessageLines += Math.ceil(lineLength / process.stdout.columns);
    }
    lastMessageLines = Math.max(lastMessageLines, 0);

    process.stdout.clearScreenDown();
    process.stdout.write(
      util.formatWithOptions(
        { colors: true, breakLength: Infinity, depth: 4 },
        value
      )
    );
  };
}

// Define the mock database and functions
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

// Run the main function
main();
