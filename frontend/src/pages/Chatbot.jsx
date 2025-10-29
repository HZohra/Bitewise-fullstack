import React, { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BiteWise, your dietary companion. I can help you with anything food related! What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          profile: {
            diets: [],
            allergens: [],
            max_time: null,
            location: null
          }
        }),
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        entities: data.entities
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I have not connected the API yet. lol",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    // Convert markdown-like formatting to JSX
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={index}>{line.slice(2, -2)}</strong>;
        }
        if (line.startsWith('• ')) {
          return <div key={index} className="ml-4">• {line.slice(2)}</div>;
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return <em key={index} className="text-gray-600">{line.slice(1, -1)}</em>;
        }
        if (line.includes('[') && line.includes('](') && line.includes(')')) {
          const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            return (
              <div key={index}>
                <a 
                  href={linkMatch[2]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 underline hover:text-teal-800"
                >
                  {linkMatch[1]}
                </a>
              </div>
            );
          }
        }
        return <div key={index}>{line}</div>;
      });
  };

  const quickActions = [
    "Show me vegan dinner under 30 min",
    "Plan my meals for 2 days",
    "Why can't I eat this dish?",
    "Substitute for milk",
    "Find gluten-free pasta recipes"
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">
          AI Chatbot 🤖
        </h1>
        
        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg h-96 overflow-y-auto p-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-sm">
                  {formatMessage(message.text)}
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-teal-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action)}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm hover:bg-teal-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about recipes, allergens, meal planning..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p><strong>Try asking:</strong></p>
          <p>"Show me vegan dinner under 30 min" • "Plan my meals for 2 days" • "Why can't I eat this dish?"</p>
        </div>
      </div>
    </div>
  );
}
