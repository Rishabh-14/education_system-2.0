import { fetchWithRetry, getAudioStreamURL, playAudio } from './audioUtils.js';
import { callChatGPTText } from './textUtils.js';

export async function handleCommand(transcript, mode, audioPlayer = null) {
    if (mode === 'text') {
        const responseText = await callChatGPTText(transcript);
        displayText(responseText); // Assuming there's a function to display text
    } else if (mode === 'audio' && audioPlayer) {
        await callChatGPTAudio(transcript, audioPlayer);
    }
}

async function callChatGPTAudio(prompt, audioPlayer) {
    try {
        const response = await fetchWithRetry("http://localhost:3001/audio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
        }, 3); // Retry up to 3 times

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const audioURL = await getAudioStreamURL(response);
        await playAudio(audioURL, audioPlayer);

        if (audioPlayer.id === 'teacherAudioPlayer') {
            console.log("Teacher finished speaking, selecting a random person to ask a question.");
            const randomPerson = getRandomPerson();
            setTimeout(async () => {
                await askQuestionToPerson(randomPerson);
            }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function getRandomPerson() {
    const people = ["student", "teacher", "user"];
    return people[Math.floor(Math.random() * people.length)];
}

function getRandomQuestion() {
    const questions = [
        "Can you explain that further?",
        "What do you think about this topic?",
        "Do you have any questions?",
        "Can you summarize what we discussed?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
}

async function askQuestionToPerson(person) {
    const question = getRandomQuestion();

    if (person === "teacher") {
        console.log("Teacher is asking a question to a student or user.");
        await handleCommand(question, 'audio', document.getElementById('teacherAudioPlayer'));
    } else if (person === "student") {
        const randomStudent = getRandomStudent();
        console.log("Student is asking a question to the teacher.");
        await handleCommand(question, 'audio', randomStudent);
    } else if (person === "user") {
        console.log("Teacher is asking a question to you.");
        await handleCommand(question, 'audio', document.getElementById('teacherAudioPlayer'));
    }
}
