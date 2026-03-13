'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Send, X, Trash2, MessageCircle } from 'lucide-react'

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
        content: "👋 Hello! I'm your AI Career Assistant. I can help you with job recommendations, resume tips, interview prep, and career guidance. What can I help with today?"
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
        content: "I'm having trouble connecting right now. Please try again in a moment. 🙏"
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
      content: "Chat cleared! ✨ How can I help you now?"
    }])
    sessionStorage.removeItem('chat_history')
  }

  return (
    <>
      {/* Chat Button - Premium Floating ActionButton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 text-white rounded-full shadow-2xl shadow-violet-500/40 hover:shadow-3xl hover:shadow-violet-600/50 hover:-translate-y-1.5 hover:scale-110 transition-all duration-300 ease-out z-50 flex items-center justify-center group border border-white/20"
      >
        {/* Glow background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/30 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
        
        {/* Icon */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </div>

        {/* Pulse animation for closed state */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border border-white/40 animate-pulse-glow" />
        )}
      </button>

      {/* Chat Window - Premium Glass Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 via-slate-900/35 to-slate-950/40 shadow-2xl shadow-purple-900/30 z-50 flex flex-col overflow-hidden border border-white/5 animate-chat-bubble">
          {/* Header - Premium Gradient */}
          <div className="flex-shrink-0 bg-gradient-to-r from-violet-600/40 via-purple-600/40 to-violet-700/40 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-lg">✨</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 leading-none">Career Assistant</h3>
                <p className="text-xs text-violet-200/70 mt-0.5">AI-powered guidance</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all duration-200 backdrop-blur"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container - Premium Spacing */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-slate-900/20 via-slate-950/20 to-slate-950/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-chat-bubble`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all backdrop-blur ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-500/80 via-purple-500/80 to-violet-600/80 text-white rounded-br-none shadow-lg shadow-violet-500/20 border border-white/20'
                      : 'bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-bl-none shadow-md shadow-black/20'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start animate-chat-bubble">
                <div className="bg-slate-800/50 text-slate-300 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-700/40 backdrop-blur-md shadow-md shadow-black/20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Premium Glass */}
          <div className="flex-shrink-0 p-4 border-t border-white/5 bg-gradient-to-t from-slate-950/40 via-slate-950/30 to-transparent backdrop-blur">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-3 rounded-2xl backdrop-blur-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-400/50 focus:bg-slate-800/80 focus:shadow-lg focus:shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 py-3 rounded-2xl bg-gradient-to-r from-violet-500/80 to-purple-600/80 hover:from-violet-500 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/20 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}