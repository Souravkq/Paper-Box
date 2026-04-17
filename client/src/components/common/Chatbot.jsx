/**
 * Chatbot Component
 * Floating AI assistant powered by Gemini API
 */
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Chatbot.css';

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm PaperBox AI. Ask me about government schemes, subsidies, or benefits available for you!"
    }
  ]);
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);
  const { user }              = useAuth();

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const history = messages.slice(-10); // send last 10 messages for context
      const { data } = await api.post('/chat', {
        message: text,
        userType: user?.userType || 'General Citizen',
        history
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again!"
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot__fab ${open ? 'chatbot__fab--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="AI Chat"
        title="Chat with PaperBox AI"
      >
        {open ? '✕' : '🤖'}
        {!open && <span className="chatbot__badge">AI</span>}
      </button>

      {/* Chat window */}
      <div className={`chatbot__window ${open ? 'chatbot__window--open' : ''}`}>
        {/* Header */}
        <div className="chatbot__header">
          <div className="chatbot__avatar">🤖</div>
          <div>
            <div className="chatbot__name">PaperBox AI</div>
            <div className="chatbot__status">
              <span className="chatbot__dot" />
              Online · Powered by Gemini
            </div>
          </div>
          <button className="chatbot__close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="chatbot__messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chatbot__msg chatbot__msg--${msg.role}`}
            >
              {msg.role === 'assistant' && (
                <span className="chatbot__msg-avatar">🤖</span>
              )}
              <div className="chatbot__bubble">{msg.content}</div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="chatbot__msg chatbot__msg--assistant">
              <span className="chatbot__msg-avatar">🤖</span>
              <div className="chatbot__bubble chatbot__typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="chatbot__quick">
          {['Schemes for me', 'How to apply?', 'Latest benefits'].map(q => (
            <button
              key={q}
              className="chatbot__quick-btn"
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="chatbot__input-row">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about schemes..."
            rows={1}
            className="chatbot__input"
          />
          <button
            className="chatbot__send"
            onClick={sendMessage}
            disabled={!input.trim() || typing}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
