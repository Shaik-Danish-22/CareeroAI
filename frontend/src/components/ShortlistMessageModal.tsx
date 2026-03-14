'use client'

import { useState } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'

interface ShortlistMessageModalProps {
  candidateName: string
  candidateEmail: string
  onClose: () => void
  onSend?: (message: string) => void
}

export default function ShortlistMessageModal({
  candidateName,
  candidateEmail,
  onClose,
  onSend
}: ShortlistMessageModalProps) {
  const [message, setMessage] = useState(
    'Congratulations! You have been shortlisted for the next stage of the interview.'
  )
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      // Call the callback or API to send message
      if (onSend) {
        onSend(message)
      } else {
        // Store locally in state if no API available
        localStorage.setItem(
          `shortlist_${candidateEmail}`,
          JSON.stringify({
            message,
            timestamp: new Date().toISOString(),
            candidateName
          })
        )
      }
      
      setSent(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="text-purple-500" size={24} />
            Shortlist Candidate
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">To</p>
            <p className="font-semibold text-slate-900 dark:text-white">{candidateName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{candidateEmail}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {sent && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg mb-4">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ Message sent successfully!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || sent}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : sent ? (
              '✓ Sent'
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
