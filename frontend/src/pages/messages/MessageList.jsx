import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiSend, FiChevronLeft, FiMessageSquare,
  FiClock, FiUser, FiCheck, FiCheckCircle, FiPhone,
  FiPaperclip, FiRefreshCw,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useConversations, useMessages, useSendMessage } from '../../hooks/useMessages'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateSeparator(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function isDifferentDay(d1, d2) {
  if (!d1 || !d2) return true
  return new Date(d1).toDateString() !== new Date(d2).toDateString()
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-cyan-500',
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-cyan-500',
  'from-cyan-400 to-blue-500',
]

function getAvatarColor(name) {
  if (!name) return avatarColors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export default function MessageList() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { data: conversationsData, isLoading: loadingConversations, refetch: refetchConversations } = useConversations()
  const [activeUserId, setActiveUserId] = useState(searchParams.get('userId') ? Number(searchParams.get('userId')) : null)
  const [search, setSearch] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [showMobileList, setShowMobileList] = useState(!searchParams.get('userId'))

  useEffect(() => {
    const userIdParam = searchParams.get('userId')
    if (userIdParam) {
      setActiveUserId(Number(userIdParam))
      setShowMobileList(false)
    }
  }, [searchParams])
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const conversations = useMemo(() => {
    const list = Array.isArray(conversationsData) ? conversationsData : conversationsData?.data || []
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter((c) => {
      const name = c.userName || ''
      return name.toLowerCase().includes(q)
    })
  }, [conversationsData, search])

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.userId === activeUserId)
  }, [conversations, activeUserId])

  const { data: messagesData, isLoading: loadingMessages } = useMessages(activeUserId)

  const messages = useMemo(() => {
    return Array.isArray(messagesData) ? messagesData : messagesData?.data || []
  }, [messagesData])

  const sendMessage = useSendMessage()
  const [sending, setSending] = useState(false)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  useEffect(() => {
    if (messages.length > 0) scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!messageInput.trim() || !activeUserId) return
    setSending(true)
    try {
      await sendMessage.mutateAsync({
        receiverId: activeUserId,
        content: messageInput.trim(),
      })
      setMessageInput('')
      scrollToBottom()
    } catch (err) {
      console.error('Failed to send message', err)
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectConversation = (conv) => {
    const id = conv.userId
    setActiveUserId(id)
    setShowMobileList(false)
  }

  const activeName = activeConversation?.userName || ''
  const activeInitials = getInitials(activeName)
  const activeColor = getAvatarColor(activeName)
  const activeRole = activeConversation?.user?.role || ''

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Conversation List */}
      <div className={`w-full flex-shrink-0 border-r border-gray-200 sm:w-80 ${showMobileList ? 'block' : 'hidden sm:block'}`}>
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Messages</h2>
              <button onClick={() => refetchConversations()} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" title="Refresh">
                <FiRefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 space-y-3"><LoadingSkeleton type="list" count={6} /></div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <FiMessageSquare className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No conversations</p>
                <p className="text-xs text-gray-400 mt-1">
                  {search ? 'Try a different search' : 'Start chatting with someone'}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {conversations.map((conv, idx) => {
                  const convName = conv.userName || 'Unknown'
                  const convId = conv.userId
                  const isActive = convId === activeUserId
                  const lastMsg = conv.lastMessage || ''
                  const lastTime = conv.lastMessageAt
                  const unread = conv.unreadCount || 0

                  return (
                    <motion.button
                      key={convId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => handleSelectConversation(conv)}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all ${
                        isActive ? 'bg-cyan-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(convName)} text-sm font-bold text-white shadow-sm`}>
                          {getInitials(convName)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-cyan-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`truncate text-sm font-semibold ${isActive ? 'text-cyan-700' : 'text-gray-800'}`}>
                            {convName}
                          </p>
                          {lastTime && (
                            <span className="ml-2 shrink-0 text-[11px] text-gray-400">{timeAgo(lastTime)}</span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center justify-between">
                          <p className="truncate text-xs text-gray-500">{lastMsg || 'No messages yet'}</p>
                          {unread > 0 && (
                            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1.5 text-[10px] font-bold text-white">
                              {unread > 99 ? '99+' : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`flex flex-1 flex-col ${!showMobileList ? 'block' : 'hidden sm:flex'}`}>
        {!activeUserId ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-gray-50/50">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center mb-5">
              <FiMessageSquare className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Your Messages</h3>
            <p className="text-sm text-gray-400 mt-1">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
              <button
                onClick={() => setShowMobileList(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 sm:hidden"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${activeColor} text-sm font-bold text-white shadow-sm`}>
                {activeInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{activeName}</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <p className="text-xs text-gray-400 capitalize">{activeRole || 'Online'}</p>
                </div>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                <FiPhone className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
              {loadingMessages ? (
                <div className="space-y-4"><LoadingSkeleton type="card" count={4} /></div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <FiMessageSquare className="h-6 w-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((msg, idx) => {
                    const senderId = msg.senderId
                    const isMine = senderId === user?.id
                    const showDateSeparator = idx === 0 || isDifferentDay(
                      messages[idx - 1]?.sentAt,
                      msg.sentAt
                    )

                    return (
                      <div key={msg.id || idx}>
                        {showDateSeparator && (
                          <div className="flex items-center justify-center py-4">
                            <span className="rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm border border-gray-100">
                              {formatDateSeparator(msg.sentAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                          <div className={`max-w-[78%] ${isMine ? 'order-1' : 'order-1'}`}>
                            <div
                              className={`relative px-4 py-2.5 text-sm leading-relaxed ${
                                isMine
                                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-sm'
                                  : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content || ''}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-cyan-100' : 'text-gray-400'}`}>
                                <span className="text-[10px]">{formatTime(msg.sentAt)}</span>
                                {isMine && <FiCheck className="h-3 w-3" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              <form onSubmit={handleSend} className="flex items-end gap-2">
                <button
                  type="button"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <FiPaperclip className="h-4 w-4" />
                </button>
                <div className="relative flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    style={{ minHeight: '42px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm hover:shadow-md hover:shadow-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
