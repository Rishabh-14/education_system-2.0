// tts/script.js

/*
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const output = document.getElementById("output");
  const labelElement = document.getElementById("label");
  const textElement = document.getElementById("text");
  const teacherAudioPlayer = document.getElementById("audioPlayer1");
  const studentAudioPlayers = [
    document.getElementById("audioPlayer2"),
    document.getElementById("audioPlayer3"),
  ];
  let faceDetected = true;
  let faceDetectionInitialized = false;

  const userId = "unique-user-id"; // Replace with actual user ID if available

  startVideo();

  video.addEventListener("play", () => {
    setInterval(detectFace, 1000); // Check every second
  });

  if (annyang) {
    setupSpeechRecognition();
  } else {
    textElement.textContent = "Speech Recognition is not supported";
  }

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      video.srcObject = stream;
      console.log("Video and audio permissions granted.");
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }

  async function detectFace() {
    const imageData = captureFrame();
    const result = await sendImageForDetection(imageData);

    if (result.image) {
      updateOutput(result);
      if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
        faceDetected = false;
        console.log("Face not detected. Calling ChatGPT.");
        await callChatGPT(
          "What happened, Rishabh?",
          teacherAudioPlayer,
          "teacher"
        );
      } else if (result.faceDetected) {
        faceDetected = true;
      }
      faceDetectionInitialized = true;
    } else {
      console.error("Error:", result.error);
    }
  }

  function captureFrame() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg").split(",")[1];
  }

  async function sendImageForDetection(imageData) {
    const response = await fetch("http://localhost:3002/detect-face", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });
    return await response.json();
  }

  function updateOutput(result) {
    output.src = `data:image/jpeg;base64,${result.image}`;
    labelElement.textContent = result.label;
  }

  async function callChatGPT(prompt, audioPlayer, role) {
    try {
      const response = await fetch("http://localhost:3001/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, role: role, prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { accumulatedText } = await response.json();

      const audioResponse = await fetch(
        "http://localhost:3001/generate-audio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: accumulatedText }),
        }
      );

      if (!audioResponse.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioURL = await getAudioStreamURL(audioResponse);
      await playAudio(audioURL, audioPlayer);

      if (audioPlayer === teacherAudioPlayer) {
        console.log(
          "Teacher finished speaking, selecting a random person to ask a question."
        );
        const randomPerson = getRandomPerson(["teacher", "student"]);
        setTimeout(async () => {
          await askQuestionToPerson(randomPerson);
        }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
      } else if (studentAudioPlayers.includes(audioPlayer)) {
        console.log("Student finished speaking.");
        // Additional logic if needed when the student finishes speaking
      }
    } catch (error) {
      textElement.textContent = "Error processing your request";
      console.error("Fetch error:", error);
    }
  }

  async function getAudioStreamURL(response) {
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
      },
    });
    return URL.createObjectURL(
      new Blob([await new Response(stream).arrayBuffer()], {
        type: "audio/ogg",
      })
    );
  }

  function playAudio(audioURL, audioPlayer) {
    return new Promise((resolve) => {
      audioPlayer.src = audioURL;
      audioPlayer.onended = () => {
        resolve();
      };
      audioPlayer.play();
    });
  }

  function getRandomStudent() {
    return studentAudioPlayers[
      Math.floor(Math.random() * studentAudioPlayers.length)
    ];
  }

  function getRandomQuestion() {
    const questions = [
      "Can you explain that further?",
      "What do you think about this topic?",
      "Do you have any questions?",
      "Can you summarize what we discussed?",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function getRandomPerson(roles) {
    if (roles.includes("teacher") && roles.includes("student")) {
      const people = [teacherAudioPlayer, ...studentAudioPlayers];
      return people[Math.floor(Math.random() * people.length)];
    } else if (roles.includes("student")) {
      return getRandomStudent();
    }
    return teacherAudioPlayer;
  }

  async function askQuestionToPerson(person) {
    const question = getRandomQuestion();

    if (person === teacherAudioPlayer) {
      console.log("Teacher is asking a question to a student or user.");
      await callChatGPT(question, teacherAudioPlayer, "teacher");
    } else if (studentAudioPlayers.includes(person)) {
      console.log("Student is asking a question to the teacher.");
      await callChatGPT(question, person, "student");
    }
  }

  function setupSpeechRecognition() {
    const commands = {
      "*text": async function (transcript) {
        console.log(`Recognized speech: ${transcript}`);
        textElement.textContent = "Processing your input...";
        await callChatGPT(transcript, teacherAudioPlayer, "teacher");
      },
    };

    annyang.addCommands(commands);
    annyang.start({ autoRestart: true, continuous: true });
    annyang.debug();
  }
});
*/

