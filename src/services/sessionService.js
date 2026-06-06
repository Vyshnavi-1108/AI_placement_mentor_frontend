import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getSessions = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/api/chat-sessions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createSession = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/api/chat-sessions/new`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
