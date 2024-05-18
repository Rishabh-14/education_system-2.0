/* //Working for audio and text
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const audioPlayer = document.getElementById('audioPlayer');
    let faceDetected = true;
    let faceDetectionInitialized = false;

    // Start video
    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            video.srcObject = stream;
            console.log("Video and audio permissions granted.");
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }

    // Detect face function
    async function detectFace() {
        const imageData = captureFrame();
        const result = await sendImageForDetection(imageData);
        
        if (result.image) {
            updateOutput(result);
            if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
                faceDetected = false;
                console.log("Face not detected. Calling ChatGPT.");
                await callChatGPT("What happened, Rishabh?");
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    // Capture frame from video
    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    // Send image data to detection API
    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    // Update output image and label
    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

    // Call ChatGPT and play audio
    async function callChatGPT(prompt) {
        try {
            const response = await fetch("http://localhost:3001/audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const audioURL = await getAudioStreamURL(response);
            playAudio(audioURL);
        } catch (error) {
            textElement.textContent = "Error processing your request";
            console.error("Fetch error:", error);
        }
    }

    // Get audio stream URL
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
    }

    // Play audio
    function playAudio(audioURL) {
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    // Initialize speech recognition
    if (annyang) {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript);
            }
        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    startVideo();
    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });
});
*/

/* Audio video working

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const textInput = document.getElementById('textInput');
    const submitTextButton = document.getElementById('submitText');
    const textOutput = document.getElementById('textOutput');
    const audioPlayer = document.getElementById('audioPlayer');
    let faceDetected = true;
    let faceDetectionInitialized = false;

    // Start video
    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            video.srcObject = stream;
            console.log("Video and audio permissions granted.");
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }

    // Detect face function
    async function detectFace() {
        const imageData = captureFrame();
        const result = await sendImageForDetection(imageData);
        
        if (result.image) {
            updateOutput(result);
            if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
                faceDetected = false;
                console.log("Face not detected. Calling ChatGPT.");
                await callChatGPT("What happened, Rishabh?", "text");
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    // Capture frame from video
    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    // Send image data to detection API
    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    // Update output image and label
    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

    // Call ChatGPT and handle response based on mode (audio or text)
    async function callChatGPT(prompt, mode) {
        try {
            const response = await fetch(`http://localhost:3001/${mode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (mode === "audio") {
                const audioURL = await getAudioStreamURL(response);
                playAudio(audioURL);
            } else {
                const textResponse = await response.json();
                displayText(textResponse.message);
            }
        } catch (error) {
            textElement.textContent = "Error processing your request";
            console.error("Fetch error:", error);
        }
    }

    // Get audio stream URL
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
    }

    // Play audio
    function playAudio(audioURL) {
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    // Display text output
    function displayText(text) {
        textOutput.textContent = text;
    }

    // Initialize speech recognition
    if (annyang) {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript, "audio");
            }
        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    // Handle text input submission
    submitTextButton.addEventListener('click', () => {
        const textPrompt = textInput.value;
        callChatGPT(textPrompt, "text");
    });

    startVideo();
    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });
});
// script.js

async function submitText() {
    const textInput = document.getElementById('textInput').value;
    const outputDiv = document.getElementById('output');
    outputDiv.textContent = '';

    try {
        const response = await fetch('http://localhost:3001/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textInput }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            outputDiv.textContent += chunk;
        }
    } catch (error) {
        console.error('Error:', error);
        outputDiv.textContent = 'Error processing your request';
    }
}
*/

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const textInput = document.getElementById('textInput');
    const submitTextButton = document.getElementById('submitText');
    const textOutput = document.getElementById('textOutput');
    const audioPlayer = document.getElementById('audioPlayer');
    let faceDetected = true;
    let faceDetectionInitialized = false;

    // Start video
    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            video.srcObject = stream;
            console.log("Video and audio permissions granted.");
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }

    // Detect face function
    async function detectFace() {
        const imageData = captureFrame();
        const result = await sendImageForDetection(imageData);
        
        if (result.image) {
            updateOutput(result);
            if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
                faceDetected = false;
                console.log("Face not detected. Calling ChatGPT.");
                await callChatGPT("What happened, Rishabh?", "text");
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    // Capture frame from video
    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    // Send image data to detection API
    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    // Update output image and label
    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

    // Call ChatGPT and handle response based on mode (audio or text)
    async function callChatGPT(prompt, mode) {
        try {
            const response = await fetch(`http://localhost:3001/${mode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (mode === "audio") {
                const audioURL = await getAudioStreamURL(response);
                playAudio(audioURL);
            } else {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                textOutput.textContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    textOutput.textContent += chunk;
                }
            }
        } catch (error) {
            textElement.textContent = "Error processing your request";
            console.error("Fetch error:", error);
        }
    }

    // Get audio stream URL
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
    }

    // Play audio
    function playAudio(audioURL) {
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    // Initialize speech recognition
    if (annyang) {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript, "audio");
            }
        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    // Handle text input submission
    submitTextButton.addEventListener('click', () => {
        const textPrompt = textInput.value;
        callChatGPT(textPrompt, "text");
    });

    startVideo();
    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });
});
