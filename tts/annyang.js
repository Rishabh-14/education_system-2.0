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
