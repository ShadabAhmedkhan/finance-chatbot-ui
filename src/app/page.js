'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";

import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const URL = 'http://127.0.0.1:8000/auth'

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else router.push("/chat");
  }, []);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, type: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(URL+'chat', { message: input }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTc0NDU5MTE2OH0.1TuJBC3IMN_r9h6urnnR9w7pRvEPcsg1coSsyvOoD9g' // optional

        },
      });

      const botMsg = { text: res.data.reply, type: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { text: 'Oops! Something went wrong.', type: 'bot' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">💬 Finance Chatbot</h1>

      <div className="h-96 overflow-y-auto space-y-3 border rounded-md p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 max-w-[80%] rounded-lg ${
              msg.type === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto text-right'
                : 'bg-green-100 text-gray-800 self-start mr-auto text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md w-fit">
            Bot is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>  );
}
