export async function detectFace(video, output, labelElement) {
    const imageData = captureFrame(video);
    const result = await sendImageForDetection(imageData);
    
    if (result.image) {
        updateOutput(result, output, labelElement);
        await handleFaceDetection(result);
    } else {
        console.error('Error:', result.error);
    }
}

function captureFrame(video) {
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

function updateOutput(result, output, labelElement) {
    output.src = `data:image/jpeg;base64,${result.image}`;
    labelElement.textContent = result.label;
}

async function handleFaceDetection(result) {
    const teacherAudioPlayer = document.getElementById('teacherAudioPlayer');
    let faceDetected = true;
    let faceDetectionInitialized = false;

    if (!result.faceDetected && faceDetected && faceDetectionInitialized) {
        faceDetected = false;
        console.log("Face not detected. Calling ChatGPT.");
        await callChatGPT("What happened, Rishabh?", "audio", teacherAudioPlayer);
    } else if (result.faceDetected) {
        faceDetected = true;
    }
    faceDetectionInitialized = true;
}
