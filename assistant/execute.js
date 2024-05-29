/*
Read gpt.js: The script reads the content of gpt.js.
Execute gpt.js: The script runs gpt.js and captures its output.
Save the output to gpt_output.js: The script writes the captured output to gpt_output.js.
Execute gpt_output.js: The script runs gpt_output.js and displays its output in the terminal.
*/
import fs from "fs";
import { exec } from "child_process";

// Function to read code from a file
const readFile = (filename, callback) => {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    console.log(`${filename} has been read!`);
    callback(data);
  });
};

// Function to write code to a file
const writeToFile = (filename, content, callback) => {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    console.log(`${filename} has been saved!`);
    callback(filename);
  });
};

// Function to execute a file and save its output to another file
const executeAndSaveOutput = (inputFile, outputFile, callback) => {
  exec(`node ${inputFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${inputFile}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr from ${inputFile}: ${stderr}`);
      return;
    }
    console.log(`Output from ${inputFile}:\n${stdout}`);
    writeToFile(outputFile, stdout, callback);
  });
};

// Function to execute a file and display its output
const executeFile = (filename) => {
  exec(`node ${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${filename}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr from ${filename}: ${stderr}`);
      return;
    }
    console.log(`Output from ${filename}:\n${stdout}`);
  });
};

// Read gpt.js, execute it, save its output to gpt_output.js, and then execute gpt_output.js
readFile("gpt.js", (content) => {
  // Assuming gpt.js is read successfully, now execute it
  executeAndSaveOutput("gpt.js", "gpt_output.js", (outputFilename) => {
    executeFile(outputFilename);
  });
});
