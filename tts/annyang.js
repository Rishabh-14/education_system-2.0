/*
if (annyang) {
  var commands = {
    "*text": async function (transcript) {
      document.getElementById("text").textContent = "Processing your input...";
      try {
        const response = await fetch("http://localhost:3001/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: transcript }),
        });
        const data = await response.json(); // Assuming the server sends back JSON
        if (data.message) {
          document.getElementById("text").textContent = "Story generated: " + data.message;
        } else {
          document.getElementById("text").textContent = "No story generated, try again.";
        }
      } catch (error) {
        document.getElementById("text").textContent = "Error processing your request";
        console.error("Fetch error:", error);
      }
    },
  };

  annyang.addCommands(commands);
  annyang.start({ autoRestart: true, continuous: false });
  annyang.debug(); // Useful for development, but consider removing for production
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}
*/
/*

if (annyang) {
  var commands = {
    "*text": async function (transcript) {
      document.getElementById("text").textContent = "Processing your input...";
      try {
        const response = await fetch("http://localhost:3001/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: transcript }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = URL.createObjectURL(response.body);
        audioPlayer.play();
      } catch (error) {
        document.getElementById("text").textContent = "Error processing your request";
        console.error("Fetch error:", error);
      }
    },
  };

  annyang.addCommands(commands);
  annyang.start({ autoRestart: true, continuous: false });
  annyang.debug(); // Useful for development, but consider removing for production
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}
*/

/* Working
if (annyang) {
  // Define the command for annyang
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";

          try {
              const response = await fetch("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const blob = await response.blob();  // Get the response as a Blob
              const audioURL = URL.createObjectURL(blob);  // Create a URL for the Blob
              const audioPlayer = document.getElementById("audioPlayer");
              audioPlayer.src = audioURL;  // Set the audio element's source
              audioPlayer.play();  // Play the audio
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      },
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();

  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}

*/
/*  //streaming working but audio restarting everytime a new chunk is received
if (annyang) {
  // Define the command for annyang
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";

          try {
              const response = await fetch("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              const reader = response.body.getReader();
              const stream = new ReadableStream({
                  start(controller) {
                      function push() {
                          reader.read().then(({ done, value }) => {
                              if (done) {
                                  controller.close();
                                  return;
                              }
                              controller.enqueue(value);
                              push();
                          });
                      }

                      push();
                  }
              });

              const audioURL = URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/mpeg' }));
              audioPlayer.src = audioURL;
              audioPlayer.play();
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      },
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();

  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}
*/

/* //Working
if (annyang) {
  // Define the command for annyang
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";

          try {
              const response = await fetch("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              const mediaSource = new MediaSource();
              audioPlayer.src = URL.createObjectURL(mediaSource);

              mediaSource.addEventListener('sourceopen', async () => {
                  const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                  const reader = response.body.getReader();

                  const appendBuffer = async ({ done, value }) => {
                      if (done) {
                          mediaSource.endOfStream();
                          return;
                      }
                      sourceBuffer.appendBuffer(value);
                      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
                      reader.read().then(appendBuffer);
                  };

                  reader.read().then(appendBuffer);
              });

              audioPlayer.play();
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      },
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();

  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}
*/
/* // Working
if (annyang) {
  // Define the command for annyang
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";

          try {
              const response = await fetch("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              const mediaSource = new MediaSource();
              audioPlayer.src = URL.createObjectURL(mediaSource);

              mediaSource.addEventListener('sourceopen', () => {
                  const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                  const reader = response.body.getReader();
                  let chunks = [];

                  const appendNextChunk = async ({ done, value }) => {
                      if (done) {
                          mediaSource.endOfStream();
                          return;
                      }

                      chunks.push(value);
                      sourceBuffer.appendBuffer(value);
                      
                      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
                      
                      reader.read().then(appendNextChunk).catch(error => {
                          console.error('Error reading stream:', error);
                          // Implement retry logic or handle the error appropriately
                      });
                  };

                  reader.read().then(appendNextChunk).catch(error => {
                      console.error('Error reading stream:', error);
                      // Implement retry logic or handle the error appropriately
                  });

                  audioPlayer.addEventListener('error', () => {
                      console.error('Audio playback error');
                      // Implement retry or resume logic here
                  });

                  audioPlayer.play();
              });
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      },
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();

  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}
*/

