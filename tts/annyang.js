/*
if (annyang) {
  // Let's define a command.
  var commands = {
    "*text": function (transcript) {
      // '*text' is a named variable that will capture anything said
      document.getElementById("text").textContent = transcript;
    },
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start({ autoRestart: true, continuous: false });

  // OPTIONAL: activate debugging for detailed logging in the console
  annyang.debug();
} else {
  document.getElementById("text").textContent =
    "Speech Recognition is not supported";
}
*/

/*
if (annyang) {
  var commands = {
    "*text": async function (transcript) {
      try {
        const response = await fetch("http://localhost:3000/generate-story", {
          //gpt-once
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        });
        const data = await response.json();
        document.getElementById("text").textContent = data.message;
      } catch (error) {
        document.getElementById("text").textContent =
          "Error processing your request";
        console.error("Fetch error:", error);
      }
    },
  };

  annyang.addCommands(commands);
  annyang.start({ autoRestart: true, continuous: false });
  annyang.debug();
} else {
  document.getElementById("text").textContent =
    "Speech Recognition is not supported";
}
*/

if (annyang) {
    var commands = {
      "*text": async function (transcript) {
        document.getElementById("text").textContent = "Processing your input..."; // Feedback to the user
        try {
          const response = await fetch("http://localhost:3001/generate-story", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: transcript }), // Ensure backend expects 'prompt'
          });
          const data = await response.json();
          // Assuming the server responds with JSON that includes a 'message' key
          document.getElementById("text").textContent =
            "Story generated: " + data.message;
        } catch (error) {
          document.getElementById("text").textContent =
            "Error processing your request";
          console.error("Fetch error:", error);
        }
      },
    };
  
    annyang.addCommands(commands);
    annyang.start({ autoRestart: true, continuous: false });
    annyang.debug(); // Useful for development, but consider removing for production
  } else {
    document.getElementById("text").textContent =
      "Speech Recognition is not supported";
  }
  