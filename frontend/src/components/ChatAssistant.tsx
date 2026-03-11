'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export default function ChatAssistant() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMounted(true)
    
    // Load conversation history from memory
    const saved = sessionStorage.getItem('chat_history')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load chat history')
      }
    } else {
      // Initial greeting
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm your AI Recruiter Assistant. I can help you with job applications, resume tips, interview preparation, and more. How can I assist you today?"
      }])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat_history', JSON.stringify(messages))
    }
    scrollToBottom()
  }, [messages])

  if (!mounted) {
    return null
  }


  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')

      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await axios.post(
        `${API_URL}/messages/chat/assistant`,
        {
          message: input,
          conversation_history: conversationHistory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I help you?"
    }])
    sessionStorage.removeItem('chat_history')
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] glass rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">AI Recruiter Assistant</h3>
              <p className="text-xs text-blue-100">Powered by AI</p>
            </div>
            <button
              onClick={clearChat}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-900 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}