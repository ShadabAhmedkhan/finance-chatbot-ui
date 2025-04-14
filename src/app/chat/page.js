"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export default function ChatPage() {
    const router = useRouter();
    const [token, settoken] = useState([]);

    useEffect(() => {
        settoken((prev) => [...prev, localStorage.getItem("token")]);

        if (!token) router.push("/login");
    }, []);

    const URL = 'http://127.0.0.1:8000/'

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
        setInput('');
      
        const userMsg = { user_message: input };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
      
        try {
          const token = localStorage.getItem('token'); // Make sure this exists
          const res = await axios.post(
            URL+'chat',
            { message: input },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          const newMsg = {
            bot_reply: res.data.reply,
            timestamp: new Date().toISOString(), // optional
          };
      
          setMessages((prev) => [...prev, newMsg]);
          setInput('');
        } catch (err) {
          console.error(err);
          const errorMsg = { bot_reply: 'Oops! Something went wrong.' };
          setMessages((prev) => [...prev, errorMsg]);
        } finally {
          setLoading(false);
        }
      };
      

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
    const fetchChatHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(URL+'chat/history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(res.data); // assuming it's in [{text, type}] format
        } catch (err) {
            console.error("Failed to load chat history", err);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 px-4 relative">

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
                Logout
            </button>

            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mt-8">
                <h1 className="text-2xl font-bold mb-4 text-center">🤖 Chatbot</h1>

                <div className="messages space-y-3 max-h-[400px] overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="flex flex-col space-y-1 mb-2">
                            {msg.user_message && (
                                <div className="message bg-blue-100 text-right ml-auto px-4 py-2 rounded-md max-w-[80%]">
                                    {msg.user_message}
                                </div>
                            )}
                            {msg.timestamp && (
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                            {msg.bot_reply && (
                                <div className="message bg-gray-200 text-left mr-auto px-4 py-2 rounded-md max-w-[80%]">
                                    {msg.bot_reply}
                                </div>

                            )}
                            {msg.timestamp && (
                                <div className="text-xs text-gray-500 mt-1 text-left">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot px-4 py-2 bg-gray-200 rounded-md">
                            Thinking...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
