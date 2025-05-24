import React, { useEffect, useState, useContext } from "react";
import { FiSend } from "react-icons/fi";
import WebSocketContext from "../context/WebSocketContext";
import { useUser } from "../context/UserContext";

const Messages = () => {
  const { user, loading } = useUser();
  const { stompClient, sendMessage } = useContext(WebSocketContext);

  // Log user and loading state
  console.log("User:", user);
  console.log("Loading:", loading);

  // Recipient logic:
  const recipientId = user?.id === "1" || user?.id === 1 ? "2" : "1";
  console.log("Recipient ID determined:", recipientId);

  const [newMessageInput, setNewMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (loading || !user) return;

    console.log(`Fetching messages for user ${user.id} and recipient ${recipientId}`);

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://flatelse-1mup.onrender.com/messages/${user.id}/${recipientId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user, loading, recipientId]);

  useEffect(() => {
    if (!stompClient || !user) return;

    console.log("Subscribing to WebSocket messages for user:", user.id);

    const subscription = stompClient.subscribe(
      `/user/${user.id}/queue/messages`,
      (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received WebSocket message:", receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    );

    return () => {
      if (subscription) {
        console.log("Unsubscribing from WebSocket messages");
        subscription.unsubscribe();
      }
    };
  }, [stompClient, user]);

  const handleSendMessage = () => {
    if (!stompClient || newMessageInput.trim() === "" || !user) {
      console.log("Send message aborted: ", {
        stompClientExists: !!stompClient,
        inputEmpty: newMessageInput.trim() === "",
        userExists: !!user,
      });
      return;
    }

    const message = {
      senderId: user.id,
      recipientId,
      content: newMessageInput,
      chatId: null,
    };

    console.log("Sending message:", message);

    setMessages((prev) => [...prev, message]);
    sendMessage(message);
    setNewMessageInput("");
  };

  if (loading || !user) {
    console.log("Loading or user not ready");
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 border rounded-lg shadow-md container mx-auto">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {messages.map((msg, i) => {
          const isSender = String(msg.senderId) === String(user.id);
          return (
            <div
              key={i}
              className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-sm text-sm ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-lg rounded-tl-lg"
                    : "bg-gray-300 text-gray-800 rounded-bl-lg rounded-tr-lg"
                }`}
                style={{ wordWrap: "break-word" }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="p-3 bg-white flex items-center border-t"
        style={{ position: "sticky", bottom: 0, zIndex: 10 }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          value={newMessageInput}
          onChange={(e) => setNewMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          onClick={handleSendMessage}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Messages;
