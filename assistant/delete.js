import { listAssistant, deleteAssistant } from "./assistants.js";

async function deleteAllAssistants() {
  try {
    const response = await listAssistant();
    console.log("Response:", response);

    // Access the assistants array from the response object
    const assistants = response.data; // Assuming assistants are in the 'data' property
    console.log("List of assistants:", assistants);

    // Check if assistants is an array
    if (!Array.isArray(assistants)) {
      throw new TypeError("The assistants property is not an array.");
    }

    for (const assistant of assistants) {
      await deleteAssistant(assistant.id);
      console.log(`Deleted assistant with ID: ${assistant.id}`);
    }

    const updatedResponse = await listAssistant();
    console.log("List of assistants after deletion:", updatedResponse.data);
  } catch (error) {
    console.error("Error deleting assistants:", error);
  }
}

deleteAllAssistants();
