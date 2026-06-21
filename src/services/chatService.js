import api from "../api/axios";

// Fetch chat messages for a specific session
export const getSessionMessages = async (sessionId) => {
  const response = await api.get(`/api/chat/session/${sessionId}`);
  return response.data;
};

// Create a new chat session
export const createChatSession = async () => {
  const response = await api.post("/api/chat-sessions/new");
  return response.data;
};

// Retrieve all chat sessions for the logged-in user
export const getChatSessions = async () => {
  const response = await api.get("/api/chat-sessions/");
  return response.data;
};

// Rename a chat session
export const renameChatSession = async (sessionId, title) => {
  const response = await api.put(`/api/chat-sessions/${sessionId}`, { title });
  return response.data;
};

// Delete a chat session
export const deleteChatSession = async (sessionId) => {
  const response = await api.delete(`/api/chat-sessions/${sessionId}`);
  return response.data;
};

