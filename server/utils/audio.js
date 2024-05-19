export async function getAudioStreamURL(response) {
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

export function playAudio(audioURL, audioPlayer) {
    return new Promise((resolve) => {
        audioPlayer.src = audioURL;
        audioPlayer.onended = resolve;
        audioPlayer.play();
    });
}

export async function streamTextResponse(response, outputElement) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let formattedText = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        formattedText += chunk.replace(/["\\]/g, ''); // Format the chunk
        outputElement.textContent = formattedText;
    }
}
