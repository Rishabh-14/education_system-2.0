/*
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');

  useEffect(() => {
    if (annyang) {
      // Define commands
      const commands = {
        hello: () => setMessage("Hello! How can I help you?"),
        goodbye: () => setMessage("Goodbye! Have a nice day!"),
      };

      // Add commands to annyang
      annyang.addCommands(commands);

      // Start listening
      annyang.start();

      // Cleanup
      return () => {
        annyang.abort();
      };
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
*/
/*
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');

  useEffect(() => {
    if (annyang) {
      console.log("Annyang is available");

      // Define commands
      const commands = {
        hello: () => {
          const text = "Hello! How can I help you?";
          setMessage(text);
          console.log("Recognized command: hello");
          speak(text);
        },
        goodbye: () => {
          const text = "Goodbye! Have a nice day!";
          setMessage(text);
          console.log("Recognized command: goodbye");
          speak(text);
        },
      };

      // Add commands to annyang
      annyang.addCommands(commands);
      console.log("Commands added to annyang");

      // Start listening
      annyang.start();
      console.log("Annyang started listening");

      // Cleanup
      return () => {
        annyang.abort();
        console.log("Annyang aborted");
      };
    } else {
      console.error("Annyang is not available");
    }
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);

      utterThis.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      synth.speak(utterThis);
      console.log(`Speaking: ${text}`);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
*/
/*
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      console.log("Annyang is available");

      // Define commands
      const commands = {
        hello: () => {
          const text = "Hello! How can I help you?";
          setMessage(text);
          console.log("Recognized command: hello");
          speak(text);
        },
        goodbye: () => {
          const text = "Goodbye! Have a nice day!";
          setMessage(text);
          console.log("Recognized command: goodbye");
          speak(text);
        },
      };

      // Add commands to annyang
      annyang.addCommands(commands);
      console.log("Commands added to annyang");

      // Cleanup
      return () => {
        annyang.abort();
        console.log("Annyang aborted");
      };
    } else {
      console.error("Annyang is not available");
    }
  }, []);

  const startListening = () => {
    if (annyang) {
      annyang.start();
      setIsListening(true);
      console.log("Annyang started listening");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);

      utterThis.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      synth.speak(utterThis);
      console.log(`Speaking: ${text}`);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        {!isListening && (
          <button onClick={startListening}>Start Listening</button>
        )}
      </header>
    </div>
  );
}

export default App;
*/
/* // persistance before refresh
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      console.log("Annyang is available");

      // Define commands
      const commands = {
        hello: () => {
          const text = "Hello! How can I help you?";
          setMessage(text);
          console.log("Recognized command: hello");
          speak(text);
        },
        goodbye: () => {
          const text = "Goodbye! Have a nice day!";
          setMessage(text);
          console.log("Recognized command: goodbye");
          speak(text);
        },
      };

      // Add commands to annyang
      annyang.addCommands(commands);
      console.log("Commands added to annyang");

      // Automatically start listening if permission was previously granted
      if (localStorage.getItem("isListening") === "true") {
        startListening();
      }

      // Cleanup
      return () => {
        annyang.abort();
        console.log("Annyang aborted");
      };
    } else {
      console.error("Annyang is not available");
    }
  }, []);

  const startListening = () => {
    if (annyang) {
      annyang.start();
      setIsListening(true);
      localStorage.setItem("isListening", "true");
      console.log("Annyang started listening");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);

      utterThis.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      synth.speak(utterThis);
      console.log(`Speaking: ${text}`);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        {!isListening && (
          <button onClick={startListening}>Start Listening</button>
        )}
      </header>
    </div>
  );
}

export default App;
*/
/*
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (annyang) {
      console.log("Annyang is available");

      // Define commands
      const commands = {
        hello: () => {
          const text = "Hello! How can I help you?";
          setMessage(text);
          console.log("Recognized command: hello");
          speak(text);
        },
        goodbye: () => {
          const text = "Goodbye! Have a nice day!";
          setMessage(text);
          console.log("Recognized command: goodbye");
          speak(text);
        },
      };

      // Add commands to annyang
      annyang.addCommands(commands);
      console.log("Commands added to annyang");

      // Automatically start listening if permission was previously granted
      const isPermissionGranted =
        localStorage.getItem("permissionGranted") === "true";
      if (isPermissionGranted) {
        startListening();
      }

      // Cleanup
      return () => {
        annyang.abort();
        console.log("Annyang aborted");
      };
    } else {
      console.error("Annyang is not available");
    }
  }, []);

  const requestPermission = () => {
    // This function is called when the user clicks the "Grant Permission" button
    startListening();
    localStorage.setItem("permissionGranted", "true");
    setPermissionGranted(true);
    speak('Permission granted. You can now say "hello" or "goodbye".');
  };

  const startListening = () => {
    if (annyang) {
      annyang.start();
      setIsListening(true);
      console.log("Annyang started listening");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);

      utterThis.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      synth.speak(utterThis);
      console.log(`Speaking: ${text}`);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        {!permissionGranted && (
          <button onClick={requestPermission}>Grant Permission</button>
        )}
      </header>
    </div>
  );
}

export default App;
*/
import React, { useEffect, useState } from "react";
import annyang from "annyang";

function App() {
  const [message, setMessage] = useState('Say "hello" or "goodbye"!');
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (annyang) {
      console.log("Annyang is available");

      // Define commands
      const commands = {
        "*transcript": (transcript) => {
          setMessage(`You said: ${transcript}`);
          console.log(`Recognized command: ${transcript}`);
          getApiResponse(transcript);
        },
      };

      // Add commands to annyang
      annyang.addCommands(commands);
      console.log("Commands added to annyang");

      // Automatically start listening if permission was previously granted
      const isPermissionGranted =
        localStorage.getItem("permissionGranted") === "true";
      if (isPermissionGranted) {
        startListening();
      }

      // Cleanup
      return () => {
        annyang.abort();
        console.log("Annyang aborted");
      };
    } else {
      console.error("Annyang is not available");
    }
  }, []);

  const getApiResponse = async (transcript) => {
    try {
      const response = await fetch(
        "https://educationsystem-20-production.up.railway.app/gpt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        }
      );
      const data = await response.json();
      const responseMessage = data.message;
      setMessage(responseMessage);
      speak(responseMessage);
    } catch (error) {
      console.error("Error fetching API response:", error);
    }
  };

  const requestPermission = () => {
    // This function is called when the user clicks the "Grant Permission" button
    startListening();
    localStorage.setItem("permissionGranted", "true");
    setPermissionGranted(true);
    speak("Permission granted. You can now say any command.");
  };

  const startListening = () => {
    if (annyang) {
      annyang.start();
      setIsListening(true);
      console.log("Annyang started listening");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);

      utterThis.onend = () => {
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      synth.speak(utterThis);
      console.log(`Speaking: ${text}`);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        {!permissionGranted && (
          <button onClick={requestPermission}>Grant Permission</button>
        )}
      </header>
    </div>
  );
}

export default App;
