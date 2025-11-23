// src/components/ChatbotWidget.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleExpand = () => {
    setIsOpen(false); // Close the widget
    navigate("/chatbot"); // Navigate to full page
  };

  return (
    <>
      {/* Floating round button (when widget is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-500 shadow-lg flex items-center justify-center text-white text-2xl hover:bg-teal-600 transition-colors z-40"
        >
          🤖
        </button>
      )}

      {/* Popup chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-teal-50 rounded-t-xl">
            <span className="font-semibold text-teal-700">
              BiteWise Chatbot
            </span>

            <div className="flex items-center gap-2">
              {/* Expand button - navigates to /chatbot page */}
              <button
                onClick={handleExpand}
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded px-1.5 py-0.5"
                title="Expand to full page"
              >
                ⤢
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat content wrapper – THIS is the important change: min-h-0 */}
          <div className="p-3 flex-1 min-h-0">
            {/* compact=true for widget version */}
            <ChatbotWindow compact={true} />
          </div>
        </div>
      )}
    </>
  );
}
