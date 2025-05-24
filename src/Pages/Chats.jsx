import React, { useState } from "react";

function Chats() {
  const [messages, setMessages] = useState([
    { text: "Hey, how are you?", sender: "other" },
    { text: "I'm good! How about you?", sender: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "me" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen container mx-auto max-w-7xl py-24 rounded-4xl">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-base-200 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Active Users</h2>
        <ul className="menu">
          <li><a>User 1</a></li>
          <li><a>User 2</a></li>
          <li><a>User 3</a></li>
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.sender === "me" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.sender === "me" ? "bg-primary text-white" : "bg-base-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-base-200 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full mr-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/5 bg-base-200 p-4 border-l">
        <h2 className="text-lg font-bold mb-4">User Info</h2>
        <p><strong>Name:</strong> User 1</p>
        <p><strong>Status:</strong> Online</p>
      </div>
    </div>
  );
}

export default Chats;