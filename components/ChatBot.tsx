import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { PaperAirplaneIcon, XIcon, UserIcon, BotIcon } from './icons';
import { ChatBubbleIcon } from './icons';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm your AI Style Assistant. How can I help you find the perfect look today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a friendly and stylish AI assistant for URBANEDGE, a modern men's fashion store for the Indian market. Your goal is to help users with fashion advice, product recommendations, and answer questions about the store. Keep your answers concise, helpful, and in line with the brand's cool and confident identity. Available product categories are: Jackets, Sneakers, T-Shirts, Shirts, Jeans, Accessories, Shoes.",
          },
        });
        setChat(chatSession);
      } catch (error) {
        console.error("Failed to initialize Gemini chat:", error);
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const botMessage: Message = { sender: 'bot', text: response.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { sender: 'bot', text: "Oops! Something went wrong. Please try asking again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-white text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Open style assistant"
      >
        <ChatBubbleIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-down">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <h3 className="text-lg font-bold text-white">Style Assistant</h3>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              <XIcon />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                 {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-800 text-white flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for style advice..."
                className="flex-1 bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white focus:outline-none p-3 rounded-md"
                disabled={isLoading || !chat}
              />
              <button
                type="submit"
                className="p-3 bg-white text-black rounded-md hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim() || !chat}
                aria-label="Send message"
              >
                <PaperAirplaneIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
