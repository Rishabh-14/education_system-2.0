import { startVideo } from './video.js';
import { detectFace } from './faceDetection.js';
import { setupSpeechRecognition } from './speechRecognition.js';
import { callChatGPT } from './chatGPT.js';

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    const labelElement = document.getElementById('label');
    const textElement = document.getElementById('text');
    const textInput = document.getElementById('textInput');
    const submitTextButton = document.getElementById('submitText');
    const textOutput = document.getElementById('textOutput');
    const teacherAudioPlayer = document.getElementById('teacherAudioPlayer');

    startVideo(video);
    video.addEventListener('play', () => setInterval(() => detectFace(video, output, labelElement), 1000));

    setupSpeechRecognition(textElement, teacherAudioPlayer);
    submitTextButton.addEventListener('click', () => {
        const textPrompt = textInput.value;
        callChatGPT(textPrompt, "text", textOutput);
    });
});