/*
if (annyang) {
  // Define the command for annyang
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";

          try {
              const response = await fetchWithRetry("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              }, 3); // Retry up to 3 times

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              const mediaSource = new MediaSource();
              audioPlayer.src = URL.createObjectURL(mediaSource);

              mediaSource.addEventListener('sourceopen', () => {
                  const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                  const reader = response.body.getReader();
                  let chunks = [];
                  let lastReadPosition = 0;

                  const appendNextChunk = async ({ done, value }) => {
                      if (done) {
                          mediaSource.endOfStream();
                          return;
                      }

                      chunks.push(value);
                      sourceBuffer.appendBuffer(value);
                      lastReadPosition += value.byteLength;
                      
                      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
                      
                      reader.read().then(appendNextChunk).catch(async error => {
                          console.error('Error reading stream:', error);
                          await retryRead(reader, lastReadPosition); // Retry reading from last position
                      });
                  };

                  reader.read().then(appendNextChunk).catch(async error => {
                      console.error('Error reading stream:', error);
                      await retryRead(reader, lastReadPosition); // Retry reading from last position
                  });

                  audioPlayer.addEventListener('error', () => {
                      console.error('Audio playback error');
                      // Implement retry or resume logic here
                  });

                  audioPlayer.play();
              });
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      },
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();

  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}

// Fetch with retry mechanism
async function fetchWithRetry(url, options, retries) {
  for (let i = 0; i < retries; i++) {
      try {
          return await fetch(url, options);
      } catch (error) {
          console.error(`Fetch attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
              await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
          }
      }
  }
  throw new Error('All fetch attempts failed');
}

// Retry reading from the last position
async function retryRead(reader, lastReadPosition) {
  try {
      await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
      const { done, value } = await reader.read();
      if (done) {
          return;
      }
      chunks.push(value);
      sourceBuffer.appendBuffer(value);
      lastReadPosition += value.byteLength;
      
      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
      
      reader.read().then(appendNextChunk).catch(async error => {
          console.error('Error reading stream:', error);
          await retryRead(reader, lastReadPosition); // Retry reading from last position
      });
  } catch (error) {
      console.error('Retry read failed:', error);
  }
}
*/

/*
if (annyang) {
  // Initialize and start annyang
  initializeAnnyang();

  // Update the UI to indicate that speech recognition is enabled
  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  // Update the UI to indicate that speech recognition is not supported
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}

// Function to initialize annyang and define commands
function initializeAnnyang() {
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";
          try {
              const response = await fetchWithRetry("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              }, 3); // Retry up to 3 times

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              handleAudioStreaming(audioPlayer, response);
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      }
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();
}

// Function to handle fetch with retry logic
async function fetchWithRetry(url, options, retries) {
  for (let i = 0; i < retries; i++) {
      try {
          return await fetch(url, options);
      } catch (error) {
          console.error(`Fetch attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
              await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
          }
      }
  }
  throw new Error('All fetch attempts failed');
}

// Function to handle audio streaming
function handleAudioStreaming(audioPlayer, response) {
  const mediaSource = new MediaSource();
  audioPlayer.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      const reader = response.body.getReader();
      let chunks = [];
      let lastReadPosition = 0;

      const appendNextChunk = async ({ done, value }) => {
          if (done) {
              mediaSource.endOfStream();
              return;
          }

          chunks.push(value);
          sourceBuffer.appendBuffer(value);
          lastReadPosition += value.byteLength;

          await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

          reader.read().then(appendNextChunk).catch(async error => {
              console.error('Error reading stream:', error);
              await retryRead(reader, lastReadPosition, sourceBuffer); // Retry reading from last position
          });
      };

      reader.read().then(appendNextChunk).catch(async error => {
          console.error('Error reading stream:', error);
          await retryRead(reader, lastReadPosition, sourceBuffer); // Retry reading from last position
      });

      audioPlayer.addEventListener('error', () => {
          console.error('Audio playback error');
          // Implement retry or resume logic here
      });

      audioPlayer.play();
  });

  window.addEventListener('offline', () => {
      console.log('Network offline detected');
      audioPlayer.pause();
  });

  window.addEventListener('online', async () => {
      console.log('Network online detected');
      await retryRead(reader, lastReadPosition, sourceBuffer); // Resume reading from last position
      audioPlayer.play();
  });

  audioPlayer.addEventListener('waiting', () => {
      console.log('Audio buffering detected');
      // Implement logic to handle buffering, if necessary
  });
}

// Function to retry reading the stream from the last position
async function retryRead(reader, lastReadPosition, sourceBuffer) {
  try {
      await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
      const { done, value } = await reader.read();
      if (done) {
          return;
      }
      chunks.push(value);
      sourceBuffer.appendBuffer(value);
      lastReadPosition += value.byteLength;

      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

      reader.read().then(appendNextChunk).catch(async error => {
          console.error('Error reading stream:', error);
          await retryRead(reader, lastReadPosition, sourceBuffer); // Retry reading from last position
      });
  } catch (error) {
      console.error('Retry read failed:', error);
  }
}
*/

