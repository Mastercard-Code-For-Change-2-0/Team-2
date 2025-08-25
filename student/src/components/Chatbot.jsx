import { useState } from 'react';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to Katalyst India's Student Outreach & Application Tracking System. I'm Priya — I'll help you check your application status, upload or review required documents, find upcoming events or deadlines, and explain the next steps in the selection process. If you're unsure about anything, just ask!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: messages.slice(1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const assistantMessage = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'assistant', content: 'Error: Could not connect to the server. Please check your connection and try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="font-semibold">Priya - Katalyst Assistant</h3>
        <p className="text-xs text-blue-100">Ask me about applications, events, and more!</p>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-4'
                : 'bg-gray-100 text-gray-800 mr-4'
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 text-gray-800 mr-4 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Priya is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}