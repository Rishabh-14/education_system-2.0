export async function startVideo(video) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        console.log("Video and audio permissions granted.");
    } catch (error) {
        console.error("Error accessing media devices.", error);
    }
}