/*
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const output = document.getElementById("output");
  const labelElement = document.getElementById("label");
  const textElement = document.getElementById("text");
  const teacherAudioPlayer = document.getElementById("audioPlayer1");
  const studentAudioPlayers = [
    document.getElementById("audioPlayer2"),
    document.getElementById("audioPlayer3"),
  ];
  let faceDetected = true;
  let faceDetectionInitialized = false;

  const userId = "unique-user-id"; // Replace with actual user ID if available

  startVideo();

  video.addEventListener("play", () => {
    setInterval(detectFace, 1000); // Check every second
  });

  if (annyang) {
    setupSpeechRecognition();
  } else {
    textElement.textContent = "Speech Recognition is not supported";
  }

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      video.srcObject = stream;
      console.log("Video and audio permissions granted.");
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }

  async function detectFace() {
    const imageData = captureFrame();
    const result = await sendImageForDetection(imageData);

    if (result.image) {
      updateOutput(result);
      if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
        faceDetected = false;
        console.log("Face not detected. Calling ChatGPT.");
        await callChatGPT(
          "What happened, Rishabh?",
          teacherAudioPlayer,
          "teacher"
        );
      } else if (result.faceDetected) {
        faceDetected = true;
      }
      faceDetectionInitialized = true;
    } else {
      console.error("Error:", result.error);
    }
  }

  function captureFrame() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg").split(",")[1];
  }

  async function sendImageForDetection(imageData) {
    const response = await fetch("http://localhost:3002/detect-face", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });
    return await response.json();
  }

  function updateOutput(result) {
    output.src = `data:image/jpeg;base64,${result.image}`;
    labelElement.textContent = result.label;
  }

  async function callChatGPT(prompt, audioPlayer, role) {
    try {
      const response = await fetch(`${apiUrl}/audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, role: role, prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { accumulatedText } = await response.json();

      const audioResponse = await fetch(`${apiUrl}/generate-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: accumulatedText }),
      });

      if (!audioResponse.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioURL = await getAudioStreamURL(audioResponse);
      await playAudio(audioURL, audioPlayer);

      if (
        audioPlayer === teacherAudioPlayer ||
        studentAudioPlayers.includes(audioPlayer)
      ) {
        console.log(
          "Teacher or student finished speaking, selecting a random person to ask a question."
        );
        const randomPerson = getRandomPerson(["teacher", "student"]);
        setTimeout(async () => {
          await askQuestionToPerson(randomPerson);
        }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
      }
    } catch (error) {
      textElement.textContent = "Error processing your request";
      console.error("Fetch error:", error);
    }
  }

  async function getAudioStreamURL(response) {
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
      },
    });
    return URL.createObjectURL(
      new Blob([await new Response(stream).arrayBuffer()], {
        type: "audio/ogg",
      })
    );
  }

  function playAudio(audioURL, audioPlayer) {
    return new Promise((resolve) => {
      audioPlayer.src = audioURL;
      audioPlayer.onended = () => {
        resolve();
      };
      audioPlayer.play();
    });
  }

  function getRandomStudent() {
    return studentAudioPlayers[
      Math.floor(Math.random() * studentAudioPlayers.length)
    ];
  }

  function getRandomPerson(roles) {
    if (roles.includes("teacher") && roles.includes("student")) {
      const people = [teacherAudioPlayer, ...studentAudioPlayers];
      return people[Math.floor(Math.random() * people.length)];
    } else if (roles.includes("student")) {
      return getRandomStudent();
    }
    return teacherAudioPlayer;
  }

  async function askQuestionToPerson(person) {
    const questionPrompt = "Ask a question based on the previous response.";

    if (person === teacherAudioPlayer) {
      console.log("Teacher is asking a question to a student or user.");
      await callChatGPT(questionPrompt, teacherAudioPlayer, "teacher");
    } else if (studentAudioPlayers.includes(person)) {
      console.log("Student is asking a question to the teacher.");
      await callChatGPT(questionPrompt, person, "student");
    }
  }

  function setupSpeechRecognition() {
    const commands = {
      "*text": async function (transcript) {
        console.log(`Recognized speech: ${transcript}`);
        textElement.textContent = "Processing your input...";
        await callChatGPT(transcript, teacherAudioPlayer, "teacher");
      },
    };

    annyang.addCommands(commands);
    annyang.start({ autoRestart: true, continuous: true });
    annyang.debug();
  }
});
*/

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3001/config")
    .then((response) => response.json())
    .then((config) => {
      const apiUrl = config.apiUrl;
      initializeApp(apiUrl);
    })
    .catch((error) => {
      console.error("Error fetching configuration:", error);
    });

  function initializeApp(apiUrl) {
    const video = document.getElementById("video");
    const output = document.getElementById("output");
    const labelElement = document.getElementById("label");
    const textElement = document.getElementById("text");
    const teacherAudioPlayer = document.getElementById("audioPlayer1");
    const studentAudioPlayers = [
      document.getElementById("audioPlayer2"),
      document.getElementById("audioPlayer3"),
    ];
    let faceDetected = true;
    let faceDetectionInitialized = false;

    const userId = "unique-user-id"; // Replace with actual user ID if available

    startVideo();

    video.addEventListener("play", () => {
      setInterval(detectFace, 1000); // Check every second
    });

    if (annyang) {
      setupSpeechRecognition();
    } else {
      textElement.textContent = "Speech Recognition is not supported";
    }

    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        video.srcObject = stream;
        console.log("Video and audio permissions granted.");
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    }

    async function detectFace() {
      const imageData = captureFrame();
      const result = await sendImageForDetection(imageData);

      if (result.image) {
        updateOutput(result);
        if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
          faceDetected = false;
          console.log("Face not detected. Calling ChatGPT.");
          await callChatGPT(
            "What happened, Rishabh?",
            teacherAudioPlayer,
            "teacher"
          );
        } else if (result.faceDetected) {
          faceDetected = true;
        }
        faceDetectionInitialized = true;
      } else {
        console.error("Error:", result.error);
      }
    }

    function captureFrame() {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg").split(",")[1];
    }

    async function sendImageForDetection(imageData) {
      const response = await fetch("http://localhost:3002/detect-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      return await response.json();
    }

    function updateOutput(result) {
      output.src = `data:image/jpeg;base64,${result.image}`;
      labelElement.textContent = result.label;
    }

    async function callChatGPT(prompt, audioPlayer, role) {
      try {
        const response = await fetch(`${apiUrl}/audio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId, role: role, prompt: prompt }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const { accumulatedText } = await response.json();

        const audioResponse = await fetch(`${apiUrl}/generate-audio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: accumulatedText }),
        });

        if (!audioResponse.ok) {
          throw new Error("Failed to generate audio");
        }

        const audioURL = await getAudioStreamURL(audioResponse);
        await playAudio(audioURL, audioPlayer);

        if (
          audioPlayer === teacherAudioPlayer ||
          studentAudioPlayers.includes(audioPlayer)
        ) {
          console.log(
            "Teacher or student finished speaking, selecting a random person to ask a question."
          );
          const randomPerson = getRandomPerson(["teacher", "student"]);
          setTimeout(async () => {
            await askQuestionToPerson(randomPerson);
          }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
        }
      } catch (error) {
        textElement.textContent = "Error processing your request";
        console.error("Fetch error:", error);
      }
    }

    async function getAudioStreamURL(response) {
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
        },
      });
      return URL.createObjectURL(
        new Blob([await new Response(stream).arrayBuffer()], {
          type: "audio/ogg",
        })
      );
    }

    function playAudio(audioURL, audioPlayer) {
      return new Promise((resolve) => {
        audioPlayer.src = audioURL;
        audioPlayer.onended = () => {
          resolve();
        };
        audioPlayer.play();
      });
    }

    function getRandomStudent() {
      return studentAudioPlayers[
        Math.floor(Math.random() * studentAudioPlayers.length)
      ];
    }

    function getRandomPerson(roles) {
      if (roles.includes("teacher") && roles.includes("student")) {
        const people = [teacherAudioPlayer, ...studentAudioPlayers];
        return people[Math.floor(Math.random() * people.length)];
      } else if (roles.includes("student")) {
        return getRandomStudent();
      }
      return teacherAudioPlayer;
    }

    async function askQuestionToPerson(person) {
      const questionPrompt = "Ask a question based on the previous response.";

      if (person === teacherAudioPlayer) {
        console.log("Teacher is asking a question to a student or user.");
        await callChatGPT(questionPrompt, teacherAudioPlayer, "teacher");
      } else if (studentAudioPlayers.includes(person)) {
        console.log("Student is asking a question to the teacher.");
        await callChatGPT(questionPrompt, person, "student");
      }
    }

    function setupSpeechRecognition() {
      const commands = {
        "*text": async function (transcript) {
          console.log(`Recognized speech: ${transcript}`);
          textElement.textContent = "Processing your input...";
          await callChatGPT(transcript, teacherAudioPlayer, "teacher");
        },
      };

      annyang.addCommands(commands);
      annyang.start({ autoRestart: true, continuous: true });
      annyang.debug();
    }
  }
});
