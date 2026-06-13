import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Custom Axios courier bridge connected to http://localhost:5000/api

function Chat() {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // UI Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  // Auto Scroll Anchor
  const messagesEndRef = useRef(null);
  const activeUserName = localStorage.getItem('username') || 'Profile';
  
  // Starting welcome message context bubble
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your secure Medical Assistant. Please describe your symptoms or health queries.", isBot: true }
  ]);

  // Handle auto-scroll whenever a new message lands or loader triggers
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clears the security passport JWT token from storage
    navigate('/login'); // Redirects user out to the login page
  };

  const handleAddAccountRedirect = () => {
    navigate('/signup'); // Clean routing to your signup page
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessageText = inputMessage;
    setInputMessage(''); 

    const userMsg = {
      id: Date.now(), 
      text: userMessageText,
      isBot: false
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true); 

    try {
      const res = await api.post('/chat', { text: userMessageText });

      let aiTextReply = "I received an unexpected empty data packet format from the medical engine.";
      if (res && res.data) {
        if (res.data.bot && res.data.bot.text) {
          aiTextReply = res.data.bot.text; 
        } else if (res.data.reply) {
          aiTextReply = res.data.reply;
        } else if (typeof res.data === 'string') {
          aiTextReply = res.data;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        text: aiTextReply,
        isBot: true
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error("CRITICAL CONSOLE PIPELINE ERROR:", err);
      const errorMsg = {
        id: Date.now() + 2,
        text: `Pipeline failure: ${err.response?.data?.msg || err.message || 'Check local terminal connections.'}`,
        isBot: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); 
    }
  };

  // STEEL GREY INLINE THEMING MATRIX
  const styles = {
    appWrapper: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#282c34', 
      color: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    },
    sidebar: {
      width: isSidebarOpen ? '280px' : '0px',
      backgroundColor: '#1e222b', 
      borderRight: '1px solid #2d3139',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      zIndex: 20
    },
    sidebarContent: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: '280px',
      boxSizing: 'border-box'
    },
    brandBlock: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    brandIcon: {
      height: '36px',
      width: '36px',
      borderRadius: '10px',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#ffffff'
    },
    brandText: {
      fontSize: '18px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      color: '#ffffff'
    },
    historyItem: {
      width: '100%',
      backgroundColor: '#282c34',
      border: '1px solid #3a3f4d',
      textAlign: 'left',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    guideBox: {
      fontSize: '12px',
      color: '#9ca3af',
      lineHeight: '1.5',
      backgroundColor: 'rgba(40, 44, 52, 0.6)',
      padding: '14px',
      borderRadius: '12px',
      border: '1px solid #2d3139',
      marginTop: '8px'
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: '1px solid #2d3139',
      backgroundColor: '#161920',
      minWidth: '280px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px' // Clean, micro spacing
    },
    singleUnifiedBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '12px 14px',
      backgroundColor: '#282c34',
      border: '1px solid #3a3f4d',
      borderRadius: '12px',
      color: '#ffffff',
      boxSizing: 'border-box'
    },
    plusIconBtn: {
      background: 'none',
      border: 'none',
      color: '#3b82f6', 
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      transition: 'transform 0.2s ease'
    },
    exitGateBtn: {
      background: 'none',
      border: 'none',
      color: '#f87171', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      borderRadius: '6px',
      transition: 'all 0.2s ease'
    },
    accordionDrawer: {
      maxHeight: isAddAccountOpen ? '50px' : '0px',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
      display: 'flex',
      flexDirection: 'column'
    },
    addAccountSubBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#161920',
      border: '1px dashed #3a3f4d',
      color: '#9ca3af',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '6px',
      textAlign: 'center',
      transition: 'all 0.2s'
    },
    mainWorkspace: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    },
    topNavbar: {
      height: '64px',
      backgroundColor: '#1e222b',
      borderBottom: '1px solid #2d3139',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 10
    },
    hamburgerBtn: {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      fontSize: '22px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      borderRadius: '8px',
      marginRight: '16px',
      backgroundColor: '#282c34'
    },
    portalTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0
    },
    chatViewport: {
      flex: 1,
      overflowY: 'auto',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      backgroundColor: '#282c34'
    },
    bubbleRow: {
      display: 'flex',
      width: '100%'
    },
    messageBubble: (isBot) => ({
      maxWidth: '70%',
      borderRadius: '16px',
      padding: '14px 20px',
      fontSize: '14.5px',
      lineHeight: '1.6',
      backgroundColor: isBot ? '#1e222b' : '#3b82f6',
      color: isBot ? '#e5e7eb' : '#ffffff',
      border: isBot ? '1px solid #3a3f4d' : 'none',
      borderTopLeftRadius: isBot ? '0px' : '16px',
      borderTopRightRadius: isBot ? '16px' : '0px'
    }),
    senderTag: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#60a5fa',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '4px',
      margin: 0
    },
    typingIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      paddingTop: '4px'
    },
    typingDot: (delay) => ({
      width: '6px',
      height: '6px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both',
      animationDelay: delay
    }),
    footerInputContainer: {
      padding: '24px',
      backgroundColor: '#1e222b',
      borderTop: '1px solid #2d3139'
    },
    formInputLayout: {
      maxWidth: '900px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      position: 'relative'
    },
    textBarInput: {
      width: '100%',
      padding: '16px 64px 16px 20px',
      borderRadius: '14px',
      border: '1px solid #3a3f4d',
      backgroundColor: '#161920',
      color: '#ffffff',
      fontSize: '14.5px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    sendArrowBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      height: '42px',
      width: '42px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.appWrapper}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
      
      {/* 1. SIDEBAR ARCHITECTURE */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={styles.brandBlock}>
            <div style={styles.brandIcon}>+</div>
            <span style={styles.brandText}>CareBot AI</span>
          </div>
          
          <div>
            <button type="button" style={styles.historyItem}>
              <span>💬</span> <span>Current Assessment</span>
            </button>
            <div style={{borderTop: '1px solid #2d3139', paddingTop: '16px'}}>
              <p style={{fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 4px'}}>Safety Guide</p>
              <p style={styles.guideBox}>
                This tool provides situational insights based on medical patterns. It is not an alternate choice for an emergency clinical evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* 🛠️ ONE SINGLE UNIFIED ACCOUNT CONTAINER */}
        <div style={styles.sidebarFooter}>
          <div style={styles.singleUnifiedBar}>
            
            {/* LEFT SIDE: Plus Button + Username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsAddAccountOpen(!isAddAccountOpen)}
                style={styles.plusIconBtn}
                title="Toggle Account Settings"
              >
                {isAddAccountOpen ? '×' : '+'}
              </button>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb', userSelect: 'none' }}>
                {activeUserName}
              </span>
            </div>

            {/* RIGHT SIDE: Exit Gate and Arrow SVG Icon for Logout */}
            <button 
              type="button" 
              onClick={handleLogout} 
              style={styles.exitGateBtn}
              title="Log Out"
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#f87171'}
            >
              {/* Modern SDE standard logout gate-and-arrow vector glyph */}
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>

          {/* THE DRAWER CONTENT (Only displays when left + is clicked) */}
          <div style={styles.accordionDrawer}>
            <button 
              type="button" 
              style={styles.addAccountSubBtn}
              onClick={handleAddAccountRedirect}
              onMouseEnter={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#3a3f4d'; e.target.style.color = '#9ca3af'; }}
            >
              + Add Another Account
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHAT FEED WORKSPACE */}
      <div style={styles.mainWorkspace}>
        <header style={styles.topNavbar}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <button type="button" style={styles.hamburgerBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              ☰
            </button>
            <div style={{height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginRight: '10px'}}></div>
            <h1 style={styles.portalTitle}>Symptom Guidance Portal</h1>
          </div>
        </header>

        <div style={styles.chatViewport}>
          {messages.map((msg) => (
            <div key={msg.id} style={{...styles.bubbleRow, justifyContent: msg.isBot ? 'flex-start' : 'flex-end'}}>
              <div style={styles.messageBubble(msg.isBot)}>
                {msg.isBot && <p style={styles.senderTag}>Assistant</p>}
                <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{...styles.bubbleRow, justifyContent: 'flex-start'}}>
              <div style={styles.messageBubble(true)}>
                <p style={styles.senderTag}>CareBot AI</p>
                <div style={styles.typingIndicator}>
                  <span style={{color: '#9ca3af', marginRight: '4px'}}>Analyzing clinical input</span>
                  <div style={styles.typingDot('0s')}></div>
                  <div style={styles.typingDot('0.2s')}></div>
                  <div style={styles.typingDot('0.4s')}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer style={styles.footerInputContainer}>
          <form onSubmit={handleSendMessage} style={styles.formInputLayout}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              placeholder={isLoading ? "Analyzing symptoms..." : "Describe what physical symptoms you are experiencing..."}
              style={styles.textBarInput}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()} style={styles.sendArrowBtn}>
              ➔
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default Chat;