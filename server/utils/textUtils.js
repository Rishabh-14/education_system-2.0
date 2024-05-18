import { gptOnce } from '../text/gpt.js';

export async function callChatGPTText(prompt) {
    const responseText = await gptOnce(prompt);
    return responseText;
}

export function displayText(text) {
    const textElement = document.getElementById("text");
    textElement.textContent = text;
}
