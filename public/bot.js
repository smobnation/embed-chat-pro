(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: null, // Will be set dynamically
    storageKey: 'chatbot_conversation',
    animationDuration: 300
  };

  // Get bot ID and API URL from script tag
  const scriptTag = document.querySelector('script[data-bot]');
  const botId = scriptTag ? scriptTag.getAttribute('data-bot') : null;
  const apiUrl = scriptTag ? scriptTag.getAttribute('data-api-url') : null;
  
  // Set API URL dynamically
  if (apiUrl) {
    // Use custom API URL if provided
    CONFIG.apiUrl = apiUrl;
  } else {
    // Auto-detect: use the same origin as the script file
    const scriptSrc = scriptTag ? scriptTag.src : '';
    if (scriptSrc) {
      const scriptUrl = new URL(scriptSrc);
      CONFIG.apiUrl = scriptUrl.origin + '/api/public/chat';
    } else {
      // Fallback to current origin (for backward compatibility)
      CONFIG.apiUrl = window.location.origin + '/api/public/chat';
    }
  }

  if (!botId) {
    console.error('Chatbot: Bot ID not found. Please add data-bot attribute to the script tag.');
    return;
  }

  // State management
  let isOpen = false;
  let isLoading = false;
  let conversation = [];
  let botSettings = null;
  let analytics = {
    messagesSent: 0,
    sessionStart: Date.now(),
    interactions: 0
  };

  // Load conversation from localStorage
  function loadConversation() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey + '_' + botId);
      conversation = saved ? JSON.parse(saved) : [];
    } catch (e) {
      conversation = [];
    }
  }

  // Save conversation to localStorage
  function saveConversation() {
    try {
      localStorage.setItem(CONFIG.storageKey + '_' + botId, JSON.stringify(conversation));
    } catch (e) {
      console.warn('Chatbot: Could not save conversation to localStorage');
    }
  }

  // Load bot settings
  async function loadBotSettings() {
    try {
      const response = await fetch(CONFIG.apiUrl.replace('/api/public/chat', '/api/public/bot-settings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botId })
      });

      if (response.ok) {
        const data = await response.json();
        botSettings = data;
        console.log('Bot settings loaded:', botSettings);
      } else {
        console.warn('Could not load bot settings, using defaults');
      }
    } catch (error) {
      console.warn('Error loading bot settings:', error);
    }
  }

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }

  // Analytics tracking
  function trackEvent(event, data = {}) {
    analytics.interactions++;
    console.log('Analytics:', event, { ...data, botId, timestamp: Date.now() });
    
    // Send analytics to server (optional)
    if (CONFIG.apiUrl) {
      fetch(CONFIG.apiUrl.replace('/api/public/chat', '/api/analytics'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          event,
          data: { ...data, ...analytics },
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).then(response => {
        if (response.ok) {
          console.log('Analytics sent successfully');
        } else {
          console.warn('Analytics failed to send');
        }
      }).catch(error => {
        console.warn('Analytics error:', error);
      });
    }
  }

  // Create chat widget HTML
  function createWidget() {
    const themeColor = botSettings?.themeColor || '#3B82F6';
    const botName = botSettings?.name || 'AI Assistant';
    const welcomeMessage = botSettings?.welcomeMessage || 'Hello! How can I help you today?';
    
    console.log('Creating widget with:', { themeColor, botName, welcomeMessage, botSettings });
    
    const widget = document.createElement('div');
    widget.id = 'chatbot-widget';
    widget.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-button" id="chatbot-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="chatbot-modal" id="chatbot-modal">
          <div class="chatbot-header">
            <div class="chatbot-title">${botName}</div>
            <button class="chatbot-close" id="chatbot-close">×</button>
          </div>
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-message bot-message">
              <div class="message-content">${welcomeMessage}</div>
            </div>
          </div>
          <div class="chatbot-input-container">
            <input type="text" id="chatbot-input" placeholder="Type your message..." />
            <button id="chatbot-send">Send</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #chatbot-widget {
        --chatbot-primary: ${themeColor};
        --chatbot-primary-hover: ${adjustColor(themeColor, -20)};
        --chatbot-primary-light: ${adjustColor(themeColor, 40)};
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .chatbot-container {
        position: relative;
      }

      .chatbot-button {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-primary-hover));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        color: white;
        position: relative;
        overflow: hidden;
      }

      .chatbot-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s;
      }

      .chatbot-button:hover::before {
        transform: translateX(100%);
      }

      .chatbot-button:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      }

      .chatbot-button:active {
        transform: scale(0.95);
      }

      .chatbot-modal {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 520px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .chatbot-modal.open {
        display: flex;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chatbot-header {
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-primary-hover));
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
      }

      .chatbot-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: shimmer 3s infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .chatbot-title {
        font-weight: 600;
        font-size: 16px;
      }

      .chatbot-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chatbot-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .chatbot-message {
        display: flex;
        margin-bottom: 8px;
      }

      .bot-message {
        justify-content: flex-start;
      }

      .user-message {
        justify-content: flex-end;
      }

      .message-content {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .bot-message .message-content {
        background: #f3f4f6;
        color: #374151;
        border-bottom-left-radius: 4px;
      }

      .user-message .message-content {
        background: var(--chatbot-primary);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .chatbot-input-container {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }

      #chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
      }

      #chatbot-input:focus {
        border-color: var(--chatbot-primary);
        box-shadow: 0 0 0 3px var(--chatbot-primary-light);
      }

      #chatbot-send {
        padding: 12px 20px;
        background: var(--chatbot-primary);
        color: white;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      #chatbot-send:hover {
        background: var(--chatbot-primary-hover);
      }

      #chatbot-send:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: #f3f4f6;
        border-radius: 18px;
        max-width: 80px;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }

      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typing {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      @media (max-width: 480px) {
        .chatbot-modal {
          width: calc(100vw - 40px);
          height: calc(100vh - 100px);
          bottom: 10px;
          right: 10px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(widget);

    return widget;
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Send message to API
  async function sendMessage(message) {
    try {
      console.log('Sending message to API:', { botId, message, apiUrl: CONFIG.apiUrl });
      
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: botId,
          message: message
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data.reply;
    } catch (error) {
      console.error('Chatbot API error:', error);
      return 'Sorry, I encountered an error. Please try again later.';
    }
  }

  // Handle user input
  async function handleUserInput() {
    const input = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send');
    const message = input.value.trim();

    if (!message || isLoading) return;

    // Add user message
    addMessage(message, true);
    conversation.push({ role: 'user', content: message });
    saveConversation();

    // Track message sent
    analytics.messagesSent++;
    trackEvent('message_sent', { messageLength: message.length });

    // Clear input and disable send button
    input.value = '';
    sendButton.disabled = true;
    isLoading = true;

    // Show typing indicator
    showTyping();

    try {
      // Send to API
      const reply = await sendMessage(message);
      
      // Hide typing indicator
      hideTyping();
      
      // Add bot response
      addMessage(reply);
      conversation.push({ role: 'bot', content: reply });
      saveConversation();
    } catch (error) {
      hideTyping();
      addMessage('Sorry, I encountered an error. Please try again later.');
    } finally {
      isLoading = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  // Toggle chat modal
  function toggleChat() {
    const modal = document.getElementById('chatbot-modal');
    isOpen = !isOpen;
    
    if (isOpen) {
      modal.classList.add('open');
      document.getElementById('chatbot-input').focus();
      trackEvent('chat_opened');
    } else {
      modal.classList.remove('open');
      trackEvent('chat_closed');
    }
  }

  // Load conversation history
  function loadChatHistory() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML = '<div class="chatbot-message bot-message"><div class="message-content">Hello! How can I help you today?</div></div>';
    
    conversation.forEach(msg => {
      addMessage(msg.content, msg.role === 'user');
    });
  }

  // Initialize chatbot
  async function init() {
    loadConversation();
    await loadBotSettings();
    console.log('Bot settings after load:', botSettings);
    const widget = createWidget();
    
    // Track widget initialization
    trackEvent('widget_loaded');
    
    // Event listeners
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChat);
    document.getElementById('chatbot-close').addEventListener('click', toggleChat);
    document.getElementById('chatbot-send').addEventListener('click', handleUserInput);
    
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
      }
    });

    // Load chat history
    loadChatHistory();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
