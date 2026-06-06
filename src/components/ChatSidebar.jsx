function ChatSidebar({
  sessions,
  createNewChat,
  selectedSession,
  setSelectedSession,
}) {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 p-4">
      <button
        onClick={createNewChat}
        className="w-full bg-blue-600 p-3 rounded-lg mb-4"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setSelectedSession(session.id)}
            className={`cursor-pointer p-3 rounded-lg ${
              selectedSession === session.id ? "bg-blue-600" : "bg-slate-800"
            }`}
          >
            {session.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
