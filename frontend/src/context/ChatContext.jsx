// src/context/ChatContext.jsx
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BiteWise, your dietary companion. I can help you with anything food related! What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
