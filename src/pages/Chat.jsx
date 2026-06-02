import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { getChatHistory } from "../services/chatService";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory();

      const formatted = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      setMessages(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const token = localStorage.getItem("token");

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    setLoading(true);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/chat/?message=${encodeURIComponent(
          currentMessage,
        )}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const aiMessage = {
        role: "assistant",
        content: res.data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);

      let errorMessage = "⚠️ AI service is busy. Please try again.";

      if (error.response?.status === 503) {
        errorMessage =
          "⚠️ Gemini servers are overloaded. Please try again in a few seconds.";
      }

      if (error.response?.status === 429) {
        errorMessage = "⚠️ Gemini free quota exceeded. Please wait a minute.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 p-4">
        <h1 className="text-3xl font-bold">AI Mentor Chat</h1>
        <button
          onClick={() => setMessages([])}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            Ask your first career question 🚀
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl p-4 rounded-2xl ${
                msg.role === "user" ? "bg-blue-600" : "bg-slate-800"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl">
              🤖 AI is typing...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-4 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about placements..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
