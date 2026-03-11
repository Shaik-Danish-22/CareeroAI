'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  created_at: string
  sender_name: string
  sender_role: string
}

interface MessagingSystemProps {
  recipientId?: string
  recipientName?: string
}

export default function MessagingSystem({ recipientId, recipientName }: MessagingSystemProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [view, setView] = useState<'inbox' | 'conversation'>('inbox')
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(
    recipientId && recipientName ? { id: recipientId, name: recipientName } : null
  )

  useEffect(() => {
    setMounted(true)
    if (recipientId) {
      setView('conversation')
    }
  }, [recipientId])

  useEffect(() => {
    if (mounted && isOpen) {
      if (view === 'inbox') {
        fetchInbox()
      } else if (selectedUser) {
        fetchConversation(selectedUser.id)
      }
      fetchUnreadCount()
    }
  }, [mounted, isOpen, view, selectedUser])

  if (!mounted) {
    return null
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUnreadCount(response.data.unread_count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const fetchInbox = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/messages/inbox`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch inbox:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversation = async (userId: string) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data.messages)
      fetchUnreadCount()
    } catch (error) {
      console.error('Failed to fetch conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || sending) return

    setSending(true)
    try {
      await axios.post(
        `${API_URL}/messages/send`,
        {
          recipient_id: selectedUser.id,
          content: newMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setNewMessage('')
      fetchConversation(selectedUser.id)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const openConversation = (msg: Message) => {
    setSelectedUser({
      id: msg.sender_id,
      name: msg.sender_name
    })
    setView('conversation')
  }

  const backToInbox = () => {
    setView('inbox')
    setSelectedUser(null)
    fetchInbox()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Message Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Messages Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] glass rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              {view === 'conversation' && (
                <button
                  onClick={backToInbox}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h3 className="font-bold">
                {view === 'inbox' ? 'Messages' : selectedUser?.name || 'Conversation'}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : view === 'inbox' ? (
              // Inbox View
              <div>
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => openConversation(msg)}
                      className={`w-full p-4 border-b border-slate-200 hover:bg-slate-50 text-left transition-colors ${
                        !msg.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-semibold ${!msg.read ? 'text-blue-600' : 'text-slate-900'}`}>
                          {msg.sender_name}
                        </span>
                        <span className="text-xs text-slate-500">{formatTime(msg.created_at)}</span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{msg.content}</p>
                      <span className="text-xs text-slate-500 capitalize">{msg.sender_role}</span>
                    </button>
                  ))
                )}
              </div>
            ) : (
              // Conversation View
              <div className="p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.sender_id !== selectedUser?.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Input (only in conversation view) */}
          {view === 'conversation' && selectedUser && (
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}