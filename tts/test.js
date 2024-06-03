// tts/test.js
import { readFileAsync } from "./async_read.js";

async function testReadFile() {
  try {
    const data = await readFileAsync("./Mr_Ranedeer.txt"); // Ensure the path is correct
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testReadFile();
