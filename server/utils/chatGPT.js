export async function callChatGPT(prompt, mode, outputElement) {
    try {
        const response = await fetch(`http://localhost:3001/${mode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        if (mode === "audio") {
            const audioURL = await getAudioStreamURL(response);
            await playAudio(audioURL, outputElement);
            await handleTeacherAudioCompletion();
        } else {
            await streamTextResponse(response, outputElement);
        }
    } catch (error) {
        outputElement.textContent = "Error processing your request";
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
        audioPlayer.onended = resolve;
        audioPlayer.play();
    });
}

async function streamTextResponse(response, outputElement) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let formattedText = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        formattedText += chunk.replace(/["\\,]/g, ''); // Format the chunk
        outputElement.textContent = formattedText;
    }
}

async function handleTeacherAudioCompletion() {
    const teacherAudioPlayer = document.getElementById('teacherAudioPlayer');
    console.log("Teacher finished speaking, selecting a random student to ask a question.");
    const randomStudent = getRandomStudent();
    console.log(`Random student selected: ${randomStudent.id}`);
    setTimeout(async () => {
        await callChatGPT("Can you explain that further?", "audio", randomStudent);
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
}

function getRandomStudent() {
    const studentAudioPlayers = [
        document.getElementById('studentAudioPlayer1'),
        document.getElementById('studentAudioPlayer2')
    ];
    return studentAudioPlayers[Math.floor(Math.random() * studentAudioPlayers.length)];
}