/* // Interrupt working
if (annyang) {
  // Initialize and start annyang
  initializeAnnyang();

  // Update the UI to indicate that speech recognition is enabled
  document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
  // Update the UI to indicate that speech recognition is not supported
  document.getElementById("text").textContent = "Speech Recognition is not supported";
}

// Function to initialize annyang and define commands
function initializeAnnyang() {
  var commands = {
      "*text": async function (transcript) {
          document.getElementById("text").textContent = "Processing your input...";
          try {
              const response = await fetchWithRetry("http://localhost:3001/audio", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ prompt: transcript }),
              }, 3); // Retry up to 3 times

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const audioPlayer = document.getElementById("audioPlayer");
              handleAudioStreaming(audioPlayer, response);
          } catch (error) {
              document.getElementById("text").textContent = "Error processing your request";
              console.error("Fetch error:", error);
          }
      }
  };

  // Add the commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start({ autoRestart: true, continuous: true });

  // Debugging output
  annyang.debug();
}

// Function to handle fetch with retry logic
async function fetchWithRetry(url, options, retries) {
  for (let i = 0; i < retries; i++) {
      try {
          return await fetch(url, options);
      } catch (error) {
          console.error(`Fetch attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
              await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
          }
      }
  }
  throw new Error('All fetch attempts failed');
}

// Function to handle audio streaming
function handleAudioStreaming(audioPlayer, response) {
  const mediaSource = new MediaSource();
  audioPlayer.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      const reader = response.body.getReader();
      let chunks = [];
      let lastReadPosition = 0;

      const appendNextChunk = async ({ done, value }) => {
          if (done) {
              mediaSource.endOfStream();
              return;
          }

          chunks.push(value);
          sourceBuffer.appendBuffer(value);
          lastReadPosition += value.byteLength;

          await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

          reader.read().then(appendNextChunk).catch(async error => {
              console.error('Error reading stream:', error);
              await retryRead(reader, lastReadPosition, sourceBuffer, chunks); // Retry reading from last position
          });
      };

      reader.read().then(appendNextChunk).catch(async error => {
          console.error('Error reading stream:', error);
          await retryRead(reader, lastReadPosition, sourceBuffer, chunks); // Retry reading from last position
      });

      audioPlayer.addEventListener('error', () => {
          console.error('Audio playback error');
          // Implement retry or resume logic here
      });

      audioPlayer.play();
  });

  window.addEventListener('offline', () => {
      console.log('Network offline detected');
      audioPlayer.pause();
  });

  window.addEventListener('online', async () => {
      console.log('Network online detected');
      await retryRead(reader, lastReadPosition, sourceBuffer, chunks); // Resume reading from last position
      audioPlayer.play();
  });

  audioPlayer.addEventListener('waiting', () => {
      console.log('Audio buffering detected');
      // Implement logic to handle buffering, if necessary
  });
}

// Function to retry reading the stream from the last position
async function retryRead(reader, lastReadPosition, sourceBuffer, chunks) {
  try {
      await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
      const { done, value } = await reader.read();
      if (done) {
          return;
      }
      chunks.push(value);
      sourceBuffer.appendBuffer(value);
      lastReadPosition += value.byteLength;

      await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

      reader.read().then(appendNextChunk).catch(async error => {
          console.error('Error reading stream:', error);
          await retryRead(reader, lastReadPosition, sourceBuffer, chunks); // Retry reading from last position
      });
  } catch (error) {
      console.error('Retry read failed:', error);
  }
}
*/

const students = new Map([
    ["Alice", { audioPlayer: document.getElementById("audioPlayer-Alice"), lastReadPosition: 0, chunks: [] }],
    ["Bob", { audioPlayer: document.getElementById("audioPlayer-Bob"), lastReadPosition: 0, chunks: [] }],
    ["Charlie", { audioPlayer: document.getElementById("audioPlayer-Charlie"), lastReadPosition: 0, chunks: [] }]
]);

if (annyang) {
    // Initialize and start annyang
    initializeAnnyang();

    // Update the UI to indicate that speech recognition is enabled
    document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
    // Update the UI to indicate that speech recognition is not supported
    document.getElementById("text").textContent = "Speech Recognition is not supported";
}

const students = new Map([
    ["Alice", { audioPlayer: document.getElementById("audioPlayer-Alice"), lastReadPosition: 0, chunks: [] }],
    ["Bob", { audioPlayer: document.getElementById("audioPlayer-Bob"), lastReadPosition: 0, chunks: [] }],
    ["Charlie", { audioPlayer: document.getElementById("audioPlayer-Charlie"), lastReadPosition: 0, chunks: [] }]
]);

