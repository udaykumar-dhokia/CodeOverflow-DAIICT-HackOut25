import React, { useState, useRef } from 'react'
import axios from 'axios'

interface ChatMessage {
  sender: 'user' | 'bot'
  text: string
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await axios.post(
        'https://h2-grid-chatbot.onrender.com/chat',
        {
          question: trimmed,
        },
        {
          withCredentials: true,
        },
      )

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: response.data.answer || 'No response' },
      ])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error: Unable to reach chatbot.' },
      ])
    } finally {
      setIsTyping(false)
      scrollToBottom()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-green-800 text-white p-4 rounded-full shadow-lg shadow-green-300/10 hover:shadow-green-400/30 transition-all animate-bounce"
        >
          🌱 Chat
        </button>
      )}

      {isOpen && (
        <div className="w-100 max-h-[600px] flex flex-col bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-primary font-bold p-3 flex justify-between items-center shadow-md">
            <span className="text-white">
              H<sub>2</sub>Bot
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white font-bold text-lg hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-2xl max-w-[80%] break-words shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white self-end'
                    : 'bg-gray-200 text-gray-800 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="px-4 py-2 rounded-2xl max-w-[60%] bg-gray-200 text-gray-800 self-start animate-pulse">
                Bot is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about Green Hydrogen..."
              className="flex-1 p-3 outline-none placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-primary text-white hover:bg-green-600 transition-colors rounded-r-2xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWidget
