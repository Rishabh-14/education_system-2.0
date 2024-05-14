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

if (annyang) {
  var commands = {
    "*text": async function (transcript) {
      document.getElementById("text").textContent = "Processing your input...";
      try {
        const response = await fetch("http://localhost:3002/audio", {
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
