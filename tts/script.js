/* // Working distracted look away 
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const audioPlayer = document.getElementById('audioPlayer');
    let faceDetected = true;
    let faceDetectionInitialized = false;

    startVideo();

    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });

    if (annyang) {
        setupSpeechRecognition();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
                await callChatGPT("tell me a joke");
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

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

    function playAudio(audioURL) {
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    function setupSpeechRecognition() {
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
    }
});
*/

/* // random playing of audio working

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const audioPlayers = [
        document.getElementById('audioPlayer1'),
        document.getElementById('audioPlayer2'),
        document.getElementById('audioPlayer3')
    ];
    let faceDetected = true;
    let faceDetectionInitialized = false;

    startVideo();

    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });

    if (annyang) {
        setupSpeechRecognition();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
                await callChatGPT("What happened, Rishabh?");
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

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
            playRandomAudio(audioURL);
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
    }

    function playRandomAudio(audioURL) {
        const randomIndex = Math.floor(Math.random() * audioPlayers.length);
        const audioPlayer = audioPlayers[randomIndex];
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    function setupSpeechRecognition() {
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
    }
});
*/
/* // random speaking working but not syncronously
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const teacherAudioPlayer = document.getElementById('teacherAudioPlayer');
    const studentAudioPlayers = [
        document.getElementById('studentAudioPlayer1'),
        document.getElementById('studentAudioPlayer2')
    ];
    let faceDetected = true;
    let faceDetectionInitialized = false;

    startVideo();

    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });

    if (annyang) {
        setupSpeechRecognition();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
                await callChatGPT("What happened, Rishabh?", teacherAudioPlayer);
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

    async function callChatGPT(prompt, audioPlayer) {
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
            playAudio(audioURL, audioPlayer);

            if (audioPlayer === teacherAudioPlayer) {
                setTimeout(() => {
                    const randomStudent = getRandomStudent();
                    callChatGPT("Can you explain that further?", randomStudent);
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
    }

    function playAudio(audioURL, audioPlayer) {
        audioPlayer.src = audioURL;
        audioPlayer.play();
    }

    function getRandomStudent() {
        return studentAudioPlayers[Math.floor(Math.random() * studentAudioPlayers.length)];
    }

    function setupSpeechRecognition() {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript, teacherAudioPlayer);
            }
        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    }
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const teacherAudioPlayer = document.getElementById('teacherAudioPlayer');
    const studentAudioPlayers = [
        document.getElementById('studentAudioPlayer1'),
        document.getElementById('studentAudioPlayer2')
    ];
    let faceDetected = true;
    let faceDetectionInitialized = false;

    startVideo();

    video.addEventListener('play', () => {
        setInterval(detectFace, 1000); // Check every second
    });

    if (annyang) {
        setupSpeechRecognition();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
                await callChatGPT("What happened, Rishabh?", teacherAudioPlayer);
            } else if (result.faceDetected) {
                faceDetected = true;
            }
            faceDetectionInitialized = true;
        } else {
            console.error('Error:', result.error);
        }
    }

    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    async function sendImageForDetection(imageData) {
        const response = await fetch('http://localhost:3002/detect-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    }

    function updateOutput(result) {
        output.src = `data:image/jpeg;base64,${result.image}`;
        labelElement.textContent = result.label;
    }

    async function callChatGPT(prompt, audioPlayer) {
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
            await playAudio(audioURL, audioPlayer);

            if (audioPlayer === teacherAudioPlayer) {
                console.log("Teacher finished speaking, selecting a random student to ask a question.");
                const randomStudent = getRandomStudent();
                console.log(`Random student selected: ${randomStudent.id}`);
                setTimeout(async () => {
                    await callChatGPT("Can you explain that further?", randomStudent);
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
            }
        });
        return URL.createObjectURL(new Blob([await new Response(stream).arrayBuffer()], { type: 'audio/ogg' }));
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
        return studentAudioPlayers[Math.floor(Math.random() * studentAudioPlayers.length)];
    }

    function setupSpeechRecognition() {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript, teacherAudioPlayer);
            }
        };

        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    }
});
