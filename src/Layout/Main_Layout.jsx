import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const LOCAL_STORAGE_KEY = 'ai_chat_messages';

function Main_Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load messages on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  // Save messages on every update
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const encodedText = encodeURIComponent(userMsg.text);
      const res = await fetch(`https://salesforce-hackathon-s8mr.onrender.com/ai/interest/question/${encodedText}`);
      if (!res.ok) throw new Error('Failed to fetch AI response');
      const aiText = await res.text();

      const aiMsg = { sender: 'ai', text: aiText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navbar />
      <Outlet />

      {/* AI Icon */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 transition z-50"
        aria-label="Open AI Chat"
      >
        <FaRobot size={24} />
      </button>

      {/* Modal */}
      <input type="checkbox" id="ai-chat-modal" className="modal-toggle" checked={isModalOpen} readOnly />
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box flex flex-col max-w-md w-full max-h-[80vh] p-6 bg-white relative">
          <h3 className="font-bold text-lg mb-4 text-purple-700 flex items-center gap-2">
            <FaRobot /> AI Chat
          </h3>

          <div className="flex-grow overflow-y-auto mb-4 border h-64 rounded p-4 bg-gray-50 flex flex-col gap-2">
            {messages.length === 0 && (
              <p className="text-gray-500 italic">Start the conversation by typing a message below.</p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[75%] ${
                  msg.sender === 'user'
                    ? 'bg-purple-100 text-purple-900 self-end'
                    : 'bg-gray-200 text-gray-900 self-start'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="text-gray-500 italic mt-2">AI is thinking...</div>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input input-bordered flex-grow"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              aria-label="Send Message"
            >
              <FaPaperPlane className='' />
            </button>
          </div>

          <button
            className="btn btn-sm btn-circle absolute right-4 top-4"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close Chat Modal"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}

export default Main_Layout;
