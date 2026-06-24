import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { 
  getChatSessions, 
  createChatSession, 
  getSessionMessages,
  renameChatSession,
  deleteChatSession
} from "../services/chatService";
import Loader from "../components/Loader";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  ChevronRight, 
  Menu, 
  X, 
  Trash2,
  Sparkles,
  Edit2,
  Check,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse state
  const [initialLoading, setInitialLoading] = useState(true);

  // Rename states
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitleText, setEditTitleText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadSessionMessages(selectedSession);
    } else {
      setMessages([]);
    }
  }, [selectedSession]);

  // Auto Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streaming]);

  const loadSessions = async () => {
    try {
      setInitialLoading(true);
      const data = await getChatSessions();
      setSessions(data);
      if (data.length > 0) {
        setSelectedSession(data[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load chat history.");
    } finally {
      setInitialLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const data = await getSessionMessages(sessionId);
      const formatted = data.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      setMessages(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  const createNewChat = async () => {
    try {
      const session = await createChatSession();
      setSessions((prev) => [session, ...prev]);
      setSelectedSession(session.id);
      setMessages([]);
      setSidebarOpen(false);
      toast.success("New chat session created!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create chat session.");
    }
  };

  const handleStartRename = (e, session) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.title);
  };

  const handleSaveRename = async (sessionId) => {
    if (!editTitleText.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    try {
      const updatedSession = await renameChatSession(sessionId, editTitleText.trim());
      setSessions(sessions.map(s => s.id === sessionId ? updatedSession : s));
      setEditingSessionId(null);
      toast.success("Chat renamed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename chat");
    }
  };

  const handleDeleteSession = async (e, sessionId, sessionTitle) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${sessionTitle}"?`)) {
      return;
    }
    try {
      await deleteChatSession(sessionId);
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      toast.success("Chat session deleted");
      
      // If we deleted the active session, switch to the first remaining session or null
      if (selectedSession === sessionId) {
        if (updatedSessions.length > 0) {
          setSelectedSession(updatedSessions[0].id);
        } else {
          setSelectedSession(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chat session");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || streaming) return;
    if (!selectedSession) {
      toast.error("Create a chat session first.");
      return;
    }

    const currentMessage = message;
    setMessage("");

    const userMessage = {
      role: "user",
      content: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      
      const response = await fetch(
        `${baseURL}/api/chat/stream?message=${encodeURIComponent(currentMessage)}&session_id=${selectedSession}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start stream");
      }

      setLoading(false);
      setStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantReply += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  if (updated.length > 0) {
                    updated[updated.length - 1].content = assistantReply;
                  }
                  return updated;
                });
              } else if (data.error) {
                assistantReply = `⚠️ AI Mentor Error: ${data.error}`;
                setMessages((prev) => {
                  const updated = [...prev];
                  if (updated.length > 0) {
                    updated[updated.length - 1].content = assistantReply;
                  }
                  return updated;
                });
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
      
      const sessionsList = await getChatSessions();
      setSessions(sessionsList);
    } catch (error) {
      console.error(error);
      toast.error("AI service temporarily unavailable.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I encountered an issue. Please try sending your query again.",
        },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl border border-slate-900 overflow-hidden bg-slate-950/40 backdrop-blur-md relative">
      
      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-20 md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        aria-label="Toggle chat list"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sessions Sidebar (Desktop slide / Mobile overlay) */}
      <div className={`border-r border-slate-900 flex flex-col bg-slate-950/95 transition-all duration-300 z-10 
        ${sidebarCollapsed ? "w-0 md:w-0 border-r-0 overflow-hidden hidden" : "w-72 md:w-72"} 
        absolute md:static inset-y-0 left-0 ${
          sidebarOpen ? "translate-x-0 w-72" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-950">
          <span className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Chat Sessions
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={createNewChat}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden md:flex p-2 rounded-xl text-slate-400 hover:bg-slate-950 hover:text-white transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-xs">
              No conversations yet.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSession(session.id);
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 cursor-pointer text-left text-sm transition-all border ${
                  selectedSession === session.id
                    ? "bg-slate-900 border-slate-800 text-emerald-400"
                    : "border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-500" />
                  
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={editTitleText}
                      onChange={(e) => setEditTitleText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(session.id);
                        if (e.key === "Escape") setEditingSessionId(null);
                      }}
                      className="bg-slate-950 text-slate-100 px-2 py-0.5 rounded border border-slate-700 w-full focus:outline-none focus:border-emerald-500 text-xs"
                      autoFocus
                    />
                  ) : (
                    <span 
                      onDoubleClick={(e) => handleStartRename(e, session)}
                      className="truncate font-semibold cursor-text select-none"
                      title="Double click to rename"
                    >
                      {session.title}
                    </span>
                  )}
                </div>

                {/* Operations Buttons (Rename and Delete) */}
                {editingSessionId === session.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveRename(session.id);
                    }}
                    className="p-1 rounded text-emerald-400 hover:bg-slate-950 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleStartRename(e, session)}
                      className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-950 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id, session.title)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-950 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/20">
        
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3 pl-12 md:pl-0">
            {/* Sidebar Expand Trigger (desktop only when collapsed) */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="hidden md:flex p-2 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </button>
            )}
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-white text-sm sm:text-base">AI Placement Mentor</h2>
          </div>
          
          {selectedSession && messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              <Trash2 className="h-4.5 w-4.5" />
              Clear screen
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!selectedSession ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">No Active Session</h3>
              <p className="text-slate-400 text-xs max-w-sm mt-1 mb-4">
                Please select an existing chat session or create a new session to begin your guidance.
              </p>
              <button
                onClick={createNewChat}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Start Chatting
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">Ask Your Placement Guide</h3>
              <p className="text-slate-400 text-xs max-w-sm mt-1">
                Query mock coding puzzles, resume layout tips, behavioral questions, or system design approaches.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-slate-950 font-semibold rounded-tr-sm"
                      : "bg-slate-900 border border-slate-800/60 text-slate-200 rounded-tl-sm"
                  }`}
                >
                  <article className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-slate-800 prose-code:text-emerald-400">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </article>
                </div>
              </div>
            ))
          )}

          {/* AI typing states */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800/60 px-5 py-3.5 rounded-3xl rounded-tl-sm text-sm text-slate-300 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                AI Mentor is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Input Bar */}
        {selectedSession && (
          <div className="p-4 border-t border-slate-900 bg-slate-950/40">
            <div className="flex gap-2.5 max-w-4xl mx-auto relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about placements..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 pr-14 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                disabled={loading || streaming}
              />

              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading || streaming}
                className="absolute right-2.5 top-2.5 h-11 w-11 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