if (annyang) {
    // Initialize and start annyang
    initializeAnnyang();

    // Update the UI to indicate that speech recognition is enabled
    document.getElementById("text").textContent = "Speech recognition is enabled. Please speak.";
} else {
    // Update the UI to indicate that speech recognition is not supported
    document.getElementById("text").textContent = "Speech Recognition is not supported";
}

// Function to initialize annyang and define commands
function initializeAnnyang() {
    var commands = {
        "*studentName *text": async function (studentName, transcript) {
            console.log(`Received command for ${studentName}: ${transcript}`);
            document.getElementById("text").textContent = `Processing input for ${studentName}...`;

            if (!students.has(studentName)) {
                document.getElementById("text").textContent = `Student ${studentName} not found`;
                console.log(`Student ${studentName} not found`);
                return;
            }

            try {
                const response = await fetchWithRetry("http://localhost:3001/audio", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: transcript }),
                }, 3); // Retry up to 3 times

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const student = students.get(studentName);
                handleAudioStreaming(student.audioPlayer, response, studentName);
            } catch (error) {
                document.getElementById("text").textContent = `Error processing request for ${studentName}`;
                console.error("Fetch error:", error);
            }
        }
    };

    // Add the commands to annyang
    annyang.addCommands(commands);

    // Start listening
    annyang.start({ autoRestart: true, continuous: true });

    // Debugging output
    annyang.debug();
}

// Function to handle fetch with retry logic
async function fetchWithRetry(url, options, retries) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting fetch ${i + 1}/${retries} to ${url}`);
            const response = await fetch(url, options);
            console.log(`Fetch attempt ${i + 1} successful`);
            return response;
        } catch (error) {
            console.error(`Fetch attempt ${i + 1} failed:`, error);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
            }
        }
    }
    throw new Error('All fetch attempts failed');
}

// Function to handle audio streaming
function handleAudioStreaming(audioPlayer, response, studentName) {
    const mediaSource = new MediaSource();
    audioPlayer.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        const reader = response.body.getReader();
        let chunks = [];
        let lastReadPosition = 0;

        const appendNextChunk = async ({ done, value }) => {
            if (done) {
                mediaSource.endOfStream();
                return;
            }

            chunks.push(value);
            sourceBuffer.appendBuffer(value);
            lastReadPosition += value.byteLength;

            await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

            reader.read().then(appendNextChunk).catch(async error => {
                console.error(`Error reading stream for ${studentName}:`, error);
                await retryRead(reader, lastReadPosition, sourceBuffer, chunks, studentName); // Retry reading from last position
            });
        };

        reader.read().then(appendNextChunk).catch(async error => {
            console.error(`Error reading stream for ${studentName}:`, error);
            await retryRead(reader, lastReadPosition, sourceBuffer, chunks, studentName); // Retry reading from last position
        });

        audioPlayer.addEventListener('error', () => {
            console.error(`Audio playback error for ${studentName}`);
            // Implement retry or resume logic here
        });

        audioPlayer.play();
    });

    window.addEventListener('offline', () => {
        console.log(`Network offline detected for ${studentName}`);
        audioPlayer.pause();
    });

    window.addEventListener('online', async () => {
        console.log(`Network online detected for ${studentName}`);
        await retryRead(reader, lastReadPosition, sourceBuffer, chunks, studentName); // Resume reading from last position
        audioPlayer.play();
    });

    audioPlayer.addEventListener('waiting', () => {
        console.log(`Audio buffering detected for ${studentName}`);
        // Implement logic to handle buffering, if necessary
    });
}

// Function to retry reading the stream from the last position
async function retryRead(reader, lastReadPosition, sourceBuffer, chunks, studentName) {
    try {
        await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
        const { done, value } = await reader.read();
        if (done) {
            return;
        }
        chunks.push(value);
        sourceBuffer.appendBuffer(value);
        lastReadPosition += value.byteLength;

        await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));

        reader.read().then(appendNextChunk).catch(async error => {
            console.error(`Error reading stream for ${studentName}:`, error);
            await retryRead(reader, lastReadPosition, sourceBuffer, chunks, studentName); // Retry reading from last position
        });
    } catch (error) {
        console.error(`Retry read failed for ${studentName}:`, error);
    }
}

// Simulate random interruptions every 10 seconds for testing purposes
setInterval(() => {
    const studentNames = ["Alice", "Bob", "Charlie"];
    const randomStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
    const randomAction = Math.random() > 0.5 ? 'offline' : 'online';
    
    if (randomAction === 'offline') {
        window.dispatchEvent(new Event('offline'));
    } else {
        window.dispatchEvent(new Event('online'));
    }

    console.log(`Simulating ${randomAction} event for ${randomStudent}`);
}, 10000);
