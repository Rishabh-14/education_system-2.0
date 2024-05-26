import axios from "axios";

async function getChatResponse() {
  try {
    const response = await axios.post(
      "http://localhost:3000/chat",
      {
        chatId: "chatcmpl-9T4GEG1ivDOwREw78fNtXZvDhc72c",
        message: "How do I retrieve the whole conversation?",
        role: "Student",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the response field from the returned data
    const assistantResponse = response.data.response;
    console.log("Assistant Response:", assistantResponse);
  } catch (error) {
    console.error("Error fetching chat response:", error);
  }
}

getChatResponse();
