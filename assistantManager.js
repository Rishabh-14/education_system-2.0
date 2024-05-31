// Location: src/assistantManager.js

const assistants = new Map();

const addAssistant = (studentId, assistantId) => {
  assistants.set(studentId, assistantId);
};

const getAssistant = (studentId) => {
  return assistants.get(studentId);
};

export { addAssistant, getAssistant };
