import { callChatGPT } from './chatGPT.js';

export function setupSpeechRecognition(textElement, teacherAudioPlayer) {
    if (annyang) {
        const commands = {
            "*text": async function (transcript) {
                console.log(`Recognized speech: ${transcript}`);
                textElement.textContent = "Processing your input...";
                await callChatGPT(transcript, "audio", teacherAudioPlayer);
            }
        };
        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        annyang.debug();
    } else {
        textElement.textContent = "Speech Recognition is not supported";
    }
}
