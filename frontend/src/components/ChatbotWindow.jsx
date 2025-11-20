// src/components/ChatbotWindow.jsx
import React, { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

export default function ChatbotWindow({ compact = false }) {
  const userName = "Zohra"; // 👈 name shown on user messages

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BiteWise, your dietary companion. I can help you with anything food related! What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
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
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "u1", // later replace with real auth user id
          text: userMessage.text,
          profile: {
            diets: [],
            allergens: [],
            max_time: null,
            location: null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      const botText =
        data?.response || "Sorry, I couldn't find anything for that.";

      const botMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: "bot",
        timestamp: new Date(),
        intent: data.intent,
        entities: data.entities,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I can’t reach the server right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <strong key={index}>{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith("• ")) {
        return (
          <div key={index} className="ml-4">
            • {line.slice(2)}
          </div>
        );
      }
      if (line.startsWith("*") && line.endsWith("*")) {
        return (
          <em key={index} className="text-gray-600">
            {line.slice(1, -1)}
          </em>
        );
      }
      if (line.includes("[") && line.includes("](") && line.includes(")")) {
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
    "Find gluten-free pasta recipes",
  ];

  return (
    // root container – flex column, clipped, fits parent
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Messages area – this is the scrollable part */}
      <div className="flex-1 min-h-0 max-h-full overflow-y-auto p-2 space-y-3">
        {messages.map((message) => {
          const isUser = message.sender === "user";
          const bubbleClasses = isUser
            ? "bg-teal-500 text-white"
            : "bg-gray-100 text-gray-800";

          return (
            <div
              key={message.id}
              className={`mb-1 ${isUser ? "text-right" : "text-left"}`}
            >
              {/* Name above bubble */}
              <div
                className={`text-[11px] mb-0.5 ${
                  isUser ? "text-teal-600" : "text-gray-500"
                }`}
              >
                {isUser ? userName : "BiteWise"}
              </div>

              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bubbleClasses}`}
              >
                <div className="text-sm">{formatMessage(message.text)}</div>
                <div
                  className={`text-[10px] mt-1 ${
                    isUser ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="text-left mb-3">
            <div className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions – only in full-page mode */}
      {!compact && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action)}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs hover:bg-teal-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about recipes, allergens, meal planning..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>

      {/* Help text – only in full-page mode */}
      {!compact && (
        <div className="mt-3 text-center text-xs text-gray-600">
          <p>
            <strong>Try asking:</strong>
          </p>
          <p>
            "Show me vegan dinner under 30 min" • "Plan my meals for 2 days" •
            "Why can't I eat this dish?"
          </p>
        </div>
      )}
    </div>
  );
}
