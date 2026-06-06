import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getChatHistory = async (sessionId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/api/chat/history/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
