export async function fetchWithRetry(url, options, retries) {
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
        audioPlayer.onended = () => {
            resolve();
        };
        audioPlayer.play();
    });
}
