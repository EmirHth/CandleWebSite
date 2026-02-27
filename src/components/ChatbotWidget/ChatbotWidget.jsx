import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getResponse, QUICK_REPLIES } from './chatbotResponses'
import './ChatbotWidget.css'

function formatTime() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

const WELCOME_MSG = {
  id: 0,
  from: 'bot',
  text: 'Merhaba! 👋 Ben Laydora\'nın sanal asistanıyım. Size kargo, ürünler, bakım ipuçları ve daha fazlası hakkında yardımcı olabilirim.',
  time: formatTime(),
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showNotif, setShowNotif] = useState(true)
  const [msgCounter, setMsgCounter] = useState(1)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setShowNotif(false)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const userText = (text || input).trim()
    if (!userText) return

    const userMsg = {
      id: msgCounter,
      from: 'user',
      text: userText,
      time: formatTime(),
    }
    setMessages(prev => [...prev, userMsg])
    setMsgCounter(c => c + 2)
    setInput('')
    setTyping(true)

    const delay = 600 + Math.random() * 800
    setTimeout(() => {
      const answer = getResponse(userText)
      const botMsg = {
        id: msgCounter + 1,
        from: 'bot',
        text: answer,
        time: formatTime(),
      }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        className={`cb-bubble${open ? ' cb-bubble--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Sohbeti kapat' : 'Yardım al'}
        whileTap={{ scale: 0.93 }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && showNotif && (
          <span className="cb-notif">1</span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="cb-panel-header">
              <div className="cb-panel-header__left">
                <div className="cb-avatar">🕯</div>
                <div>
                  <div className="cb-panel-name">Laydora Asistan</div>
                  <div className="cb-panel-status">Çevrimiçi</div>
                </div>
              </div>
              <button className="cb-panel-close" onClick={() => setOpen(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="cb-messages">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`cb-msg cb-msg--${msg.from}`}
                >
                  <div className="cb-msg__bubble">{msg.text}</div>
                  <div className="cb-msg__time">{msg.time}</div>
                </div>
              ))}

              {typing && (
                <div className="cb-typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies — shown only after welcome */}
            {messages.length <= 2 && !typing && (
              <div className="cb-quick-replies">
                {QUICK_REPLIES.map(qr => (
                  <button key={qr} className="cb-qr" onClick={() => sendMessage(qr)}>
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="cb-input-row">
              <input
                ref={inputRef}
                className="cb-input"
                type="text"
                placeholder="Mesaj yazın…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="cb-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                aria-label="Gönder"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m22 2-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
