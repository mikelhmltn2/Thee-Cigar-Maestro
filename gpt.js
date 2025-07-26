
document.addEventListener('DOMContentLoaded', () => {
  // Utility function for text sanitization
  function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:rgba(220,20,60,0.9);color:white;padding:10px;border-radius:4px;z-index:9999;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  const assistantBtn = document.createElement('button');
  assistantBtn.textContent = "Ask the Maestro";
  assistantBtn.id = "gpt-maestro-btn";
  assistantBtn.setAttribute('aria-label', 'Open AI Assistant');
  document.body.appendChild(assistantBtn);

  const chatBox = document.createElement('div');
  chatBox.id = "gpt-chat-box";
  chatBox.setAttribute('role', 'dialog');
  chatBox.setAttribute('aria-labelledby', 'gpt-chat-header');

  // Create chat box content securely
  const chatHeader = document.createElement('div');
  chatHeader.id = "gpt-chat-header";
  chatHeader.textContent = "The Maestro";
  chatHeader.style.fontWeight = 'bold';
  chatHeader.style.marginBottom = '8px';

  const inputArea = document.createElement('textarea');
  inputArea.id = "gpt-input";
  inputArea.placeholder = "Ask about pairings, rituals, cigars...";
  inputArea.maxLength = 500;
  inputArea.style.cssText = 'width:100%;height:60px;margin-bottom:8px;background:#2c2c2c;border:1px solid #666;color:#fff;padding:5px;resize:vertical;';

  const sendBtn = document.createElement('button');
  sendBtn.id = "gpt-send";
  sendBtn.textContent = "Send";
  sendBtn.style.cssText = 'width:100%;padding:8px;background:#c69c6d;border:none;cursor:pointer;font-weight:bold;margin-bottom:8px;';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = "×";
  closeBtn.style.cssText = 'position:absolute;top:5px;right:5px;background:transparent;border:none;color:#f0e6d2;cursor:pointer;font-size:18px;';
  closeBtn.setAttribute('aria-label', 'Close chat');

  const responseDiv = document.createElement('div');
  responseDiv.id = "gpt-response";
  responseDiv.textContent = "Awaiting your wisdom...";
  responseDiv.style.fontStyle = 'italic';

  // Assemble chat box
  chatBox.appendChild(closeBtn);
  chatBox.appendChild(chatHeader);
  chatBox.appendChild(inputArea);
  chatBox.appendChild(sendBtn);
  chatBox.appendChild(responseDiv);
  
  document.body.appendChild(chatBox);

  // Event handlers
  assistantBtn.onclick = () => {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open')) {
      inputArea.focus();
    }
  };

  closeBtn.onclick = () => {
    chatBox.classList.remove('open');
  };

  // Enhanced send functionality with validation and security
  async function sendMessage() {
    const input = inputArea.value.trim();
    if (!input) {
      showError('Please enter a message');
      return;
    }

    if (input.length > 500) {
      showError('Message too long. Please keep it under 500 characters.');
      return;
    }

    // Disable inputs during request
    sendBtn.disabled = true;
    inputArea.disabled = true;
    responseDiv.textContent = "The Maestro is thinking...";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch("https://theecigarmaestro.vercel.app/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: sanitizeText(input) }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      
      if (!data || typeof data.response !== 'string') {
        throw new Error('Invalid response format from server');
      }

      // Safely display response
      responseDiv.textContent = "🧠 The Maestro says: " + data.response;
      inputArea.value = ''; // Clear input on success

    } catch (err) {
      console.error('GPT request failed:', err);
      
      if (err.name === 'AbortError') {
        responseDiv.textContent = "⚠️ Request timed out. Please try again.";
      } else if (err.message.includes('Failed to fetch')) {
        responseDiv.textContent = "⚠️ Network error. Please check your connection.";
      } else {
        responseDiv.textContent = "⚠️ Unable to reach The Maestro. Please try again later.";
      }
    } finally {
      // Re-enable inputs
      sendBtn.disabled = false;
      inputArea.disabled = false;
    }
  }

  sendBtn.onclick = sendMessage;

  // Allow Enter key to send (with Shift+Enter for new line)
  inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close chat with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatBox.classList.contains('open')) {
      chatBox.classList.remove('open');
    }
  });
});
