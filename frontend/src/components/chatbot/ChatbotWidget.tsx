import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ChatbotWidgetProps {
  onClose: () => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate API call to AI backend
    const botResponse = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    }).then(res => res.json());

    setMessages(prev => [...prev, { sender: 'bot', text: botResponse.reply }]);
  };

  return (
    <div className="fixed bottom-20 right-6 bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 z-50
                    w-80 sm:w-96 lg:w-[20rem] max-h-[120vh]">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-green-600 text-white px-4 py-3 rounded-t-2xl">
        <span className="font-semibold">Uwazi254 AI Assistant</span>
        <button onClick={onClose} className="hover:text-gray-200">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            👋 Hi! How can I help you with community issues today?
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] break-words
              ${msg.sender === 'user'
                ? 'bg-green-100 self-end text-right ml-auto'
                : 'bg-gray-100 self-start text-left mr-auto'
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about community issues..."
          className="flex-1 p-3 outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;
