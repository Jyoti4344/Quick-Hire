import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize chat with AI's greeting
  useEffect(() => {
    setMessages([
      { id: 1, text: "Hello! I'm your AI interviewer. Ready to begin?", sender: 'ai' }
    ]);
  }, []);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== '') {
      const userMessage = { id: messages.length + 1, text: inputMessage, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputMessage('');

      // Call OpenAI API for AI response
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4', // Use 'gpt-4' or 'gpt-3.5-turbo' based on your subscription
            messages: [
              { role: 'system', content: "You are an AI interviewer asking questions and responding based on the user's answers." },
              ...messages.map((msg) => ({
                role: msg.sender === 'ai' ? 'assistant' : 'user',
                content: msg.text,
              })),
              { role: 'user', content: inputMessage },
            ],
          }),
        });

        const data = await response.json();
        const aiResponseText = data.choices[0].message.content;

        const aiMessage = { id: messages.length + 2, text: aiResponseText, sender: 'ai' };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, there was an error processing your message. Please try again.",
          sender: 'ai',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
