import React, { useState } from "react";
import { useEffect, useRef } from "react";
import '../css/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Bonjour, je suis votre assistant médical MediTech. Comment puis-je vous aider aujourd’hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    const clean = input.trim();
    if (!clean) return;

    const userMsg = { sender: "user", text: clean };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3001/users/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json"
         },
        body: JSON.stringify({ message: clean }),
      });

      const data = await response.json();
      let botText = data?.response || "❌ Oups, une erreur est survenue.";
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Impossible de répondre pour le moment." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        className="chatbot-button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ouvrir le chatbot"
      >
        <img src="/bulle-de-discussion.png" alt="chatbot" className="chatbot-icon" />
      </button>

      {isOpen && (
        <div className="chatbot-modal" role="dialog" aria-label="Chatbot MediTech">
          <div className="chatbot-header">
            <span>Assistant MediTech</span>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
              aria-label="Fermer le chatbot"
            >
              ✖
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.sender}`}>
                <div className={`bubble ${msg.sender}`}>{msg.text}</div>
                </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="bubble bot typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez un message…"
            />
            <button onClick={handleSend} disabled={isTyping || !input.trim()}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;